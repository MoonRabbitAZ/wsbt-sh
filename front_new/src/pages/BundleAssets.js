import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AOS from 'aos';

import { Table, Col, Container, Row, Button } from 'react-bootstrap';
import HeaderInner from '../component/Layout/HeaderInner';
import { currentPoolDetails, completedPoolDetails } from '../redux/action/bundle.action';
import { startPreloader, endPreloader } from '../redux/action/web3.action';
import { Web3Context } from '../web3/contexts/web3Context';
import { getIcon } from '../component/Icon';

import 'aos/dist/aos.css';
import { Timer } from '../component/Timer';
import { Link } from 'react-router-dom';

import BundleContract from '../contracts/BundleContract';
import { toBn, fromWei } from '../helpers/bn.helper';

import { toast } from 'react-toastify';

const BundleAssets = () => {
  const { networkDetails } = useContext(Web3Context);
  const { type } = useParams();
  const { pathname } = useLocation();

  const [bundle, setBundle] = useState(0);
  const [claimAmount, setClaimAmount] = useState('0')

  const dispatch = useDispatch();
  const { assetListData, completedListData } = useSelector((state) => state.bundleReducer);

  useEffect(() => AOS.init(), []);
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  useEffect(() => {
    if (networkDetails.address === '') return;

    async function init() {
      const bundleContract = new BundleContract(networkDetails.web3);
      const bundleId = await bundleContract.bundleId();

      const bundle_ = await bundleContract.fetchBundle(bundleId);
      setBundle(bundle_);

      const user = await bundleContract.fetchUser(networkDetails.address);
      setClaimAmount(user.claimable);

      if (type !== 'completed') {
        dispatch(currentPoolDetails(networkDetails.address + '/' + bundleId));
      } else {
        dispatch(completedPoolDetails(networkDetails.address + '/' + bundleId));
      }
    }

    init();
  }, [networkDetails, type]);

  const claimTokens = async () => {
    if (networkDetails.address === '') {
      return toast.error('Please connect with your wallet');
    }

    dispatch(startPreloader());
    try {
      const bundleContract = new BundleContract(networkDetails.web3);
      await bundleContract.withdraw(networkDetails.address);
    } catch (e) {
      console.log(e);
      toast.error("Error when sending transaction");
    }
    dispatch(endPreloader());
  };

  return (
    <>
      <HeaderInner />
      <div className="bundle_assets">
        <div className="top_block">
          <Container>
            <Row className="align-items-center">
              <Col xs={12} md={12} lg={5} className="mt-4 mt-lg-0">
                {/* <p className="para_text font_secondary text-white mb-1 d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => navigate(type === "current" ? "/bundledetails" : "/bundleassets/current")}>
                                <LeftArrowSmall className="me-2" />
                                {type === "history" ? "Dashboard" : type === "current" ? "Dashboard" : "History"}</p> */}
                <h2 className="section_title">
                  {type === 'history' ? 'WSBT Assets' : type === 'current' ? 'Current Pool' : 'Completed Pools'}
                </h2>
                {/* <p className="para_text font_secondary">Some description</p> */}
              </Col>
              <Col xs={12} md={12} lg={7} className="mt-4 mt-lg-0">
                <div className="bundle_box p-3 p-sm-4">
                  <h2 className="box-title pt-2 mb-4">Balances</h2>
                  <Row>
                    <Col xs={7} sm={6}>
                      <p className="font_secondary mb-0 wsbt_title">Staked</p>
                      <div className="value">
                        {type === 'completed'
                          ? completedListData && fromWei(completedListData.totalBalance).toString()
                          : assetListData && assetListData.length > 0 && fromWei(assetListData[0].balance).toString()}
                      </div>
                    </Col>
                    <Col xs={5} sm={6} className="box-wrapper" >
                      <Timer
                        endAtSeconds={bundle.end}
                        timerTxt="Ends in"
                        waitText="New pool creation"
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <Row>
            <Col className="asset_list">
              {type === 'completed' ? (
                <>
                  {completedListData && completedListData.poolData.length > 0 && toBn(claimAmount).isGreaterThan(0) ? (
                    <div className="spe_block_left para_text py-2 px-4">
                      <Button
                        variant="primary"
                        onClick={claimTokens}
                        className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase"
                      >
                        Claim
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
                  <Table responsive="md">
                    {completedListData && completedListData.poolData.length > 0 ? (
                      <thead>
                        <tr>
                          <th className="">Pool</th>
                          <th className="">Token</th>
                          <th className="text-center">Strike price</th>
                          <th className="text-center">Strike amount</th>
                          <th className="text-end">Token staked(%)</th>
                        </tr>
                      </thead>
                    ) : (
                      <thead>
                        <tr>
                          <th className="text-center">
                            <p>Nothing to see here</p>
                            <div className="spe_block_left para_text py-2 px-4">
                              <Link className="btn-flat btn btn-primary mb-3 mb-xl-0 link-sp" to={'/bundledetails'}>
                                Make a forecast
                              </Link>
                            </div>
                          </th>
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {completedListData &&
                        completedListData.poolData.length > 0 &&
                        completedListData.poolData.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td className="">{item.bundleId}</td>
                              <td className="">
                                {getIcon(item.short, 'me-2 icon')}
                                {item.tokenTitle}
                              </td>
                              <td className="text-center">{'$ ' + fromWei(item.strikePrice).toString()}</td>
                              <td className="text-center">{fromWei(item.strikeAmount).toString() + 'WSBT'}</td>
                              <td className="text-end">
                                {toBn(item.strikeAmount)
                                  .dividedBy(completedListData.totalBalance)
                                  .multipliedBy(100)
                                  .toFixed(2) + '%'}
                              </td>

                              {/* <td className="text-end">{parseFloat(item.strikeAmount / completedListData[0].totalBalance * 100).toFixed(2) + "%"}</td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </>
              ) : (
                <Table responsive="md">
                  {assetListData && assetListData.length > 0 ? (
                    <thead>
                      <tr>
                        <th className="">Token</th>
                        <th className="text-center">Strike price</th>
                        <th className="text-center">Strike amount</th>
                        <th className="text-end">Token staked(%)</th>
                      </tr>
                    </thead>
                  ) : (
                    <thead>
                      <tr>
                        <th className="text-center">
                          <p>You are not participating in the current pool</p>
                          <div className="spe_block_left para_text py-2 px-4">
                            <Link className="me-4 btn-flat btn btn-primary mb-3 mb-xl-0 link-sp" to={'/bundledetails'}>
                              Start predicting
                            </Link>
                          </div>
                        </th>
                      </tr>
                    </thead>
                  )}

                  <tbody>
                    {assetListData &&
                      assetListData.length > 0 &&
                      assetListData.map((item) => {
                        return (
                          <tr key={item.key}>
                            <td className="">
                              {getIcon(item.short, 'me-2 icon')}
                              {item.tokenTitle}
                            </td>
                            <td className="text-center">{'$ ' + fromWei(item.strikePrice).toString()}</td>
                            <td className="text-center">{fromWei(item.strikeAmount).toString() + 'WSBT'}</td>
                            <td className="text-end">
                              {toBn(item.strikeAmount).dividedBy(item.balance).multipliedBy(100).toFixed(2) + '%'}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BundleAssets;
