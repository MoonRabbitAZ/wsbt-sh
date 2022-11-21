import React from 'react';
import { Col, Container, FormControl, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import 'aos/dist/aos.css';

import footerBg from '../../assets/images/footer-bg.png';
import logoFooter from '../../assets/images/wsb-logo.svg';

const Footer = () => {
  return (
    <>
      <footer
        className="pt-4 d-flex align-items-end"
        style={{ background: `transparent url(${footerBg}) no-repeat center 50px` }}
      >
        <Container>
          <Row className="align-items-end pb-4 pb-lg-5">
            <Col className="text-center pb-0 pb-lg-5">
              <div className="subscribe_block">
                <h2 className="block_title mb-4" data-aos="zoom-in-up" data-aos-delay="400" data-aos-once="true">
                  Subscribe for updates
                </h2>
                <div className="subscribe_form mx-auto" data-aos="zoom-in-up" data-aos-delay="500" data-aos-once="true">
                  <form action="#">
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Enter your email"
                        aria-label="Enter your email"
                        aria-describedby="basic-addon2"
                      />
                      <InputGroup.Text id="basic-addon2">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10.412 12H4.50002L2.52302 4.13505C2.51036 4.08934 2.50265 4.0424 2.50002 3.99505C2.47802 3.27405 3.27202 2.77405 3.96002 3.10405L22.5 12L3.96002 20.896C3.28002 21.223 2.49602 20.737 2.50002 20.029C2.50204 19.9658 2.51316 19.9031 2.53302 19.843L4.00002 15"
                            stroke="#D9D9D9"
                            strokeWidth={'2'}
                            strokeLinecap={'round'}
                            strokeLinejoin={'round'}
                          />
                        </svg>
                      </InputGroup.Text>
                    </InputGroup>
                  </form>
                </div>
              </div>
              <div className="mt-4 pt-3" data-aos="zoom-in-up" data-aos-once="true">
                <img src={logoFooter} className="img-fluid" alt="WSB.sh" />
              </div>
              <div className="mt-4 pt-2 mb-1 footer_link_block" data-aos="zoom-in-up" data-aos-once="true">
                <ul className="d-flex justify-content-center p-o list-unstyled">
                  <li className="px-4">
                    <a href="https://t.me/wsbsh" target="blank" className="footer_link px-xl-4">
                      Telegram
                    </a>
                  </li>
                  {/* <li className="px-4">
                    <Link to="#" target="blank" className="footer_link px-xl-4">
                      Medium
                    </Link>
                  </li> */}
                  <li className="px-4">
                    <a href="https://twitter.com/wsb_sh/" target="blank" className="footer_link px-xl-4">
                      Twitter
                    </a>
                  </li>
                  <li className="px-4">
                    <a href="https://www.coingecko.com/en/coins/wsb-sh" target="blank" className="footer_link px-xl-4">
                      CoinGecko
                    </a>
                  </li>
                  <li className="px-4">
                    <a href="https://app.uniswap.org/#/swap?chain=polygon&outputCurrency=0x7f4e04aa61b9a46403c1634e91bf31df3bc554cf" target="blank" className="footer_link px-xl-4">
                      Uniswap
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
