import { Link, Redirect } from 'react-router-dom'
import { Formik, Field } from 'formik'
import { useEffect, useState } from 'react'
import { FiUser, FiAtSign, FiTag, FiKey, FiChevronsLeft, FiChevronsRight, FiPhone, FiX } from 'react-icons/fi'
import * as Yup from 'yup'
import MaskedInput from 'react-text-mask'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

import { phone as phoneMask, taxid as taxidMask } from '../../../functions/mask'
import { endPoint, regulation, site } from '../../../constants/default'



export default function (props) {
    const [error, setError] = useState(false)
    const [errorResponse, setErrorResponse] = useState()
    const [redirect, setRedirect] = useState(false)
    const [redirectRoute, setRedirectRoute] = useState('/')
    const [success, setSuccess] = useState(false)
    const [modalRegulation, setModalRegulation] = useState(false)

    const fetchRegister = async (values) => {
        try {
            const response = await axios.post(endPoint + '/api/v1/auth/register', values)


            if (response.status === 200) {
                setSuccess(true)
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
                                <div className={`mb-5 ${success ? 'd-none' : ''}`}>
                                    <h2 className="cta-1 mb-0 text-primary">Cadastro</h2>
                                </div>
                                <div className={`mb-5 ${success ? 'd-none' : ''}`}>
                                    <p className="h6">Preencha o formulário abaixo para se registrar.</p>
                                </div>
                                <div className={`${success ? 'd-none' : ''}`}>
                                    <Formik
                                        initialValues={{
                                            name: '',
                                            email: '',
                                            password: '',
                                            password_confirmation: '',
                                            taxid: '',
                                            phone: '',
                                            regulation: false
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

                                            if (!values.name) {
                                                errors.name = 'Este campo é obrigatório'
                                            }

                                            if (!values.phone) {
                                                errors.phone = 'Este campo é obrigatório'
                                            }

                                            if (!values.taxid) {
                                                errors.taxid = 'Este campo é obrigatório'
                                            }

                                            if (!values.regulation) {
                                                errors.regulation = 'Para concluir o cadastro é necessário aceitar os termos'
                                            }

                                            return errors;
                                        }}

                                        onSubmit={async (values, { setSubmitting }) => {
                                            setError(false)
                                            await fetchRegister(values)
                                        }}

                                        validationSchema={Yup.object().shape({
                                            phone: Yup.string().required("Required")
                                        })}

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
                                                id="registerForm"
                                                className="tooltip-end-bottom"
                                                noValidate
                                                onSubmit={handleSubmit}
                                            >
                                                <div className="mb-3 filled form-group tooltip-end-top">
                                                    <FiUser />
                                                    <input
                                                        className="form-control"
                                                        placeholder="Digite seu nome completo"
                                                        name="name"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.name}
                                                        disabled={isSubmitting}
                                                    />
                                                    <div className="invalid-feedback">{errors.name && touched.name && errors.name}</div>
                                                </div>

                                                <div className="mb-3 filled form-group tooltip-end-top">
                                                    <FiAtSign />
                                                    <input
                                                        className="form-control"
                                                        placeholder="Informe um endereço de e-mail válido"
                                                        name="email"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                        disabled={isSubmitting}
                                                    />
                                                    <div className="invalid-feedback">{errors.email && touched.email && errors.email}</div>
                                                </div>

                                                <div className="mb-3 filled form-group tooltip-end-top">
                                                    <FiTag />
                                                    <Field
                                                        name="taxid"
                                                        render={({ field }) => (
                                                            <MaskedInput
                                                                {...field}
                                                                mask={taxidMask}
                                                                id="taxid"
                                                                placeholder="Digite seu cpf"
                                                                type="text"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                className="form-control"
                                                                disabled={isSubmitting}
                                                            />
                                                        )}
                                                    />
                                                    <div className="invalid-feedback">{errors.taxid && touched.taxid && errors.taxid}</div>
                                                </div>

                                                <div className="mb-3 filled form-group tooltip-end-top">
                                                    <FiPhone />
                                                    <Field
                                                        name="phone"
                                                        render={({ field }) => (
                                                            <MaskedInput
                                                                {...field}
                                                                mask={phoneMask}
                                                                id="phone"
                                                                placeholder="Enter your phone number"
                                                                type="text"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                className="form-control"
                                                                disabled={isSubmitting}
                                                            />
                                                        )}
                                                    />
                                                    <div className="invalid-feedback">{errors.phone && touched.phone && errors.phone}</div>
                                                </div>

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

                                                <div className="form-check">
                                                    <Field
                                                        name="regulation"
                                                        className="form-check-input"
                                                        type="checkbox"
                                                    />

                                                    <label className="form-check-label" style={{ fontSize: '9pt' }}>
                                                        Li e aceito os <b className='text-primary' style={{ cursor: 'pointer' }} onClick={() => setModalRegulation(true)}>Termos de políticas de privacidade</b>
                                                    </label>
                                                    <div className="invalid-feedback">{errors.regulation && touched.regulation && errors.regulation}</div>
                                                </div>


                                                <div className='mt-3' style={{ display: 'flex' }}>
                                                    <div style={{ width: '50%' }}>
                                                        <div
                                                            className="btn btn-foreground-alternate mb-1"
                                                            onClick={() => [setRedirect(true), setRedirectRoute('/login')]}
                                                        >
                                                            <FiChevronsLeft style={{ marginTop: '-2px' }} /> &nbsp;
                                                            Voltar
                                                        </div>
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
                                                                : <>Cadastrar <FiChevronsRight style={{ marginTop: '-2px' }} /> </>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>

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

                                <div className={`${success ? '' : 'd-none'}`}>
                                    <div
                                        role="alert"
                                        className="fade alert alert-success show"
                                    >
                                        <div className="alert-heading h4">
                                            <b>Cadastro realizado!</b>
                                        </div>
                                        Verifique sua caixa de entrada para ativar a sua conta. <br />

                                        <Link to='/login' style={{ fontWeight: '700' }}>Clique aqui</Link> para voltar.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Right Side Start --> */}

                </div>
            </div>

            {/* MODAL REGULATION */}
            <Modal show={modalRegulation} onHide={() => setModalRegulation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div style={{ fontFamily: 'Lato' }}>Políticas de uso e privacidade</div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="os-host os-host-foreign os-theme-dark os-host-resize-disabled os-host-scrollbar-horizontal-hidden scroll-track-visible os-host-transition os-host-overflow os-host-overflow-y">
                        <div className="os-content-glue"
                            style={{ margin: '0px -15px', height: '50vh', width: '493px' }}>
                        </div>
                        <div className="os-padding">
                            <div className="os-viewport os-viewport-native-scrollbars-overlaid"
                                style={{ overflowY: 'scroll' }}>
                                <div className="os-content"
                                    style={{ padding: '0px 15px', height: 'auto', width: '100%' }}>
                                    <p >{regulation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div className='mb-1 btn btn-background-alternate' onClick={() => setModalRegulation(false)}>
                        Fechar &nbsp;
                        <FiX style={{ marginTop: '-2px' }} />
                    </div>
                </Modal.Footer>
            </Modal>
            {/* MODAL REGULATION */}
        </>
    )
}