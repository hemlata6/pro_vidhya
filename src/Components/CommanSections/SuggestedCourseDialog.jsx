import { Badge, Box, Button, Card, CardContent, CardMedia, Checkbox, Divider, FormControl, Grid, IconButton, InputLabel, ListItemText, MenuItem, Paper, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
// import Grid from '@mui/material/Grid2';
import Network from '../../Netwrok';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Endpoints from '../../constant/endpoints';
import HTMLRenderer from "react-html-renderer";
import moment from 'moment';
import Fab from '@mui/material/Fab';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CancelIcon from '@mui/icons-material/Cancel';
import instId from '../../constant/InstituteId';

const SuggestedCourseDialog = ({ courseId, handleClose, onFinalAmountUpdate }) => {

    // const courseId = 527;
    const theme = useTheme();
    const isMobile = useMediaQuery("(min-width:600px)");
    const [course, setCourse] = useState(null);
    const [coursePricing, setCoursePricing] = useState([]);
    const [coursePublic, setCoursesPublic] = useState([]);
    const [publicCourses, setPublicCourses] = useState([]);
    const [suggestedLength, setSuggestedLength] = useState([]);
    const [tagName, setTagName] = useState('');
    const [courseIdData, setCourseIdData] = useState({});
    const [finalCoursePricing, setFinalCoursePricing] = useState([]);
    const [selectedAccess, setSelectedAccess] = useState('');
    const [selectedVariant, setSelectedVariant] = useState("");
    const [selectedValidityType, setSelectedValidityType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedWatchTime, setSelectedWatchTime] = useState(null);
    const [variationsList, setVariationsList] = useState([]);
    const [validityTypeList, settValidityTypeList] = useState([]);
    const [validityDateList, setValidityDateList] = useState([]);
    const [watchTimeList, setWatchTimeList] = useState([]);

    const discount = finalCoursePricing[0]?.discount ?? 0;
    const taxLab = course?.taxLab ?? 0;
    const price = finalCoursePricing[0]?.price ?? 0;

    const discountedAmount = (price * discount) / 100;
    const finalPrice = price - discountedAmount;
    const taxLabAmount = (finalPrice * taxLab) / 100;
    const finalAmount = finalPrice + taxLabAmount;

    console.log('coursePricing', coursePricing);
    

    useEffect(() => {
        if (variationsList.length === 1) {
            setSelectedVariant(variationsList[0]);
        }
        if (validityTypeList.length === 1) {
            setSelectedValidityType(validityTypeList[0]);
        }
        if (validityDateList.length === 1) {
            setSelectedDuration(validityDateList[0]);
        }
        if (watchTimeList.length === 1) {
            setSelectedWatchTime(watchTimeList[0] === "Unlimited" ? "Unlimited" : Number(watchTimeList[0]));
        }
    }, [variationsList, validityTypeList, validityDateList, watchTimeList]);

    useEffect(() => {
        const uniqueModes = getUniqueLearningModes();
        if (uniqueModes.length === 1) {
            setSelectedAccess(uniqueModes[0]);
        }
    }, [coursePricing]);

    useEffect(() => {
        filterCourses();
    }, [selectedAccess, selectedVariant, selectedValidityType, selectedDuration, selectedWatchTime]);

    useEffect(() => {
        getCourseById();
    }, [courseId]);

    useEffect(() => {
        getAllCourses();
    }, [coursePublic]);

    useEffect(() => {
        getAllCoursesPublic();
    }, []);

    useEffect(() => {
        const activeCourses = publicCourses.filter(item => item.active === true);

        const filteredCourses = activeCourses.filter(item =>
            (item.tags || []).some(tag => tag.id === coursePublic?.setting?.checkoutTag) &&
            item.id !== Number(courseId)
        );

        const tagNames = activeCourses.filter(item =>
            (item?.tags || []).some(tag => tag?.id === coursePublic?.setting?.checkoutTag)
        );

        function findTagById(dataArray, id) {
            let matchedTag = null;
            dataArray.forEach(item => {
                if (item?.tags && Array.isArray(item?.tags)) {
                    const tag = item?.tags.find(tag => tag.id === id);
                    if (tag) {
                        matchedTag = tag;
                        return;
                    }
                }
            });
            return matchedTag;
        }

        const matchedTag = findTagById(tagNames, coursePublic?.setting?.checkoutTag);
        setTagName(matchedTag);
        setSuggestedLength(filteredCourses);

        if (activeCourses.length > 0) {
            const selectedCourse = activeCourses.find(item => courseId === item.id);
            if (selectedCourse) {
                setCourseIdData(selectedCourse);
            }
        }
    }, [publicCourses, courseId, coursePublic]);

    const getCourseById = async () => {
        if (!courseId) return;
        try {
            let response = await Network.fetchCourseById(courseId);
            setCourse(response?.course || null);
            let coursePricing = response?.course?.coursePricing;
            setCoursePricing(coursePricing);
        } catch (error) {
            console.error("Error fetching course:", error);
        };
    };

    const getAllCoursesPublic = async () => {
        try {
            const response = await Network.getBuyCourseDetailsSecond(Number(courseId));
            setCoursesPublic(response.course);
            // getInstituteDetail(response.course?.instId);
        } catch (error) {
            console.log(error);
        };
    };

    const getAllCourses = async () => {
        try {
            const response = await Network.fetchCourses(instId);
            setPublicCourses(response.courses);
        } catch (error) {
            console.log(error);
        };
    };


    const getUniqueLearningModes = () => {
        const modeSet = new Set();

        coursePricing?.forEach(course => {
            let modes = [];
            if (course.liveAccess) modes.push("Live Access");
            if (course.onlineContentAccess) modes.push("Recorded");
            if (course.offlineContentAccess) modes.push("Pendrive");
            if (course.faceToFaceAccess) modes.push("Face to Face");
            if (course.quizAccess) modes.push("Quiz Access");
            if (modes.length) {
                modeSet.add(modes.join(" + "));
            }
        });

        return Array.from(modeSet);
    };

    const filterCourses = () => {
        let filtered = [...coursePricing];
        // console.log('filteredfiltered', filtered);
        if (selectedAccess) {

            filtered = coursePricing?.filter(course => {
                // Extract selected values as an array
                const selectedModes = selectedAccess.split(" + ");

                // Check if the course matches selected modes exactly
                const matchesSelection = (
                    (selectedModes.includes("Live Access") ? course.liveAccess === true : course.liveAccess === null) &&
                    (selectedModes.includes("Recorded") ? course.onlineContentAccess === true : course.onlineContentAccess === null) &&
                    (selectedModes.includes("Pendrive") ? course.offlineContentAccess === true : course.offlineContentAccess === null) &&
                    (selectedModes.includes("Quiz Access") ? course.quizAccess === true : course.quizAccess === null) &&
                    (selectedModes.includes("Face to Face") ? course.faceToFaceAccess === true : course.faceToFaceAccess === null)
                );

                return matchesSelection;
            });
            // console.log('111111111', filtered);
        };

        const variationsList = newgetVariationList(filtered);
        setVariationsList(variationsList)

        if (selectedVariant) {
            filtered = filtered?.filter((course) =>
                selectedVariant === "None"
                    ? !course.variation || course.variation.trim() === ""
                    : course.variation === selectedVariant
            );
            // console.log('22222222', filtered);
        }

        const validityTypes = [...new Set(filtered.map(course => course.validityType))];
        settValidityTypeList(validityTypes);


        if (selectedValidityType) {
            filtered = filtered?.filter(course => course.validityType === selectedValidityType);
            // console.log('3333333333', filtered);
        }

        const validityDates = [
            ...new Set(
                filtered.map(course =>
                    selectedValidityType === "validity"
                        ? formatMilliseconds(course.duration)
                        : formatTimestamp(course.expiry)
                )
            )
        ];
        setValidityDateList(validityDates);

        if (selectedDuration) {
            filtered = filtered?.filter(course =>
                selectedValidityType === "validity"
                    ? formatMilliseconds(course.duration) === selectedDuration
                    : formatTimestamp(course.expiry) === selectedDuration
            );
            // console.log('4444444444', filtered);
        }

        const watchTimeList = filtered?.map(course =>
            course.watchTime ? course.watchTime : "Unlimited"
        );
        setWatchTimeList([...new Set(watchTimeList)]);

        if (selectedWatchTime !== null && selectedWatchTime !== undefined) {

            filtered = filtered?.filter(course =>
                selectedWatchTime === "Unlimited"
                    ? course.watchTime === null || course.watchTime === undefined || course.watchTime === ""
                    : Number(course.watchTime) === Number(selectedWatchTime)
            );
            // console.log('Filtered List:', filtered);
        }

        setFinalCoursePricing(filtered);
    };

    const newgetVariationList = (filtered) => {
        const variationsSet = new Set();

        filtered?.forEach((course) => {
            if (course.variation && course.variation.trim() !== "") {
                variationsSet.add(course.variation);
            }
        });

        if (filtered?.some((course) => !course.variation || course.variation === null || course.variation.trim() === "")) {
            variationsSet.add("None");
        }

        return Array.from(variationsSet);
    };

    const formatMilliseconds = (ms) => {
        if (!ms) return "N/A";

        const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((ms % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((ms % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));

        return `${years}y ${months}m ${days}d`;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "N/A";

        return new Date(timestamp).toLocaleDateString();
    };

    const handleChangeAccess = (event) => { setSelectedAccess(event.target.value); }
    const handleSelectVariant = (event) => setSelectedVariant(event.target.value);
    const handleSelectValidityType = (event) => setSelectedValidityType(event.target.value);
    const handleSelectDuration = (event) => setSelectedDuration(event.target.value);

    return (
        <form
            style={{
                padding: '1rem'
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Stack direction={'row'} spacing={2} width={isMobile ? '95%' : '92%'} position={'absolute'} display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                        <CancelIcon
                            onClick={handleClose}
                            sx={{
                                cursor: 'pointer',
                            }}
                        />
                    </Stack>
                    <Stack direction={'column'} spacing={2}>
                        <Typography
                            fontSize={'18px'}
                            fontWeight={'600'}
                            textAlign={'start'}
                        >
                            {course?.title}
                        </Typography>
                        <Typography
                            fontSize={'14px'}
                            fontWeight={'400'}
                            textAlign={'start'}
                        >
                            {course?.shortDescription === null ? 'Short Description' : course?.shortDescription}
                        </Typography>
                        <Grid container sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ paddingRight: "10px" }}>
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel id="demo-simple-select-label">Lecture Mode</InputLabel>
                                        <Select
                                            // multiple
                                            label="Lecture Mode"
                                            fullWidth
                                            variant="outlined"
                                            value={selectedAccess}
                                            onChange={handleChangeAccess}
                                        // renderValue={(selected) => selected.join(", ")}
                                        // sx={{
                                        //     width: '100%',
                                        //     maxWidth: '430px'
                                        // }}
                                        >
                                            {getUniqueLearningModes()?.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    <ListItemText primary={option} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                {variationsList?.length === 1 && variationsList[0] === "None" ? "" :
                                    <>
                                        {selectedAccess && (
                                            <div
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <FormControl fullWidth sx={{ mb: 2 }}>
                                                    <InputLabel id="demo-simple-select-label">Variant</InputLabel>
                                                    <Select
                                                        label="Variant"
                                                        // multiple
                                                        fullWidth
                                                        variant="outlined"
                                                        value={selectedVariant}
                                                        onChange={handleSelectVariant}
                                                    // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                                    // sx={{
                                                    //     width: '100%',
                                                    //     maxWidth: '300px'
                                                    // }}
                                                    >
                                                        {variationsList.map((variant) => (
                                                            <MenuItem key={variant} value={variant}>
                                                                <ListItemText primary={variant} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )}
                                    </>
                                }
                                {
                                    validityTypeList?.length === 1 && validityTypeList[0] !== "lifetime" ? "" :
                                        <>
                                            {
                                                selectedAccess && (
                                                    <div
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                                            <InputLabel id="demo-simple-select-label">Validity Types</InputLabel>

                                                            <Select
                                                                label="Validity Types"
                                                                // multiple
                                                                fullWidth
                                                                variant="outlined"
                                                                value={selectedValidityType}
                                                                onChange={handleSelectValidityType}
                                                            // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                                            // sx={{
                                                            //     width: '100%',
                                                            //     maxWidth: '300px'
                                                            // }}
                                                            >
                                                                {validityTypeList?.map((type) => (
                                                                    <MenuItem key={type} value={type}>
                                                                        <ListItemText primary={type} />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                )}
                                        </>
                                }
                                {
                                    selectedValidityType &&
                                    selectedValidityType !== "lifetime" &&
                                    (
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <FormControl fullWidth sx={{ mb: 2 }}>
                                                <InputLabel id="demo-simple-select-label">{selectedValidityType ? selectedValidityType : "Validity"} Date</InputLabel>
                                                <p style={{ margin: 0 }}></p>
                                                <Select
                                                    label={selectedValidityType ? `${selectedValidityType} Date` : "Validity Date"}
                                                    // multiple
                                                    fullWidth
                                                    variant="outlined"
                                                    value={selectedDuration}
                                                    onChange={handleSelectDuration}
                                                // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                                // sx={{
                                                //     width: '100%',
                                                //     maxWidth: '300px'
                                                // }}
                                                >
                                                    {validityDateList?.map((duration) => (
                                                        <MenuItem key={duration} value={duration}>
                                                            <ListItemText primary={duration} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )
                                }
                                {
                                    selectedValidityType && (
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                        >
                                            <FormControl fullWidth sx={{ mb: 2 }}>
                                                <InputLabel id="demo-simple-select-label">Watch Time</InputLabel>
                                                <Select
                                                    label="Watch Time"
                                                    // multiple
                                                    fullWidth
                                                    variant="outlined"
                                                    value={selectedWatchTime}
                                                    onChange={handleSelectWatchTime}
                                                // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                                // sx={{
                                                //     width: '100%',
                                                //     maxWidth: '430px'
                                                // }}
                                                >
                                                    {watchTimeList?.map((watchTime) => {
                                                        return <MenuItem key={watchTime} value={watchTime ? watchTime : "Unlimited"}>
                                                            <ListItemText primary={watchTime !== "Unlimited" ? `${watchTime}x` : watchTime} />
                                                        </MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </div>
                                    )
                                }
                            </Grid>

                        </Grid>
                        <Stack direction={'row'} spacing={2} width={'100%'}>
                            <Button
                                onClick={handleClose}
                                sx={{
                                    textTransform: "none",
                                    background: '#9306FF',
                                    color: '#fff',
                                    py: 1,
                                    ":hover": {
                                        background: '#9306FF'
                                    },
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                Add to Cart
                                <p>₹{finalAmount}/-</p>
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    )
}

export default SuggestedCourseDialog