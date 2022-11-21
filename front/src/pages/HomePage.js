
import React, { useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import AOS from 'aos';
import Web3 from "web3";
import { Button, Col, Container, Row } from "react-bootstrap";
// import Header from "../component/Layout/Header";

import Slider from "react-slick";
import 'aos/dist/aos.css';

import Header from '../component/Layout/Header'

import bannerImg from "../assets/images/banner-img.png";
import iconBox from "../assets/images/box.svg";
import iconTruck from "../assets/images/truck.svg";
import bg1 from "../assets/images/bg-1.png";
import secondSecImg from "../assets/images/second_sec_img.jpg";
import vdoSecBg from "../assets/images/vdo-sec-bg.jpg";
import { Brifcase } from "../component/Icon";
import wbstTypesBg from "../assets/images/bg-2.png";
import { Web3Context } from "../web3/contexts/web3Context";
import { ellipseAddress } from "../web3/helpers/utils";



const wsbtTypeSettings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                settings: "unslick"
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                settings: "unslick"
            }
        },
    ]
};

const wsbtTypeData = [
    {
        key: 1,
        icon: <Brifcase />,
        title: 'Low-Risk Bundles',
        content: 'At eripuit signiferumque sea, vel ad mucius molestie, cu labitur iuvaret vulputate sed.',
    },
    {
        key: 2,
        icon: <Brifcase />,
        title: 'High-Risk Bundles',
        content: 'At eripuit signiferumque sea, vel ad mucius molestie, cu labitur iuvaret vulputate sed.',
    },
    {
        key: 3,
        icon: <Brifcase />,
        title: 'Liquidity Pool',
        content: 'At eripuit signiferumque sea, vel ad mucius molestie, cu labitur iuvaret vulputate sed.',
    },

]

const rmSliderSettings = {
    dots: true,
    infinite: false,
    arrows:false,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 2,
                // settings: "unslick"
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                // settings: "unslick"
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
};

const rmSliderData = [
    {
        key: 1,
        text1: '2019 Q3',
        text2: 'First Line of code',
        content: 'Launch official website smart contract MVP',
    },
    {
        key: 2,
        text1: '2019 Q3',
        text2: 'First Line of code',
        content: 'Launch official website smart contract MVP',
    },
    {
        key: 3,
        text1: '2019 Q3',
        text2: 'First Line of code',
        content: 'Launch official website smart contract MVP',
    },
    {
        key: 4,
        text1: '2019 Q3',
        text2: 'First Line of code',
        content: 'Launch official website smart contract MVP',
    },
]


