import { Box, Button, Card, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
// import Grid from '@mui/material/Grid2';
import Network from '../../Netwrok';
import Endpoints from '../../constant/endpoints';
import { useLocation } from 'react-router-dom';
import instId, { auth } from '../../constant/InstituteId';
const ExploreMoreSection1 = () => {

    const isMobile = useMediaQuery("(min-width:600px)");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseName = queryParams.get("courseName");
    // const auth = 'eyJ1c2VySWQiOjEwMywidGltZXN0YW1wIjoxNzM5NDM0MTY3MzgwLCJleHBpcnkiOjE3Njk0MzQxNjczODB9';
    const [domainData, setDomainData] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [courses, setCourses] = useState([]);
    const [courseByTagName, setCourseByTagName] = useState({})

    useEffect(() => {
        getDomainList();
        getAllCourses();
    }, []);

    useEffect(() => {
        const coursesByTag = {};
        const filteredCourses = courses.filter(course =>
            course.domain?.some(domain => domain.id === selectedDomain)
        );
        filteredCourses.forEach(course => {
            if (course.tags?.length > 0) {
                course.tags.forEach(tag => {
                    if (!coursesByTag[tag.tag]) {
                        coursesByTag[tag.tag] = [];
                    }
                    coursesByTag[tag.tag].push(course);
                });
            } else {
                if (!coursesByTag["Other Courses"]) {
                    coursesByTag["Other Courses"] = [];
                }
                coursesByTag["Other Courses"].push(course);
            }
        });
        setCourseByTagName(coursesByTag)
    }, [courses, selectedDomain])

    const handleChangeDomain = (event) => {
        setSelectedDomain(event.target.value);
    };

    useEffect(() => {
        if (domainData.length > 0 && !selectedDomain) {
            setSelectedDomain(domainData[0].id);
        }
    }, [domainData]);

    const getDomainList = async () => {
        try {
            const response = await Network.fetchDomain(auth);

            const caDomain = response?.domains.find(domain => domain.name === courseName);

            if (!caDomain || !caDomain.child) {
                return;
            }

            const caSubdomains = caDomain.child;

            setDomainData(caSubdomains);
        } catch (error) {
            console.error("Error fetching domains:", error);
        }
    };

    const getAllCourses = async () => {
        try {
            const response = await Network.fetchCourses(instId);
            const domainResponse = await Network.fetchDomain(auth);

            const caDomain = domainResponse?.domains.find(d => d.name === courseName);
            if (!caDomain) {
                return;
            }

            const caSubdomains = caDomain.child;
            const caCourses = response.courses.filter(course =>
                course.domain?.some(domain => caSubdomains.some(sub => sub.id === domain.id))
            );

            setDomainData(caSubdomains);
            setCourses(caCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    return (
        <div style={{ paddingLeft: isMobile ? '6rem' : '1rem', paddingRight: isMobile ? '6rem' : '1rem', paddingTop: isMobile ? '2rem' : '1rem', paddingBottom: isMobile ? '2rem' : '1rem' }}>
            <Box sx={{ padding: '2rem' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Subdomain</InputLabel>
                            <Select
                                label="Subdomain"
                                value={selectedDomain || ""}
                                onChange={handleChangeDomain}
                                sx={{
                                    width: '100%',
                                    maxWidth: '250px'
                                }}
                            >
                                {domainData.map((domain) => (
                                    <MenuItem key={domain.id} value={domain.id}>{domain.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container spacing={2} justifyContent="center">
                        {Object.keys(courseByTagName).length > 0 ? (
                            Object.keys(courseByTagName).map((tag, index) => (
                                <Box key={index} sx={{ marginBottom: '20px', width: '100%' }}>
                                    <Typography variant="h6" fontWeight="bold" pb={2}>
                                        {tag}
                                    </Typography>
                                    <Grid container spacing={2} justifyContent="flex-start">
                                        {courseByTagName[tag].map((course, idx) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={idx} display="flex" justifyContent="center">
                                                <Card
                                                    sx={{
                                                        border: '1px solid #000',
                                                        borderRadius: '10px',
                                                        boxShadow: '2px 6px 8px',
                                                        transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
                                                        ':hover': {
                                                            boxShadow: '6px 5px 8px',
                                                            transform: 'scale(1.05)',
                                                        },
                                                        padding: '10px',
                                                        width: isMobile ? '250px' : '320px',
                                                        // height: '350px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Stack spacing={1} direction="column" width="100%">
                                                        {/* 🔹 **Course Image** */}
                                                        <img
                                                            alt={course?.title}
                                                            src={`${Endpoints.mediaBaseUrl}/${course?.logo}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '140px',
                                                                objectFit: 'cover',
                                                                borderRadius: '10px',
                                                            }}
                                                        />

                                                        <Typography
                                                            textAlign="start"
                                                            fontSize="14px"
                                                            fontWeight="700"
                                                            p={0.5}
                                                        >
                                                            {course?.title}
                                                        </Typography>

                                                        <Typography
                                                            textAlign="start"
                                                            fontSize="12px"
                                                            fontWeight="500"
                                                            p={0.5}
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {(() => {
                                                                if (!course?.description) return "";
                                                                const doc = new DOMParser().parseFromString(course?.description, "text/html");
                                                                return doc.body.textContent || "";
                                                            })()}
                                                        </Typography>

                                                        <Typography textAlign="start" fontSize="12px" fontWeight="500" p={0.5}>
                                                            {course.paid ? (
                                                                course.discount > 0 ? (
                                                                    <>
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                        >
                                                                            ₹{(Number(course.price) - (Number(course.price) * (Number(course.discount) / 100))).toFixed(2)}
                                                                        </Typography>
                                                                        &nbsp; <s>₹{course.price}</s> &nbsp;
                                                                        <Typography
                                                                            component="span"
                                                                            sx={{ color: 'red', fontWeight: 'bold' }}
                                                                        >
                                                                            -{course.discount}%
                                                                        </Typography>
                                                                    </>
                                                                ) : (
                                                                    <Typography
                                                                        component="span"
                                                                        sx={{ fontWeight: '500', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                    >
                                                                        ₹{parseFloat(course.price).toFixed(2)}
                                                                    </Typography>
                                                                )
                                                            ) : (
                                                                <Typography
                                                                    component="span"
                                                                    sx={{ fontWeight: '600', background: 'rgba(255, 215, 0, 0.6)', padding: '2px 5px', borderRadius: '4px' }}
                                                                >
                                                                    Free
                                                                </Typography>
                                                            )}
                                                        </Typography>

                                                        <Stack direction="row" spacing={1} p={[0.5, 1]} justifyContent="center">
                                                            <a href={`/course?courseId=${encodeURIComponent(course?.id)}`} style={{ width: !isMobile ? "100%" : '94%' }}>
                                                                <Button
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        borderRadius: '5px',
                                                                        background: '#ff3c00',
                                                                        ":hover": {
                                                                            background: '#ff3c00'
                                                                        },
                                                                        fontSize: '12px',
                                                                        color: '#fff',
                                                                        // px: 1,
                                                                        width: '100%'
                                                                    }}
                                                                >
                                                                    View More
                                                                </Button>
                                                            </a>
                                                        </Stack>
                                                    </Stack>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ))
                        ) : (
                            <Typography>No courses available for this subdomain.</Typography>
                        )}
                    </Grid>

                </Grid>
            </Box>
        </div>
    )
};

export default ExploreMoreSection1