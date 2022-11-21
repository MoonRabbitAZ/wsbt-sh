import React, { useState, useContext, useRef, useEffect } from 'react';
import { Button, Col, Container, Row, Modal, Form } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { toast } from 'react-toastify';
import { Timer } from '../../../component/Timer';
import { ApprovedIcon, ClaimIcon, StakedIcon, WalletIcon, GraphSmall } from '../../../component/Icon';
import { Web3Context } from '../../../web3/contexts/web3Context';
import TokenContract from '../../../contracts/TokenContract';
import BundleContract from '../../../contracts/BundleContract';
import { toBn, fromWei } from '../../../helpers/bn.helper';
import { useSelector, useDispatch } from 'react-redux';
import { startPreloader, endPreloader } from '../../../redux/action/web3.action';

const WalletDetails = ({
  bundle,
  balance,
  stakedTokens,
  approvedTokens,
  setApprovedTokens,
  claimAmount,
  userInfo,
  setUserInfo,
  setPoolId,
  poolId
}) => {
  const { networkDetails, handleConnect } = useContext(Web3Context);

  const [approveAmount, setApproveAmount] = useState(0);
  const [showModalApproveAmount, setShowModalApproveAmount] = useState(false);
  const [showRewardDistributeMsg, setShowRewardDistributeMsg] = useState(false);

  const openModalApproveAmount = () => setShowModalApproveAmount(true);
  const closeModalApproveAmount = () => setShowModalApproveAmount(false);

  const dispatch = useDispatch();

  const approveTokens = async () => {
    if (approveAmount === 0) {
      toast.error('Entered value must be greater than 0.');
      return;
    }

    dispatch(startPreloader());
    try {
      const tokenContract = new TokenContract(networkDetails.web3);
      await tokenContract.approve(approveAmount, networkDetails.address);

      setApprovedTokens(await tokenContract.allowance(networkDetails.address));
    } catch (e) {
      console.log(e.message);
      toast.error("Error when sending transaction");
    }

    setShowModalApproveAmount(false);
    dispatch(endPreloader());
  };

  useEffect(async () => {
    if (networkDetails.web3 === '' || !networkDetails.address) return;

    async function init() {
      try {
        let totalPredictedInPreviousBundle = 0;
        if (poolId !== 0) {
          const bundleContract = new BundleContract(networkDetails.web3);
          const userPredictions = await bundleContract.fetchUserPredictions(networkDetails.address, poolId - 1);

          totalPredictedInPreviousBundle = userPredictions.totalPredicted
        }

        if (toBn(totalPredictedInPreviousBundle).isGreaterThan(0) && Date.now() / 1000 - bundle.start < 60) {
          setShowRewardDistributeMsg(true);
        } else {
          setShowRewardDistributeMsg(false);
        }
      } catch (e) {
        console.error(e);
      }
    }

    dispatch(startPreloader());
    await init();
    dispatch(endPreloader());
  }, [networkDetails.address, bundle])

  const connectWallet = async () => {
    dispatch(startPreloader());
    await handleConnect(true);
    dispatch(endPreloader());
  };

  const updateBundleId = async () => {
    if (networkDetails.web3 === '') return;

    const bundleContract = new BundleContract(networkDetails.web3);
    const bundleId = await bundleContract.bundleId();

    console.log(`Old bundle ID: ${poolId}, New bundle ID: ${bundleId}`);
    if (bundleId !== poolId) setPoolId(bundleId);
    else setShowRewardDistributeMsg(true);
  };

  return (
    <>
      {networkDetails && networkDetails.connected ? (
        <section className="staking_period_end">
          <Container>
            <Row className="align-items-center">
              <Col xs={12} md={12} lg={6} className="mt-4 mt-lg-0">
                <div className="spe_block p-4 d-flex align-items-center">
                  <div className="spe_block_left para_text pt-2 pb-4 pb-md-2 px-4">
                    <Timer
                      endAtSeconds={bundle.stakingEnd}
                      timerTxt="Staking period ends in"
                      waitText="Staking period is over"
                    />
                  </div>
                </div>
              </Col>
              <Col xs={12} md={12} lg={6} className="mt-4 mt-lg-0">
                <div className="spe_block p-4 d-flex align-items-center">
                  <div className="spe_block_left para_text pt-2 pb-4 pb-md-2 px-4">
                    <Timer
                      endAtSeconds={bundle.end}
                      updateBundleId={updateBundleId}
                      timerTxt="Next pool available in"
                      waitText="New pool creation"
                    />
                  </div>
                </div>
              </Col>
              <Col sm={12} className="mt-4">
                <div className="spe_block_lg p-4">
                  <div className="text_title py-2 px-4 text-white">
                    Your dashboard
                    {showRewardDistributeMsg ? <p className="decription">Rewards for the previous bundle will be disributed in a few minutes.</p> : ''}
                  </div>
                  <div className="py-4 py-lg-5 px-4">
                    <Row>
                      <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                        <WalletIcon />
                        <p className="font_secondary mb-0 wsbt_title">Wallet</p>
                        <div className="wsbt_value">{parseFloat(fromWei(balance).toFixed(2))} WSBT</div>
                      </Col>
                      <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                        <StakedIcon />
                        <p className="font_secondary mb-0 wsbt_title">Staked</p>
                        <div className="wsbt_value">{parseFloat(fromWei(stakedTokens).toFixed())} WSBT</div>
                      </Col>
                      <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                        <ApprovedIcon />
                        <p className="font_secondary mb-0 wsbt_title">Approved</p>
                        <div className="wsbt_value">{parseFloat(fromWei(approvedTokens).toFixed(2))} WSBT</div>
                      </Col>
                      <Col sm={6} md={6} lg={3} className="my-3 my-lg-0">
                        <ClaimIcon />
                        <p className="font_secondary mb-0 wsbt_title">Available to Claim</p>
                        <div className="wsbt_value">{parseFloat(fromWei(claimAmount).toFixed())} WSBT</div>
                      </Col>
                    </Row>
                  </div>
                  <div className="spe_block_left para_text py-2 px-4">
                    <Button
                      variant="primary"
                      onClick={openModalApproveAmount}
                      className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase"
                    >
                      Approve
                    </Button>
                    {/* <Button variant="primary" className="me-4 btn-bordered mb-3 mb-xl-0 text-uppercase">Claim</Button> */}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="crypto_prediction">
          <Container>
            <Row className="justify-content-center align-items-center">
              <Col xs={12} md={12} lg={8} className="">
                <h2 className="block_title">Use your crypto-prediction skills to earn APY.</h2>
                <p className="para_text font_secondary">Connect with Metamask and predict.</p>
              </Col>
              <Col xs={12} md={12} lg={4} className="d-flex justify-content-lg-end align-items-center mt-4 mt-lg-0">
                <Button
                  variant="primary"
                  className="me-4 btn-bordered mb-3 mb-xl-0 text-uppercase"
                  onClick={connectWallet}
                >
                  Connect wallet
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      )}
      <Modal
        show={showModalApproveAmount}
        onHide={closeModalApproveAmount}
        centered
        className="moddal_sm bd_modal"
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 mt-2 p-4" closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center block_title">
            Approve WSBT from wallet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="para_text font_secondary mt-4 mt-md-5 pt-3 mb-4">Add to approved WSBT</p>
          <Form>
            <Form.Group className="mb-3 addtoinput" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="0"
                value={approveAmount}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => setApproveAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="d-flex mt-4 pt-3 form_range_1">
            <RangeSlider
              value={fromWei(approveAmount).toNumber()}
              tooltip={'off'}
              max={fromWei(balance).toNumber()}
              onChange={(e) => setApproveAmount(e.target.value)}
              className="w-100 mt-2"
            />
            <p
              className="para_text font_secondary ps-3 m-0"
              style={{ cursor: 'pointer' }}
              onClick={() => setApproveAmount(fromWei(balance).toNumber())}
            >
              MAX
            </p>
          </div>
          <div className="mt-4 text-center mb-4">
            <Button
              variant="primary"
              onClick={approveTokens}
              className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase"
            >{`Approve ${approveAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} WSBT`}</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default WalletDetails;
