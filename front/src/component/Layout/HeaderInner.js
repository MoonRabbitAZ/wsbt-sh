// import React from "react";
import React, { useEffect, useContext, useState } from 'react';
import { Link } from "react-router-dom";

import { Container, Nav, Navbar } from "react-bootstrap";
// import {Link} from 'react-scroll'

import 'aos/dist/aos.css';

import logoMain from "../../assets/images/wsb-logo.svg";
import { UserIcon, BellIcon } from '../Icon';
import { Web3Context } from "../../web3/contexts/web3Context";
import { poolMethods } from "../../web3/functions/factory"


const HeaderInner = () => {
    const { networkDetails } = useContext(Web3Context);
    const [ownerAddress, setOwnerAddress] = useState()

    useEffect(() => {
        (async () => {
            const instance = await poolMethods.getInstance(networkDetails.web3);
            console.log({instance})
            if (instance) {
                let address = await poolMethods.fetchOwner(instance, networkDetails.address)
                setOwnerAddress(address)
            }
        })();
    }, [networkDetails.web3]);

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
            <Container>

                <Navbar.Brand href="/"><img src={logoMain} className="img-fluid" alt="WSB.sh" data-aos="zoom-in" data-aos-delay="400" data-aos-easing="ease-out-quart" data-aos-duration="800" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {networkDetails.address &&
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mx-auto mt-4 mt-lg-0">
                            <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0" to="/bundledetails" >Dashboard</Link>
                            <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/bundleassets/current" >Current Pool</Link>
                            <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/bundleassets/completed" >Completed Pools</Link>
                            <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/halloffame" >Hall of Legends</Link>
                            <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/megapool" >Mega Pool</Link>
                        </Nav>
                        {/* <Link to="/" className="btn me-3 mt-1 mt-lg-0 btn-unstyled px-2 mb-3 mb-xl-0 text-uppercase text-white"><BellIcon /></Link>
                        <Link to="/" className="btn me-3 btn-unstyled px-2 mb-3 mb-xl-0 text-uppercase text-white"><UserIcon /></Link> */}
                    </Navbar.Collapse>}
            </Container>
        </Navbar>
    </>
}

export default HeaderInner;