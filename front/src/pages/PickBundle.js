import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from "react-router-dom";
import AOS from 'aos';

import { Col, Container, Row } from "react-bootstrap";
import { LeftArrowSmall } from "../component/Icon";

import HeaderInner from '../component/Layout/HeaderInner';

import 'aos/dist/aos.css';

const PickBundle = () => {

    const navigate = useNavigate();

    useEffect(() => {
        AOS.init();
    }, []);
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return <>
        <HeaderInner />
        <div className="pick_Bundle">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={12} lg={5} className="mt-4 mt-lg-0">
                        {/* <p className="para_text font_secondary text-white mb-1 d-flex align-items-center">
                            <LeftArrowSmall className="me-2" />
                            Welcome</p> */}
                        <h2 className="section_title">Pick a Bundle</h2>
                        {/* <p className="para_text font_secondary">A short line of description goes here</p> */}
                    </Col>
                    <Col xs={12} md={12} lg={12} className="mt-4 mt-lg-0">
                        <Row className="w-100 justify-content-end">
                            {/*  <Col md={12} lg={6} className="mb-4">
                                <div className="bundle_box p-4">
                                    <h2 className="box-title pt-3">Low-risk WSBT</h2>
                                    <p className="para_text font_secondary mb-3 pb-1">Description for low risk WSBT goes here in this space</p>
                                </div>
                            </Col>
                            <Col md={12} lg={6} className="mb-4">
                                <div className="bundle_box p-4">
                                    <h2 className="box-title pt-3">Low-risk WSBT</h2>
                                    <p className="para_text font_secondary mb-3 pb-1">Description for low risk WSBT goes here in this space</p>
                                </div>
                            </Col> */}
                            <Col md={12} lg={6} className="mb-4">
                                <div className="bundle_box p-4" onClick={() => navigate("/bundledetails")}>
                                    <h2 className="box-title pt-3">Low-Risk Bundles</h2>
                                    {/* <p className="para_text font_secondary mb-3 pb-1">Description for low risk WSBT goes here in this space</p> */}
                                </div>
                            </Col>
                            {/* <Col md={12} lg={6} className="mb-4">
                                <div className="bundle_box p-4">
                                    <h2 className="box-title pt-3">High-risk WSBT</h2>
                                    <p className="para_text font_secondary mb-3 pb-1">Description for high risk WSBT goes here in this space</p>
                                </div>
                            </Col> */}
                            {/*   <Col md={12} lg={6} className="mb-4">
                                <div className="bundle_box p-4">
                                    <h2 className="box-title pt-3">Low-risk WSBT</h2>
                                    <p className="para_text font_secondary mb-3 pb-1">Description for low risk WSBT goes here in this space</p>
                                </div>
                            </Col>
                            <Col md={12} lg={6} className="mb-4">
                                <div className="bundle_box p-4">
                                    <h2 className="box-title pt-3">Low-risk WSBT</h2>
                                    <p className="para_text font_secondary mb-3 pb-1">Description for low risk WSBT goes here in this space</p>
                                </div>
                            </Col> */}
                        </Row>
                    </Col>
                </Row>
            </Container>


        </div>
    </>
}

export default PickBundle;