// import React from "react";
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import AOS from 'aos';
import { useSelector, useDispatch } from 'react-redux';

import 'aos/dist/aos.css';

import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import { toast } from "react-toastify"
import HeaderInner from '../component/Layout/HeaderInner'


import {
    Bitcoin,
    GraphSmall,
    GraphSmallDown,
    LeftArrowSmall,
    EthIcon,
    BNBIcon,
    SolIcon,
    AvaIcon,
    EnzIcon,
    NumIcon,
    UmaIcon,
    CarIcon,
    BatIcon,
    SysIcon,
    WsbIcon,
    DogeIcon,
    AbuIcon,
    WalletIcon,
    StakedIcon,
    ClaimIcon,
    ApprovedIcon
} from "../component/Icon";

import lbdAvtar1 from "../assets/images/lbd-avtar-img-1.png";
import MRLogo from "../assets/images/mrlogo.png";

import { Web3Context } from "../web3/contexts/web3Context";
import { bundleList, addNFTUser, placeBet, leaderboard } from "../action/bundle.action"
import { Timer } from "../component/Timer"
import { enviornment } from "../constants/constants";
import { poolMethods } from "../web3/functions/factory"
import Web3 from 'web3';
import * as Loader from "react-loader-spinner";
import LottieLoader from "../Utils/lottieLoader"


