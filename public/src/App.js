import React from 'react';
import './css/main.css';
import Navbar from './Navbar.jsx';
import ScrollUpButton from "./ScrollUpButton"
import TopNavBar from './TopNavBar';
import Virals from './Virals.jsx';
import TopUSA from './top.jsx';
import Mentions from './mentions.jsx';
import logo from './images/logo.png';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
function App() {
  return (
    <>
    
    <div className="container">
    <div className="row">
    <img className="mx-auto" style = {{width:"200px",height:"200px",marginTop : "15px", marginBottom: "15px"}} src={logo}/>
    </div>
    {/*<Navbar></Navbar>*/}
    <Router>
    <TopNavBar></TopNavBar>

      <div className="row contentRow">
      
        {/* <i class="fas fa-photo-video"></i> medias icon */}
        
        <Switch>
        <Route exact path="/" component={Virals} />
        <Route path="/TopUSA" component={TopUSA} />
        <Route path="/mentions" component={Mentions} />
        </Switch>
        
        
      </div>
      </Router>
    </div>
    <ScrollUpButton scrollStepInPx="50" delayInMs="9.66"/>
    </>
  );
}

export default App;
