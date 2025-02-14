import { Badge, Box, Button, Card, CardContent, CardMedia, Checkbox, Dialog, Divider, FormControl, IconButton, InputLabel, keyframes, ListItemText, MenuItem, Paper, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2';
import Network from '../../Netwrok';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Endpoints from '../../constant/endpoints';
import HTMLRenderer from "react-html-renderer";
import moment from 'moment';
import Fab from '@mui/material/Fab';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SuggestedCourseDialog from './SuggestedCourseDialog';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import dayjs from 'dayjs';
import employeesss from '../../Images/employee.svg'

const zoomInOut = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const CoursesDetail = ({ courseId }) => {

    const instId = 49;
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
    const [suggestedCourseDialog, setSuggestedCourseDialog] = useState(false);
    const [suggestedCourseId, setSuggestedCourseId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0); // State to track the active index
    const [employee, setEmployee] = useState([]);

    // console.log('course', course)

    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: isMobile ? 5 : 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        beforeChange: (current, next) => setActiveIndex(next), // Update activeIndex on slide change
        customPaging: (i) => (
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: i === activeIndex ? "#ED1B23" : "#FFD700", // Change color based on active index
                    margin: "0 5px",
                    cursor: "pointer",
                }}
            />
        ),
        appendDots: (dots) => (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                }}
            >
                {dots}
            </div>
        ),
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    dots: true,
                },
            },
        ],
    };

    const getEmployee = async () => {
        try {
            const response = await Network.fetchEmployee(instId);
            setEmployee(response?.employees);

        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };
    useEffect(() => {
        getEmployee();
    }, []);

    const handleOpenSuggestedCourseDialog = (id) => {
        setSuggestedCourseDialog(true);
        setSuggestedCourseId(id)
    };

    const handleCloseSuggestedCourseDialog = () => {
        setSuggestedCourseDialog(false);
    };

    // console.log('suggestedLength', tagName, suggestedLength);

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

    const [finalCoursePricing, setFinalCoursePricing] = useState([]);
    const [finalAmountsss, setFinalAmountsss] = useState(0); // Store the final amount from child

    useEffect(() => {
        if (course) {
            setFinalCoursePricing(course?.coursePricing);
        };
    }, [])

    const handleFinalAmountUpdate = (amount) => {
        setFinalAmountsss(amount); // Update the parent state with child's final amount
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

    const getLowestFinalPrice = (coursePricing) => {
        if (!coursePricing.length) return null;

        return coursePricing.reduce((lowest, course) => {
            const finalPrice = course.price - (course.price * (course.discount / 100));
            return finalPrice < lowest ? finalPrice : lowest;
        }, Infinity);
    };

    useEffect(() => {
        getCourseById();
    }, [courseId]);

    useEffect(() => {
        getAllCourses();
    }, [coursePublic]);

    useEffect(() => {
        getAllCoursesPublic();
    }, []);

    //Combination New Code 

    const getUniqueLearningModes = () => {
        const modeSet = new Set();

        coursePricing.forEach(course => {
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
        return coursePricing.filter(course => {
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

    console.log('finalAmount', discount, taxLab, price, discountedAmount, finalPrice, taxLabAmount, finalAmount)
    console.log('filteredCourses', filteredCourses)

    return (
        <div style={{ paddingLeft: isMobile ? '6rem' : '1rem', paddingRight: isMobile ? '6rem' : '1rem', paddingTop: isMobile ? '2rem' : '1rem', paddingBottom: isMobile ? '3rem' : '1rem' }}>
            <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 4, md: 4, lg: 4 }}>
                    <Stack direction={'column'} spacing={1}>
                        <Carousel showThumbs={false} className="carousel-box">
                            <div>
                                <img src={Endpoints?.mediaBaseUrl + "/" + course?.logo} style={{ borderRadius: "8px", width: '95%' }} />
                            </div>
                            <div style={{ height: "100%" }}>
                                <video
                                    style={{ width: "95%", height: "100%", borderRadius: '10px', maxHeight: '40vh' }}
                                    src={Endpoints?.mediaBaseUrl + course?.introVideo}
                                    controls
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </Carousel>
                        <Typography
                            textAlign={'center'}
                            fontSize={'16px'}
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            gap={1}
                            width={'100%'}
                        >
                            Starting from
                            {/* {
                                finalAmount === undefined ? <>
                                    {finalAmount || 0}/-
                                </> : <> */}
                            {/* {
                                        (() => {
                                            const finalPrice = getLowestFinalPrice(course?.coursePricing);
                                            if (!finalPrice) return "Price not available";

                                            return ` ₹${finalPrice}`;
                                        })()
                                    } */}
                            {/* </>
                            } */}
                            <p>₹{(finalAmount).toFixed(2)}/-</p>
                            {/* {finalAmount || 0}/- */}
                            {/* 3500/-<s>5000/-</s>30% off */}
                        </Typography>
                        <Button
                            sx={{
                                textTransform: "none",
                                background: '#9306FF',
                                color: '#fff',
                                py: 1,
                                ":hover": {
                                    background: '#9306FF'
                                }
                            }}
                        >
                            Add to Cart
                        </Button>
                    </Stack>
                </Grid>
                <Grid item size={{ xs: 12, sm: 8, md: 8, lg: 8 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                <Stack direction={'column'} spacing={2}>
                                    <Typography
                                        fontSize={'18px'}
                                        fontWeight={'600'}
                                        textAlign={isMobile ? 'start' : 'center'}
                                    >
                                        {course?.title}
                                    </Typography>
                                    <Typography
                                        fontSize={'14px'}
                                        fontWeight={'400'}
                                        textAlign={isMobile ? 'start' : 'center'}
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
                                </Stack>
                            </Grid>
                            <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} width={'100%'}>
                                {suggestedLength.length > 0 && (
                                    <>
                                        <Stack direction={'row'} spacing={2} width={'100%'}>
                                            <Typography
                                                fontSize={'20px'}
                                                fontWeight={'600'}
                                                textAlign={isMobile ? 'start' : 'center'}
                                                width={'100%'}
                                                py={[3, 2]}
                                            >
                                                {tagName?.tag}
                                            </Typography>
                                        </Stack>
                                        <Stack direction={isMobile ? 'row' : 'column'} spacing={2} width={'100%'}>
                                            {
                                                suggestedLength.map((item, i) => {
                                                    return (
                                                        <Stack key={i} direction={isMobile ? 'row' : 'column'} spacing={2} display={'flex'}>
                                                            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Checkbox
                                                                    onChange={(event) => {
                                                                        if (event.target.checked) {
                                                                            handleOpenSuggestedCourseDialog(item.id);
                                                                        }
                                                                    }}
                                                                />
                                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <CardContent>
                                                                        <Typography component="div"
                                                                            fontSize={'14px'}
                                                                        >
                                                                            {item.title}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            fontSize={'12px'}
                                                                            component="div"
                                                                            sx={{ color: 'text.secondary' }}
                                                                        >
                                                                            {item?.shortDescription}
                                                                        </Typography>
                                                                    </CardContent>
                                                                </Box>
                                                                <CardMedia
                                                                    component="img"
                                                                    sx={{ width: 151 }}
                                                                    image={item?.logo}
                                                                    alt="Live from space album cover"
                                                                />
                                                            </Card>
                                                        </Stack>
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                    sx={{
                        borderRadius: '10px',
                        background: '#fff',
                    }}
                >
                    <Stack direction={'column'} spacing={2}>
                        <Typography
                            fontSize={'18px'}
                            fontWeight={'600'}
                            textAlign={isMobile ? 'start' : 'center'}
                            py={[0, 2]}
                        >
                            Description
                        </Typography>
                        <HTMLRenderer
                            html={course?.description}
                        />
                    </Stack>
                </Grid>
                <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                    sx={{
                        borderRadius: '10px',
                        background: '#fff',
                        py: [2, 5]
                    }}
                >
                    <Stack direction={'row'} spacing={2}>
                        <Typography
                            fontSize={'18px'}
                            fontWeight={'600'}
                            textAlign={isMobile ? 'start' : 'center'}
                            py={[0, 2]}
                        >
                            Faculty Profile
                        </Typography>
                    </Stack>
                    {
                        <Slider {...settings}>
                            {
                                employee.length > 0 && employee.map((item, index) => {

                                    const joiningDate = dayjs(item.joining); // Replace 'item.joining' with the actual key for the joining date
                                    const today = dayjs();
                                    const years = today.diff(joiningDate, "year");
                                    const months = today.diff(joiningDate, "month") % 12;
                                    const experience = `${years} Year${years > 1 ? "s" : ""} ${months} Month${months > 1 ? "s" : ""}`;

                                    return (
                                        <Box>
                                            <Stack
                                                key={index}
                                                direction={'column'}
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: isMobile ? '250px' : '250px',
                                                    margin: 'auto',
                                                }}
                                            >
                                                <img
                                                    alt=""
                                                    src={item.profile === null ? employeesss : Endpoints.mediaBaseUrl + item.profile}
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        backgroundColor: '#FFD700',
                                                        borderRadius: '15px 15px 0px 0px',
                                                        py: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        fontSize={'18px'}
                                                        fontWeight={'500'}
                                                        textAlign={'center'}
                                                        py={0.2}
                                                        color="#ED1B23"
                                                    >
                                                        {item?.firstName + ' ' + item?.lastName || 'John Doe'}
                                                    </Typography>
                                                    <Typography
                                                        fontSize={'14px'}
                                                        fontWeight={'500'}
                                                        textAlign={'center'}
                                                        py={0.2}
                                                        color="#212529"
                                                    >
                                                        {item.designation || 'English Language'}
                                                    </Typography>
                                                    <Typography
                                                        fontSize={'14px'}
                                                        fontWeight={'500'}
                                                        textAlign={'center'}
                                                        py={0.2}
                                                        color="#212529"
                                                    >
                                                        {experience || '12 Year Experience'}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )
                                })
                            }
                        </Slider>
                    }
                </Grid>
                <Grid item size={{ xs: 12, sm: 12, md: 12, lg: 12 }} py={2}>
                    <Stack direction={'row'}>
                        <Typography
                            fontSize={'18px'}
                            fontWeight={'600'}
                            textAlign={isMobile ? 'start' : 'center'}
                            py={[0, 2]}
                        >
                            Suggested Courses
                        </Typography>
                    </Stack>
                    {
                        suggestedLength.length > 0 && (
                            <>
                                {
                                    suggestedLength.map((course, i) => {
                                        const removeHtmlTags = (html) => {
                                            if (!html) return "";
                                            const doc = new DOMParser().parseFromString(html, "text/html");
                                            return doc.body.textContent || "";
                                        };
                                        return (
                                            <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                                                <Card
                                                    key={i}
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: isMobile ? '280px' : '340px',
                                                        border: '1px solid #000',
                                                        borderRadius: '15px',
                                                        boxShadow: '2px 6px 8px',
                                                        transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
                                                        ':hover': {
                                                            boxShadow: '6px 5px 8px',
                                                            transform: 'scale(1.05)',
                                                        },
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Stack spacing={1} direction="column">
                                                        {/* 🔹 Course Image */}
                                                        <Stack spacing={2} p={1}>
                                                            <img
                                                                alt={course?.title}
                                                                src={Endpoints?.mediaBaseUrl + course?.logo}
                                                                style={{
                                                                    width: '100%',
                                                                    borderRadius: '10px'
                                                                }}
                                                            />
                                                        </Stack>

                                                        {/* 🔹 Course Title */}
                                                        <Typography
                                                            textAlign={['center', 'start']}
                                                            fontSize={'15px'}
                                                            fontWeight={'700'}
                                                            p={1}
                                                        >
                                                            {course?.title}
                                                        </Typography>

                                                        <Typography
                                                            p={1}
                                                            fontSize={'12px'}
                                                            sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            {removeHtmlTags(course?.description)}
                                                        </Typography>
                                                        <Typography p={1} fontSize={'12px'}>
                                                            Starting from
                                                            {
                                                                (() => {
                                                                    const finalPrice = getLowestFinalPrice(course?.coursePricing);
                                                                    if (!finalPrice) return "Price not available";

                                                                    return ` ₹${finalPrice}`;
                                                                })()
                                                            }
                                                        </Typography>
                                                        <Stack direction="row" spacing={1} p={1} justifyContent={['center', 'start']} width={'100%'}>
                                                            <a href={`/course?courseId=${encodeURIComponent(course?.id)}`} style={{ width: '94%' }}>
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
                                        )
                                    })
                                }
                            </>
                        )
                    }
                </Grid>
            </Grid>
            {/* <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                <Fab
                    size="medium"
                    sx={{
                        color: '#fff',
                        background: '#003085',
                        ":hover": {
                            background: '#003085',
                        }
                    }}
                    aria-label="add"
                >
                    <Badge color="secondary" badgeContent={1}>
                        <ShoppingCartIcon />
                    </Badge>
                </Fab>
            </Box> */}
            <Stack direction={'row'} spacing={2}
                sx={{
                    position: 'fixed',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    top: '88%'
                }}
            >
                <Button
                    sx={{
                        position: 'relative',
                        borderRadius: `4px`,
                        fontWeight: '700',
                        background: `rgb(221, 42, 61)`,
                        color: `rgb(255, 255, 255)`,
                        boxShadow: `rgba(0, 0, 0, 0.5) 4px 3px 14px 0px`,
                        display: `flex`,
                        justifyContent: 'center',
                        gap: 1,
                        alignItems: 'baseline',
                        padding: `14px 11px`,
                        fontSize: `12px`,
                        animation: `${zoomInOut} 1.5s infinite ease-in-out`,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        boxSizing: 'border-box',
                        textDecoration: 'none',
                        ":hover": {
                            background: 'red!important'
                        },
                    }}
                >
                    Procced to checkout
                    <span
                        style={{
                            color: 'yellow',
                            fontSize: '10px',
                            textTransform: 'none'
                        }}
                    >
                        Total Price {(finalAmount).toFixed(2)}/-
                    </span>
                </Button>
            </Stack>
            <Dialog
                open={suggestedCourseDialog}
                onClose={() => setSuggestedCourseDialog(false)}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "500px",
                        },
                    },
                }}
            >
                <SuggestedCourseDialog
                    courseId={suggestedCourseId}
                    handleClose={handleCloseSuggestedCourseDialog}
                    onFinalAmountUpdate={handleFinalAmountUpdate}
                />
            </Dialog>
        </div >
    )
};

export default CoursesDetail;