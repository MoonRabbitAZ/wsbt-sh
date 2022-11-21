import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Web3Context } from '../../web3/contexts/web3Context';

import logoMain from '../../assets/images/wsb-logo.svg';

import 'aos/dist/aos.css';

const HeaderInner = () => {
  const { networkDetails } = useContext(Web3Context);

  useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => window.removeEventListener('scroll', isSticky);
  });

  const isSticky = () => {
    const header = document.querySelector('.header_section');
    window.scrollY >= 50 ? header.classList.add('sticky_nav') : header.classList.remove('sticky_nav');
  };

  return (
    <Navbar collapseOnSelect expand="xl" variant="dark" fixed="top" className="header_section">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logoMain}
            className="img-fluid"
            alt="WSB.sh"
            data-aos="zoom-in"
            data-aos-delay="400"
            data-aos-easing="ease-out-quart"
            data-aos-duration="800"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {networkDetails.address ? (
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav className="d-flex mt-4 mt-lg-0">
              <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0" to="/bundledetails">
                Dashboard
              </Link>
              <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/bundleassets/current">
                Current Pool
              </Link>
              <Link
                href=""
                className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0"
                to="/bundleassets/completed"
              >
                Completed Pools
              </Link>
              <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/halloffame">
                Hall of Legends
              </Link>
              {/* <Link href="" className="top-nav-link mx-0 mx-lg-3 mb-2 mb-xl-0 mt-1 mt-xl-0" to="/megapool">
                Mega Pool
              </Link> */}
            </Nav>
          </Navbar.Collapse>
        ) : (
          ''
        )}
      </Container>
    </Navbar>
  );
};

export default HeaderInner;
