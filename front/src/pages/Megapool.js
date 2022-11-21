import React, { useContext, useEffect, useState } from 'react'
import HeaderInner from '../component/Layout/HeaderInner'
import { Col, Container, Row, Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { checkUserStatus } from '../action/bundle.action';
import { Web3Context } from "../web3/contexts/web3Context";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { poolMethods } from "../web3/functions/factory"

const Megapool = () => {

    const [getContractInstance, setContractInstance] = useState();

    const dispatch = useDispatch()

    const { isUserEligible } = useSelector(state => state.bundleReducer)

    const { networkDetails, handleConnect, resetApp } = useContext(Web3Context);

    const checkUser = async () => {
        await dispatch(checkUserStatus(networkDetails.address))

        //if (isUserEligible) {
            await poolMethods.registerforMegapool(getContractInstance, networkDetails.address)
        // } else {
        //     return toast.error("You're not eligible to register the Megapool")
        // }
    }

    useEffect(() => {
        (async () => {
            const instance = await poolMethods.getInstance(networkDetails.web3);
            if (instance) {
                setContractInstance(instance);
            }
        })();
    }, [networkDetails.web3]);

    /* useEffect(async () => {
        if (isUserEligible === false) {
            return toast.error("You're not eligible to register the Megapool")
        }

        if (getContractInstance && isUserEligible) {
            await poolMethods.registerforMegapool(getContractInstance, networkDetails.address)
        }
    }, [isUserEligible, getContractInstance]) */


    return (
        <>
            <HeaderInner />
            <div className="hall_of_fame">
                <div className="top_block">
                    <Container>
                        <Row className="align-items-stretch text-center text-md-start">
                            <Col>
                                <h2 className="section_title mb-0">Mega Pool</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <section className="Setting_form">
                <Container>
                    <Form>
                        <div className="setting_form_inner">
                            <Row className="align-items-center justify-content-center  mb-5">

                                <Col xs="auto">
                                    <h4 className="align-items-center justify-content-center">Register for Mega Pool</h4>

                                    <div className='spe_block_left para_text py-2 px-4 text-center mt-3'>
                                        <Button variant="primary" onClick={checkUser} className="btn-flat mb-3 mb-xl-0 text-uppercase">Register</Button>
                                    </div>
                                </Col>

                                {/*  <Col xs="auto">
                                    <Button
                                        type="button"
                                        className="mb-2"
                                    //onClick={handleSubmit(onFloorHandleClick)}
                                    >
                                        Claim
                                    </Button>
                                </Col> */}

                            </Row>
                        </div>
                    </Form>
                </Container>
            </section>
        </>
    )
}

export default Megapool