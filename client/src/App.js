import React, { Component } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authActions';
import {clearCurrentProfile} from './actions/profileAction';

/** redux */
import {Provider} from 'react-redux';
import store from './store';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';


//check for token
if(localStorage.jwtToken !== 'undefined'){
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);

  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);

  // set user and isauthenticated
  store.dispatch(setCurrentUser(decoded));
  
  // logout
  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    // Logout user
    store.dispatch(logoutUser());

    // todo: clear current profile

    store.dispatch(clearCurrentProfile());

    // redirect to login
    window.location.href = '/Login';
  }
  
}


export default class App extends Component {
  render() {
    return (

      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
} 