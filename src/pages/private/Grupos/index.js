
import React, { useState, useEffect } from 'react'
import { FiHome, FiHardDrive, FiClock, FiBook, FiUsers, FiBell, FiX } from 'react-icons/fi'

import { Redirect, Link } from 'react-router-dom'
import { Breadcrumb, PageHeader, Button, Popconfirm, notification, List, Empty, Alert, Table } from 'antd'
import ReactTooltip from 'react-tooltip'
import { CheckCircleOutlined } from '@ant-design/icons'
import { isMobile } from 'react-device-detect'
import api from '../../../services/api'



const Groups = () => {
    const [redirect, setRedirect] = useState(false)
    const [redirectRoute, setRedirectRoute] = useState('')
    const [data, setData] = useState([])
    const [loadingData, setLoadingData] = useState(false)

    const goToNewGroup = async () => {
        await setRedirectRoute('/register_new_group')
        await setRedirect(true)
    }

    useEffect(() => {

        loadGroups()

    }, [])

    const loadGroups = async () => {
        setLoadingData(true)
        const response = await api.get('/api/v1/enjoy/groups')
        setData(response.data)
        setLoadingData(false)
    }

    const goToEditGroup = async (id) => {
        await setRedirectRoute('/edit/' + id)
        await setRedirect(true)
    }

    const openDeleteConfirm = async (item, index) => {
        let temp_state = [...data]
        let temp_element = { ...temp_state[index] }
        temp_element.deleteDeviceVisible = true
        temp_state[index] = temp_element
        setData(temp_state)
    }

    const closeDeleteConfirm = async (item, index) => {
        let temp_state = [...data]
        let temp_element = { ...temp_state[index] }
        temp_element.deleteDeviceVisible = false
        temp_state[index] = temp_element
        setData(temp_state)
    }


    const deleteGroup = async (item, index) => {
        let temp_state = [...data]
        let temp_element = { ...temp_state[index] }
        temp_element.loadingDeleteGroup = true
        temp_state[index] = temp_element
        await setData(temp_state)

        const response = await api.delete('/api/v1/enjoy/groups/' + item.id)

        if (response) {
            notification['success']({
                description: 'Grupo cadastrado com sucesso!',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            })

            loadGroups()
        }
    }

    const columns = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <>{text}</>,
        },


        {
            title: 'Data',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => <>{new Date(created_at).toLocaleDateString('pt-BR')}</>,
        },

        {
            title: '',
            render: (row, record, index) => <>
                <span data-tip='' data-for='editSchedule' onClick={() => goToEditGroup(row.id)}>
                    <button class="btn btn-icon btn-icon-start btn-primary mb-1" type="button">
                        <span>Editar</span>
                    </button>
                </span>
                &nbsp;&nbsp;
                <Popconfirm
                    title="Tem certeza que deseja excluir este grupo?"
                    onConfirm={e => deleteGroup(row, index)}
                    onCancel={e => closeDeleteConfirm(row, index)}
                    visible={row.deleteDeviceVisible}
                    okText="Sim"
                    cancelText="Não"
                    placement={'left'}
                    okButtonProps={{ loading: row.loadingDeleteGroup }}
                >
                    <span data-tip='' data-for='deleteSchedule'>
                        <button class="btn btn-icon btn-icon-start btn-danger mb-1" type="button">
                            <span>Excluir</span>
                        </button>
                    </span>
                </Popconfirm>
            </>,
        },

    ]

    return (
        <div style={{ marginTop: '30px' }}>
            {redirect ? <Redirect to={redirectRoute} /> : <></>}

            <div className="page-title-container">
                <h1 className="mb-0 pb-0 display-4 mt-2">
                    <FiUsers style={{ marginTop: '-7px' }} /> &nbsp;
                    Grupos
                </h1>
            </div>

            <div className='card mt-10'>
                <div className='card-body'>
                    <div className='row'>

                        <div className='col-12'>
                            <div className={` ${isMobile ? '' : 'float-right'}`}>
                                <Button className='w-full' type="primary" onClick={() => goToNewGroup()}>
                                    Criar novo grupo
                                    <i className='uil-plus ml-5' />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <br /><br />

                    {isMobile
                        ? <>
                            <List
                                dataSource={data}
                                loading={loadingData}
                                locale={{ emptyText: (<Empty description={'Nenhum grupo cadastrado'} />) }}
                                header={
                                    <>
                                        <div className={` ${isMobile ? 'hidden' : 'row'}`}>
                                            <div className='col-6 bold'>Nome</div>
                                            <div className='col-2 bold'>Pin</div>
                                            <div className='col-2 bold'>Criação</div>
                                        </div>
                                    </>
                                }
                                renderItem={(item, index) => {
                                    if (item.name) {
                                        return (
                                            <div className='row mt-10'>
                                                <div className='col-sm-6 col-12'>
                                                    <b>Nome do grupo:</b> &nbsp;
                                                    {item.name}
                                                </div>
                                                <div className='col-sm-2 col-12'>
                                                    <b>Possui pin de segurança? </b> &nbsp;
                                                    {item.pin ? <i className='uil-check text-success ft-16' /> : <i className='uil-multiply text-danger ft-16' />}
                                                </div>
                                                <div className='col-sm-2 col-12'>
                                                    <b>Data de criação:</b> &nbsp;
                                                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className='col-sm-2 col-12 mt-10'>
                                                    <Button className='btn-primary' style={{ width: '49%', marginRight: '2px' }} onClick={() => goToEditGroup(item.id)}>
                                                        Editar
                                                        <i className='uil-edit' style={{ marginLeft: '10px' }} />
                                                    </Button>

                                                    <Popconfirm
                                                        title="Tem certeza que deseja excluir este grupo?"
                                                        onConfirm={e => deleteGroup(item, index)}
                                                        onCancel={e => closeDeleteConfirm(item, index)}
                                                        visible={item.deleteDeviceVisible}
                                                        okText="Sim"
                                                        cancelText="Não"
                                                        placement={'left'}
                                                        okButtonProps={{ loading: item.loadingDeleteGroup }}
                                                    >
                                                        <Button className='btn-danger' style={{ width: '49%' }}>
                                                            Excluir
                                                            <i className='uil-trash' style={{ marginLeft: '10px' }} />
                                                        </Button>
                                                    </Popconfirm>

                                                </div>
                                            </div>
                                        )
                                    }
                                }}
                            />
                        </>
                        : <>
                            <Table
                                columns={columns}
                                dataSource={data}
                                loading={loadingData}
                            />
                        </>
                    }



                </div>
            </div>


        </div>
    )
}

export default Groups
