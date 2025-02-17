import { Box, Button, Card, Grid, InputLabel, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import instId from "../../constant/InstituteId";
import { BASE_URL } from "../../constant/endpoints";
import axios from "axios";

const ProceedToCheckoutForm = ({ cartCourses, setProceedToCheckoutModal, course }) => {

    const [title, setTitle] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [payloadCart, setPayloadCart] = useState([]);
    const [finalAmounts, setFinalAmounts] = useState(0);

    console.log('payloadCart', payloadCart);


    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
            setNumber(value);
            setError('');
            if (value.length < 10) {
                setError('Number must be 10 digits long');
            }
        }
    };

    useEffect(() => {
        if (cartCourses?.length > 0) {
            const updatedCart = cartCourses
            const updatedTotal = updatedCart.reduce((sum, item) => {
                const discount = item.discount ?? 0;
                const taxLab = item.taxLab ?? 0;
                const price = item.price ?? 0;

                const discountedAmount = (price * discount) / 100;
                const finalPrice = price - discountedAmount;
                const taxLabAmount = (finalPrice * taxLab) / 100;
                return sum + (finalPrice + taxLabAmount);
            }, 0);
            const updatedPurchaseArray = cartCourses.map(item => ({
                "purchaseType": "course",
                "entityId": course?.id,
                "campusId": 0,
                "courseId": 0,
                "coursePricingId": item.id
            }));
            setPayloadCart(updatedPurchaseArray)
            setFinalAmounts(updatedTotal)
        } else {
            // Reset if cart is empty
            setFinalAmounts(0);
            setPurchaseArray([]);
        }
    }, [cartCourses])

    const handleSubmit = async () => {
        const body = {
            "firstName": title,
            "lastName": title,
            "contact": number,
            "email": email,
            "instId": instId,
            "campaignId": null,
            "coupon": "",
            "coursePricingId": 0,
            "entityModals": payloadCart
        }
        try {
            const response = await axios.post(BASE_URL + `/admin/payment/fetch-public-checkout-url`, body);

            if (response?.data?.status === true) {

                const width = 480;
                const height = 1080;
                const left = window.screenX + (window.outerWidth / 2) - (width / 2);
                const top = window.screenY + (window.outerHeight / 2) - (height / 2);

                window.open(
                    response?.data?.url,
                    'sharer',
                    `location=no,width=${width},height=${height},top=${top},left=${left}`
                );

                // window.open(response?.data?.url, '_blank', "noopener,noreferrer");
                // window.open(response?.data?.url, 'sharer', "location=no,width=480,height=1080");

                setTitle('');
                setNumber('');
                setEmail('')
                setPayloadCart([])
                setProceedToCheckoutModal(false)
            }

        } catch (err) {
            console.log(err);
        };
    };

    return (
        <React.Fragment>
            <Typography sx={{ mt: 3, mb: 1, py: 1 }}>
                <Card sx={{
                    width: "100%",
                    // boxShadow: "rgba(0, 0, 0, 0.11) 0px 3px 8px", 
                    textAlign: "center",
                    mb: 3
                }}>
                    <Typography padding={1} mt={3} fontWeight={'bold'} variant='h5'>
                        Please fill this details
                    </Typography>
                    <Grid container sx={{ margin: "20px 0", justifyContent: "center" }}>
                        <Grid item xs={12} sm={10} md={10} lg={10}>
                            <TextField
                                className='mobile-fill-textfield'
                                fullWidth
                                variant="outlined"
                                type="text"
                                label="Name"
                                name="name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                InputProps={{
                                    style: {
                                        borderRadius: "10px", fontSize: '14px'
                                    }
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }
                                }}
                                sx={{ gridColumn: "span 12", mb: 2 }}
                            />
                            <TextField
                                inputProps={{
                                    maxLength: 10
                                }}
                                className='mobile-fill-textfield'
                                fullWidth
                                variant="outlined"
                                type="number"
                                label="Number"
                                name="number"
                                value={number}
                                onChange={handleNumberChange}
                                error={!!error}
                                helperText={error}
                                InputProps={{
                                    style: {
                                        borderRadius: "10px", fontSize: '14px'
                                    }
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }
                                }}
                                sx={{ gridColumn: "span 12", mb: 2 }}
                            />
                            <TextField
                                className='mobile-fill-textfield'
                                fullWidth
                                variant="outlined"
                                type="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    style: {
                                        borderRadius: "10px", fontSize: '14px'
                                    }
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }
                                }}
                                sx={{ gridColumn: "span 12", mb: 2 }}
                            />
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                // margin: "16px",
                                width: "100%"
                            }}>
                                <Typography variant="h6" color={'darkblue'}><b>Total price :</b> </Typography>
                                <Typography variant="h6" fontWeight={'bold'}>
                                    &#8377; ₹{finalAmounts.toFixed(2)}
                                </Typography>
                            </Box>

                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: "200px", padding: "10px", margin: "15px", fontSize: '13px' }}
                        onClick={handleSubmit}
                        disabled={title === '' || number === '' || email === ''}
                    >
                        Pay
                    </Button>
                </Card>
            </Typography>
        </React.Fragment>
    )
};

export default ProceedToCheckoutForm;