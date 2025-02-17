import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import React from 'react'
// import Grid from '@mui/material/Grid2';
import logo from '../../Images/PROVIDHYA_LOGO-01.jpg';
import telegram from '../../Images/telegram.svg';
import facebook from '../../Images/facebook.svg';
import insta from '../../Images/insta.svg';
import youtube from '../../Images/youtube.svg';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const isMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();

    const handlePrivacyPolicy = () =>{
        navigate("/Privacy-policy")
    }

    const handleTermsAndConditions = () =>{
        navigate("/terms-conditions")
    }

    return (
        <div style={{ paddingLeft: isMobile ? '0rem' : '0rem', paddingRight: isMobile ? '0rem' : '0rem', paddingTop: '0rem', paddingBottom: '0rem' }}>
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ background: '#19499D', py: [2, 4] }}>
                    <Box sx={{ flexGrow: 1, pl: !isMobile ?  "2rem" : '6rem', pr: !isMobile ?  "2rem" : '6rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                                <img
                                    alt=''
                                    src={logo}
                                    style={{
                                        width: '60%'
                                    }}
                                />
                                <Typography
                                    fontSize={'16px'}
                                    color='#fff'
                                    fontWeight={500}
                                >
                                    विद्या धनं सर्वधन प्रधानम्
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2}>
                                <Stack direction={'column'}>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#B5B4B4'
                                        fontWeight={500}
                                        mb={2}
                                    >
                                        Useful Links
                                    </Typography>
                                </Stack>
                                <Stack direction={'column'} spacing={1}>
                                    <a href='/' style={{ textDecoration: 'none' }}>
                                        <Typography
                                            fontSize={'16px'}
                                            color='#fff'
                                            fontWeight={500}
                                            sx={{
                                                cursor: 'pointer',
                                                ":hover": {
                                                    color: '#E0822D'
                                                }
                                            }}
                                        >
                                            Home
                                        </Typography>
                                    </a>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#fff'
                                        fontWeight={500}
                                        sx={{
                                            cursor: 'pointer',
                                            ":hover": {
                                                color: '#E0822D'
                                            }
                                        }}
                                    >
                                        Course
                                    </Typography>
                                    <a href='/about' style={{ textDecoration: 'none' }}>
                                        <Typography
                                            fontSize={'16px'}
                                            color='#fff'
                                            fontWeight={500}
                                            sx={{
                                                ":hover": {
                                                    color: '#E0822D'
                                                }
                                            }}
                                        >
                                            About Us
                                        </Typography>
                                    </a>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#fff'
                                        fontWeight={500}
                                        sx={{
                                            cursor: 'pointer',
                                            ":hover": {
                                                color: '#E0822D'
                                            }
                                        }}
                                    >
                                        Contact Us
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                                <Stack direction={'column'}>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#B5B4B4'
                                        fontWeight={500}
                                        mb={2}
                                    >
                                        Important Links
                                    </Typography>
                                </Stack>
                                <Stack direction={'column'} spacing={1}>
                                    <Typography
                                    onClick={handlePrivacyPolicy}
                                        fontSize={'16px'}
                                        color='#fff'
                                        fontWeight={500}
                                        sx={{
                                            cursor: 'pointer',
                                            ":hover": {
                                                color: '#E0822D'
                                            }
                                        }}
                                    >
                                        Privacy Policy
                                    </Typography>
                                    <Typography
                                    onClick={handleTermsAndConditions}
                                        fontSize={'16px'}
                                        color='#fff'
                                        fontWeight={500}
                                        sx={{
                                            cursor: 'pointer',
                                            ":hover": {
                                                color: '#E0822D'
                                            }
                                        }}
                                    >
                                        Terms & conditions
                                    </Typography>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#fff'
                                        fontWeight={500}
                                        sx={{
                                            cursor: 'pointer',
                                            ":hover": {
                                                color: '#E0822D'
                                            }
                                        }}
                                    >
                                        Refund & Return Policy
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2}>
                                <Stack direction={'column'}>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#B5B4B4'
                                        fontWeight={500}
                                        mb={2}
                                    >
                                        Contact Us
                                    </Typography>
                                </Stack>
                                <Stack direction={'column'} spacing={1}>
                                    <Typography
                                        fontSize={'16px'}
                                        color='#fff'
                                        fontWeight={500}
                                    >
                                        605, 6th Floor, Atulya IT Park
                                        Opp. Indian Coffee house, Indore
                                        452014
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isMobile ?'flex-end' : "left",
                                    alignItems: 'center'
                                }}
                            >
                                <Stack direction={'column'} spacing={2}>
                                    <Stack direction={'column'} spacing={2}>
                                        <Typography
                                            color='#fff'
                                            fontWeight={'500'}
                                            fontSize={'16px'}
                                            textAlign={isMobile ? 'center' : 'start'}
                                        >
                                            +91-8269051592
                                        </Typography>
                                        <Typography
                                            color='#fff'
                                            fontWeight={'500'}
                                            fontSize={'16px'}
                                            textAlign={isMobile ? 'center' : 'start'}
                                        >
                                            care@classiolabs.com
                                        </Typography>
                                    </Stack>
                                    <Stack direction={'row'} spacing={4}>
                                        <img
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            alt=''
                                            src={telegram}
                                        />
                                        <img
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            alt=''
                                            src={facebook}
                                        />
                                        <img
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            alt=''
                                            src={insta}
                                        />
                                        <img
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            alt=''
                                            src={youtube}
                                        />
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ background: '#002B77', p: isMobile ? '1.5rem' : '0.5rem' }}>
                    <Typography
                        textAlign={'center'}
                        fontSize={isMobile ? '1rem' : '0.8rem'}
                        fontWeight={500}
                        color='#B5B4B4'
                    >
                        2025 ProVidhya Education Services. All Rights Reserved | Tech Partner :
                        <a href='https://www.classiolabs.com/' style={{ textDecoration: 'none' }} target='_blank'>
                            <span style={{ color: '#B5B4B4', marginLeft: '5px' }}>CLASSIO LABS</span>
                        </a>
                    </Typography>
                </Grid>
            </Grid>
        </div >
    )
}

export default Footer