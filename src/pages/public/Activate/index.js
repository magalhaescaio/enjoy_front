import { useEffect, useState } from "react"
import queryString from 'query-string'
import { Link, Redirect } from "react-router-dom"
import axios from "axios"
import { endPoint, site } from "../../../constants/default"



export default function (props) {
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [checkingToken, setCheckingToken] = useState(true)
    const [redirect, setRedirect] = useState(false)
    const [redirectRoute, setRedirectRoute] = useState('/')
    const [token, setToken] = useState()

    useEffect(() => {
        const urlParameters = queryString.parse(window.location.search)

        const token = urlParameters['token']

        if (!token) {
            setCheckingToken(false)
            setError(true)
        } else {
            setToken(token)
            verifyToken(token)
        }

    }, [])

    const verifyToken = async (activationToken) => {
        try {
            const response = await axios.get(endPoint + '/api/v1/auth/activate?token=' + activationToken)

            if(response.status === 200){
                setCheckingToken(false)
                setSuccess(true)
            }else{
                setCheckingToken(false)
                setError(true)
            }
        } catch (error) {
            setCheckingToken(false)
            setError(true)
        }
    }

    return (
        <>
            {redirect ? <Redirect to={redirectRoute} /> : <></>}

            <div className="fixed-background"></div>

            <div className="container-fluid p-0 h-100 position-relative">
                <div className="row g-0 h-100">
                    {/* LEFT */}
                    <div className="offset-0 col-12 d-none d-lg-flex offset-md-1 col-lg h-lg-100">
                        <div className="min-h-100 d-flex align-items-center">
                            <div className="w-100 w-lg-75 w-xxl-50">
                                <div>
                                    <div className="mb-5">
                                        <h1 className="display-3 text-white">Bem-vindo!</h1>
                                        <h1 className="display-3 text-white"></h1>
                                    </div>
                                    <p className="h6 text-white lh-1-5 mb-5">
                                        Tenha o controle do acendimento das luzes, de abertura das portas e portões da sua casa com apenas um toque no seu celular.
                                    </p>
                                    <div className="mb-5">
                                        <a className="btn btn-lg btn-outline-white" href={site} target='_blank'>Saiba mais</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* LEFT */}

                    {/* RIGHT */}
                    <div className="col-12 col-lg-auto h-100 pb-4 px-4 pt-0 p-lg-0">
                        <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
                            <div className="sw-lg-50 px-5">
                                <div className="sh-11">
                                    <a href="index.html">
                                        <div className="logo-default"></div>
                                    </a>
                                </div>

                                {checkingToken
                                    ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
                                        <div className="spinner-border spinner-border-md"></div>
                                        <div className="text-primary mt-3">Verificando token...</div>
                                    </div>
                                    : <></>
                                }

                                {error
                                    ? <div role="alert" className="fade alert alert-danger show mt-2">
                                        <b>Não foi possível verificar token</b> <br />
                                        O token pode ter expirado ou ser inválido! <br />
                                        Verifique o e-mail ou entre em contato com o administrador do sistemas <br />

                                        <div className="mt-2">
                                            <Link to='/login' className="text-danger" style={{ fontWeight: 'bold' }}>
                                                Clique aqui
                                            </Link> para voltar.
                                        </div>
                                    </div>
                                    : <></>
                                }

                                {success
                                    ? <div role="alert" className="fade alert alert-success show mt-2">
                                        <b>Token validado com sucesso</b> <br />
                                        Sua conta já está ativa e pode ser acessada.
                                        
                                        <div className="mt-2">
                                            <Link to='/login' className="text-success" style={{ fontWeight: 'bold' }}>
                                                Clique aqui
                                            </Link> para voltar.
                                        </div>
                                    </div>
                                    : <></>
                                }


                            </div>
                        </div>
                    </div>
                    {/* RIGHT */}

                </div>
            </div>
        </>
    )
}