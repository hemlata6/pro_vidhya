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
    const [selectedAccess, setSelectedAccess] = useState([]);
    // const [selectedVariant, setSelectedVariant] = useState("");
    // const [selectedValidityType, setSelectedValidityType] = useState("");
    // const [selectedDuration, setSelectedDuration] = useState(null);
    // const [selectedWatchTime, setSelectedWatchTime] = useState(null);
    const [coursePricing, setCoursePricing] = useState([]);
    const [coursePublic, setCoursesPublic] = useState([]);
    const [publicCourses, setPublicCourses] = useState([]);
    const [suggestedLength, setSuggestedLength] = useState([]);
    const [tagName, setTagName] = useState('');
    const [courseIdData, setCourseIdData] = useState({});    

    useEffect(() => {
        // ✅ Filter only active courses
        const activeCourses = publicCourses.filter(item => item.active === true);

        // ✅ Filter courses that match the tag and are active
        const filteredCourses = activeCourses.filter(item =>
            (item.tags || []).some(tag => tag.id === coursePublic?.setting?.checkoutTag) &&
            item.id !== Number(courseId)
        );

        // ✅ Filter tag names only from active courses
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


    // const formatMilliseconds = (milliseconds) => {
    //     if (selectedValidityType === "expiry") {
    //         return moment(milliseconds).format("D MMMM YYYY");
    //     } else if (selectedValidityType === "validity") {
    //         const totalDays = milliseconds / (1000 * 60 * 60 * 24);
    //         const years = Math.floor(totalDays / 365);
    //         const months = Math.floor((totalDays % 365) / 30);
    //         const days = Math.floor(totalDays % 30);

    //         return [years ? `${years} year(s)` : "", months ? `${months} month(s)` : "", days ? `${days} day(s)` : ""]
    //             .filter(Boolean)
    //             .join(" ");
    //     }
    //     return "";
    // };

    const [finalCoursePricing, setFinalCoursePricing] = useState([]);

    // useEffect(() => {
    //     if (finalAmount !== undefined) {
    //         onFinalAmountUpdate(finalAmount); // Send final price to parent
    //     }
    // }, [finalAmount]);

    // const [finalAmountsss, setFinalAmountsss] = useState(0); // Store the final amount from child

    // const discountedAmount = (finalCoursePricing[0]?.price / 100) * course?.discount;
    // const finalPrice = finalCoursePricing[0]?.price - discountedAmount;
    // const taxLabAmount = (finalPrice / 100) * course?.taxLab;
    // const finalAmount = finalPrice + taxLabAmount;

    // const filterCourses = () => {
    //     let filtered = [...coursePricing];

    //     if (selectedAccess.length > 0) {
    //         filtered = filtered.filter((course) =>
    //             selectedAccess.every((access) =>
    //                 (access === "Live Access" && course.liveAccess) ||
    //                 (access === "Quiz Access" && course.quizAccess) ||
    //                 (access === "Online / Cloude Access" && course.onlineContentAccess) ||
    //                 (access === "Offline / Pendrive Access" && course.offlineContentAccess) ||
    //                 (access === "Face To Face" && course.faceToFaceAccess)
    //             )
    //         );
    //     }

    //     if (selectedVariant) {
    //         filtered = filtered.filter((course) =>
    //             selectedVariant === "None" ? !course.variation : course.variation === selectedVariant
    //         );
    //     }

    //     if (selectedValidityType) {
    //         filtered = filtered.filter((course) => course.validityType === selectedValidityType);
    //     }

    //     if (selectedDuration) {
    //         filtered = filtered.filter((course) =>
    //             selectedValidityType === "expiry" ? course.expiry === selectedDuration : course.duration === selectedDuration
    //         );
    //     }

    //     if (selectedWatchTime) {
    //         filtered = filtered.filter((course) => course.watchTime === selectedWatchTime);
    //     }

    //     setFinalCoursePricing(filtered);

    //     const getLowestFinalPrice = (pricingList) => {
    //         if (!pricingList.length) return null;

    //         return pricingList.reduce((lowest, course) => {
    //             const finalPrice = course.price - (course.price * (course.discount / 100));
    //             return finalPrice < lowest.finalPrice
    //                 ? { finalPrice, originalPrice: course.price, discount: course.discount }
    //                 : lowest;
    //         }, { finalPrice: Infinity, originalPrice: 0, discount: 0 });
    //     };

    //     const priceDetails = getLowestFinalPrice(filtered);
    //     if (priceDetails && priceDetails.finalPrice !== Infinity) {
    //         setFinalAmountsss(priceDetails.finalPrice);
    //     } else {
    //         setFinalAmountsss(0);
    //     }

    // };

    // useEffect(() => {
    //     filterCourses();
    // }, [selectedAccess, selectedVariant, selectedValidityType, selectedDuration, selectedWatchTime]);

    const handleChangeAccess = (event) => setSelectedAccess(event.target.value);
    const handleSelectVariant = (event) => setSelectedVariant(event.target.value);
    const handleSelectValidityType = (event) => setSelectedValidityType(event.target.value);
    const handleSelectDuration = (event) => setSelectedDuration(event.target.value);
    const handleSelectWatchTime = (event) => setSelectedWatchTime(Number(event.target.value));

    const getAccessList = () => [
        ...(coursePricing?.some((c) => c.liveAccess) ? ["Live Access"] : []),
        ...(coursePricing?.some((c) => c.quizAccess) ? ["Quiz Access"] : []),
        ...(coursePricing?.some((c) => c.onlineContentAccess) ? ["Online / Cloude Access"] : []),
        ...(coursePricing?.some((c) => c.offlineContentAccess) ? ["Offline / Pendrive Access"] : []),
        ...(coursePricing?.some((c) => c.faceToFaceAccess) ? ["Face To Face"] : []),
    ];

    const getVariationList = () =>
        [...new Set(coursePricing.map((c) => c.variation || "None"))];
    const getValidityTypeList = () =>
        [...new Set(coursePricing.map((c) => c.validityType))];

    const getDurationList = () =>
        [...new Set(coursePricing.map((c) => (selectedValidityType === "expiry" ? c.expiry : c.duration)))];

    const getWatchTimeList = () => {
        const maxWatchTime = Math.max(...coursePricing.map((c) => c.watchTime || 0));
        return Array.from({ length: maxWatchTime }, (_, i) => i + 1);
    };

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

    useEffect(() => {
        getCourseById();
    }, [courseId]);

    useEffect(() => {
        // if (iFrameInstId && iFrameInstId.instId) {
        getAllCourses();
        // };
    }, [coursePublic]);

    useEffect(() => {
        getAllCoursesPublic();
    }, []);

    // useEffect(() => {
    //     if (onFinalAmountUpdate) {
    //         onFinalAmountUpdate(finalAmount);
    //     }
    // }, [finalAmount]);

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

    const [selectedLearningMode, setSelectedLearningMode] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState("");
    const [availableVariants, setAvailableVariants] = useState([]);
    const [validityTypes, setValidityTypes] = useState([]);
    const [selectedValidityType, setSelectedValidityType] = useState("");
    const [durations, setDurations] = useState([]);
    const [expiries, setExpiries] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedExpiry, setSelectedExpiry] = useState(null);
    const [watchTimes, setWatchTimes] = useState([]);
    const [selectedWatchTime, setSelectedWatchTime] = useState(null);


    const filterCoursesByLearningMode = () => {
        return coursePricing?.filter(course => {
            // Extract selected values as an array
            const selectedModes = selectedLearningMode.split(" + ");

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
    };

    const updateValidityTypes = () => {
        const uniqueValidityTypes = [...new Set(filteredCourses.map(course => course.validityType))];
        setValidityTypes(uniqueValidityTypes);

        // Auto-select if only one validity type exists
        if (uniqueValidityTypes.length === 1) {
            setSelectedValidityType(uniqueValidityTypes[0]);
        }
    };

    // Extract expiry dates & durations
    const updateExpiriesAndDurations = () => {
        if (selectedValidityType === "expiry") {
            const uniqueExpiries = [...new Set(filteredCourses.map(course => course.expiry).filter(e => e !== null))];
            setExpiries(uniqueExpiries);
        } else {
            setExpiries([]);
        }

        if (selectedValidityType === "validity") {
            const uniqueDurations = [...new Set(filteredCourses.map(course => course.duration).filter(d => d !== null))];
            setDurations(uniqueDurations);
        } else {
            setDurations([]);
        }
    };

    // Extract available watch times
    const updateWatchTimes = () => {
        const uniqueWatchTimes = [...new Set(filteredCourses.map(course => course.watchTime).filter(w => w !== null))];
        setWatchTimes(uniqueWatchTimes);
    };

    // Format milliseconds into "years, months, days"
    const formatMilliseconds = (milliseconds) => {
        const totalDays = milliseconds / (1000 * 60 * 60 * 24);
        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);
        const days = Math.floor(totalDays % 30);

        return [
            years ? `${years} year(s)` : "",
            months ? `${months} month(s)` : "",
            days ? `${days} day(s)` : ""
        ].filter(Boolean).join(" ");
    };

    // Handle changes in learning mode
    const handleLearningModeChange = (event) => {
        setSelectedLearningMode(event.target.value);
    };

    // Handle changes in validity type selection
    const handleValidityTypeChange = (event) => {
        setSelectedValidityType(event.target.value);
    };

    // Handle changes in expiry selection
    const handleExpiryChange = (event) => {
        setSelectedExpiry(event.target.value);
        setFilteredCourses(filteredCourses.filter(course => course.expiry === event.target.value));
    };

    // Handle changes in duration selection
    const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
        setFilteredCourses(filteredCourses.filter(course => course.duration === event.target.value));
        updateWatchTimes();
    };

    // Handle changes in watch time selection
    const handleWatchTimeChange = (event) => {
        setSelectedWatchTime(event.target.value);
        setFilteredCourses(filteredCourses.filter(course => course.watchTime === event.target.value));
    };

    // Update filtered courses when Learning Mode changes
    useEffect(() => {
        const newFilteredCourses = filterCoursesByLearningMode();
        setFilteredCourses(newFilteredCourses);
    }, [selectedLearningMode]);

    // Update validity types when filtered courses change
    useEffect(() => {
        updateValidityTypes();
    }, [filteredCourses]);

    // Update filtered courses when Validity Type changes
    useEffect(() => {
        setFilteredCourses(filteredCourses.filter(course => course.validityType === selectedValidityType));
        updateExpiriesAndDurations();
    }, [selectedValidityType]);

    const discount = filteredCourses[0]?.discount ?? 0;  // Ensure discount is a number
    const taxLab = course?.taxLab ?? 0;  // Ensure taxLab is a number
    const price = filteredCourses[0]?.price ?? 0;  // Ensure price is a number

    const discountedAmount = (price * discount) / 100;  // Proper calculation
    const finalPrice = price - discountedAmount;
    const taxLabAmount = (finalPrice * taxLab) / 100;
    const finalAmount = finalPrice + taxLabAmount;

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
                        <Stack direction={'row'} spacing={2} width={'100%'}>
                            <div
                                style={{
                                    width: '100%'
                                }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Lecture Mode</InputLabel>
                                    <Select
                                    label="Lecture Mode"
                                        // multiple
                                        fullWidth
                                        variant="outlined"
                                        value={selectedLearningMode}
                                        onChange={handleLearningModeChange}
                                        // renderValue={(selected) => selected.join(", ")}
                                        sx={{
                                            width: '100%',
                                            maxWidth: '430px'
                                        }}
                                    >
                                        {getUniqueLearningModes().map((mode, index) => (
                                            <MenuItem key={index} value={mode}>
                                                {mode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            {availableVariants.length > 0 && (
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Variant</InputLabel>
                                        <Select
                                            // multiple
                                            fullWidth
                                            variant="outlined"
                                            value={selectedVariant}
                                            onChange={handleVariantChange}
                                            // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                            sx={{
                                                width: '100%',
                                                maxWidth: '430px'
                                            }}
                                        >
                                            {availableVariants.map((variant, index) => (
                                                <MenuItem key={index} value={variant}>
                                                    {variant}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )}
                        </Stack>
                        <Stack direction={'row'} spacing={2} width={'100%'}>
                            {
                                validityTypes.length > 1 && (
                                    <div
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select Validity</InputLabel>
                                            <Select
                                                // multiple
                                                fullWidth
                                                variant="outlined"
                                                value={selectedValidityType}
                                                onChange={handleValidityTypeChange}
                                                // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: '430px'
                                                }}
                                            >
                                                {validityTypes.map((type, index) => (
                                                    <MenuItem key={index} value={type}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                )}
                            {/* {
                                            selectedValidityType && selectedValidityType !== "lifetime" && getDurationList().length > 0 && ( */}
                            {selectedValidityType === "expiry" && expiries.length > 0 && (
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Expiry Date</InputLabel>
                                        <Select
                                            // multiple
                                            fullWidth
                                            variant="outlined"
                                            value={selectedExpiry}
                                            onChange={handleExpiryChange}
                                            // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                            sx={{
                                                width: '100%',
                                                maxWidth: '430px'
                                            }}
                                        >
                                            {expiries.map((expiry, index) => (
                                                <MenuItem key={index} value={expiry}>
                                                    <ListItemText primary={moment(expiry).format("D MMMM YYYY")} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )}
                        </Stack>
                        <Stack direction={'row'} spacing={2} width={'100%'}>
                            {selectedValidityType === "validity" && durations.length > 0 && (
                                <div
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Validity</InputLabel>
                                        <Select
                                            // multiple
                                            fullWidth
                                            variant="outlined"
                                            value={selectedDuration}
                                            onChange={handleDurationChange}
                                            // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                            sx={{
                                                width: '100%',
                                                maxWidth: '430px'
                                            }}
                                        >
                                            {durations.map((duration, index) => (
                                                <MenuItem key={index} value={duration}>
                                                    <ListItemText primary={formatMilliseconds(duration)} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )}
                            {
                                watchTimes.length > 0 && (
                                    <div
                                        style={{
                                            width: '100%',
                                            maxWidth: '430px'
                                        }}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select View</InputLabel>
                                            <Select
                                                // multiple
                                                fullWidth
                                                variant="outlined"
                                                value={selectedWatchTime}
                                                onChange={handleWatchTimeChange}
                                                // renderValue={(selected) => selected.join(", ")} // Directly show selected values
                                                sx={{
                                                    width: '100%',
                                                    // maxWidth: '300px'
                                                }}
                                            >
                                                {watchTimes.map((watchTime, index) => (
                                                    <MenuItem key={index} value={watchTime}>
                                                        {watchTime}x
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                )}
                        </Stack>
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