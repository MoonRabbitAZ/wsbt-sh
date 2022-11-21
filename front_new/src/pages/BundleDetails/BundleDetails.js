// import React from "react";
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import AOS from 'aos';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import HeaderInner from '../../component/Layout/HeaderInner';
import { Web3Context } from '../../web3/contexts/web3Context';
import { getNFTUser, addNFTUser, leaderboard } from '../../redux/action/bundle.action';
import { startPreloader, endPreloader } from '../../redux/action/web3.action';
import WalletDetails from './components/WalletDetails';
import AvailablePools from './components/AvailablePools';
import BundleContract from '../../contracts/BundleContract';
import TokenContract from '../../contracts/TokenContract';

import 'aos/dist/aos.css';

const BundleDetails = () => {
  const { pathname } = useLocation();

  const [balance, setBalance] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [approvedTokens, setApprovedTokens] = useState(0);
  const [stakedTokens, setStakedTokens] = useState(0);
  const [poolId, setPoolId] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [bundle, setBundle] = useState(0);

  const dispatch = useDispatch();

  const { leaderboardData } = useSelector((state) => state.bundleReducer);
  const preloader = useSelector((state) => state.web3Reducer);
  const state = useSelector((state) => state);

  const { networkDetails } = useContext(Web3Context);

  useEffect(() => AOS.init(), []);
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  useEffect(() => {
    async function init() {
      const bundleContract = new BundleContract(networkDetails.web3);

      const bundle_ = await bundleContract.fetchBundle(poolId);
      setBundle(bundle_);

      if (poolId > 0) dispatch(leaderboard(poolId - 1));
    }

    init();
  }, [poolId]);
  useEffect(() => {
    if (networkDetails.web3 === '' || !networkDetails.address) return;

    async function init() {
      dispatch(startPreloader());
      try {
        const tokenContract = new TokenContract(networkDetails.web3);

        setBalance(await tokenContract.balanceOf(networkDetails.address));
        setApprovedTokens(await tokenContract.allowance(networkDetails.address));

        const bundleContract = new BundleContract(networkDetails.web3);

        const bundleId = await bundleContract.bundleId();
        if (bundleId !== poolId) setPoolId(bundleId);

        const userPredictions = await bundleContract.fetchUserPredictions(networkDetails.address, poolId);
        setStakedTokens(userPredictions.totalPredicted);

        const user = await bundleContract.fetchUser(networkDetails.address);
        setClaimAmount(user.claimable);
      } catch (e) {
        console.error(e);
      }

      dispatch(endPreloader());
    }

    init();
  }, [networkDetails.web3, networkDetails.address, poolId]);

  // useEffect(async () => {
  //   if (networkDetails.web3 === '' || !networkDetails.address) return;

  //   async function init() {
  //     dispatch(startPreloader());
  //     try {
  //       const bundleContract = new BundleContract(networkDetails.web3);

  //       const user = await bundleContract.fetchUser(networkDetails.address, poolId);
  //       setClaimAmount(user.claimable);

  //       if (!user.active) {
  //         await bundleContract.register(networkDetails.address, userInfo.userName);

  //         dispatch(
  //           addNFTUser({
  //             username: userInfo.userName,
  //             walletAddress: networkDetails.address
  //           })
  //         );
  //       }

  //       dispatch(getNFTUser(networkDetails.address));
  //     } catch (e) {
  //       console.error(e);
  //     }

  //     dispatch(endPreloader());
  //   }

  //   init();
  // }, [networkDetails.web3]);

  useEffect(async () => {
    const auth = state.authReducer;
    if (auth.nftUser === undefined || networkDetails.web3 === '') return;
    if (auth.nftUser.username === userInfo.userName) return;

    const bundleContract = new BundleContract(networkDetails.web3);
    const user = await bundleContract.fetchUser(networkDetails.address, poolId);

    let username = '';
    if (user.username !== '') username = user.username;
    else username = userInfo.userName;

    dispatch(
      addNFTUser({
        username: username,
        walletAddress: networkDetails.address
      })
    );

    dispatch(getNFTUser(networkDetails.address));
  }, [state.authReducer]);

  const updateUserInfo = (e) => {
    setUserInfo((preValues) => ({
      ...preValues,
      userName: e.target.value
    }));
  };

  return (
    <>
      <HeaderInner />

      <div className="bundle_details">
        <WalletDetails
          bundle={bundle}
          balance={balance}
          stakedTokens={stakedTokens}
          approvedTokens={approvedTokens}
          setApprovedTokens={setApprovedTokens}
          claimAmount={claimAmount}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          setPoolId={setPoolId}
          poolId={poolId}
        />
        <AvailablePools
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          bundle={bundle}
          approvedTokens={approvedTokens}
          setApprovedTokens={setApprovedTokens}
          poolId={poolId}
          setStakedTokens={setStakedTokens}
          balance={balance}
          setBalance={setBalance}
        />

        <section className="Leaderboard">
          <Container>
            <Row className="">
              <Col xs={12}>
                <p className="para_text font_secondary text-white mb-1 d-flex align-items-center">Top stakers</p>
                <h2 className="section_title">Leaderboard</h2>
                {/* <p className="para_text font_secondary">Some description</p> */}
              </Col>
            </Row>

            <Row className="mt-5">
              {leaderboardData ? (
                leaderboardData.map((leaderboardDt, index) => (
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
                ))
              ) : (
                <h2>No entries available</h2>
              )}
            </Row>
            <Row className="mt-5">
              <Col xs={12}>
                {leaderboardData &&
                  leaderboardData.map(
                    (leaderboardDt, index) =>
                      index > 2 && (
                        <div className="leaderboard_list_item d-flex px-4 py-3 align-items-center mb-4">
                          <div className="lbd_number me-1 me-lg-3 me-xl-4 pe-3 pe-lg-4">{leaderboardDt.rank}</div>
                          {/* <div className="lbd_avtar me-1 me-lg-3 me-xl-4 pe-1 pe-lg-2"> <img src={lbdAvtar1} className="img-fluid" alt="img" /></div> */}
                          <div className="d-md-flex justify-content-between flex-fill">
                            <div className="text_title font_secondary">{leaderboardDt.username}</div>
                            {/* <div className="text_value ms-auto font_secondary">{leaderboardDt.score < 0 ? "-" : "" + ((leaderboardDt.totalBal - (parseFloat(leaderboardDt.totalBal) + parseFloat(leaderboardDt.totalBal * leaderboardDt.score))) / leaderboardDt.totalBal * 100).toFixed(2) || 0}%</div> */}
                          </div>
                        </div>
                      )
                  )}
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
};

export default BundleDetails;
