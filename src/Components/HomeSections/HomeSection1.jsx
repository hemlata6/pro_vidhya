import React from 'react'
import Grid from '@mui/material/Grid2';
import { useMediaQuery } from '@mui/material';
import CustomCarousel from '../CommanSections/CustomCarousel';

const HomeSection1 = () => {

  const isMobile = useMediaQuery("(min-width:600px)");

  return (
    <div style={{ paddingLeft: isMobile ? '0rem' : '0rem', paddingRight: isMobile ? '0rem' : '0rem', paddingTop: isMobile ? '0rem' : '0rem', paddingBottom: isMobile ? '2rem' : '0rem' }}>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ background: '#b7b2b221', py: [1, 3] }}>
          <CustomCarousel />
        </Grid>
      </Grid>
    </div>
  )
}

export default HomeSection1