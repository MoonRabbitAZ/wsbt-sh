import React, { useContext, useEffect } from 'react';
import HeaderInner from '../component/Layout/HeaderInner';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { checkUserStatus } from '../redux/action/bundle.action';
import { Web3Context } from '../web3/contexts/web3Context';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BundleContract from '../contracts/BundleContract';

const Megapool = () => {
  const dispatch = useDispatch();

  const { isUserEligible } = useSelector((state) => state.bundleReducer);
  const { networkDetails } = useContext(Web3Context);

  useEffect(() => {
    if (networkDetails.address === '') return;

    dispatch(checkUserStatus(networkDetails.address));
  }, [networkDetails.address]);

  const checkUser = async () => {
    if (!isUserEligible) {
      return toast.error("You are not eligible to register in the Mega Pool");
    }

    if (networkDetails.web3 === '') {
      return toast.error('Please, connect with Metamask.');
    }

    const bundleContract = new BundleContract(networkDetails.web3);
    await bundleContract.participateForMegaPool(networkDetails.address);
  };

  return (
    <>
      <HeaderInner />
      <div className="hall_of_fame">
        <div className="top_block">
          <Container>
            <Row className="align-items-stretch text-center text-md-start">
              <Col xs={12} md={12} lg={5}>
                <h2 className="section_title mb-0">Mega Pool</h2>
                
              </Col>
              <Col xs={12} md={12} lg={7} className="mt-4 mt-lg-0">
                <div className="bundle_box p-3 p-sm-4">
                  <p className="info">In order to be eligible for the Mega Pool, you need to place high enough in pool rankings. Keep predicting!</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      {isUserEligible ? <section className="Setting_form">
        <Container>
          <Form>
            <div className="setting_form_inner">
              <Row className="align-items-center justify-content-center  mb-5">
                <Col xs="auto">
                  <h4 className="align-items-center justify-content-center">Register for Mega Pool</h4>

                  <div className="spe_block_left para_text py-2 px-4 text-center mt-3">
                    <Button variant="primary" onClick={checkUser} className="btn-flat mb-3 mb-xl-0 text-uppercase">
                      Register
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </Container>
      </section> : ''}
      
    </>
  );
};

export default Megapool;
