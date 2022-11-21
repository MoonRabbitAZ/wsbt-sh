// import React from "react";
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AOS from 'aos';
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';

import { halloffame } from "../action/bundle.action"

import 'aos/dist/aos.css';
import { LeftArrowSmall } from '../component/Icon';
import HeaderInner from '../component/Layout/HeaderInner';

const hofAssetListData = [
    {
        key: 1,
        title: 'Username30',
        description: 'SOME DESCRIPTION',
    },
    {
        key: 2,
        title: 'Username30',
        description: 'SOME DESCRIPTION',
    },
    {
        key: 3,
        title: 'Username30',
        description: 'SOME DESCRIPTION',
    },
    {
        key: 4,
        title: 'Username30',
        description: 'SOME DESCRIPTION',
    },
    {
        key: 5,
        title: 'Username30',
        description: 'SOME DESCRIPTION',
    },
    {
        key: 6,
        title: 'Username30',
        description: 'SOME DESCRIPTION',
    },

]

const HallOfFame = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { halloffameData } = useSelector(state => state.bundleReducer)

    useEffect(() => {
        AOS.init();
    }, []);
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        dispatch(halloffame())
    }, [])


    return <>
        <HeaderInner />
        <div className="hall_of_fame">
            <div className="top_block">
                <Container>
                    <Row className="align-items-stretch text-center text-md-start">
                        <Col>
                            <h2 className="section_title mb-0">Hall of Legends</h2>
                            {/* <p className="para_text font_secondary">Some description</p> */}
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container className="mt-5 pt-4">
                <Row className="align-items-stretch">
                    {halloffameData && halloffameData.length > 0 ? halloffameData.map((item, index) => {
                        return (
                            <Col xs={12} md={6} lg={6} className="mb-4" key={item.bundleId}>
                                <div className="hof_block d-flex align-items-center p-4 flex-wrap">
                                <h2 className='mb-0 me-2'>Pool</h2>
                                    <div className="number w-auto text-center ps-0 ps-xl-4 ps-2 pe-xl-4">
                                        {item.bundleId}
                                    </div>                                   
                                    <div className="right_col">
                                        <h3 className="block_title mb-0">{item.user_name}</h3>
                                        {/*     <p className="para_text font_secondary mb-0">{item.description} </p> */}
                                    </div>
                                </div>
                            </Col>
                        );
                    }) : <h2>No entries available</h2>}
                </Row>
            </Container>
        </div>
    </>
}

export default HallOfFame;