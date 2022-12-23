import React, { useEffect } from "react"
import Fallback from "./components/fallback"
import { isMobile } from 'react-device-detect'

import { isAuthenticated } from './services/authentication'

import 'antd/dist/antd.css'
import './assets/styles/app.css'
import './assets/font/CS-Interface/style.css'
import './assets/styles/vendor/bootstrap.min.css'
import './assets/styles/vendor/OverlayScrollbars.min.css'
import './assets/styles/styles.css'

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"

const Login = React.lazy(() => import('./pages/public/Login'))
const Activate = React.lazy(() => import('./pages/public/Activate'))
const ForgotPassword = React.lazy(() => import('./pages/public/ForgotPassword'))
const RecoveryPassword = React.lazy(() => import('./pages/public/RecoveryPassword'))
const Register = React.lazy(() => import('./pages/public/Register'))

const Layout = React.lazy(() => import('./pages/private/Layout'))


const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}

		render={props => isAuthenticated() ? (
			<Component {...props} />
		) : (
			<Redirect to={{ pathname: "/login", state: { from: props.location } }} />
		)
		}
	/>
)

function App() {
	useEffect(() => {

		isMobile
			? document.querySelector("html").setAttribute('data-dimension', 'mobile')
			: document.querySelector("html").setAttribute('data-dimension', 'desktop')

	}, [])

	return (
		<>
			<div className={`loading-overlay hidden`} id="loadingOverlay">
				<div className="spinner-overlay-container">

					<div>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
							<div className="spinner-border spinner-border-md"></div>
							<div className="text-primary mt-3">Carregando...</div>
						</div>
					</div>

				</div>
			</div>

			<BrowserRouter>
				<React.Suspense fallback={<Fallback />}>
					<Switch>
						<Route exact path="/login" render={props => <Login {...props} />} />
						<Route exact path="/ativacao" render={props => <Activate {...props} />} />
						<Route exact path="/register" render={props => <Register {...props} />} />
						<Route exact path="/password-recovery" render={props => <RecoveryPassword {...props} />} />
						<Route exact path="/forgot-password" render={props => <ForgotPassword {...props} />} />


						<PrivateRoute path="/" component={props => <Layout {...props} />} />

						<Route path="*">
							Err
						</Route>

					</Switch>
				</React.Suspense>
			</BrowserRouter>
		</>
	)
}

export default App
