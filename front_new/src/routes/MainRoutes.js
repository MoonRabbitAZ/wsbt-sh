import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from '../component/Layout/Footer';
import BundleDetails from '../pages/BundleDetails/BundleDetails';
import BundleAssets from '../pages/BundleAssets';
import HallOfFame from '../pages/HallOfFame';
// import Megapool from '../pages/Megapool';

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<BundleDetails />} />
        <Route path="/bundledetails" element={<BundleDetails />} />
        <Route path="/bundleassets/:type" element={<BundleAssets />} />
        <Route path="/halloffame" element={<HallOfFame />} />
        {/* <Route path="/megapool" element={<Megapool />} /> */}
      </Routes>
      <Footer />
    </>
  );
};

export default MainRoutes;
