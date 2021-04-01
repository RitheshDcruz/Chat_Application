import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Chat from './components/Chat/Chat.js';
import Join from './components/Join/Join';



function App() {
    return (
        <Router>
            <Route exact path="/" component={Join}></Route>
            <Route exact path="/chat" component={Chat}></Route>
            
        </Router>
    )
}

export default App
