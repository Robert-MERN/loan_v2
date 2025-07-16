import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QrCanvas from './utilities/QrCanvas';
import Image from 'next/image';
import scan from "@/public/images/scan.png";
import direct from "@/public/images/direct.png";
import clipboardCopy from 'clipboard-copy';
import useStateContext from '@/context/ContextProvider';
import { CircularProgress, FormHelperText } from '@mui/material';
import { useRouter } from 'next/router';


const Repayment_tab = ({ axios }) => {

    const { set_snackbar_alert, set_API_loading, get_loan_api, get_payment_info_api } = useStateContext();

    const [loan, set_loan] = useState(null);
    const [payment_info, set_payment_info] = useState(null);
    const [is_loading, set_is_loading] = useState(true);

    const router = useRouter();



    useEffect(() => {
        if (router.isReady) {
            get_loan_api(axios, router.query.id, set_loan, set_is_loading);
            get_payment_info_api(axios, set_payment_info, set_is_loading);
        }

    }, [router.isReady])

    const [expanded, setExpanded] = useState('panel1');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };


    // 10:00 minutes timer
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer); // Clean up the timer when the component unmounts
    }, []);

    // Format time into MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };


    // Copy to Clipboard function
    const [copied, setCopied] = useState({
        upi: false,
        amount: false,
    });

    const copyToClipboard = (text, param) => {
        clipboardCopy(text)
            .then(() => {
                setCopied(prev => ({ ...prev, [param]: true }));
                setTimeout(() => setCopied(prev => ({ ...prev, [param]: false })), 1000);
            })
            .catch((err) => {
                console.error("Failed to Copy");
            });
    };


    // Sumbit UTR Function

    const [value, set_value] = useState({
        utr: "",
        errors: { utr: "" }
    });

    const handle_utr_change = (event) => {
        const { name, value } = event.target;
        set_value((prev_state) => ({
            ...prev_state,
            [name]: value.trim(),
        }));
    }
    const validate_form = (field_name, value) => {
        let error = '';

        const utr_regex = /^\d{12}$/
        switch (field_name) {
            case 'utr':
                if (!value) {
                    error = 'Please enter your 12-digit UTR';
                } else if (!utr_regex.test(value)) {
                    error = 'Invalid UTR';
                }
                break;
            default:
                break;
        }
        return error;
    }

    const dummy_loader = () => {
        set_API_loading(true);
        setTimeout(() => {
            set_API_loading(false);
            set_snackbar_alert({
                open: true,
                message: `UTR Submitted successfully`,
                severity: "success"
            });
            set_value({
                utr: "",
                errors: { utr: "" }
            })
        }, 2000);

    }

    const handle_submit = () => {
        const errors = {};
        Object.keys(value).forEach((field_name) => {
            const error = validate_form(field_name, value[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });
        set_value((prev_state) => ({
            ...prev_state,
            errors,
        }));
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            dummy_loader();
        }
    }

    return (
        <>


            {is_loading ?
                <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center`} >
                    <CircularProgress />
                </div>

                : !loan || !payment_info ?
                    <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center flex-col gap-16`} >
                        <div className='flex flex-col md:flex-row items-center' >

                            <h1 className='text-[26px] md:text-[46px] font-bold px-[15px] mr-[15px] md:px-[25px] md:mr-[25px] md:border-r-2 md:border-stone-300' >Link Expired {";("}</h1>
                            <p className='text-[13px] md:text-[16px] font-medium' >This link is expired contact the company agent</p>
                        </div>
                    </div>

                    :

                    < div className='w-full h-full bg-[#f5f5f5] pb-8'>

                        <div className='w-full bg-[#3b82f6] px-[15px] pt-[20px] pb-[60px] relative shadow-md' >
                            <p className='text-[20px] text-white'>Payment Amount</p>
                            <p ></p>

                            <div className='w-full flex justify-between items-center mt-3' >
                                <p className='text-[23px] text-white font-semibold'> ₹ {loan.loan_amount}.00</p>
                                <p className='text-white text-[15px]' >{formatTime(timeLeft)}</p>
                            </div>

                            <div className='absolute w-full px-[15px] right-0 left-0 md:-bottom-3 -bottom-6' >
                                <div className='bg-white px-[10px] py-[10px] rounded-lg shadow-md' >
                                    <p className='text-stone-900 text-[15px] font-medium'>Please choose one of the following methods to make payment</p>
                                </div>
                            </div>

                        </div>

                        <div className='w-full my-9 md:my-6 px-[15px]'>
                            {/* QR Scanner */}
                            <Accordion
                                expanded={expanded === 'panel1'}
                                onChange={handleChange('panel1')}
                                elevation={0}
                                sx={{
                                    border: 'none',
                                    '&:before': { display: 'none' },
                                }}
                                className="shadow-none p-0"
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    className='px-[15px] '
                                >
                                    <div className='flex gap-2 items-center' >
                                        <Image src={scan} className='w-[30px] object-contain' />
                                        <p className='text-[14px] font-semibold text- text-[#3b82f6]'>Scan QRCode</p>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails className='px-[10px] border-t border-stone-200'>
                                    <div className='w-full text-center flex justify-center items-center flex-col'>

                                        <p className='text-[15px] mt-2'>Use Mobile Scan code to pay</p>
                                        <p className='text-[24px] font-bold text-red-500 mb-2'>₹ {loan.loan_amount}.00</p>
                                        <QrCanvas text={`${payment_info.qr_scanner}&am=${loan.loan_amount}.00&cu=INR`} />

                                        <p className='mt-1 text-stone-400 text-[15px] font-medium'>Do not use the same QR code to pay multiple times</p>
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            {/* Direct UPI */}
                            <Accordion
                                expanded={expanded === 'panel2'}
                                onChange={handleChange('panel2')}
                                elevation={0}
                                sx={{
                                    border: 'none',
                                    borderTop: '1px solid #D1D5DB',
                                    '&:before': { display: 'none' },
                                }}
                                className="shadow-none p-0"
                            >


                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                    className='px-[15px] '
                                >
                                    <div className='flex gap-2 items-center' >
                                        <Image src={direct} className='w-[30px] object-contain' />
                                        <p className='text-[14px] font-semibold text- text-[#3b82f6]'>Direct Transfer</p>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails className='px-[10px] border-t border-stone-200'>
                                    <div className='w-full bg-[#F1F7FF] py-[12px] px-[15px] rounded-t-xl mt-2' >
                                        <span className='text-[#3b82f6]'>Step 1: </span>
                                        {"Transfer "}
                                        <span className='text-[#ff0000] whitespace-nowrap'>₹ {loan.loan_amount}.00</span>
                                        {" to the following upi "}
                                    </div>

                                    <div className='w-full py-[14px] px-[15px] border-b border-stone-300 flex justify-between items-center' >
                                        <p className='text-[15px] text-stone-800'>{payment_info.upi_id}</p>
                                        <button onClick={() => copyToClipboard(payment_info.upi_id, "upi")} className='px-[8px] py-[8px] active:opacity-70 text-white bg-[#3b82f6] text-[13px] transition-all'>{copied.upi ? "Copied" : "Copy"}</button>
                                    </div>

                                    <div className='w-full py-[14px] px-[15px] border-b border-stone-300 flex justify-between items-center shadow-md' >
                                        <p className='text-[15px] text-stone-800'>{loan.loan_amount}.00</p>
                                        <button onClick={() => copyToClipboard(`${loan.loan_amount}.00`, "amount")} className='px-[8px] py-[8px] active:opacity-70 text-white bg-[#3b82f6] text-[13px] transition-all'>{copied.amount ? "Copied" : "Copy"}</button>
                                    </div>



                                    <div className='w-full bg-[#F1F7FF] py-[12px] px-[15px] rounded-t-xl mt-8' >
                                        <span className='text-[#3b82f6]'>Step 1: </span>
                                        {" Submit Ref  No/Reference No/UTR "}
                                    </div>

                                    <div className='w-full flex items-center py-[14px] mt-2 px-[10px]' >
                                        <input
                                            placeholder='UTR(UPI Ref.ID)'
                                            type="text"
                                            className='w-full outline-none caret-slate-500 text-[14px] px-[10px]'
                                            value={value.utr}
                                            name="utr"
                                            onChange={handle_utr_change}
                                        />
                                        <button onClick={handle_submit} className='px-[8px] py-[8px] active:opacity-70 text-white bg-[#3b82f6] text-[13px] transition-all whitespace-nowrap'>Sumbit Utr</button>
                                    </div>

                                    {value.errors.utr && <FormHelperText className="px-[20px]" error>{value.errors.utr}</FormHelperText>}


                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div >
            }
        </>

    );
};

export default Repayment_tab;
