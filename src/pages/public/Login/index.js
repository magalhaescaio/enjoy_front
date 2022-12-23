import axios from "axios";
import { useState } from "react";
import { FiAtSign, FiKey } from "react-icons/fi"
import { Link, Redirect } from "react-router-dom"
import { Formik } from 'formik'


import { endPoint, site } from '../../../constants/default';


export default function (props) {
    const [error, setError] = useState(false)
    const [errorResponse, setErrorResponse] = useState()
    const [redirect, setRedirect] = useState(false)
    const [redirectRoute, setRedirectRoute] = useState()

    const fetchLogin = async (values) => {

        try {
            const response = await axios.post(endPoint + '/api/v1/auth/login', values)

            if (response.status === 200) {
                localStorage.setItem('OnlyOne-token', response.data.access_token)
                localStorage.setItem('OnlyOne-userData', JSON.stringify(response.data.user))

                setRedirect(true)
                setRedirectRoute('/')
            }
        } catch (error) {
            setError(true)
            setErrorResponse(error.response.data)
        }
    }

    return (
        <>
            {redirect ? <Redirect to={redirectRoute} /> : <></>}

            <div className="fixed-background"></div>

            <div className="container-fluid p-0 h-100 position-relative">
                <div className="row g-0 h-100">

                    {/* <!-- Left Side Start --> */}
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
                    {/* <!-- Left Side End --> */}

                    {/* <!-- Right Side Start --> */}
                    <div className="col-12 col-lg-auto h-100 pb-4 px-4 pt-0 p-lg-0">
                        <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
                            <div className="sw-lg-50 px-5">
                                <div className="sh-11">
                                    <a href="index.html">
                                        <div className="logo-default"></div>
                                    </a>
                                </div>
                                <div className="mb-5">
                                    <h2 className="cta-1 mb-0 text-primary">Login</h2>
                                </div>
                                <div className="mb-5">
                                    <p className="h6">Utilize suas credenciais para acessar.</p>
                                    {/* <p className="h6">
                                        Ainda não tem acesso?
                                        <Link to="/register" style={{ marginLeft: '2px' }}>clique aqui</Link>
                                        .
                                    </p> */}
                                </div>
                                <div>
                                    <Formik
                                        initialValues={{
                                            email: '',
                                            password: ''
                                        }}
                                        validate={values => {
                                            const errors = {}
                                            if (!values.email) {
                                                errors.email = 'Este campo é obrigatório'
                                            } else if (
                                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                            ) {
                                                errors.email = 'Endereço de e-mail inválido'
                                            }

                                            if (!values.password) {
                                                errors.password = 'Este campo é obrigatório'
                                            }
                                            return errors;
                                        }}

                                        onSubmit={async (values, { setSubmitting }) => {
                                            setError(false)
                                            await fetchLogin(values)
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
                                        }) => (
                                            <form
                                                id="loginForm"
                                                className="tooltip-end-bottom"
                                                noValidate
                                                onSubmit={handleSubmit}
                                            >
                                                <div className="mb-3 filled form-group tooltip-end-top">
                                                    <FiAtSign />
                                                    <input
                                                        className="form-control"
                                                        placeholder="Email"
                                                        name="email"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                        disabled={isSubmitting}
                                                    />

                                                    <div className="invalid-feedback">{errors.email && touched.email && errors.email}</div>
                                                </div>
                                                <div className="mb-3 filled form-group tooltip-end-top">
                                                    <FiKey />
                                                    <input
                                                        className="form-control required pe-7"
                                                        name="password"
                                                        type="password"
                                                        placeholder="Password"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.password}
                                                        required
                                                        disabled={isSubmitting}
                                                    />

                                                    <div className="invalid-feedback">{errors.password && touched.password && errors.password}</div>
                                                    <Link to='forgot-password' className="text-small position-absolute t-3 e-3">
                                                        Esqueceu a senha?
                                                    </Link>
                                                </div>

                                                <button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    className="btn btn-lg btn-primary mb-1"
                                                >
                                                    {isSubmitting
                                                        ? <>
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                            Carregando
                                                        </>
                                                        : <>Login</>
                                                    }
                                                </button>

                                                {error
                                                    ? <>
                                                        {errorResponse && errorResponse.title
                                                            ? <>
                                                                <div role="alert" className="fade alert alert-danger show mt-2">
                                                                    <b>{errorResponse.title}</b> <br />
                                                                    {errorResponse.message}
                                                                </div>
                                                            </>
                                                            : <>
                                                                {Object.keys(errorResponse.error).length > 0
                                                                    ? <>
                                                                        <div role="alert" className="fade alert alert-danger show mt-2">
                                                                            <b>Verifique os erros abaixo</b>
                                                                            {Object.keys(errorResponse.error).map((row, index) => {
                                                                                return (
                                                                                    <div key={index}>
                                                                                        <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{row}:</span>
                                                                                        &nbsp;
                                                                                        {errorResponse.error[row].map((r, i) => {
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
                            </div>
                        </div>
                    </div>
                    {/* <!-- Right Side End --> */}

                </div>
            </div>
        </>
    )
}