import { useEffect, useState } from 'react'
import { FiBook } from 'react-icons/fi'
import api from '../../../services/api'

export default function (props) {

    const [loading, setLoading] = useState()
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const response = await api.get('/api/v1/enjoy/list_users')

            setUsers(response.data)
        } catch (error) {

        }
        setLoading(false)
    }

    const aproveUser = async (user) => {
        setLoading(true)

        try {
            const response = await api.get('/api/v1/enjoy/change_user?id=' + user + '&status=active')

            await loadUsers()
        } catch (error) {

        }

        setLoading(false)
    }

    const reproveUser = async (user) => {
        setLoading(true)

        try {
            const response = await api.get('/api/v1/enjoy/change_user?id=' + user + '&status=reproved')

            await loadUsers()
        } catch (error) {

        }

        setLoading(false)
    }

    const reactivateUser = async (user) => {
        setLoading(true)

        try {
            const response = await api.get('/api/v1/enjoy/change_user?id=' + user + '&status=active')

            await loadUsers()
        } catch (error) {

        }

        setLoading(false)
    }

    return (
        <>
            <div className="page-title-container">
                <h1 className="mb-0 pb-0 display-4 mt-2">
                    <FiBook style={{ marginTop: '-7px' }} /> &nbsp;
                    Usuários
                </h1>
            </div>

            <div className='card'>
                <div className='card-body'>

                    {loading
                        ? <>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
                                <div className="spinner-border spinner-border-md"></div>
                                <div className="text-primary mt-3">Carregando</div>
                            </div>

                        </>
                        : <>
                            <div className="row g-0 h-100  mb-2  d-none d-sm-flex">
                                <div className="col  ">
                                    <div className="text-muted text-medium cursor-pointer">Nome</div>
                                </div>
                                <div className="col  ">
                                    <div className="text-muted text-medium cursor-pointer">E-mail</div>
                                </div>
                                <div className="col   ">
                                    <div className="text-muted text-medium cursor-pointer">Status</div>
                                </div>
                                <div className="col   ">
                                    <div className="text-muted text-medium cursor-pointer">Data</div>
                                </div>

                                <div className="col">

                                </div>
                            </div>

                            {users.map((row, index) => {
                                return (
                                    <div key={index} className="row g-0 h-100  mb-2  d-none d-sm-flex">
                                        <div className="col  ">
                                            <div className="text-black text-medium cursor-pointer">{row.name}</div>
                                        </div>

                                        <div className="col  ">
                                            <div className="text-black text-medium cursor-pointer">{row.email}</div>
                                        </div>

                                        <div className="col  ">
                                            <div className="text-black text-medium cursor-pointer">{row.company_status}</div>
                                        </div>

                                        <div className="col">
                                            <div className="text-black text-medium cursor-pointer">{new Date(row.created_at).toLocaleDateString('pt-BR')}</div>
                                        </div>

                                        <div className='col'>
                                            {row.company_status === 'pending'
                                                ? <>
                                                    <span className='aprove-user' onClick={() => aproveUser(row.id)}>
                                                        Aprovar
                                                    </span>
                                                </>
                                                : <>
                                                </>
                                            }

                                            {row.company_status === 'active'
                                                ? <>
                                                    <span className='reprove-user' onClick={() => reproveUser(row.id)}>
                                                        Bloquear
                                                    </span>
                                                </>
                                                : <>
                                                </>
                                            }

                                            {row.company_status === 'reproved'
                                                ? <>
                                                    <span className='reactive-user' onClick={() => reactivateUser(row.id)}>
                                                        Reativar
                                                    </span>
                                                </>
                                                :
                                                <>


                                                </>
                                            }


                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    }

                </div>
            </div>
        </>
    )
}