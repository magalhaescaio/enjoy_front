import React, { useState, useEffect, useCallback } from 'react'

import { Breadcrumb, PageHeader, Form, Input, Alert, Spin, Transfer, Empty, Switch, Button, notification, Tabs, TimePicker, Select } from 'antd'
import { Redirect, Link, useParams } from 'react-router-dom'
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { MaskedInput } from 'antd-mask-input'

import DefaultUser from './../../../assets/img/profile/default.jpg'

import api from './../../../services/api'
import { ResponsiveEmbed } from 'react-bootstrap'

const { TabPane } = Tabs
const { Option } = Select;

function NewContacts(props) {
    const [week] = useState([
        { 'name': 'monday', 'label': 'Segunda-feira' },
        { 'name': 'tuesday', 'label': 'Terça-feira' },
        { 'name': 'wednesday', 'label': 'Quarta-feira' },
        { 'name': 'thursday', 'label': 'Quinta-feira' },
        { 'name': 'friday', 'label': 'Sexta-feira' },
        { 'name': 'saturday', 'label': 'Sábado' },
        { 'name': 'sunday', 'label': 'Domingo' },
    ])

    const [idEdit, setIdEdit] = useState()
    const [weekData, setWeekData] = useState({})
    const [groupName, setGroupName] = useState()

    const [redirect, setRedirect] = useState(false)
    const [loadingForm, setLoadingForm] = useState(false)
    const [loadingInfo, setLoadingInfo] = useState(false)
    const [redirectRoute, setRedirectRoute] = useState('')

    const [contacts, setContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [targetContacts, setTargetContacts] = useState([])

    const [devices, setDevices] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([])
    const [targetDevices, setTargetDevices] = useState([])

    const [hasPin, setHasPin] = useState(false)

    const [enableTimeUse, setTimeUse] = useState(false)

    const [deviceSelected, setDeviceSelected] = useState([])
    const [contactSelected, setContactSelected] = useState([])

    const [form] = Form.useForm()

    const location = useParams()

    // const fetchData = useCallback(async (loc) => {
    //     let id_edit = loc.id

    //     if(id_edit){
    //         setIdEdit(id_edit)
    //         getGroupData(id_edit)
    //         loadConfig()
    //     }else{
    //         loadConfig()
    //     }
    // }, [])

    //   useEffect(() => {
    //     fetchData(location).catch(console.error);
    //   }, [fetchData])

    async function connect(id) {
        if (id) {
            setIdEdit(id)
            getGroupData(id)
            // loadConfig()
        }
    }

    useEffect(() => {


        // async function conectar() {
        //    const resposta = await ObterEstoque(props);

        //    setEstoqueReal(resposta[0])
        //    setEstoquePrevisto(resposta[1])
        //    setData(resposta[2])
        // }
        // await conectar();

        if (props.location.pathname === '/register_new_group') {
            loadConfig()
        } else {
            var group = props.location.pathname
            group = group.split('/edit/')


            setIdEdit(group[1])
            getGroupData(group[1])
            loadConfig()

        }

        // connect(location.id)

    }, [])

    const handleDevice = (value, item) => {
        console.log(value)
        setDeviceSelected(value)
        // setTypeSelected(parseInt(item.type))
    }

    const handleContact = (value, item) => {
        console.log(value)
        setContactSelected(value)
        // setTypeSelected(parseInt(item.type))
    }

    const formatDateTime = (value) => {
        var new_value = value.split(':')

        return new_value[0] + ':' + new_value[1]
    }

    const getGroupData = async (id) => {
        setLoadingInfo(true)

        const response = await api.get('/api/v1/enjoy/groups/' + id)

        setGroupName(response.data.group.name)
        setHasPin(response.data.group.pin)

        form.setFieldsValue({ name: response.data.group.name })
        // form.setFieldsValue({pin: response.data.group.pin})
        // form.setFieldsValue({pin_repeat: response.data.group.pin})

        // form.setFieldsValue({begin_monday: response.data.group.pin})

        response.data.week.map((row, index) => {
            if (row.day === 'monday') {
                form.setFieldsValue({ begin_monday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_monday: formatDateTime(row.end) })
            }

            if (row.day === 'tuesday') {
                form.setFieldsValue({ begin_tuesday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_tuesday: formatDateTime(row.end) })
            }

            if (row.day === 'wednesday') {
                form.setFieldsValue({ begin_wednesday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_wednesday: formatDateTime(row.end) })
            }

            if (row.day === 'thursday') {
                form.setFieldsValue({ begin_thursday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_thursday: formatDateTime(row.end) })
            }

            if (row.day === 'friday') {
                form.setFieldsValue({ begin_friday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_friday: formatDateTime(row.end) })
            }

            if (row.day === 'saturday') {
                form.setFieldsValue({ begin_saturday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_saturday: formatDateTime(row.end) })
            }

            if (row.day === 'sunday') {
                form.setFieldsValue({ begin_sunday: formatDateTime(row.begin) })
                form.setFieldsValue({ end_sunday: formatDateTime(row.end) })
            }
        })

        var new_devices = []
        response.data.devices.map((row, index) => {
            new_devices.push({ value: row.id_device, label: row.device_name })
        })
        setDeviceSelected(new_devices)
        form.setFieldsValue({ devices: new_devices })

        var new_contacts = []
        response.data.contacts.map((row, index) => {
            new_contacts.push({ value: row.id_user, label: row.name })
        })
        console.log(new_contacts)
        setContactSelected(new_contacts)
        form.setFieldsValue({ contacts: new_contacts })

        if (response.data.week) {
            // setTimeUse(true)
        }

        // setData(response.data)

        let array_devices = []
        response.data.devices.map((row, index) => {
            array_devices.push(row.id_device)
        })

        setTargetDevices(array_devices)

        let array_contacts = []
        response.data.contacts.map((row, index) => {
            array_contacts.push(row.id_user)
        })

        setTargetContacts(array_contacts)


        var weekObject = {}

        response.data.week.map((row, index) => {
            if (row.begin && row.end) {
                weekObject[row.day] = { 'start': row.begin, 'end': row.end }
            }
        })


        setWeekData(weekObject)
        setLoadingInfo(false)
    }

    const goToGroups = async () => {
        await setRedirectRoute('/grupos')
        await setRedirect(true)
    }

    const submitNewGroup = async (values) => {


        if (values.pin !== values.pin_repeat) {
            notification['error']({
                description: 'O pin precisa ser igual nos dois campos!',
                icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
                placement: 'bottom'
            })
            return
        }

        var has = false
        const isFound = contactSelected.some(element => {
            if (element.value) {
                has = true
            }
        })

        var users = []
        if(has === true){
            contactSelected.map((row) => {
                users.push(row.value)
            })
        }

        const request = {
            "group_name": values.name,
            // "pin": values.pin,
            "contacts": users.length > 0 ? users : contactSelected,
            "devices": 1,
            "id": idEdit ? idEdit : null
        }

        console.log(contactSelected)

        request.week = {}

        request.week.monday = {
            'start': values.begin_monday ? values.begin_monday : null,
            'end': values.end_monday ? values.end_monday : null
        }

        request.week.tuesday = {
            'start': values.begin_tuesday ? values.begin_tuesday : null,
            'end': values.end_tuesday ? values.end_tuesday : null
        }

        request.week.wednesday = {
            'start': values.begin_wednesday ? values.begin_wednesday : null,
            'end': values.end_wednesday ? values.end_wednesday : null
        }

        request.week.thursday = {
            'start': values.begin_thursday ? values.begin_thursday : null,
            'end': values.end_thursday ? values.end_thursday : null
        }

        request.week.friday = {
            'start': values.begin_friday ? values.begin_friday : null,
            'end': values.end_friday ? values.end_friday : null
        }

        request.week.saturday = {
            'start': values.begin_saturday ? values.begin_saturday : null,
            'end': values.end_saturday ? values.end_saturday : null
        }

        request.week.sunday = {
            'start': values.begin_sunday ? values.begin_sunday : null,
            'end': values.end_sunday ? values.end_sunday : null
        }


        setLoadingForm(true)

        const response = await api.post('/api/v1/enjoy/groups', request)

        if (idEdit) {
            if (response) {
                if (response.status === 200) {
                    notification['success']({
                        description: 'Grupo editado com sucesso!',
                        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                    })
                } else {
                    notification['error']({
                        description: 'Não foi possível editar grupo!',
                        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
                    })
                }
            } else {
                notification['error']({
                    description: 'Não foi possível editar grupo!',
                    icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
                })
            }
        } else {
            if (response) {
                if (response.status === 200) {
                    notification['success']({
                        description: 'Grupo cadastrado com sucesso!',
                        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                    })
                } else {
                    notification['error']({
                        description: 'Não foi possível cadastrar grupo!',
                        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
                    })
                }
            } else {
                notification['error']({
                    description: 'Não foi possível cadastrar grupo!',
                    icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
                })
            }
        }



        setLoadingForm(false)

        await setRedirectRoute('/grupos')
        await setRedirect(true)
    }

    const loadConfig = async () => {
        setLoadingInfo(true)

        const response = await api.get('/api/v1/enjoy/groups/config/get_params')

        try {
            const response = await api.get('/api/v1/enjoy/list_users')

            setContacts(response.data)
        } catch (error) {

        }

        // setContacts(response.data.contacts)
        // setDevices(response.data.devices)

        setLoadingInfo(false)
    }

    const onChangeDevice = (nextTargetKeys, direction, moveKeys) => {
        setTargetDevices(nextTargetKeys)
    }

    const onChangeContacts = (nextTargetKeys, direction, moveKeys) => {
        setTargetContacts(nextTargetKeys)
    }

    const onSelectChangeDevice = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedDevices([...sourceSelectedKeys, ...targetSelectedKeys])
    }

    const onSelectChangeContacts = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedContacts([...sourceSelectedKeys, ...targetSelectedKeys])
    }


    return (
        <div style={{ marginTop: '30px' }}>
            {redirect ? <Redirect to={redirectRoute} /> : <></>}

            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">Início</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/groups">Grupos</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{idEdit ? <>Editar Grupo</> : <>Novo grupo</>}</Breadcrumb.Item>
            </Breadcrumb>

            <div className='card mt-10'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-12'>
                            <PageHeader
                                style={{ marginTop: '-40px' }}
                                className="site-page-header"
                                onBack={() => goToGroups()}
                                title={idEdit ? <>Editar grupo</> : <>Criar novo grupo</>}
                            />
                        </div>
                    </div>

                    {loadingInfo
                        ? <>
                            <div className='row w-full'>
                                <div className='col-12'>
                                    <div className='d-flex justify-content-center'>
                                        <Spin size='large' />
                                    </div>
                                </div>
                            </div>
                        </>
                        : <>

                            <Form
                                name="new_group"
                                form={form}
                                layout='vertical'
                                autoComplete="off"
                                onFinish={submitNewGroup}
                            >
                                <Form.Item
                                    name="name"
                                    label="Nome do grupo"
                                    rules={[{ required: true, message: 'Este campo é obrigatório' }]}
                                    initialValue={groupName}
                                >
                                    <Input />
                                </Form.Item>
                                {/* 
                                    <Form.Item
                                        name="has_pin"
                                        label="Deseja adicionar um pin de segurança para este grupo?"
                                    >
                                        <Switch checked={hasPin} onChange={setHasPin} />
                                    </Form.Item> */}

                                {hasPin
                                    ? <div className='row'>
                                        <div className='col-sm-6 col-12'>
                                            <Form.Item
                                                name="pin"
                                                label="Informe o pin de segurança"
                                                rules={[{ required: true, message: 'Este campo é obrigatório', min: 4 }]}
                                            >
                                                <Input.Password
                                                    maxLength={8}
                                                    placeholder="min 4 - max 8"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className='col-sm-6 col-12'>
                                            <Form.Item
                                                name="pin_repeat"
                                                label="Confirmar pin"
                                                rules={[{ required: true, message: 'Este campo é obrigatório', min: 4 }]}
                                            >
                                                <Input.Password
                                                    maxLength={8}
                                                    placeholder="Informe o pin novamente"
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    : <></>
                                }
                                {/* 
                                    <Form.Item
                                        name="enable_time_use"
                                        label="Deseja habilitar um horário específico para uso?"
                                    >
                                        <Switch checked={enableTimeUse} onChange={setTimeUse} />
                                    </Form.Item> */}

                                {!enableTimeUse
                                    ? <div className="card-container mb-20">
                                        <Tabs defaultActiveKey="0" type='card' tabPosition='top'>
                                            {week.map((row, index) => {
                                                return (
                                                    <TabPane tab={row.label} key={index}>
                                                        <div className='row justify-content-center'>
                                                            <div className='col-4'>
                                                                <Form.Item
                                                                    name={`begin_${row.name}`}
                                                                    label="Início"
                                                                    initialValue={weekData[row.name] ? moment(weekData[row.name] ? weekData[row.name]['start'] : '00:00', 'HH:mm:ss') : null}
                                                                >
                                                                    {/* <TimePicker placeholder='Informe um horário' format={'HH:mm'} className={'w-full'} /> */}
                                                                    <MaskedInput
                                                                        maskOptions={{ mask: '00:00', lazy: true }}
                                                                        inputmode="numeric"
                                                                    // pattern="[0-9]*"
                                                                    // type="number"
                                                                    />
                                                                </Form.Item>
                                                            </div>
                                                            <div className='col-4'>
                                                                <Form.Item
                                                                    name={`end_${row.name}`}
                                                                    label="Término"
                                                                    initialValue={weekData[row.name] ? moment(weekData[row.name] ? weekData[row.name]['end'] : '00:00', 'HH:mm:ss') : null}
                                                                >
                                                                    {/* <TimePicker placeholder='Informe um horário' format={'HH:mm'} className={'w-full'} /> */}
                                                                    <MaskedInput
                                                                        maskOptions={{ mask: '00:00', lazy: true }}
                                                                        inputmode="numeric"
                                                                    // pattern="[0-9]*"
                                                                    // type="number"
                                                                    />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                    </TabPane>
                                                )
                                            })}

                                        </Tabs>
                                    </div>
                                    : <></>
                                }



                                <Form.Item
                                    name="contacts"
                                    label="Contatos"
                                >
                                    <div className=' w-full'>
                                        <div>
                                            <Alert
                                                message={<b>Info!</b>}
                                                description="Informe os contatos que farão parte deste grupo"
                                                type="info"
                                                showIcon
                                                className='mb-20 mt-10'
                                            />

                                            <br /> <br />

                                            <Select
                                                mode="multiple"
                                                onChange={handleContact}
                                                defaultValue={contactSelected}
                                            >
                                                {contacts.map((row, index) => {
                                                    return (
                                                        <Option key={index} value={row.id}>
                                                            {row.name}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>

                                            {/* <Transfer
                                                    dataSource={contacts}
                                                    titles={['Contatos', 'Grupo']}
                                                    targetKeys={targetContacts}
                                                    selectedKeys={selectedContacts}
                                                    onChange={onChangeContacts}
                                                    onSelectChange={onSelectChangeContacts}
                                                    rowKey={item => item.id}
                                                    style={{width: '100%'}}
                                                    locale={{notFoundContent: (<Empty description={'Vazio'}  />)}}
                                                    render={item => (
                                                        <>
                                                            <div className='ml-10'>
                                                                {item.contact_avatar
                                                                    ?  <img src={item.contact_avatar} height="25" alt="" className="rounded-circle shadow-sm mr-10" />
                                                                    :  <img src={DefaultUser} height="25" alt="" className="rounded-circle shadow-sm mr-10" />
                                                                }
                                                        
                                                                {item.contact_name}
                                                            </div>
                                                        </>
                                                    )}
                                                /> */}
                                        </div>
                                    </div>
                                </Form.Item>

                                <Form.Item className='mt-30'>
                                    <div className='float-right'>
                                        <Button
                                            loading={loadingForm}
                                            type="success"
                                            htmlType="submit" style={{ background: "#0acf97", borderColor: "#0acf97", color: 'white', width: '150px' }}>
                                            {idEdit ? <>Editar</> : <>Salvar</>} <i className='uil-check ml-5' />
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default NewContacts