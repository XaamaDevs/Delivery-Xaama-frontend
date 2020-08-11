//	Importing React main module and its features
import React, { useState } from "react";


//	Importing React Router features
import { NavLink, useHistory} from "react-router-dom";

// Importing styles
import "./styles.css";


//	Exporting resource to routes.js
export default function Navbar() {
	return (
		<div className="website-container">
      <nav className="navbar navbar-expand-lg navbar-light bg-transparent pt-5 px-3">
        <NavLink to="/" className="navbar-brand text-warning">Xaama</NavLink>
        <button className="navbar-toggler bg-warning" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <NavLink style={{color: "#ffbf00"}} exact activeClassName="activeRoute" activeStyle={{ color: 'white' }} to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink style={{color: "#ffbf00"}} activeClassName="activeRoute" activeStyle={{ color: 'white' }} to="/menu" className="nav-link">Menu</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink style={{color: "#ffbf00"}} activeClassName="activeRoute" activeStyle={{ color: 'white' }} to="/login" className="nav-link">Login</NavLink>
            </li>
            <li className="nav-item">
              <NavLink style={{color: "#ffbf00"}} activeClassName="activeRoute" activeStyle={{ color: 'white' }} to="/signup" className="nav-link">Signup</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
	);
}