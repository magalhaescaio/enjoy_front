
import { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Fallback from './../../../components/fallback'
import Private from './../../../routes/private'

export default function (props) {

    return (
        <>
            <main>
                <div className="container">
                    <div className="h-100 row">
                        <div id="contentArea" className="h-100 col" style={{ opacity: 1 }}>
                            <Suspense fallback={<Fallback />}>
                                <Switch>
                                    {Private.map((route, idx) => {
                                        return route.component && (
                                            <Route
                                                key={idx}
                                                path={route.path}
                                                exact={route.exact}
                                                name={route.name}
                                                render={props => (
                                                    <route.component {...props} />
                                                )}
                                            />
                                        )
                                    })}
                                    {/* <Redirect from="/" to="/home" /> */}
                                </Switch>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}