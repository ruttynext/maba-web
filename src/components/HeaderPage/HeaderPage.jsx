import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import logo from './../../assets/images/LogoMaba.jpg'
import './HeaderPage.css'

function HeaderPage({activeUser, onLogout}) {
    return (
 
        <div className="c-header-page">
         <Navbar expand="md" className="navbar shadow">
            <Navbar.Toggle className="ml-auto toggle" aria-controls="basic-navbar-nav" />
            <Navbar.Brand href="#/">
                <img src={logo} className="logo-img" alt=""></img>
            </Navbar.Brand>        
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav>
                    {
                        activeUser?
                            <Nav.Link className="nav-links" href="/login" onClick={() => onLogout()}>יציאה</Nav.Link>
                             :
                            <>
                            {/* <Nav.Link className="nav-links" href="/signup">הרשמה</Nav.Link> */}
                            <Nav.Link className="nav-links" href="/login">כניסה</Nav.Link>    
                            </>
                    }
                </Nav>
            </Navbar.Collapse>
            </Navbar>      
        </div>
    );
}

export default HeaderPage;