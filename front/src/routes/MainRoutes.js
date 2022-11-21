import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from '../component/Layout/Footer'
// import Header from '../component/Layout/Header'
import HomePage from '../pages/HomePage'
import BundleDetails from '../pages/BundleDetails'
import PickBundle from '../pages/PickBundle'
import BundleAssets from '../pages/BundleAssets'
import HallOfFame from '../pages/HallOfFame'
import Megapool from '../pages/Megapool'
import { GlobalContext } from '../context/globalContext'

const MainRoutes = () => {

  const { isLoggedIn } = useContext(GlobalContext)

  return (
    <>
      <Routes>
        <Route path="/" element={<BundleDetails />} />
        <Route path="/bundledetails" element={<BundleDetails />} />
        {/* <Route path="/pickbundle" element={<PickBundle />} /> */}
        <Route path="/bundleassets/:type" element={<BundleAssets />} />
        <Route path="/halloffame" element={<HallOfFame />} />
        <Route path="/megapool" element={<Megapool />} />
      </Routes>
      <Footer />
    </>
  )
}

export default MainRoutes;
