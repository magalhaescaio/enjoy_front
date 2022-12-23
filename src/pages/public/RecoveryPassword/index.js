import { useEffect, useState } from "react"
import queryString from 'query-string'
import { Link, Redirect } from "react-router-dom"
import axios from "axios"
import { FiKey, FiChevronsRight } from 'react-icons/fi'
import { Formik } from 'formik'

import { endPoint, site } from "../../../constants/default"

export default function (props) {
    // var url = endPoint + '/api/v1/auth/check/verify_token/'+token

    const [error, setError] = useState(false)
    const [email, setEmail] = useState()
    const [success, setSuccess] = useState(false)
    const [checkingToken, setCheckingToken] = useState(true)
    const [redirect, setRedirect] = useState(false)
    const [redirectRoute, setRedirectRoute] = useState('/')
    const [token, setToken] = useState()

    const [changeSuccess, setChangeSuccess] = useState(false)
    const [errorChange, setErrorChange] = useState(false)
    const [errorChangeResponse, setErrorChangeResponse] = useState()

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
            const response = await axios.get(endPoint + '/api/v1/auth/check/verify_token/' + activationToken)

            if (response.status === 200) {
                setEmail(response.data[0].email)
                setCheckingToken(false)
                setSuccess(true)
            } else {
                setCheckingToken(false)
                setError(true)
            }
        } catch (error) {
            setCheckingToken(false)
            setError(true)
        }
    }

    const fetchRecoveryPassword = async (values) => {
        try {
            const response = await axios.post(endPoint + '/api/v1/auth/change/reset_password', values)

            if (response.status === 200) {
                setChangeSuccess(true)
            }
        } catch (error) {
            setErrorChange(true)
            setErrorChangeResponse(error.response.data)
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

                                        <div className="mt-2">
                                            <Link to='/login' className="text-danger" style={{ fontWeight: 'bold' }}>
                                                Clique aqui
                                            </Link> para voltar.
                                        </div>
                                    </div>
                                    : <></>
                                }

                                {success
                                    ? <>
                                        <div className={`mb-5 ${changeSuccess ? 'd-none' : ''} `}>
                                            <p className="h6">Informe uma nova senha para conta</p>
                                        </div>

                                        <div className={`${changeSuccess ? 'd-none' : ''}`}>
                                            <Formik
                                                initialValues={{
                                                    password: '',
                                                    password_confirmation: '',
                                                    token: token,
                                                    email: email
                                                }}

                                                validate={values => {
                                                    const errors = {}

                                                    if (!values.password_confirmation) {
                                                        errors.password_confirmation = 'Este campo é obrigatório'
                                                    }

                                                    if (!values.password) {
                                                        errors.password = 'Este campo é obrigatório'
                                                    } else {
                                                        if (values.password_confirmation !== values.password_confirmation) {
                                                            errors.password_confirmation = 'As senhas não coincidem'
                                                        }
                                                    }

                                                    return errors;
                                                }}

                                                onSubmit={async (values, { setSubmitting }) => {
                                                    setError(false)
                                                    await fetchRecoveryPassword(values)
                                                }}
                                            >
                                                {({
                                                    values,
                                                    errors,
                                                    touched,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    isSubmitting,
                                                    handleTaxid
                                                }) => (
                                                    <form
                                                        id="changePassword"
                                                        className="tooltip-end-bottom"
                                                        noValidate
                                                        onSubmit={handleSubmit}
                                                    >
                                                        <div className="mb-3 filled form-group tooltip-end-top">
                                                            <FiKey />
                                                            <input
                                                                className="form-control required pe-7"
                                                                name="password"
                                                                type="password"
                                                                placeholder="Insira sua senha"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.password}
                                                                required
                                                                disabled={isSubmitting}
                                                            />

                                                            <div className="invalid-feedback">{errors.password && touched.password && errors.password}</div>
                                                        </div>

                                                        <div className="mb-3 filled form-group tooltip-end-top">
                                                            <FiKey />
                                                            <input
                                                                className="form-control required pe-7"
                                                                name="password_confirmation"
                                                                type="password"
                                                                placeholder="Confirme sua senha"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.password_confirmation}
                                                                required
                                                                disabled={isSubmitting}
                                                            />

                                                            <div className="invalid-feedback">{errors.password_confirmation && touched.password_confirmation && errors.password_confirmation}</div>
                                                        </div>

                                                        <div className='mt-3' style={{ display: 'flex' }}>
                                                            <div style={{ width: '50%' }}>

                                                            </div>

                                                            <div style={{ width: '50%', display: 'flex', justifyContent: "flex-end" }}>

                                                                <button
                                                                    disabled={isSubmitting}
                                                                    type="submit"
                                                                    className="btn btn-lg btn-info  mb-1 "
                                                                >
                                                                    {isSubmitting
                                                                        ? <>
                                                                            <span className="spinner-border spinner-border-sm"></span>
                                                                            Carregando
                                                                        </>
                                                                        : <>Alterar senha <FiChevronsRight style={{ marginTop: '-2px' }} /> </>
                                                                    }
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {errorChange
                                                            ? <>
                                                                {errorChangeResponse && errorChangeResponse.title
                                                                    ? <>
                                                                        <div role="alert" className="fade alert alert-danger show mt-2">
                                                                            <b>{errorChangeResponse.title}</b> <br />
                                                                            {errorChangeResponse.message}
                                                                        </div>
                                                                    </>
                                                                    : <>
                                                                        {Object.keys(errorChangeResponse.error).length > 0
                                                                            ? <>
                                                                                <div role="alert" className="fade alert alert-danger show mt-2">
                                                                                    <b>Verifique os erros abaixo</b>
                                                                                    {Object.keys(errorChangeResponse.error).map((row, index) => {
                                                                                        return (
                                                                                            <div key={index}>
                                                                                                <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{row}:</span>
                                                                                                &nbsp;
                                                                                                {errorChangeResponse.error[row].map((r, i) => {
                                                                                                    return (
                                                                                                        <span key={i} className='ml-1' style={{ fontSize: '9pt' }}>
                                                                                                            {r}
                                                                                                        </span>
                                                                                                    )
                                                                                                })}
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </>
                                                                            : <></>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                            : <></>
                                                        }
                                                    </form>
                                                )}
                                            </Formik>
                                        </div>

                                        {changeSuccess
                                            ? <>
                                                <div
                                                    role="alert"
                                                    className="fade alert alert-success show"
                                                >
                                                    <div className="alert-heading h4">
                                                        <b>Senha alterada!</b>
                                                    </div>
                                                    Sua senha foi alterada com sucesso e você já pode utiliza-la <br />

                                                    <Link to='/login' style={{ fontWeight: '700' }}>Clique aqui</Link> para voltar.
                                                </div>
                                            </>
                                            : <></>
                                        }
                                    </>
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