const BundleDetails = () => {
    const [getInstance, setInstance] = useState();
    const [getContractInstance, setContractInstance] = useState();
    const [balance, setBalance] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const [approvedTokens, setApprovedTokens] = useState(0);
    const [stakedTokens, setStakedTokens] = useState(0);
    const [poolId, setPoolId] = useState(0);
    const [isLoading, setLoader] = useState(false);
    const [claimAmount, setClaimAmount] = useState(0);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { bundleData, leaderboardData } = useSelector(state => state.bundleReducer)
    const { showLoader } = useSelector(state => state.apiReducer)
    const { networkDetails, handleConnect, resetApp } = useContext(Web3Context);


    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [cryptoValue, setCryptoValue] = useState("");
    const [placeBetInfo, setPlaceBetInfo] = useState({});

    const handleClose = () => setShow(false);
    const handleClose1 = () => setShow1(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);

    const handleClose2 = () => setShow2(false);
    const handleShow2 = async (val) => {
        if (approvedTokens == 0) {
            toast.error("You don't have approved tokens to stake")
            return;
        }
        if (getContractInstance) {
            setLoader(true)
            let fetchPool = await poolMethods.fetchPoolDetails(getContractInstance, networkDetails.address, poolId)
            let _staking_ends = fetchPool._staking_ends * 1000
            // if (_staking_ends <= new Date().getTime()) {
            //     toast.error("The staking period has been over")
            //     setLoader(false)
            //     return;
            // }

            let userBets = await poolMethods.fetchUserBets(getContractInstance, networkDetails.address, { poolId, index: val.index })
            //console.log({userBets})
            if (userBets._amounts[val.index] > 0) {
                toast.error("You've already betted")
                setLoader(false)
                return;
            }
            setCryptoValue({ long: val.long, short: val.short });
            setPlaceBetInfo({ index: val.index, price: val.price })
            setLoader(false)
            setShow2(true);
        } else {
            toast.error("Please connect with your wallet")
            return;
        }
    }

    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);

    var inputElement = useRef(null);

    const showUserNameModal = async () => {

        setUserInfo((preValues) => {
            return { ...preValues, userName: "" }
        })

        setTimeout(() => {

            if (inputElement.current) {
                inputElement.current.focus();
            }
        }, 300)

        setShow1(true)
        //handleConnect();
    }
    const connectWallet = async () => {
        setShow1(false)
        handleConnect();
    }

    const updateUserInfo = (e) => {
        setUserInfo((preValues) => ({
            ...preValues,
            userName: e.target.value
        }))
    }

    useEffect(() => {

        AOS.init();
        dispatch(bundleList())
        if (poolId > 0) {
            dispatch(leaderboard(poolId - 1))
        }

    }, [poolId]);
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        (async () => {
            setLoader(true)
            getAllCalculations()
            setLoader(false)
        })()
    }, [networkDetails.web3])

    useEffect(() => {
        (async () => {
            if (getContractInstance) {
                let obj = {}
                obj.user_name = userInfo.userName
                obj.wallet_address = networkDetails.address

                if (userInfo.userName) {
                    console.log({ getContractInstance, getInstance })
                    let userDt = await poolMethods.registerUser(getContractInstance, networkDetails.address, obj.user_name);

                    console.log({ userDt })
                    if (userDt) {
                        dispatch(addNFTUser(obj))
                    }

                    //return setUserInfo({})
                }
            }
        })()
        //return () => setUserInfo({})
    }, [getContractInstance, userInfo.userName])

    const getAllCalculations = async () => {
        const instance = await poolMethods.getERCInstance(networkDetails.web3)
        const contractInst = await poolMethods.getInstance(networkDetails.web3)

        if (instance) {
            setInstance(instance);

            let bal = await poolMethods.getBalance(instance, networkDetails.address)


            if (bal && bal !== 0) {
                //setBalance(parseFloat(bal / enviornment.divideValue).toFixed(2));
                setBalance(bal);
            }

            let approvedTokens = await poolMethods.getApprovedTokens(instance, networkDetails.address)

            if (approvedTokens && approvedTokens !== 0) {
                //setBalance(parseFloat(bal / enviornment.divideValue).toFixed(2));
                setApprovedTokens(approvedTokens);
            }

            let poolId = await poolMethods.fetchLatestPool(contractInst, networkDetails.address)

            setPoolId(poolId);

            let userStaked = await poolMethods.fetchUserStaked(contractInst, networkDetails.address, { poolId })
            if (userStaked.totalbet) {
                let totalbet = parseFloat(userStaked.totalbet / enviornment.divideValue).toFixed(2);
                setStakedTokens(totalbet);
            }

            let fetchUser = await poolMethods.fetchUser(contractInst, networkDetails.address)
            console.log({ fetchUser })
            if (fetchUser.claimable) {
                let claimAmount = parseFloat(fetchUser.claimable / enviornment.divideValue).toFixed(2);
                setClaimAmount(claimAmount);
            }
        }

        if (contractInst) {
            setContractInstance(contractInst);
        }
    }

    const approveTokens = async () => {
        if (value1 == 0) {
            toast.error("Entered value must be greater than 0")
            return;
        }
        setLoader(true)
        if (getInstance) {
            await poolMethods.approveTokens(getInstance, networkDetails.address, value1)
            getAllCalculations()
            setShow(false)
            setLoader(false)
        } else {
            handleConnect()
        }
    }

    const placeBetCrypto = async (stakeAmount) => {
        if (getContractInstance) {

            let percent = (stakeAmount / approvedTokens * 100)
            let data = {}
            data.value = (Number(percent) * 100).toFixed(6)
            data.index = placeBetInfo.index
            data.address = networkDetails.address
            data.balance = Web3.utils.toWei(stakeAmount.toString(), 'ether')
            data.bundleId = Number(poolId)
            data.price = Math.round(Number(placeBetInfo.price) * 100)
            data.percent = Math.round(Number(percent) * 100)
            setLoader(true)
            setUserInfo({})

            let isValid = await getContractInstance.methods.PlaceBetValid(data.index, data.bundleId, data.balance).call({ from: networkDetails.address })
            console.log({ isValid })
            if (isValid) {
                let placeBetResp = await poolMethods.placeBet(getContractInstance, networkDetails.address, data)

                if (placeBetResp.transactionHash) {
                    data.price = Web3.utils.toWei(placeBetInfo.price.toString(), 'ether')
                    data.value = Number(percent)
                    await dispatch(placeBet(data))
                    await getAllCalculations()
                    setShow2(false)
                    navigate("/bundleassets/history")
                }
            } else {
                toast.error('Error')
            }
            setLoader(false)
        } else {
            handleConnect()
        }
    }

    const dashboardIcon = (param = "") => {
        return {
            "BTC": <Bitcoin className={param} />,
            "ETH": <EthIcon className={param} />,
            "BNB": <BNBIcon className={param} />,
            "SOL": <SolIcon className={param} />,
            "AVAX": <AvaIcon className={param} />,
            "MLN": <EnzIcon className={param} />,
            "NMR": <NumIcon className={param} />,
            "UMA": <UmaIcon className={param} />,
            "ADA": <CarIcon className={param} />,
            "BAT": <BatIcon className={param} />,
            "SYS": <SysIcon className={param} />,
            "WSBT": <WsbIcon className={param} />,
            "DOGE": <DogeIcon className={param} />,
            "AAA": <img src={MRLogo} height="50px" width="50px" className="img-fluid" alt="img" />
        }
    }


    return <>



        {/* <Loader.TailSpin
                    type="Rings"
                    color="#AAA8A8"
                    height={100}
                    width={100}
                /> */}
        {showLoader && showLoader.BUNDLE_LIST || isLoading ?
            <div className="lotties-loader">
                <LottieLoader />
            </div> : null}

        <HeaderInner />

        <div className="bundle_details">
            {networkDetails && networkDetails.connected ?
                <section className="stacking_period_end">

                    <Container>
                        <Row className="align-items-center">

                            <Col xs={12} md={12} lg={6} className="mt-4 mt-lg-0">
                                <div className='spe_block p-4 d-flex align-items-center'>
                                    <div className='spe_block_left para_text pt-2 pb-4 pb-md-2 px-4'>
                                        <p className='mb-3'>Staking period ends in</p>
                                        <Timer type="stakePeriod" page="details" />
                                        {/* <div className='spe_time'>23:59:59</div> */}
                                    </div>
                                    {/* <div className='spe_block_right d-flex align-items-center pb-2 pb-md-3 pt-4 pt-md-3 px-4'>
                                        <GraphSmall className="text-white ms-2 me-2" />
                                        <div className='spe_text para_text font_secondary text-white'>
                                            <strong>You are currently in the top 3%
                                                of the total stakes.</strong>
                                        </div>
                                    </div> */}
                                </div>
                            </Col>

                            <Col xs={12} md={12} lg={6} className="mt-4 mt-lg-0">
                                <div className='spe_block p-4 d-flex align-items-center'>
                                    <div className='spe_block_left para_text pt-2 pb-4 pb-md-2 px-4'>
                                        <p className='mb-3'>Next pool available in</p>
                                        <Timer type="stakeStart" />
                                        {/* <div className='spe_time'>23:59:59</div> */}
                                    </div>
                                    {/* <div className='spe_block_right d-flex align-items-center pb-2 pb-md-3 pt-4 pt-md-3 px-4'>
                                        <GraphSmall className="text-white ms-2 me-2" />
                                        <div className='spe_text para_text font_secondary text-white'>
                                            <strong>You are currently in the top 3%
                                                of the total stakes.</strong>
                                        </div>
                                    </div> */}
                                </div>
                            </Col>

                            <Col sm={12} className="mt-4">
                                <div className='spe_block_lg p-4'>
                                    <div className='text_title py-2 px-4 text-white'>
                                        Your dashboard
                                    </div>
                                    <div className='py-4 py-lg-5 px-4'>
                                        <Row>
                                            <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                                                <WalletIcon />
                                                <p className="font_secondary mb-0 wsbt_title">Wallet</p>
                                                <div className='wsbt_value'>{balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} WSBT</div>
                                            </Col>
                                            <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                                                <StakedIcon />
                                                <p className="font_secondary mb-0 wsbt_title">Staked</p>
                                                <div className='wsbt_value'>{stakedTokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} WSBT</div>
                                            </Col>
                                            <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                                                <ApprovedIcon />
                                                <p className="font_secondary mb-0 wsbt_title">Approved</p>
                                                <div className='wsbt_value'>{approvedTokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} WSBT</div>
                                            </Col>
                                            <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                                                <ClaimIcon />
                                                <p className="font_secondary mb-0 wsbt_title">Running Pool Claim</p>
                                                <div className='wsbt_value'>{claimAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} WSBT</div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className='spe_block_left para_text py-2 px-4'>
                                        <Button variant="primary" onClick={handleShow} className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase">Approve</Button>
                                        {/* <Button variant="primary" className="me-4 btn-bordered mb-3 mb-xl-0 text-uppercase">Claim</Button> */}
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </Container>
                </section> :
                <section className="crypto_prediction">
                    <Container>
                        <Row className="justify-content-center align-items-center">
                            <Col xs={12} md={12} lg={8} className="">
                                <h2 className="block_title">Use your crypto-prediction skills to earn APY.</h2>
                                <p className="para_text font_secondary">Connect with Metamask and predict.</p>
                            </Col>
                            <Col xs={12} md={12} lg={4} className="d-flex justify-content-lg-end align-items-center mt-4 mt-lg-0">
                                <Button variant="primary" className="me-4 btn-bordered mb-3 mb-xl-0 text-uppercase" onClick={showUserNameModal}>Connect wallet</Button>
                            </Col>
                        </Row>
                    </Container>
                </section>}
            <section className="available_wsbt">
                <Container>
                    <Row className="justify-content-center align-items-center">
                        <Col xs={12} className="">
                            <h2 className="section_title">Available Pools</h2>
                            <p className="para_text font_secondary">{networkDetails && networkDetails.connected ? "Stake on the coin of your choice" : "Connect with Metamask and predict"}.</p>
                        </Col>
                    </Row>
                    <Row className="justify-content-center align-items-center mt-5 font_secondary">
                        {bundleData && bundleData.length > 0 && bundleData.map((bundleDt, index) => (
                            <Col xs={12} md={6} lg={4} className="mb-4" key={index}>
                                <a style={{ cursor: "pointer" }} onClick={() => handleShow2(bundleDt)}>
                                    <div className="feature_box p-3">
                                        <div className="box_icon mb-4">
                                            {dashboardIcon()[bundleDt.short]}
                                        </div>
                                        <div className="d-flex justify-content-between text_1 mb-2 pt-3">
                                            <div className="">{bundleDt.long}</div>
                                            <div className="">${bundleDt.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                        </div>
                                        <div className="d-flex justify-content-between text_2">
                                            <div className="">{bundleDt.short}</div>
                                            <div className="d-flex align-items-center">
                                                {bundleDt.last24hChange}%
                                                {bundleDt.last24hChange > 0 ? <GraphSmall className="text-white ms-1" /> : <GraphSmallDown className="text-white ms-1" />}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
            <section className="Leaderboard">
                <Container>
                    <Row className="">
                        <Col xs={12}>
                            <p className="para_text font_secondary text-white mb-1 d-flex align-items-center">
                                Top stakers</p>
                            <h2 className="section_title">Leaderboard</h2>
                            {/* <p className="para_text font_secondary">Some description</p> */}
                        </Col>
                    </Row>

                    <Row className="mt-5">
                        {leaderboardData ? leaderboardData.map((leaderboardDt, index) => (
                            <Col xs={12} md={6} lg={4} className="mb-4" key={index}>
                                <div className="leaderboard_item_box d-flex p-3 align-items-center justify-con tent-between">
                                    <div className="lbd_number me-1 me-xl-4 pe-2 pe-lg-3">{leaderboardDt.rank}</div>
                                    {/* <div className="lbd_avtar me-0 me-xl-4 pe-3"> <img src={lbdAvtar1} className="img-fluid" alt="img" /></div> */}
                                    <div className="lbd_text_col">
                                        <div className="text_title">{leaderboardDt.user_name}</div>
                                        {/* <div className="text_value font_secondary">{leaderboardDt.score < 0 ? "-" : "" + ((leaderboardDt.totalBal - (parseFloat(leaderboardDt.totalBal) + parseFloat(leaderboardDt.totalBal * leaderboardDt.score))) / leaderboardDt.totalBal * 100).toFixed(2) || 0}%</div> */}
                                    </div>
                                </div>
                            </Col>
                        )) : <h2>No entries available</h2>}
                    </Row>
                    <Row className="mt-5">
                        <Col xs={12} >
                            {leaderboardData && leaderboardData.map((leaderboardDt, index) => (
                                index > 2 && <div className="leaderboard_list_item d-flex px-4 py-3 align-items-center mb-4">
                                    <div className="lbd_number me-1 me-lg-3 me-xl-4 pe-3 pe-lg-4">{leaderboardDt.rank}</div>
                                    {/* <div className="lbd_avtar me-1 me-lg-3 me-xl-4 pe-1 pe-lg-2"> <img src={lbdAvtar1} className="img-fluid" alt="img" /></div> */}
                                    <div className='d-md-flex justify-content-between flex-fill'>
                                        <div className="text_title font_secondary">{leaderboardDt.user_name}</div>
                                        {/* <div className="text_value ms-auto font_secondary">{leaderboardDt.score < 0 ? "-" : "" + ((leaderboardDt.totalBal - (parseFloat(leaderboardDt.totalBal) + parseFloat(leaderboardDt.totalBal * leaderboardDt.score))) / leaderboardDt.totalBal * 100).toFixed(2) || 0}%</div> */}
                                    </div>
                                </div>
                            ))}

                        </Col>
                    </Row>
                </Container>
            </section>

            <Modal show={show1} onHide={handleClose1} centered className="moddal_sm bd_modal" backdrop="static">
                <Modal.Header className="border-bottom-0 mt-2 p-4" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center block_title">
                        Enter your name
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Form.Group className="mb-3" className="addtoinput">
                            <Form.Control type="text" name="userName" value={userInfo.userName} required="required" onChange={updateUserInfo} ref={inputElement} />
                        </Form.Group>
                    </Form>
                    <div className="mt-4 text-center mb-4">
                        <Button variant="primary" className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase" onClick={connectWallet}>Save</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={show} onHide={handleClose} centered className="moddal_sm bd_modal" backdrop="static">
                <Modal.Header className="border-bottom-0 mt-2 p-4" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center block_title">
                        Approve WSBT from wallet
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <p className="para_text font_secondary mt-4 mt-md-5 pt-3 mb-4">
                        Add to approved WSBT
                    </p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail" className="addtoinput">
                            <Form.Control type="text" placeholder="0" value={value1} onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }} onChange={e => setValue1(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <div className="d-flex mt-4 pt-3 form_range_1">
                        <RangeSlider
                            value={value1}
                            tooltip={'off'}
                            max={Number(balance)}
                            onChange={e => setValue1(e.target.value)}
                            className="w-100 mt-2"
                        />
                        <p className="para_text font_secondary ps-3 m-0" style={{ cursor: "pointer" }} onClick={() => setValue1(balance)}>MAX</p>
                    </div>
                    {/* <p className="para_text text-center font_secondary mb-5 mt-5 pt-2 pt-md-5">
                        A piece of description for the next step goes here.
                    </p> */}
                    <div className="mt-4 text-center mb-4">
                        <Button variant="primary" onClick={approveTokens} className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase" disabled={isLoading}>{!isLoading ? `Approve ${value1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} WSBT` : `Please wait...`}</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={show2} onHide={handleClose2} centered className="moddal_sm bd_modal" backdrop="static">
                <Modal.Header className="border-bottom-0 mt-2 p-4" closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="w-100 block_title">
                        <div className="icon_text mb-3">
                            {dashboardIcon("me-2")[cryptoValue.short]}
                            {cryptoValue.long}</div>
                        Enter stake amount
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <p className="para_text font_secondary mt-2 mt-md-3 pt-2 mb-4">
                        Stake WSBT on {cryptoValue.long}
                    </p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail" className="addtoinput">
                            <Form.Control type="text" placeholder="0" value={value2} onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }} onChange={e => setValue2(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <div className="d-flex mt-4 pt-3 form_range_1">
                        <RangeSlider
                            value={value2}
                            tooltip={'off'}
                            max={Number(approvedTokens)}
                            onChange={e => setValue2(e.target.value)}
                            className="w-100 mt-2"
                        />
                        <p className="para_text font_secondary ps-3 m-0" style={{ cursor: "pointer" }} onClick={() => setValue2(Number(approvedTokens))}>MAX</p>
                    </div>
                    {/* <p className="para_text text-center font_secondary mb-5 mt-5 pt-2 pt-md-5">
                        A piece of description for the next step goes here.
                    </p> */}
                    <div className="mt-4 text-center mb-4">
                        <Button variant="primary" onClick={() => placeBetCrypto(value2)} className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase" disabled={isLoading}>{!isLoading ? `Stake ${value2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} WSBT` : "Please wait..."}</Button>
                    </div>
                </Modal.Body>
            </Modal>


        </div>
    </>
}

export default BundleDetails;