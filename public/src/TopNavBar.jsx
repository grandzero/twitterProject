import React, { Component,Fragment } from 'react';
import './css/topNavBar.css';
import Virals from './Virals.jsx';
import TopUSA from './top.jsx';
import Mentions from './mentions.jsx';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class TopNavBar extends Component {
    

    render() { 
        return ( 
        
        <div className="topNavBar sticky-top col-xs-12 col-sm-12 col-md-9 col-lg-6 col-xl-5 mx-auto tweet-area">
        <ul className="nav justify-content-center">
            <li className="nav-item" >
            <Link className="nav-link" to="/"><i className="fab fa-twitter"></i> Virals</Link>
            </li>
            <li className="nav-item" >
                <Link className="nav-link" to="/TopUSA"><i className="fas fa-list-ol"></i> Top 20 USA</Link>
            </li>
            <li className="nav-item" >
                <Link className="nav-link" to="/mentions"><i className="fas fa-at"></i> Mentions</Link>
            </li>
        </ul>

        </div> 
        
         );
    }
}
 
export default TopNavBar;