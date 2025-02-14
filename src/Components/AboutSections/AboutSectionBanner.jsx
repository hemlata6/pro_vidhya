import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Endpoints from '../../constant/endpoints';
import Network from '../../Netwrok';

const AboutSectionBanner = () => {

    const isMobile = useMediaQuery("(min-width:600px)");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [banners, setBanners] = useState([]);
    const instId = 49;

    const getBanners = async () => {
        try {
            const response = await Network.fetchBannerss(instId);
            const fetchedBanners = response.banners || [];
            let reusltBanner = [];
            fetchedBanners.forEach((item) => {
                // console.log('item', item)
                if (item?.group === 'About us Top Banner') {
                    reusltBanner.push(item);
                };
            })
            // setBanners(reusltBanner || []);
            if (reusltBanner.length > 0) {
                const extendedBanners = [...reusltBanner, reusltBanner[0]];
                setBanners(extendedBanners);
            } else {
                setBanners([]);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            setBanners([]);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === banners.length - 2 ? 0 : prevIndex + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [banners]);

    useEffect(() => {
        if (currentIndex === banners.length - 2) {
            setBanners([...banners]);
        }
    }, [currentIndex])

    return (
        <React.Fragment>
            <div style={{ paddingLeft: isMobile ? '0rem' : '0rem', paddingRight: isMobile ? '0rem' : '0rem', paddingTop: isMobile ? '2rem' : '1rem', paddingBottom: isMobile ? '2rem' : '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', overflow: 'hidden' }}>
                    <Box
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        {isMobile ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    transition: 'transform 0.5s ease',
                                    transform: `translateX(${-currentIndex * 100}%)`,
                                    width: `60%`,
                                }}
                            >
                                {banners.map((img, index) => {
                                    const isCenterImage = index === currentIndex;
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                flex: '0 0 100%',
                                                padding: '5px',
                                                boxSizing: 'border-box',
                                                textAlign: 'center',
                                                transform: isCenterImage ? 'scale(1.2, 1)' : 'scale(1, 1.3)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <img
                                                src={Endpoints?.mediaBaseUrl + img?.banner}
                                                alt={`slide-${index}`}
                                                style={{
                                                    width: isCenterImage ? '1000px' : '700px', // Increase sizes
                                                    height: isCenterImage ? '350px' : '200px', // Adjust for desired height
                                                    borderRadius: '10px',
                                                    transition: 'transform 0.3s ease',
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    transition: 'transform 0.5s ease',
                                    transform: `translateX(${-currentIndex * 100}%)`,
                                    width: `100%`,
                                }}
                            >
                                {banners.map((img, index) => {
                                    const isCenterImage = index === currentIndex;
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                flex: '0 0 100%',
                                                padding: '5px',
                                                boxSizing: 'border-box',
                                                textAlign: 'center',
                                                transform: isCenterImage ? 'scale(1, 1)' : 'scale(1, 1)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <img
                                                src={Endpoints?.mediaBaseUrl + img?.banner}
                                                alt={`slide-${index}`}
                                                style={{
                                                    width: '100%', // Set to full width
                                                    maxWidth: isCenterImage ? '1000px' : '750px', // Larger width for centered image
                                                    height: isCenterImage ? '200px' : '200px', // Increase height as well
                                                    borderRadius: '10px',
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '5px' }}>
                    {banners.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: index === currentIndex ? 'primary.main' : 'grey.500',
                                mx: 0.5,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </Box>
            </div>
        </React.Fragment>

    );
};

export default AboutSectionBanner;
