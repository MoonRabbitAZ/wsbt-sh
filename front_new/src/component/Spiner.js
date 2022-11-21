import React from 'react';
import { Spinner } from 'react-bootstrap';

export const Spiner = () => {
  return (
    <>
      <div className="loader">
        <Spinner animation="border" variant="orange" className="text-orange" />
      </div>
    </>
  );
};
