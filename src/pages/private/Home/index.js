import { useEffect, useState } from 'react'
import { FiHome, FiBox, FiRepeat, FiWifiOff, FiCheckCircle, FiCrosshair, FiCpu, FiPower, FiArrowUpCircle, FiArrowDownCircle, FiDroplet, FiTrendingUp, FiSettings, FiX, FiAlertCircle, FiAlertOctagon } from 'react-icons/fi'
import LiquidFillGauge from 'react-liquid-gauge'
import Thermometer from 'react-thermometer-component'
import { Switch, notification } from 'antd'
import Moment from 'react-moment'
import axios from 'axios'
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { FaPowerOff, FaWifi, FaSwimmingPool, FaLink, FaInfoCircle } from 'react-icons/fa';

import { waitOn } from '../../../functions/waitOn'
import { waitOff } from '../../../functions/waitOff'


import api from './../../../services/api'
import { endPointOnly } from '../../../constants/default'


import motor from './../../../assets/img/only/motor.png'
import motor_danger from './../../../assets/img/only/motor_danger.png'

export default function (props) {
    const [user, setUser] = useState()
    const [sharedAmbients, setSharedAmbients] = useState([])
    const [gettingData, setGettingData] = useState(false)
    const [loadingAmbients, setLoadingAmbients] = useState(false)
    const [ambients, setAmbients] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const parseUTCDate = dateString => {
        const dateParams = dateString.replace(/ UTC/, '').split(/[\s-:]/)
        dateParams[1] = (parseInt(dateParams[1], 10) - 1).toString()

        return new Date(Date.UTC(...dateParams))
    }

    function addHours(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);

        return date;
    }

    function getDayName() {
        var date = new Date();
        return date.toLocaleDateString({ weekday: 'long' });
    }

    const getAmbients = async (reload, loading) => {


        if (!loading) {
            setLoadingAmbients(true)
        }

        setRefreshing(true)

        if (reload === true) {
            var ambients = undefined

            if (loading === true) {
                setGettingData(true)
            }

        } else {
            var ambients = JSON.parse(localStorage.getItem('OnlyOne-Ambients'))
        }

        if (!ambients) {
            // REQUEST
            const response = await api.get('/api/v1/ambients')

            var array_ambients = []
            var sharedAmbients = []

            response.data.groups.map((r, i) => {
                r.group.group_week.map((day) => {
                    //begin
                    //day
                    //end

                    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    var d = new Date();
                    var actualDayName = days[d.getDay()]
                    var actualTime = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()

                    // console.log(actualDayName)
                    // console.log(days)
                    console.log(actualTime)
                    console.log(day.begin)
                    console.log(day.end)


                    if (day.day === actualDayName) {
                        // console.log(day.begin, day.end, actualTime)


                        if (day.begin < actualTime
                            && day.end > actualTime) {
                            //Enable
                            r.group.groups_devices.map((myAmbients) => {
                                // ambients.push(amb)
                                sharedAmbients = myAmbients.ambients

                                //    myAmbients.map((result) => {
                                //     console.log(result)
                                //    })
                            })
                        } else {
                            setSharedAmbients(false)
                            // console.log('Nao');
                        }

                    }
                })
            })

            response.data.ambient.map((row) => {
                var array_devices = []
                var array_painel = []

                row.ambient_devices.map((r) => {

                    if (r.deleted_at) {

                    } else {
                        r.devices.map((d) => {
                            if (d.module.spool.length > 2) {
                                var device_connection = true
                            } else {
                                var device_connection = false
                            }




                            var l_update = d.module.last_update

                            if (d.type.id === 22 || d.type.id === 20 || d.type.id === 23 || d.type.id === 24) {
                                l_update = d.module.feedback[0].last_update
                            }



                            var last_device_update = new Date(parseUTCDate(l_update))

                            last_device_update = addHours(3, last_device_update)
                            // alert(last_device_update)
                            var actual_date = new Date()

                            const diffTime = Math.abs(actual_date - last_device_update);
                            var seconds = Math.floor((diffTime / 1000))

                            if (seconds < 20) {
                                device_connection = false
                            } else {
                                device_connection = true
                            }


                            var actual_alias = 0
                            var feedback_status = []

                            if (d.module.feedback) {
                                d.module.feedback.map((row, index) => {
                                    var alias = parseInt(row.button_alias)
                                    var status = parseInt(row.status)

                                    if (status === -1) {
                                        if (alias > actual_alias) {
                                            actual_alias = alias
                                        }
                                    }

                                    if (row.type === 'alert' || row.type === 'trigger') {
                                        if (row.status === -1) {
                                            var f_status = {
                                                type: row.type,
                                                status: row.status,
                                                alias: row.button_alias,
                                                critical_alert: row.critical_alert,
                                                last_update: row.last_update,
                                                color: row.color,
                                                icon: row.icon,
                                                description: row.description,
                                                has_command: row.has_command,
                                                command: row.command,

                                            }

                                            feedback_status.push(f_status)
                                        }
                                    }
                                })
                            }

                            array_devices.push({
                                "id": d.id,
                                "mac_address": d.mac_address,
                                "name": d.name,
                                "status": d.module.status,
                                "type": d.type.name,
                                "id_type": d.type.id,
                                "icon": d.type.icon_media_id,
                                "module_id": d.module_id,
                                "notifications": true,
                                "last_update": d.module.last_update,
                                "offline": device_connection,
                                "feedback": d.module.feedback ? d.module.feedback : null,
                                "actual_alias": actual_alias,
                                "feedback_status": feedback_status,
                                "color": feedback_status[0] ? feedback_status[0].color : null,
                                "array_painel": array_painel
                            })
                        })
                    }
                })

                var my_ambient = {
                    "id": row.id,
                    "name": row.name,
                    "status": row.status,
                    "devices": array_devices,
                }

                array_ambients.push(my_ambient)
            })

            sharedAmbients.map((row) => {
                var array_devices = []
                var array_painel = []

                row.ambient_devices.map((r) => {

                    if (r.deleted_at) {

                    } else {
                        r.devices.map((d) => {
                            if (d.module.spool.length > 2) {
                                var device_connection = true
                            } else {
                                var device_connection = false
                            }



                            var l_update = d.module.last_update

                            if (d.type.id === 22 || d.type.id === 20 || d.type.id === 23 || d.type.id === 24) {
                                l_update = d.module.feedback[0].last_update
                            }



                            var last_device_update = new Date(parseUTCDate(l_update))

                            last_device_update = addHours(3, last_device_update)
                            // alert(last_device_update)
                            var actual_date = new Date()

                            const diffTime = Math.abs(actual_date - last_device_update);
                            var seconds = Math.floor((diffTime / 1000))

                            if (seconds < 20) {
                                device_connection = false
                            } else {
                                device_connection = true
                            }

                            // console.log('actual:' + actual_date);
                            // console.log('ult update' + last_device_update);
                            // console.log(diffTime);
                            // console.log('diferenca seconds = ' + seconds);

                            var actual_alias = 0
                            var feedback_status = []

                            if (d.module.feedback) {
                                d.module.feedback.map((row, index) => {
                                    var alias = parseInt(row.button_alias)
                                    var status = parseInt(row.status)

                                    if (status === -1) {
                                        if (alias > actual_alias) {
                                            actual_alias = alias
                                        }
                                    }

                                    if (row.type === 'alert' || row.type === 'trigger') {
                                        if (row.status === -1) {
                                            var f_status = {
                                                type: row.type,
                                                status: row.status,
                                                alias: row.button_alias,
                                                critical_alert: row.critical_alert,
                                                last_update: row.last_update,
                                                color: row.color,
                                                icon: row.icon,
                                                description: row.description,
                                                has_command: row.has_command,
                                                command: row.command,
                                            }

                                            feedback_status.push(f_status)
                                        }
                                    }
                                })
                            }

                            array_devices.push({
                                "id": d.id,
                                "mac_address": d.mac_address,
                                "name": d.name,
                                "status": d.module.status,
                                "type": d.type.name,
                                "id_type": d.type.id,
                                "icon": d.type.icon_media_id,
                                "module_id": d.module_id,
                                "notifications": true,
                                "last_update": d.module.last_update,
                                "offline": device_connection,
                                "feedback": d.module.feedback ? d.module.feedback : null,
                                "actual_alias": actual_alias,
                                "feedback_status": feedback_status,
                                "color": feedback_status[0] ? feedback_status[0].color : null,
                                "array_painel": array_painel
                            })
                        })
                    }
                })

                var my_ambient = {
                    "id": row.id,
                    "name": row.name,
                    "status": row.status,
                    "devices": array_devices,
                }

                array_ambients.push(my_ambient)
            })

            // console.log(array_ambients)

            await localStorage.setItem('OnlyOne-Ambients', JSON.stringify(array_ambients))
            await setAmbients(array_ambients)

            // REQUEST
        } else {
            await setAmbients(ambients)
        }


        if (reload === true && loading === true) {
            setGettingData(false)
        }

        setLoadingAmbients(false)
        setRefreshing(false)

    }

    const sendFeedBackCommandDevice = async (index, module_id, mac_address, ambient, device, feedback, command) => {
        const user_data = await JSON.parse(localStorage.getItem('OnlyOne-userData'))

        const newAmbients = [...ambients]
        newAmbients[ambient].devices[device].feedback[index].feedback_loading = true;
        setAmbients(newAmbients)

        var url = endPointOnly + "/test/command?mac_address=" + mac_address + "&user_id=" + user_data.app_user + "&command=" + command + "& HTTP/1.1";

        await axios.get(url)

        const new2Ambients = [...ambients]
        new2Ambients[ambient].devices[device].feedback[index].feedback_loading = false;
        setAmbients(new2Ambients)

        notification['success']({
            description: 'Ação enviada com sucesso',
            icon: <FiCheckCircle style={{ color: '#52c41a' }} />,
        })

    }

    const sendCommandPanel = async (command, mac_address) => {
        waitOn()
        const user_data = await JSON.parse(localStorage.getItem('OnlyOne-userData'))

        var url = endPointOnly + "/test/command?mac_address=" + mac_address + "&user_id=44355&command=" + command + "& HTTP/1.1";

        await axios.get(url)

        notification['success']({
            description: 'Ação enviada com sucesso',
            icon: <FiCheckCircle style={{ color: '#52c41a' }} />,
        })
        waitOff()
    }

    useEffect(() => {
        var data = JSON.parse(localStorage.getItem('OnlyOne-userData'))
        setUser(data)

        // await connnectPusher(user_data.app_user)
        getAmbients()

        setInterval(() => {
            getAmbients(true, true)
        }, 15000)
    }, [])

    // LEVEL CONTROLLER
    const radius = 100;

    const renderLevelController = (feedback, alias, name, feedback_status, mac_address, ambient, device, color, offline) => {
        var t = false
        var temp = 0

        var critico = feedback.find(item => item.description === 'nivel_critico')
        var min = feedback.find(item => item.description === '25')

        var sensor_temperatura = feedback.find(item => item.description === 'sensor_temperatura')
        if (sensor_temperatura) {
            temp = sensor_temperatura.status
        }

        if (critico.status === 0 && min.status === 0) {
            t = true
            alias = 15
        }

        if (critico.status === -1) {
            alias = 15
        }

        return (
            <>
                <div className='card-level-controller-container'>

                    <div className="card-level-controller">
                        {/* STATUS */}
                        {offline
                            ? <>
                                <span className='offline-data'>
                                    <span className=''>
                                        <FiWifiOff /> Offline
                                    </span>
                                </span>
                            </>
                            : <>

                                {gettingData
                                    ? <span className='retrieve-data'>
                                        {/* <span className=''>
                                            <FiRepeat /> Recebendo dados
                                        </span> */}
                                    </span>
                                    : <></>
                                }
                            </>
                        }
                        {/* STATUS */}
                        <div className="level-controller-name">
                            <h6 className='text-info'>{name}</h6>
                        </div>


                        {/* THERMOMETER */}
                        <div className='thermometer-container' >
                            <Thermometer
                                theme="light"
                                value={temp}
                                max="80"
                                steps=""
                                format="°C"
                                size="small"
                                height="200"
                                tooltipValue={false}
                                tooltip={false}
                            />
                        </div>
                        {/* THERMOMETER */}

                        <LiquidFillGauge
                            style={{ margin: '0 auto' }}
                            width={radius * 2}
                            height={radius * 2}
                            percent={'%'}
                            riseAnimation
                            waveAnimation
                            waveFrequency={3}
                            waveAmplitude={2}
                            gradient
                            value={alias}
                            circleStyle={{
                                fill: color ? color : '#178bca'
                            }}
                            textStyle={
                                alias === 10
                                    ? { fontFamily: 'white' }
                                    : alias === 100
                                        ? { fontFamily: 'green' }
                                        : null
                            }
                        >
                        </LiquidFillGauge>

                        <div className='level-controller-lastupdate'>
                            {/* ALERTS */}
                            {feedback.map((row, index) => {
                                switch (row.type) {
                                    case 'alert':
                                    case 'trigger':
                                        if (row.status === '-1' && row.critical_alert === '0' || row.status === -1 && row.critical_alert === 0) {
                                            return (
                                                <div key={index} style={{ width: '100%' }}>
                                                    <div className='alert-level-controller' style={{ background: row.color }}>
                                                        <div className=''>
                                                            {row.button_alias}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        } else if (row.status === '-1' && row.critical_alert === '1' || row.status === -1 && row.critical_alert === 1) {
                                            return (
                                                <div key={index} className='level-controler-critical-alert' style={{ width: '100%' }}>
                                                    <div className="">
                                                        {row.button_alias}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        break
                                    default:

                                        break
                                }

                            })}
                            {/* ALERTS */}

                            {feedback.map((row, index) => (
                                row.has_command === "1" || row.has_command === 1 ?
                                    <div key={index} style={{ width: '100%', marginRight: '30px', marginLeft: '30px' }}>
                                        <div className='control-level-command-button'>
                                            <div className='row'>
                                                <div className='col-9'>
                                                    <div style={{ marginLeft: '5px' }}>
                                                        {row.button_alias}
                                                    </div>
                                                </div>
                                                <div className='col-3'>
                                                    <Switch
                                                        checkedChildren="On"
                                                        unCheckedChildren="Off"
                                                        checked={row.status.toString() === '-1' ? true : false}
                                                        loading={row.feedback_loading}
                                                        onChange={e => [sendFeedBackCommandDevice(index, row.module_id, mac_address, ambient, device, feedback, row.command)]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                            ))}

                            <div>Últ.Atualização</div>
                            <div>
                                {feedback[1]
                                    ? <Moment format="DD/MM/YYYY HH:m:ss">{feedback[1].last_update}</Moment>
                                    : <></>
                                }
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // LEVEL CONTROLLER

    // PANEL CONTROLLER
    const renderPanel = (feedback, alias, name, mac_address, ambient, device, status) => {
        var falha_bomba_1 = '0';
        var falha_bomba_2 = '0';

        var bomba_1_ok = feedback.find(item => item.description === 'bomba_1_ok')
        var bomba_1 = feedback.find(item => item.description === 'bomba_1')

        var bomba_2_ok = feedback.find(item => item.description === 'bomba_2_ok')
        var bomba_2 = feedback.find(item => item.description === 'bomba_2')

        var nivel_critico_superior = feedback.find(item => item.description === 'nivel_critico_superior')
        var manual = feedback.find(item => item.description === 'manual')
        var automatico = feedback.find(item => item.description === 'automatico')
        var sistema_ligado = feedback.find(item => item.description === 'sistema_ligado')
        var abastecimento_ok = feedback.find(item => item.description === 'abastecimento_ok')
        var extravasao = feedback.find(item => item.description === 'extravasao')
        var nivel_critico_cisterna = feedback.find(item => item.description === 'nivel_critico_cisterna')
        var falha_de_motor = feedback.find(item => item.description === 'falha_de_motor')
        var soft_starter = feedback.find(item => item.description === 'soft_starter')
        var reset = feedback.find(item => item.description === 'reset')

        if (falha_de_motor.status.toString() === '1') {
            if (bomba_1_ok.status.toString() === '0') {
                falha_bomba_1 = '1'
            } else {
                falha_bomba_1 = '0'
            }

            if (bomba_2_ok) {
                if (bomba_2_ok.status.toString() === '0') {
                    falha_bomba_2 = '1'
                } else {
                    falha_bomba_2 = '0'
                }
            }
        }

        return (
            <div className='card-level-controller-container'>
                <div className="card-level-controller">
                    <div className='row'>
                        <div className='col-12'>
                            {gettingData
                                ? <span className='retrieve-data'>
                                    {/* <span className=''>
                                        <FiRepeat /> Recebendo dados
                                    </span> */}
                                </span>
                                : <>
                                    {status
                                        ? <>
                                            <span className='offline-data'>
                                                <span className=''>
                                                    <FiWifiOff /> Offline
                                                </span>
                                            </span>
                                        </>
                                        : <></>
                                    }
                                </>
                            }
                            <div className="level-controller-name">
                                <h6 className='text-info'>{name}</h6>
                            </div>

                            <div className='row'>
                                {falha_de_motor
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [
                                                    falha_de_motor.has_command.toString() === '1'
                                                        ? sendCommandPanel(falha_de_motor.command, mac_address)
                                                        : null
                                                ]}
                                            >
                                                <img src={falha_de_motor.status.toString() === '0'
                                                    ? motor
                                                    : motor_danger
                                                }
                                                    className="icon-image"
                                                />

                                                {falha_de_motor.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt', marginTop: '4px' }}>
                                                        {falha_de_motor.button_alias}
                                                    </div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#cf1f1f', fontSize: '7pt', marginTop: '4px' }}>
                                                        {falha_de_motor.button_alias}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }

                                {manual
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [manual.has_command.toString() === '1' ? sendCommandPanel(manual.command, mac_address) : null]}
                                            >
                                                {manual.status.toString() === '0'
                                                    ? <><FiCrosshair style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiCrosshair style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {manual.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt', marginTop: '4px' }}>{manual.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt', marginTop: '4px' }}>{manual.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }

                                {automatico
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [sendCommandPanel(automatico.command, mac_address)]}
                                            >
                                                {automatico.status.toString() === '0'
                                                    ? <><FiCpu style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiCpu style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {automatico.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt', marginTop: '4px' }}>{automatico.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt', marginTop: '4px' }}>{automatico.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }

                                {sistema_ligado
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [sistema_ligado.has_command.toString() === '1' ? sendCommandPanel(sistema_ligado.command, mac_address) : null]}
                                            >
                                                {sistema_ligado.status.toString() === '0'
                                                    ? <><FiPower style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiPower style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {sistema_ligado.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt', marginTop: '4px' }}>{sistema_ligado.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt', marginTop: '4px' }}>{sistema_ligado.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }
                            </div>

                            <div className='row'>
                                {nivel_critico_superior
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [nivel_critico_superior.has_command.toString() === '1' ? sendCommandPanel(nivel_critico_superior.command, mac_address) : null]}
                                            >
                                                {nivel_critico_superior.status.toString() === '0'
                                                    ? <><FiArrowUpCircle style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiArrowUpCircle style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {nivel_critico_superior.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt' }}>{nivel_critico_superior.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt' }}>{nivel_critico_superior.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }

                                {nivel_critico_cisterna
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [nivel_critico_cisterna.has_command.toString() === '1' ? sendCommandPanel(nivel_critico_cisterna.command, mac_address) : null]}
                                            >
                                                {nivel_critico_cisterna.status.toString() === '0'
                                                    ? <><FiArrowDownCircle style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiArrowDownCircle style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {nivel_critico_cisterna.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt' }}>{nivel_critico_cisterna.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt' }}>{nivel_critico_cisterna.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <>
                                    </>
                                }

                                {abastecimento_ok
                                    ? <>
                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [abastecimento_ok.has_command.toString() === '1' ? sendCommandPanel(abastecimento_ok.command, mac_address) : null]}
                                            >
                                                {abastecimento_ok.status.toString() === '0'
                                                    ? <><FiDroplet style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiDroplet style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {abastecimento_ok.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt' }}>{abastecimento_ok.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt' }}>{abastecimento_ok.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }

                                {extravasao
                                    ? <>

                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [extravasao.has_command.toString() === '1' ? sendCommandPanel(extravasao.command, mac_address) : null]}
                                            >
                                                {extravasao.status.toString() === '0'
                                                    ? <><FiTrendingUp style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiTrendingUp style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {extravasao.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt' }}>{extravasao.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt' }}>{extravasao.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }

                                {soft_starter
                                    ? <>

                                        <div className='col'>
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [soft_starter.has_command.toString() === '1' ? sendCommandPanel(soft_starter.command, mac_address) : null]}
                                            >
                                                {soft_starter.status.toString() === '0'
                                                    ? <><FiAlertCircle style={{ fontSize: '25px', color: 'grey' }} /></>
                                                    : <><FiAlertCircle style={{ fontSize: '25px', color: '#08C427' }} /></>
                                                }

                                                {soft_starter.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt' }}>{soft_starter.button_alias}</div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#08C427', fontSize: '7pt' }}>{soft_starter.button_alias}</div>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }
                            </div>


                            <div className='row'>
                                <div className='col-6'>
                                    <div
                                        onClick={() => [bomba_1_ok.has_command.toString() === '1' ? sendCommandPanel(bomba_1_ok.command, mac_address) : null]}
                                    >
                                        <div className={`panel-cog ${bomba_1.status.toString() === '1' ? 'rotating' : ''} `}>
                                            <FiSettings style={{ fontSize: '30pt' }} />
                                        </div>
                                        <div className='bomb-name'>{bomba_1.button_alias}</div>
                                        <div className='bomba_status'>
                                            {falha_bomba_1 === '1'
                                                ? <><FiX style={{ color: 'red' }} className='falha_motor_x ' /></>
                                                : <></>
                                            }

                                            {bomba_1_ok.status.toString() === '1'
                                                ? <><div className='bullet' style={{ marginRight: '5px', background: '#07B724' }}></div> Operando</>
                                                : <><div className='bullet' style={{ marginRight: '5px', background: '#FFF033' }}></div> Inoperante</>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='col'></div>
                                <div className='col-4'>

                                    {reset
                                        ? <>
                                            {/* <div className='col'> */}
                                            <div
                                                className='status-panel-content ripple'
                                                onClick={() => [
                                                    reset.has_command.toString() === '1'
                                                        ? sendCommandPanel(reset.command, mac_address)
                                                        : null
                                                ]}

                                                style={{
                                                    backgroundColor: 'rgba(0, 110, 255, 0.882)',
                                                    borderRadius: 10
                                                }}
                                            >

                                                {reset.status.toString() === '0'
                                                    ? <><FiAlertOctagon style={{ fontSize: '25px', color: 'white' }} /></>
                                                    : <><FiAlertOctagon style={{ fontSize: '25px', color: 'white' }} /></>
                                                }

                                                {reset.status.toString() === '0'
                                                    ? <div className='panel-text' style={{ fontWeight: 'bold', fontSize: '7pt', marginTop: '4px', color: 'white' }}>
                                                        {reset.button_alias}
                                                    </div>
                                                    : <div className='panel-text ' style={{ fontWeight: 'bold', color: '#white', fontSize: '7pt', marginTop: '4px' }}>
                                                        {reset.button_alias}
                                                    </div>
                                                }
                                            </div>

                                            {/* </div> */}
                                        </>
                                        : <></>
                                    }
                                    {bomba_2_ok
                                        ? <div
                                            onClick={() => [bomba_2_ok.has_command.toString() === '1' ? sendCommandPanel(bomba_2_ok.command, mac_address) : null]}
                                        >
                                            <div className={`panel-cog ${bomba_2.status.toString() === '1' ? 'rotating' : ''} `}>
                                                <FiSettings />
                                            </div>
                                            <div className='bomb-name'>{bomba_2.button_alias}</div>
                                            <div className='bomba_status'>
                                                {falha_bomba_2 === '1'
                                                    ? <><FiX style={{ color: 'red' }} className='falha_motor_x ' /></>
                                                    : <></>
                                                }

                                                {bomba_2_ok.status.toString() === '1'
                                                    ? <><div className='bullet' style={{ marginRight: '5px', background: '#07B724' }}></div> Operando</>
                                                    : <><div className='bullet' style={{ marginRight: '5px', background: '#FFF033' }}></div> Inoperante</>
                                                }
                                            </div>
                                        </div>
                                        : <></>
                                    }

                                </div>
                                <div className='col'></div>

                            </div>
                        </div>
                    </div>
                    <br /> <br />
                    <div className='level-controller-lastupdate' style={{ paddingBottom: '' }}>
                        <div>Últ.Atualização</div>
                        <div>
                            {feedback[1]
                                ? <Moment format="DD/MM/YYYY HH:m:ss">{feedback[1].last_update}</Moment>
                                : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // PANEL CONTROLLER

    // SELETIVIDADE
    const renderSeletividade = (feedback, alias, name, feedback_status, mac_address, ambient, device, color, offline) => {

        var sinal = feedback.find(item => item.description === 'sinal')
        var manual = feedback.find(item => item.description === 'manual')
        var seletividade = feedback.find(item => item.description === 'seletividade')

        return (
            <div className='card-level-controller-container'>
                <div className="card-level-controller">
                    {/* STATUS */}
                    {offline
                        ? <>
                            <span className='offline-data'>
                                <span className=''>
                                    <FiWifiOff /> Offline
                                </span>
                            </span>
                        </>
                        : <>

                            {gettingData
                                ? <span className='retrieve-data'>
                                    {/* <span className=''>
                                        <FiRepeat /> Recebendo dados
                                    </span> */}
                                </span>
                                : <></>
                            }
                        </>
                    }
                    {/* STATUS */}
                    <div className="level-controller-name">
                        <h6 className='text-info'>{name}</h6>
                    </div>


                    <div className='row' style={{ marginTop: 20 }}>
                        <div className='col-12 '>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <HiOutlineOfficeBuilding style={{
                                    fontSize: 40,
                                    color: offline ? '#ff0000d0' : ''
                                }} />
                            </div>

                        </div>

                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-7'>
                                    Seletividade
                                </div>

                                <div className='col-5'>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        fontSize: 8,
                                        marginTop: '5px',
                                        width: '70px',
                                        backgroundColor: seletividade.status === -1 ? '#00ff6a39' : '#ff000039',
                                        borderRadius: '8px'
                                    }}>
                                        {seletividade.status === -1 ? 'ON' : 'OFF'} &nbsp;
                                        <div style={{ marginTop: '-40px' }} >
                                            <FaPowerOff
                                                color={seletividade.status === -1 ? 'green' : 'red'}
                                                size={12}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: 20 }}>
                                <div className='col-7'>
                                    Radio LoRa
                                </div>

                                <div className='col-5'>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        fontSize: 8,
                                        marginTop: '5px',
                                        width: '70px',
                                        backgroundColor: sinal.status === -1 ? '#ff000039' : '#00ff6a39',
                                        borderRadius: '8px',
                                    }}>

                                        {sinal.status === -1 ? 'Sem sinal' : 'Conectado'} &nbsp;

                                        <div style={{ marginTop: '-40px' }} >
                                            <FaWifi
                                                color={sinal.status === -1 ? 'red' : 'green'}
                                                size={12}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: 20 }}>
                                <div className='col-12' >
                                    {manual.status === -1
                                        ? <div className='' style={{
                                            backgroundColor: '#ff000052',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#ff0000d0',
                                            fontWeight: 'bold'
                                        }}>
                                            <FaLink
                                                color={'#ff0000d0'}
                                                size={12}
                                            /> &nbsp;
                                            Modo Manual
                                        </div>
                                        : <div style={{
                                            backgroundColor: '#006eff5b',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#006effe1',
                                            fontWeight: 'bold'
                                        }}>
                                            <FaLink
                                                color={'#006effe1'}
                                                size={12}
                                            /> &nbsp;

                                            Modo Automático
                                        </div>
                                    }
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className='level-controller-lastupdate'>
                        {/* ALERTS */}
                        <div>Últ.Atualização</div>
                        <div>
                            {feedback[1]
                                ? <Moment format="DD/MM/YYYY HH:mm:ss">{feedback[1].last_update}</Moment>
                                : <></>
                            }
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // SELETIVIDADE

    // PISCINAS
    const renderPiscina = (feedback, alias, name, feedback_status, mac_address, ambient, device, color, offline) => {

        var sinal = feedback.find(item => item.description === 'sinal')
        var manual = feedback.find(item => item.description === 'manual')
        var seletividade = feedback.find(item => item.description === 'seletividade')

        return (
            <div className='card-level-controller-container'>
                <div className="card-level-controller">
                    {/* STATUS */}
                    {offline
                        ? <>
                            <span className='offline-data'>
                                <span className=''>
                                    <FiWifiOff /> Offline
                                </span>
                            </span>
                        </>
                        : <>

                            {gettingData
                                ? <span className='retrieve-data'>
                                    {/* <span className=''>
                                        <FiRepeat /> Recebendo dados
                                    </span> */}
                                </span>
                                : <></>
                            }
                        </>
                    }
                    {/* STATUS */}
                    <div className="level-controller-name">
                        <h6 className='text-info'>{name}</h6>
                    </div>


                    <div className='row' style={{ marginTop: 20 }}>
                        <div className='col12 '>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FaSwimmingPool style={{
                                    fontSize: 40,
                                    color: offline ? '#ff0000d0' : ''
                                }} />
                            </div>

                        </div>

                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-8'>
                                    Seletividade
                                </div>

                                <div className='col-4'>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        fontSize: 8,
                                        marginTop: '5px',
                                        backgroundColor: seletividade.status === -1 ? '#00ff6a39' : '#ff000039',
                                        borderRadius: '8px'
                                    }}>
                                        {seletividade.status === -1 ? 'ON' : 'OFF'} &nbsp;
                                        <div style={{ marginTop: '-40px' }} >
                                            <FaPowerOff
                                                color={seletividade.status === -1 ? 'green' : 'red'}
                                                size={12}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: 20 }}>
                                <div className='col-7'>
                                    Radio LoRa
                                </div>

                                <div className='col-5'>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        fontSize: 8,
                                        marginTop: '5px',
                                        width: '70px',
                                        backgroundColor: sinal.status === -1 ? '#ff000039' : '#00ff6a39',
                                        borderRadius: '8px',
                                    }}>

                                        {sinal.status === -1 ? 'Sem sinal' : 'Conectado'} &nbsp;
                                        <div style={{ marginTop: '-40px' }} >
                                            <FaWifi
                                                color={sinal.status === -1 ? 'red' : 'green'}
                                                size={12}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: 20 }}>
                                <div className='col-12' >
                                    {manual.status === -1
                                        ? <div className='' style={{
                                            backgroundColor: '#ff000052',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#ff0000d0',
                                            fontWeight: 'bold'
                                        }}>
                                            <FaLink
                                                color={'#ff0000d0'}
                                                size={12}
                                            /> &nbsp;
                                            Modo Manual
                                        </div>
                                        : <div style={{
                                            backgroundColor: '#006eff5b',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#006effe1',
                                            fontWeight: 'bold'
                                        }}>
                                            <FaLink
                                                color={'#006effe1'}
                                                size={12}
                                            /> &nbsp;

                                            Modo Automático
                                        </div>
                                    }
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className='level-controller-lastupdate'>
                        {/* ALERTS */}
                        <div>Últ.Atualização</div>
                        <div>
                            {feedback[1]
                                ? <Moment format="DD/MM/YYYY HH:mm:ss">{feedback[1].last_update}</Moment>
                                : <></>
                            }
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // PISCINAS

    //SALA DO GERADOR
    const renderSalaGerador = (ambient) => {
        if (ambients.length > 0) {
            var render = false
            var feedback = []

            ambients[0].devices.map((device, i) => {
                switch (device.id_type) {
                    default:
                        break;

                    case 23:
                    case 24:
                        feedback.push(device.feedback)
                        render = true
                }
            })

            var sala_gerador_manual = 0
            var gerador_1 = 0
            var gerador_2 = 0
            var sinal = 0
            var updated = undefined
            var connection = false

            {
                feedback.map((row, index) => {

                    var last_update = row[index].last_update
                    last_update = new Date(parseUTCDate(last_update))

                    var actual_date = new Date()

                    actual_date = addHours(-3, actual_date)

                    const diffTime = Math.abs(actual_date - last_update);
                    var seconds = Math.floor((diffTime / 1000))

                    if (seconds < 20) {
                        connection = true
                        updated = row[index].last_update

                        sala_gerador_manual = row.find(item => item.description === 'sala_gerador_manual')
                        sala_gerador_manual = sala_gerador_manual.status


                        if (sala_gerador_manual === 0) {
                            gerador_1 = row.find(item => item.description === 'gerador_1')
                            gerador_1 = gerador_1.status

                            gerador_2 = row.find(item => item.description === 'gerador_2')
                            gerador_2 = gerador_2.status
                        }

                        sinal = row.find(item => item.description === 'sinal')

                        if (sinal.status === 0) {
                            sinal = -1
                        }
                        return
                    }
                })

            }

            return (
                <div className='card-level-controller-container' >
                    <div className="card-level-controller">

                        {/* STATUS */}
                        <div className="level-controller-name">
                            <h6 className='text-info'>Sala do Gerador</h6>
                        </div>


                        <div className='row' style={{ paddingRight: '1%', paddingLeft: '1%' }}>
                            <div className='col-6'>
                                <div className={`panel-cog ${gerador_1 === -1 ? 'rotating' : ''} `}>
                                    <FiSettings size={40} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <h5>Gerador 1</h5>
                                </div>
                            </div>

                            <div className='col-6'>
                                <div className={`panel-cog ${gerador_2 === -1 ? 'rotating' : ''} `}>
                                    <FiSettings size={40} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <h5>Gerador 2</h5>
                                </div>
                            </div>
                        </div>

                        {sinal === -1
                            ? <></>
                            : <><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className=' badge bg-danger text-uppercase'>Perda de comunicação</div></div></>
                        }

                        {sala_gerador_manual === 0
                            ? <div className='' style={{
                                backgroundColor: '#006eff5b',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#006effe1',
                                fontWeight: 'bold',
                                marginTop: '15px'
                            }}><FaInfoCircle
                                    color={'#006effe1'}
                                    size={12}
                                /> &nbsp; Modo Automático Ativo</div>
                            : <div className='' style={{
                                backgroundColor: '#ff000052',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#ff0000d0',
                                fontWeight: 'bold',
                                marginTop: '15px'
                            }}><FaInfoCircle
                                    color={'#ff0000d0'}
                                    size={12}
                                /> &nbsp;
                                Modo Manual/Teste</div>
                        }

                        <div className='level-controller-lastupdate'>
                            {/* ALERTS */}
                            <div>Últ.Atualização</div>
                            <div>
                                <Moment format="DD/MM/YYYY HH:mm:ss">{updated}</Moment>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    //SALA DO GERADOR

    return (
        <>
            <div className="page-title-container">
                {/* <div style={{ display: 'flex' }}>
                    <div style={{ width: '50%' }}>
                        <h1 className="mb-3 pb-0 display-4 mt-2">
                            <FiHome style={{ marginTop: '-7px' }} /> &nbsp;
                            Início
                        </h1>
                    </div>
                    <div style={{ width: '50%' }}>
                        {gettingData
                            ? <>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <span className="spinner-border spinner-border-sm"></span>
                                </div>
                            </>
                            : <></>
                        }
                    </div>
                </div> */}

                {/* <h2 className="small-title">Dashboard</h2> */}

                <div className='card'>
                    <div className='card-body'>


                        {loadingAmbients
                            ? <>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
                                    <div className="spinner-border spinner-border-md"></div>
                                    <div className="text-primary mt-3">Carregando ambientes...</div>
                                </div>
                            </>
                            : <>

                                {ambients.map((ambient, index) => {
                                    return (
                                        <div className='row' key={index}>
                                            <div className='col-12'>
                                                <h6 className='text-info'>
                                                    <FiBox style={{ marginTop: '-2px' }} /> &nbsp;
                                                    {ambient.name}
                                                </h6>

                                                <div className='card-custom'>
                                                    <div className='card-custom-header'>Paineis</div>
                                                    <div>
                                                        <div className='row'>
                                                            {ambient.devices.map((device, i) => {
                                                                switch (device.id_type) {

                                                                    case 20:
                                                                        // PANEl
                                                                        return (
                                                                            <div className="col-12 col-md-3" key={i}>
                                                                                {renderPanel(device.feedback, device.actual_alias, device.name, device.mac_address, index, i, device.offline)}
                                                                            </div>
                                                                        )

                                                                }
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>


                                                {/* DEVICES */}
                                                <div className='card-custom'>
                                                    <div className='card-custom-header'>Seletividade</div>
                                                    <div>
                                                        <div className='row'>
                                                            {ambient.devices.map((device, i) => {
                                                                switch (device.id_type) {
                                                                    case 2:
                                                                        // LAMP
                                                                        return

                                                                    case 17:
                                                                        // DOOR
                                                                        return

                                                                    case 22:
                                                                        // LEVEL CONTROLLER
                                                                        return (
                                                                            <div className="col-12 col-md-2" key={i}>
                                                                                {renderLevelController(device.feedback, device.actual_alias, device.name, device.feedback_status, device.mac_address, index, i, device.color, device.offline)}
                                                                            </div>
                                                                        )
                                                                        return

                                                                    // case 20:
                                                                    //     // PANEl
                                                                    //     return (
                                                                    //         <div className="col-12 col-md-3" key={i}>
                                                                    //             {renderPanel(device.feedback, device.actual_alias, device.name, device.mac_address, index, i, device.offline)}
                                                                    //         </div>
                                                                    //     )
                                                                    case 23:
                                                                        // ENJOY TORRE
                                                                        return (
                                                                            <div className="col" key={i}>
                                                                                {renderSeletividade(device.feedback, device.actual_alias, device.name, device.feedback_status, device.mac_address, index, i, device.color, device.offline)}
                                                                            </div>
                                                                        )
                                                                        return

                                                                    case 24:
                                                                        // ENJOY PISCINA
                                                                        return (
                                                                            <div className="col" key={i}>
                                                                                {renderPiscina(device.feedback, device.actual_alias, device.name, device.feedback_status, device.mac_address, index, i, device.color, device.offline)}
                                                                            </div>
                                                                        )
                                                                        return
                                                                }
                                                            })}


                                                            <div className="col" >
                                                                {renderSalaGerador(ambients)}
                                                            </div>
                                                        </div>
                                                        {/* DEVICES */}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}