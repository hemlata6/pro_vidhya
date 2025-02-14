import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import '../src/index.css'
import Network from './Netwrok';
import { useMediaQuery } from '@mui/material';
import Endpoints from './constant/endpoints';
import CALandingPage from './Pages/CALandingPage';
import CSLandingPage from './Pages/CSLaningPage';
import CLATLandingPage from './Pages/CLATLandingPage';
import IPMATLandingPage from './Pages/IPMMATLandingPage';
import ExploreMorePage from './Pages/ExploreMorePage';
import AboutSectionPage from './Pages/AboutSectionPage';
import CoursePage from './Pages/CoursePage';

function App() {

  const instId = 49;
  const isMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = useState('Aurous Academy');

  const getInstituteDetail = async () => {
    try {
      let response = await Network.fetchInstituteDetail(instId);
      Endpoints.mediaBaseUrl = response?.instituteTechSetting?.mediaUrl
      // setGalleryList(response?.institute?.gallery);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInstituteDetail();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/CA' element={<CALandingPage />} />
        <Route path='/CS' element={<CSLandingPage />} />
        <Route path='/CLAT' element={<CLATLandingPage />} />
        <Route path='/IPMAT-CUET' element={<IPMATLandingPage />} />
        <Route path='/courseDetails' element={<ExploreMorePage />} />
        <Route path='/about' element={<AboutSectionPage />} />
        <Route path='/course' element={<CoursePage />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
