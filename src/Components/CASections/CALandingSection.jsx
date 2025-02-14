import { Box, Card, Divider, Paper, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2';

const CALandingSection = () => {

    const isMobile = useMediaQuery("(min-width:600px)");

    return (
        <div style={{ paddingLeft: isMobile ? '6rem' : '1rem', paddingRight: isMobile ? '6rem' : '1rem', paddingTop: isMobile ? '2rem' : '1rem', paddingBottom: isMobile ? '2rem' : '1rem' }}>
            CA Landing
        </div>
    )
}

export default CALandingSection