const HomePage = () => {

    const { networkDetails, handleConnect, resetApp } = useContext(Web3Context);
    
    /* const connectWallet = async () => {
        handleConnect();
    } */

    useEffect(() => {
        AOS.init();
    }, []);
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (<>
        <Header />
        <section className="home_banner">
            <div className="bg_1">
                <img src={bg1} className="img-fluid" alt="img" />
            </div>
            <Container>
                <Row className="justify-content-center align-items-center flex-row-reverse">
                    <Col xs={12} md={7} lg={6} className="pe-2 pe-md-0 pe-lg-5 order-1">
                        <div className="banner_left" data-aos='fade-up' data-aos-delay='350' data-aos-duration="1000">
                            <h1 className="section_title mb-4" data-aos='fade-up'>We help you find the best solution </h1>
                            <p className="mb-4 para_text" data-aos='fade-up' data-aos-delay='150'>Et has minim elitr intellegat. Mea aeterno eleifend antiopam ad, nam no suscipit quaerendum. At nam minimum ponderum. Est audiam animal molestiae te. Ex duo eripuit mentitum.</p>
                          {/*   {!networkDetails.connected ? 
                            <div className="pt-3 d-lg-flex" data-aos='fade-up' data-aos-delay='250'>
                                <Button className="btn-flat text-uppercase" onClick={connectWallet}>Connect wallet</Button>
                            </div> : `Connected to wallet address - ${ellipseAddress(networkDetails.address)}`} */}
                        </div>
                    </Col>
                    <Col xs={12} md={5} lg={6} className="d-none d-md-block">
                        <div className="home_banner_img pt-4" data-aos='zoom-in' data-aos-delay='350' data-aos-easing="ease-in-quad" data-aos-duration="1000">
                            <img src={bannerImg} className="img-fluid" alt="WSB.sh - We help you find the best solution" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>

        <section className="second_section">
            <Container>
                <Row className="justify-content-between align-items-center flex-row-reverse">
                    <Col xs={12} md={7} lg={6} className="order-1">
                        <div className="left_block me-0 me-x-4">
                            <h2 className="block_title mb-4 me-0 me-xl-5 pe-0 pe-xl-5" data-aos='fade-down' data-aos-offset="400" data-aos-once="true">All About WSBT, noster postulant philosophia ea usu, qui dicta sadipscing te.</h2>
                            <Row>

                                <Col xs={12} md={6} data-aos='fade-left' data-aos-delay='250' data-aos-easing="ease-in-sine" data-aos-duration="600" data-aos-once="true">
                                    <div className="icon mb-3">
                                        <img src={iconBox} className="img-fluid" alt="img" />
                                    </div>
                                    <p className="mb-4 para_text">Et has minim elitr intellegat. Mea aeterno eleifend antiopam ad, nam no suscipit quaerendum.</p>
                                </Col>

                                <Col xs={12} md={6} data-aos='fade-left' data-aos-delay='400' data-aos-easing="ease-in-sine" data-aos-duration="600" data-aos-once="true">
                                    <div className="icon mb-3">
                                        <img src={iconTruck} className="img-fluid" alt="img" />
                                    </div>
                                    <p className="mb-4 para_text">At nam minimum ponderum. Est audiam animal molestiae te. Ex duo eripuit mentitum.</p>
                                </Col>

                            </Row>
                        </div>
                    </Col>

                    <Col xs={12} md={5} lg={5} className="mb-4 mb-md-0">
                        <div className="mb-2 mb-md-0" data-aos='flip-left' data-aos-delay='200' data-aos-easing="ease-in-sine" data-aos-duration="900" data-aos-once="true">
                            <img src={secondSecImg} className="img-fluid" alt="img" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>

        <section className="video_intro">
            <Container fluid>
                <Row className="align-items-stretch">

                    <Col xs={12} md={5} lg={6} className="mb-3 mb-lg-0 ps-0 pe-0 pe-lg-3">
                        <div className="vdo_image_block" data-aos='zoom-out' data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="900" data-aos-once="true">
                            <div className="play_icon d-flex justify-content-center align-items-center" data-aos='fade-down' data-aos-delay='700' data-aos-easing="ease-in-sine" data-aos-duration="900" data-aos-once="true">
                                <svg width="51" height="59" viewBox="0 0 51 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M51 29.5L0.749997 58.5118L0.75 0.488147L51 29.5Z" fill="white" />
                                </svg>
                            </div>
                            <img src={vdoSecBg} className="team_member_img" alt="img" />
                        </div>
                    </Col>

                    <Col xs={12} md={7} lg={6}>
                        <div className="vdo_sec_text_block me-auto px-4 d-flex flex-column h-100 justify-content-center align-items-center pt-4 pt-lg-0">
                            <h2 className="block_title mb-4 mb-md-3" data-aos='fade-up' data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="500" data-aos-once="true">All About WSBT, noster postulant philosophia ea usu, qui dicta sadipscing te.</h2>
                            <p className="para_text mb-5 mb-lg-4" data-aos='fade-up' data-aos-delay='500' data-aos-easing="ease-in-sine" data-aos-duration="700" data-aos-once="true">Et has minim elitr intellegat. Mea aeterno eleifend antiopam ad, nam no suscipit quaerendum. At nam minimum ponderum. Est audiam animal molestiae te. Ex duo eripuit mentitum.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>


        <section className="wbst_types" style={{ background: `url(${wbstTypesBg}) no-repeat center center`, }}>
            <Container>
                <Row className="align-items-stretch text-center text-md-start">
                    <Col>
                        <h2 className="section_title mb-3" data-aos='fade-left' data-aos-easing="ease-in-sine" data-aos-duration="700" data-aos-once="true">WSBT types</h2>
                        <p className="mb-4 section_subtext mb-4" data-aos='fade-left' data-aos-easing="ease-in-sine" data-aos-duration="400" data-aos-once="true">We help the world’s leading organizations follow their shipping</p>
                    </Col>
                </Row>

                <Row className="mb-5 mt-5">
                    <Col>
                        <Slider {...wsbtTypeSettings}>
                            {wsbtTypeData.map(item => {
                                return (
                                    <div key={item.key} data-aos='flip-right' data-aos-offset="400" data-aos-easing="ease-in-sine" data-aos-duration="700" data-aos-once="true">
                                        <div className="wbst_types_box text-center mx-auto mx-xl-3 pt-3 pt-lg-0 px-3 pb-1">
                                            <div className="wbst_types_box_icon mb-3 mt-1">
                                                {item.icon}
                                            </div>
                                            <h3 className="block_title_dm">{item.title}</h3>
                                            <div className="para_text">
                                                {item.content}
                                            </div>
                                            <div className="wbst_types_box mt-3">
                                                <Button className="btn-bordered text-uppercase">discover</Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </Col>
                </Row>
            </Container>
        </section>


        <section className="proj_roadmap">
            <Container>
                <Row className="align-items-stretch text-center text-md-start">
                    <Col sm={12}>
                        <h2 className="section_title mb-3" data-aos='fade-left' data-aos-offset="200" data-aos-delay='250' data-aos-easing="ease-in-sine" data-aos-duration="600" data-aos-once="true">Project Roadmap</h2>
                        <p className="mb-4 section_subtext mb-5" data-aos='fade-left' data-aos-offset="100" data-aos-delay='450' data-aos-easing="ease-in-sine" data-aos-duration="600" data-aos-once="true">We help the world’s leading organizations follow their shipping</p>
                    </Col>
                </Row>
            </Container>
            <Container className="mt-5">
                <Row>
                    <Col sm={12}>
                        <Slider {...rmSliderSettings}>
                            {rmSliderData.map(item => {
                                return (

                                    <div key={item.key} className="proj_roadmap_box mx-auto p-4 mx-2">
                                        <h3 className="title_sm mb-2">{item.text1}</h3>
                                        <h4 className="title_sm mb-2">{item.text2}</h4>
                                        <div className="para_text">
                                            {item.content}
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </Col>
                </Row>
            </Container>
        </section>
    </>
    )
}

export default HomePage;