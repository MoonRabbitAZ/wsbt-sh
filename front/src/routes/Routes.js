import React, {useContext} from 'react'
import {Route, Switch} from 'react-router-dom'
import Main from '../layout/main'
import Login from '../pages/Login'

import ProtectedRoute from './ProtectedRoute'
import PageNotFound from '../pages/PageNotFound'
import {GlobalContext} from '../context/globalContext'
import HeatMaps from '../pages/Maps/HeatMaps'
import MarkerMaps from '../pages/Maps/MarkerMaps'


const Routes = () => {
  const {isLoggedIn} = useContext(GlobalContext)

  return (
    <Main>
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          render={props => (isLoggedIn ? <HeatMaps {...props} /> : <Login {...props} />)}
        />
        <ProtectedRoute exact path="/heat-map" render={props => <HeatMaps {...props} />} />
        <ProtectedRoute exact path="/cluster-map" render={props => <MarkerMaps {...props} />} />

        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </Main>
  )
}

export default Routes
