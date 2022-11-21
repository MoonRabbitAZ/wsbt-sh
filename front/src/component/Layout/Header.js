// import React from "react";
import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

import { Container, Nav, Navbar } from "react-bootstrap";
// import {Link} from 'react-scroll'

import 'aos/dist/aos.css';

import logoMain  from "../../assets/images/wsb-logo.svg";


const Header = () => {

    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
          window.removeEventListener('scroll', isSticky);
        };
      });
      const isSticky = (e) => {
        const header = document.querySelector('.header_section');
        const scrollTop = window.scrollY;
        scrollTop >= 50 ? header.classList.add('sticky_nav') : header.classList.remove('sticky_nav');
      };

      
    return <>
        <Navbar collapseOnSelect expand="xl" variant="dark" fixed="top" className="header_section">
            <Container className="align-items-center">
                <Navbar.Brand href="/"><img src={logoMain} className="img-fluid" alt="WSB.sh" data-aos="zoom-in" data-aos-delay="400" data-aos-easing="ease-out-quart" data-aos-duration="800" /></Navbar.Brand>
                {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
                <div><Link to="/pickbundle" className="btn btn-bordered me-2 me-lg-4 text-uppercase">Enter app</Link>
                    <Link to="" className="btn me-0 me-lg-3 btn-unstyled px-2 text-uppercase text-white">EN</Link></div>
            </Container>
        </Navbar>
    </>
}

export default Header;