import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AOS from 'aos';

import { Table, Col, Container, Row, Button } from "react-bootstrap";
import HeaderInner from '../component/Layout/HeaderInner';
import { currentPoolDetails, completedPoolDetails } from "../action/bundle.action"
import { poolMethods } from "../web3/functions/factory"
import { Web3Context } from "../web3/contexts/web3Context";
import { Bitcoin, LeftArrowSmall, EthIcon, BNBIcon, SolIcon, AvaIcon, EnzIcon, NumIcon, UmaIcon, CarIcon, BatIcon, SysIcon, WsbIcon, DogeIcon, AbuIcon } from "../component/Icon";

import 'aos/dist/aos.css';
import { Timer } from '../component/Timer';
import * as Loader from "react-loader-spinner";
import LottieLoader from "../Utils/lottieLoader"
import { Link } from "react-router-dom";
import MRLogo from "../assets/images/mrlogo.png";



const BundleAssets = () => {

    const disptach = useDispatch()
    const navigate = useNavigate()
    const [getContractInstance, setContractInstance] = useState();
    const [userDetails, setUserDetails] = useState();
    const [isLoading, setLoader] = useState(false);
    const [approvedERCToken, setApprovedTokens] = useState();
    const { networkDetails } = useContext(Web3Context);
    const { assetListData, completedListData } = useSelector(state => state.bundleReducer)

    const { type } = useParams();

    useEffect(() => {
        AOS.init();
    }, []);
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        (async () => {
            const instance = await poolMethods.getInstance(networkDetails.web3);
            const ERCinstance = await poolMethods.getERCInstance(networkDetails.web3)
            const fetchUser = await poolMethods.fetchUser(instance, networkDetails.address)

            setUserDetails(fetchUser)

            if (instance) {
                setContractInstance(instance);
            }

            let approvedTokens = await poolMethods.getApprovedTokens(ERCinstance, networkDetails.address)

            if (approvedTokens && approvedTokens !== 0) {
                setApprovedTokens(approvedTokens);
            }
        })();
    }, [networkDetails.web3]);

    useEffect(async () => {
        if (getContractInstance) {
            let poolId = await poolMethods.fetchLatestPool(getContractInstance, networkDetails.address)
            if (type !== "completed") {
                disptach(currentPoolDetails(networkDetails.address + "/" + poolId))
            } else {
                disptach(completedPoolDetails(networkDetails.address + '/' + poolId))
            }
        }
    }, [getContractInstance, type])

    const claimTokens = async () => {
        if (getContractInstance) {
            setLoader(true)
            await poolMethods.claimTokens(getContractInstance, networkDetails.address)
            setLoader(false)
        }
    }

    const dashboardIcon = (param = "") => {
        let MrClassName = `img-fluid ${param}`
        return  {
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
            "AAA": <img src={MRLogo} height="50px" width="50px" className={MrClassName} alt="img" />
        }
    }

    return <>

        {isLoading ?
            <div className="lotties-loader">
                <LottieLoader />
            </div>
            : null}
        <HeaderInner />
        <div className="bundle_assets">
            <div className="top_block">
                <Container>
                    <Row className="align-items-center">
                        <Col xs={12} md={12} lg={5} className="mt-4 mt-lg-0">
                            {/* <p className="para_text font_secondary text-white mb-1 d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate(type === "current" ? "/bundledetails" : "/bundleassets/current")}>
                                <LeftArrowSmall className="me-2" />
                                {type === "history" ? "Dashboard" : type === "current" ? "Dashboard" : "History"}</p> */}
                            <h2 className="section_title">{type === "history" ? "WSBT Assets" : type === "current" ? "Current Pool" : "Completed Pools"}</h2>
                            {/* <p className="para_text font_secondary">Some description</p> */}
                        </Col>
                        <Col xs={12} md={12} lg={7} className="mt-4 mt-lg-0">
                            <div className="bundle_box p-3 p-sm-4">
                                <h2 className="box-title pt-2 mb-4">Balances</h2>
                                <Row>
                                    <Col xs={7} sm={6}>
                                        <p className="font_secondary mb-0 wsbt_title">Staked</p>
                                        <div className="value">{type === "completed" ? completedListData && completedListData.length > 0 && completedListData[0].totalBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : assetListData && assetListData.length > 0 && assetListData[0].balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                    </Col>
                                    <Col xs={5} sm={6}>
                                        <p className="font_secondary mb-0 wsbt_title">Ends in</p>
                                        <Timer type="stakePeriod" page="assets" />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container>
                <Row>
                    {console.log({userDetails})}
                    <Col className="asset_list">

                        {type === "completed" ?
                            <>
                                {completedListData && completedListData.length > 0 &&  userDetails && userDetails[2] > 0 &&
                                    <div className='spe_block_left para_text py-2 px-4'>
                                        <Button variant="primary" onClick={claimTokens} disabled={isLoading} className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase">{!isLoading ? `Claim` : `Please wait...`}</Button>
                                    </div>}
                                <Table responsive="md">
                                    {completedListData && completedListData.length > 0 ?
                                        <thead>
                                            <tr>
                                                <th className="">Pool</th>
                                                <th className="">Token</th>
                                                <th className="text-center">Strike price</th>
                                                <th className="text-center">Strike amount</th>
                                                <th className="text-end">Token staked(%)</th>
                                            </tr>
                                        </thead>
                                        : <thead>
                                            <tr>
                                                <th className="text-center">
                                                    <p>Nothing to see here</p>
                                                    <div className='spe_block_left para_text py-2 px-4'>
                                                        <Link className="btn-flat btn btn-primary mb-3 mb-xl-0 link-sp" to={'/bundledetails'}>Make a forecast</Link>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>}
                                    <tbody>
                                        {completedListData && completedListData.map((item, ind) => {
                                            return (
                                                <tr key={ind}>
                                                    <td className="">{item.bundleId}</td>
                                                    <td className="">
                                                        {dashboardIcon("me-2 icon")[item.short]}
                                                        {item.tokenTitle}</td>
                                                    <td className="text-center">{item.strikePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    <td className="text-center">{item.strikeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                    <td className="text-end">{parseFloat(item.strikeAmount / completedListData[0].totalBalance * 100).toFixed(2) + "%"}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </Table></>
                            : <Table responsive="md">
                                {assetListData && assetListData.length > 0 ?
                                    <thead>
                                        <tr>
                                            <th className="">Token</th>
                                            <th className="text-center">Strike price</th>
                                            <th className="text-center">Strike amount</th>
                                            <th className="text-end">Token staked(%)</th>
                                        </tr>
                                    </thead> :
                                    <thead>
                                        <tr>
                                            <th className="text-center">
                                                <p>You are not participating in the current pool</p>
                                                <div className='spe_block_left para_text py-2 px-4'>
                                                    <Link className="me-4 btn-flat btn btn-primary mb-3 mb-xl-0 link-sp" to={'/bundledetails'}>Start predicting</Link>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                }

                                <tbody>
                                    {assetListData && assetListData.length > 0 && assetListData[0].poolData.map(item => {
                                        return (
                                            <tr key={item.key}>
                                                <td className="">
                                                    {dashboardIcon("me-2 icon")[item.short]}
                                                    {item.tokenTitle}</td>
                                                <td className="text-center">{item.strikePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td className="text-center">{item.strikeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td className="text-end">{parseFloat(item.strikeAmount / assetListData[0].balance * 100).toFixed(2) + "%"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </Table>}
                    </Col>
                </Row>
            </Container>
        </div>
    </>
}

export default BundleAssets;