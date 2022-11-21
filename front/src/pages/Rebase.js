import React, { useEffect, useRef, useState, useContext } from "react";
import { Col, Container, Row, Button, Form, InputGroup, FormControl } from "react-bootstrap";
//import * as Loader from "react-loader-spinner";
//import {Web3Context} from '../../web3/contexts/web3Context'
//import { poolMethods } from '../../web3/functions/factory'
//import { ToastContainer, toast } from 'react-toastify';
//import {getAllTrack, addTrack} from '../../action/api'
/* import moment from 'moment'; */
import { Controller, useForm } from 'react-hook-form'
import HeaderInner from "../component/Layout/HeaderInner";

const Rebase = () => {
    /*   const { networkDetails, handleConnect, loading, setLoading } = useContext(Web3Context)
      const [show, setShow] = useState({ floor: false, market: false })
      const [disable, setDisable] = useState(false)
      const [state, setState] = useState()
      const [priceTarget, setPriceTarget] = useState(0)
      const [getAllTrackData, setGetAllTrackData] = useState()
      const [initialData, setIntialData] = useState({})
      const [values, setValues] = useState({
          floorPrice: '',
          marketPrice: '',
      })
      const {
          handleSubmit,
          formState: { errors, isDirty },
          control,
          getValues,
          setValue,
          reset,
      } = useForm({})
  
      const connectWallet = () => {
          handleConnect()
      }
      const onRenderFirstContract = async () => {
          setLoading(true)
          const firstInstance = await poolMethods.getFirstInstance(networkDetails.web3);
          if (firstInstance) {
              try {
                  const totalSupply = await poolMethods.getTotalSupply(firstInstance, networkDetails.address);
                  setState(totalSupply)
                  setLoading(false)
              } catch (error) {
                  setLoading(false)
                  console.log('error', error)
              }
          }
      }
  
      const onRenderSecondContract = async () => {
          setLoading(true)
          const secondInstance = await poolMethods.getSecondInstance(networkDetails.web3)
          if (secondInstance) {
              try {
                  const getData = await poolMethods.getDataSecond(secondInstance, networkDetails.address)
                  setPriceTarget(getData)
                  setLoading(false)
              } catch (error) {
                  setLoading(false)
                  console.log('error2', error)
              }
          }
      }
  
      const onFloorHandleClick = async () => {
          if (!values.floorPrice) {
              setShow({ ...show, floor: true })
          } else if (values.floorPrice) {
              setLoading(true)
              if (networkDetails && networkDetails.address) {
                  const secondContract = await poolMethods.getSecondInstance(networkDetails.web3)
                  if (secondContract) {
                      try {
                          const data = await poolMethods.pushReportSecond(secondContract, networkDetails.address, values.floorPrice)
                          console.log('data', data)
                          const addData = await addTrack(initialData)
                          // console.log('addData', addData)
                          if (addData.status == 200) {
                              setLoading(false)
                              setValues({
                                  floorPrice: '',
                                  marketPrice: '',
                              })
                          }
                          setLoading(false)
                      } catch (error) {
                          setLoading(false)
                          console.log('error2', error)
                      }
                  }
              } else {
                  toast.error('Please Connect wallet')
              }
          }
      }
  
      const onMarketHandleClick = async () => {
          if (!values.marketPrice) {
              setShow({ ...show, market: true })
          } else if (values.marketPrice) {
              setLoading(true)
              if (networkDetails && networkDetails.address) {
                  const thirdContract = await poolMethods.getThirdInstance(networkDetails.web3)
                  if (thirdContract) {
                      try {
                          const data = await poolMethods.pushReportThird(thirdContract, networkDetails.address, values.marketPrice)
                          // console.log('market', data)
                          const addData = await addTrack(initialData)
                          // console.log('addData', addData)
                          if (addData.status == 200) {
                              setLoading(false)
                              setValues({
                                  floorPrice: '',
                                  marketPrice: '',
                              })
                          }
                          setLoading(false)
                      } catch (error) {
                          setLoading(false)
                          console.log('error3', error)
                      }
                  }
              } else {
                  toast.error('Please Connect wallet')
              }
          }
      }
  
      const onRebaceHandleClick = async () => {
          setLoading(true)
          if (values.floorPrice && values.marketPrice) {
              if (networkDetails && networkDetails.address) {
                  const forthContract = await poolMethods.getForthInstance(networkDetails.web3)
                  if (forthContract) {
                      try {
                          const data = await poolMethods.rebaceForth(forthContract, networkDetails.address)
                          // console.log('forth', data)
                          setLoading(false)
                          const addData = await addTrack(initialData)
                          // console.log('addData', addData)
                          if (addData.status == 200) {
                              setLoading(false)
                              setValues({
                                  floorPrice: '',
                                  marketPrice: '',
                              })
                          }
                      } catch (error) {
                          setLoading(false)
                          console.log('Error4', error)
                      }
                  }
              } else {
                  toast.error('please connect wallet')
              }
          }
  
      }
  
      useEffect(async () => {
          if (networkDetails && networkDetails.address) {
              setLoading(true)
              const fifthContract = await poolMethods.getFifthInstance(networkDetails.web3)
              if (fifthContract) {
                  try {
                      const data = await poolMethods.getInRebaseWindow(fifthContract, networkDetails.address)
                      console.log('data', data)
                      setDisable(data)
                      setLoading(false)
                  } catch (error) {
                      setLoading(false)
                      console.log('error5', error)
                  }
              }
          }
      }, [networkDetails])
  
      useEffect(() => {
          if (networkDetails && networkDetails.address) {
              onRenderFirstContract()
              onRenderSecondContract()
          }
      }, [networkDetails])
  
      useEffect(async () => {
          setLoading(true)
          const getATrack = await getAllTrack()
          if (getATrack?.data?.responseData?.length > 0) {
              setGetAllTrackData(getATrack.data.responseData)
              setLoading(false)
          }
      }, [])
  
      useEffect(() => {
          const obj = {};
          if (priceTarget) {
              obj.price_history = { priceTarget: priceTarget };
          }
  
          if (state) {
              obj.supply_history = { TotalSupply: state }
          }
  
          if (values.floorPrice || getAllTrackData && getAllTrackData[0]?.florePrice) {
              obj.florePrice = values.floorPrice || getAllTrackData[0]?.florePrice
          }
  
          if (values.marketPrice || getAllTrackData && getAllTrackData[0]?.marketPrice) {
              obj.marketPrice = values.marketPrice || getAllTrackData[0]?.marketPrice
          }
          if (getAllTrackData?.length > 0) {
              obj._id = getAllTrackData[0]._id
          }
          setIntialData(obj)
      }, [getAllTrackData, values, priceTarget, state])
  
      useEffect(() => {
          if (getAllTrackData && getAllTrackData.length > 0) {
              if (getAllTrackData[0].florePrice || getAllTrackData[0].marketPrice) {
                  reset({
                      florePrice: getAllTrackData[0].florePrice ? getAllTrackData[0].florePrice : '',
                      marketPrice: getAllTrackData[0].marketPrice ? getAllTrackData[0].marketPrice : '',
                  })
                  setValues({
                      ...values,
                      floorPrice: getAllTrackData[0].florePrice ? getAllTrackData[0].florePrice : '',
                      marketPrice: getAllTrackData[0].marketPrice ? getAllTrackData[0].marketPrice : ''
                  })
              }
          }
      }, [getAllTrackData]) */


    const {
        handleSubmit,
        formState: { errors, isDirty },
        control,
        getValues,
        setValue,
        reset,
    } = useForm({})

    return (
        <>
            {/* {loading && (
                <div className="cust_loader">
                    <Loader.TailSpin
                        type="Rings"
                        color="#8DFF26"
                        height={100}
                        width={100}

                    />
                </div>
            )} */}
            <HeaderInner />
            <div className="hall_of_fame">
                <div className="top_block">
                    <Container>
                        <Row className="align-items-stretch text-center text-md-start">
                            <Col>
                                {/* <p className="para_text font_secondary text-white mb-1 d-flex align-items-center">
                                    <LeftArrowSmall className="me-2" />
                                    TRACK Token</p> */}
                                <h2 className="section_title mb-0">TRACK Token</h2>
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
                                <Form.Label column lg={2} className="fs-xl-20px fs-md-14px text-white fw-300">
                                    Set Floor Price
                                </Form.Label>
                                <Col xs="auto">
                                    <Controller
                                        name="florePrice"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    placeholder="Text"
                                                    className="form-control"
                                                // onChange={e => {
                                                //     onChange(e)
                                                //     setValues({ ...values, floorPrice: e.target.value })
                                                //     if (!e.target.value) {
                                                //         setShow({ ...show, floor: true })
                                                //     } else { setShow({ ...show, floor: false }) }
                                                // }}
                                                />
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        type="button"
                                        className="mb-2"
                                    //onClick={handleSubmit(onFloorHandleClick)}
                                    >
                                        Submit
                                    </Button>
                                </Col>
                                {/*   {!values.floorPrice && show.floor == true ? <span style={{ color: 'red', textAlign: 'center' }}>Floor Price is requred.</span> : ''} */}

                            </Row>
                            <Row className="align-items-center justify-content-center">
                                <Form.Label column lg={2} className="fs-xl-20px fs-md-14px text-white fw-300">
                                    Set Market Price
                                </Form.Label>
                                <Col xs="auto">
                                    <Controller
                                        name="marketPrice"
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <>
                                                <input
                                                    type="text"
                                                    value={value}
                                                    placeholder="Text"
                                                    className="form-control"
                                                // onChange={e => {
                                                //     onChange(e)
                                                //     setValues({ ...values, marketPrice: e.target.value })
                                                //     if (!e.target.value) {
                                                //         setShow({ ...show, floor: true })
                                                //     } else { setShow({ ...show, floor: false }) }
                                                // }}
                                                />
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        type="button"
                                        className="mb-2"
                                    //onClick={onMarketHandleClick}
                                    >
                                        Submit
                                    </Button>
                                </Col>
                                {/* {!values.marketPrice && show.market == true ? <span style={{ color: 'red', textAlign: 'center' }}>Market Price is requred.</span> : ''} */}
                                {/* <Col xs="auto">
                  <Button type="submit" className="mb-2">
                    Text
                  </Button>
                </Col> */}
                            </Row>
                            <div className="text-center  mt-5">
                                <Button
                                    type="button"
                                    className="mb-2 text-center"
                                // onClick={onRebaceHandleClick}
                                // disabled={!disable}
                                >
                                    Rebase
                                </Button>
                            </div>
                        </div>

                    </Form>

                </Container>
            </section>
        </>
    );
};
export default Rebase;