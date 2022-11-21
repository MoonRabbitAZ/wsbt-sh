import React, { useState, useContext, useEffect } from 'react';
import { Col, Container, Row, Modal, Button, Form } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import { GraphSmall, GraphSmallDown, getIcon } from '../../../component/Icon';
import { toast } from 'react-toastify';
import { Web3Context } from '../../../web3/contexts/web3Context';
import { fromWei, toBn, toWei } from '../../../helpers/bn.helper';
import BundleContract from '../../../contracts/BundleContract';
import { useSelector, useDispatch } from 'react-redux';
import { bundleList, placePrediction } from '../../../redux/action/bundle.action';
import { startPreloader, endPreloader } from '../../../redux/action/web3.action';
import { getNFTUser, addNFTUser } from '../../../redux/action/bundle.action';

const AvailablePools = ({ userInfo, setUserInfo, bundle, approvedTokens, setApprovedTokens, poolId, setStakedTokens, balance, setBalance }) => {
  const { networkDetails } = useContext(Web3Context);

  const [showModalAmount, setShowModalAmount] = useState(false);
  const [modalAmount, setModalAmount] = useState(0);
  const [cryptoValue, setCryptoValue] = useState('');
  const [placePredictionInfo, setPlacePredictionInfo] = useState({});
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const [userRegisterName, setUserRegisterName] = useState('');

  const dispatch = useDispatch();
  const cryptoPrices = useSelector((state) => {
    return state.bundleReducer.bundleData;
  });

  const hideModalRegister = () => { setShowModalRegister(false) }
  const hideModalAmount = () => { setShowModalAmount(false) }

  useEffect(() => {
    dispatch(bundleList());
  }, []);

  useEffect(async () => {
    if (!networkDetails.address) return;

    async function init() {
      try {
        const bundleContract = new BundleContract(networkDetails.web3);

        const user = await bundleContract.fetchUser(networkDetails.address);
        setUserRegistered(user.active)
      } catch (e) {
        console.error(e);
      }
    }

    dispatch(startPreloader());
    init();
    dispatch(endPreloader());
  }, [networkDetails.address]);

  const handleModals = async (val) => {
    if (!userRegistered) {
      setShowModalRegister(true);
    } else {
      handleModalAmount(val);
    }
  }

  const handleModalAmount = async (val) => {
    if (!networkDetails.web3) {
      return toast.error('Please, connect with Metamask.');
    }

    if (approvedTokens === 0) {
      return toast.error("You don't have approved tokens to stake");
    }

    if (new Date(bundle.stakingEnd * 1000) <= new Date()) {
      return toast.error('The staking period has been over. Wait for the start of the new bundle.');
    }

    dispatch(startPreloader());

    const bundleContract = new BundleContract(networkDetails.web3);
    const userPredictions = await bundleContract.fetchUserPredictions(networkDetails.address, poolId);
    if (userPredictions._amounts[val.index] > 0) {
      toast.error('Prediction is placed.');
      dispatch(endPreloader());
      return;
    }

    setCryptoValue({ long: val.long, short: val.short });
    setPlacePredictionInfo({ index: val.index, price: val.price });

    dispatch(endPreloader());
    setShowModalAmount(true);
  };

  const placePredictionCrypto = async (stakeAmount) => {
    dispatch(startPreloader());

    if (toBn(approvedTokens).isLessThan(toWei(stakeAmount))) {
      toast.error("You cannot stake more than you have left of the approved amount");
      dispatch(endPreloader());
      return
    }

    if (toBn(balance).isLessThan(toWei(stakeAmount))) {
      toast.error("You cannot stake more than you have left of the balance");
      dispatch(endPreloader());
      return
    }

    try {
      const percent = toWei(stakeAmount).dividedBy(approvedTokens).multipliedBy(100);
      const value = toWei(percent).toFixed(0);
      const index = placePredictionInfo.index;
      const address = networkDetails.address;
      const amount = toWei(stakeAmount).toFixed(0);
      const price = placePredictionInfo.price;

      // console.log({
      //   value,
      //   index,
      //   address,
      //   balance: amount,
      //   bundleId: poolId,
      //   price
      // });

      const bundleContract = new BundleContract(networkDetails.web3);
      await bundleContract.placePrediction(networkDetails.address, index, price, value, poolId, amount);

      dispatch(
        placePrediction({
          value,
          index,
          address,
          balance: amount,
          bundleId: poolId,
          price
        })
      );

      const userPredictions = await bundleContract.fetchUserPredictions(networkDetails.address, poolId);
      setStakedTokens(userPredictions.totalPredicted);
      setApprovedTokens(toBn(approvedTokens).minus(amount).toString());
      setBalance(toBn(balance).minus(amount).toString())
    } catch (e) {
      console.error(e.message);
      toast.error("Error when sending transaction");
    }

    setShowModalAmount(false);
    dispatch(endPreloader());
  };

  const register = async () => {
    if (!networkDetails.web3 || !networkDetails.address) {
      return toast.error('Please, connect with Metamask.');
    }

    if (userRegisterName.length === 0) {
      toast.error('Invalid username!');
      return;
    }

    dispatch(startPreloader());
    try {
      const bundleContract = new BundleContract(networkDetails.web3);
      await bundleContract.register(networkDetails.address, userRegisterName);

      dispatch(
        addNFTUser({
          username: userRegisterName,
          walletAddress: networkDetails.address
        })
      );
      dispatch(getNFTUser(networkDetails.address));

      setUserInfo({
        ...userInfo,
        userName: userRegisterName
      });

      setUserRegistered(true);
    } catch (e) {
      console.error(e.message);
    }
    setShowModalRegister(false);
    dispatch(endPreloader());
  };



  return (
    <>
      <section className="available_wsbt">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col xs={12} className="">
              <h2 className="section_title">Available Baskets</h2>
              <p className="para_text font_secondary">
                {networkDetails && networkDetails.connected
                  ? 'Stake on tokens which you believe will see increase in value as the pool ends'
                  : 'Connect with Metamask and predict'}
                .
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center mt-5 font_secondary">
            {cryptoPrices && cryptoPrices.length > 0
              ? cryptoPrices.map((bundleDt, index) => (
                <Col xs={12} md={6} lg={4} className="mb-4" key={index}>
                  <a style={{ cursor: 'pointer' }} onClick={() => handleModals(bundleDt)}>
                    <div className="feature_box p-3">
                      <div className="box_icon mb-4">{getIcon(bundleDt.shortName)}</div>
                      <div className="d-flex justify-content-between text_1 mb-2 pt-3">
                        <div className="">{bundleDt.longName}</div>
                        <div className="">${fromWei(bundleDt.price).toString()}</div>
                      </div>
                      <div className="d-flex justify-content-between text_2">
                        <div className="">{bundleDt.short}</div>
                        <div className="d-flex align-items-center">
                          {fromWei(bundleDt.last24hChange).toFixed(4)}%
                          {bundleDt.last24hChange > 0 ? (
                            <GraphSmall className="text-white ms-1" />
                          ) : (
                            <GraphSmallDown className="text-white ms-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </Col>
              ))
              : null}
          </Row>
        </Container>
      </section>

      <Modal
        show={showModalRegister}
        onHide={hideModalRegister}
        centered
        className="moddal_sm bd_modal"
        backdrop="static"
      >
        <Modal.Header className="border-bottom-0 mt-2 p-4" closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="w-100 text-center block_title">
            Enter your name
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3 addtoinput">
              <Form.Control
                type="text"
                name="userName"
                value={userRegisterName}
                required="required"
                onChange={e => setUserRegisterName(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="mt-4 text-center mb-4">
            <Button variant="primary" className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase" onClick={register}>
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showModalAmount} onHide={hideModalAmount} centered className="moddal_sm bd_modal" backdrop="static">
        <Modal.Header className="border-bottom-0 mt-2 p-4" closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="w-100 block_title">
            <div className="icon_text mb-3">
              {getIcon(cryptoValue.short, 'me-2')}
              {cryptoValue.long}
            </div>
            Enter prediction amount
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="para_text font_secondary mt-2 mt-md-3 pt-2 mb-4">Stake WSBT on {cryptoValue.long}</p>
          <Form>
            <Form.Group className="mb-3 addtoinput" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="0"
                value={modalAmount}
                onKeyPress={(event) => {
                  if (!/[0-9.]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => setModalAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
          <div className="d-flex mt-4 pt-3 form_range_1">
            <RangeSlider
              value={modalAmount}
              tooltip={'off'}
              max={fromWei(approvedTokens).toNumber()}
              onChange={(e) => setModalAmount(e.target.value)}
              className="w-100 mt-2"
            />
            <p
              className="para_text font_secondary ps-3 m-0"
              style={{ cursor: 'pointer' }}
              onClick={() => setModalAmount(fromWei(approvedTokens).toNumber())}
            >
              MAX
            </p>
          </div>
          <div className="mt-4 text-center mb-4">
            <Button
              variant="primary"
              onClick={() => placePredictionCrypto(modalAmount)}
              className="me-4 btn-flat mb-3 mb-xl-0 text-uppercase"
            >{`Stake ${modalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} WSBT`}</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AvailablePools;
