import React, { useEffect, useRef } from 'react'
import Endpoints from '../constant/endpoints'
import { Box, Button, IconButton, useMediaQuery } from '@mui/material'
import Network from '../Netwrok'
import NavBarTwo from '../Components/CommanSections/NavBarTwo'
import HomeSection1 from '../Components/HomeSections/HomeSection1'
import HomeSection2 from '../Components/HomeSections/HomeSection2'
import Footer from '../Components/CommanSections/Footer';
import HomeSection3 from '../Components/HomeSections/HomeSection3'
import HomeSection4 from '../Components/HomeSections/HomeSection4'
import HomeSection5 from '../Components/HomeSections/HomeSection5'
import HomeSection6 from '../Components/HomeSections/HomeSection6'
import HomeSection7 from '../Components/HomeSections/HomeSection7'
import MenuBar from '../Components/CommanSections/MenuBar'
import CoursesDetail from '../Components/CommanSections/CoursesDetail'
import { useLocation } from 'react-router-dom'

const CoursePage = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId");
    const downloadAppRef = useRef(null);

    useEffect(() => {
        if (window.location.hash === "#downloadOurApp") {
            downloadAppRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div id='homePageCss'>
            <div>
                <NavBarTwo downloadAppRef={downloadAppRef} />
                <CoursesDetail courseId={courseId} />
                {/* <MenuBar /> */}
                {/* <HomeSection1 />
                <HomeSection2 /> */}
                {/* <HomeSection3 /> */}
                {/* <HomeSection7 />
                <HomeSection6 /> */}
                <div ref={downloadAppRef}>
                    <HomeSection4 />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default CoursePage