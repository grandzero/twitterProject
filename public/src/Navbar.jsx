import React, { Component } from 'react';

class Navbar extends Component {
    state = {  }
    render() { 
        return ( 
        <nav className="mb-1 navbar navbar-expand-lg navbar-dark info-color  sticky-top">
        <a className="navbar-brand" href="#">Onickle</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-4"
          aria-controls="navbarSupportedContent-4" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarSupportedContent-4">
          <ul className="navbar-nav navbar-center ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
              <i class="fas fa-list-ol"></i> Top 20
                <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fab fa-twitter"></i> Virals</a>
            </li>
            {/*
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink-4" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-user"></i> Profile </a>
              <div className="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-4">
                <a className="dropdown-item" href="#">My account</a>
                <a className="dropdown-item" href="#">Log out</a>
              </div>
            </li> */}
          </ul>
        </div>
      </nav> );
    }
}
 
export default Navbar;