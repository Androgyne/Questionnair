import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Register from './screens/Register';
import Login from './screens/Login';
import FormList from './screens/FormList';
import DesignForm from './screens/DesignForm/DesignForm';
import FillForm from "./screens/FillForm/FillForm";
import FormResult from "./screens/DisplayAnswer/FormResult";
import AnalysisForm from "./screens/AnalysisForm";
import Home from "./screens/Home";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class App extends Component {
    render(){
        return (
            <Router>
                <Switch>
                    <Route path='/' exact={true} component={Home}/>
                    <Route path='/register' exact={true} component={Register}/>
                    <Route path='/login' exact={true} component={Login}/>
                    <Route path='/form/list' exact={true} component={FormList}/>
                    <Route path='/form/new' exact={true} component={DesignForm}/>
                    <Route path='/form/fill/:fid' exact={true} component={FillForm}/>
                    <Route path='/form/analysis/:fid' exact={true} component={AnalysisForm}/>
                    <Route path='/form/result/:aid' exact={true} component={FormResult}/>
                </Switch>
            </Router>
        )
    }
}

export default App;