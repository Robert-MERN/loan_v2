import React, { useEffect } from 'react'
import Navbar from './utilities/Navbar'
import useStateContext from '@/context/ContextProvider'
import { useState } from 'react'
import Link from 'next/link'
import clipboardCopy from 'clipboard-copy';
import { CircularProgress, IconButton } from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTime } from 'luxon'
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { useRouter } from 'next/router'


const Settings = ({ app_settings, device_info, axios }) => {
    const {
        loan_id,
        set_loan_id,
        toggle_modal,
        set_snackbar_alert,
        set_API_loading,
        get_all_loans_api,
        update_payment_info_api,
        get_payment_info_api,
        all_loans,
        values, set_values,
        set_all_loans,

    } = useStateContext();

    const router = useRouter();

    const [customize, set_customize] = useState("loan_customization");

    const [is_loading, set_is_loading] = useState(true);




    function compareDate(dateStr) {
        const inputDate = DateTime.fromFormat(dateStr, "yyyy-MM-dd", { zone: "Asia/Kolkata" });
        const todayIST = DateTime.now().setZone("Asia/Kolkata").startOf("day");

        const diffDays = inputDate.startOf("day").diff(todayIST, "days").days + 1;

        if (diffDays === 0) return { status: "Due date", days: diffDays };
        if (diffDays > 0) return { status: "Remain days", days: diffDays };
        return { status: "Overdue", days: Math.abs(diffDays) };
    }


    const loan_amount_formatted = (amount) => {
        if (typeof amount === "number") {
            return (amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        };
        return amount
    };


    // Payment information Settings

    const handle_change = (e) => {
        const { name, value } = e.target;
        set_values(prev => ({ ...prev, [name]: value }));
    };



    // Retreiving Data
    useEffect(() => {

        if (customize === "loan_customization") {
            get_all_loans_api(axios, set_all_loans, set_is_loading);
        } else {
            get_payment_info_api(axios, set_values, set_is_loading);
        };

    }, [customize]);


    const copyToClipboard = (text) => {
        clipboardCopy(text)
            .then(() => {
                set_snackbar_alert({
                    open: true,
                    message: `Copied`,
                    severity: "success"
                })

            })
            .catch((err) => {
                set_snackbar_alert({
                    open: true,
                    message: "Failed to copy",
                    severity: "primary"
                });
            });
    };




    return (
        <div className='w-screen min-h-screen relative bg-stone-100 flex justify-center' >
            <Navbar app_settings={app_settings} back_btn={true} disable_headset={true} admin={true} />

            <form className='w-full lg:w-[600px] lg:rounded-lg flex flex-col gap-6 px-[30px] mt-[52px] py-[30px]' >

                <div className='w-full flex justify-between mb-5' >


                    <button
                        type='button'
                        onClick={() => set_customize("loan_customization")}
                        className={`w-full active:opacity-60 py-[9px] rounded-s-md border-r border-gray-300 text-[12px] md:text-[15px] transition-all font-semibold ${customize === "loan_customization" ? "bg-[#536DFE] hover:opacity-70 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        Loans
                    </button>
                    <button
                        type="button"
                        onClick={() => set_customize("app_customization")}
                        className={`w-full active:opacity-60 py-[9px] rounded-e-md text-[12px] md:text-[15px] transition-all font-semibold ${customize === "app_customization" ? "bg-[#536DFE] hover:opacity-70 text-white" : "bg-stone-400 hover:bg-stone-500 text-white"}`}
                    >
                        App Settings
                    </button>



                </div>

                {customize === "app_customization" ?
                    <>

                        <div className='w-full flex flex-col gap-1' >
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">App Name</label>
                            < input
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                placeholder='Name'
                                type="text"
                                name="app_name"
                                value={values.app_name || ""}
                                onChange={handle_change}
                            />
                        </div>

                        <div className='w-full flex flex-col gap-1'>
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">UPI ID</label>
                            < input
                                placeholder='ID'
                                type="text"
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                name="upi_id"
                                value={values.upi_id || ""}
                                onChange={handle_change}
                            />
                        </div>

                        <div className='w-full flex flex-col gap-1'>
                            <label className='text-[13px] font-bold text-stone-700' htmlFor="">QR Scanner Link</label>
                            < input
                                placeholder='upi://pay?'
                                type="text"
                                className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                                name="qr_scanner"
                                value={values.qr_scanner || ""}
                                onChange={handle_change}
                            />
                        </div>

                    </>

                    :

                    <>

                        <h1 className='text-[16px] font-bold text-stone-700' htmlFor="">All loans</h1>

                        <div>

                            {is_loading ?
                                <div className='w-full flex justify-center items-center'>
                                    <CircularProgress />
                                </div>
                                :
                                <>
                                    {all_loans.length ?



                                        <div className='w-full flex flex-col gap-4' >

                                            {/* Loan */}
                                            {all_loans.map((each, index) => (
                                                < div
                                                    key={index} className='text-[14px] font-medium text-stone-700 bg-stone-50 px-[16px] py-[10px] rounded-md border border-stone-200 shadow-md w-full'

                                                >
                                                    <div className='flex justify-between items-center' >
                                                        <div className='flex flex-col text-[14px] text-stone-400 font-medium gap-1' >
                                                            <p>ID: <span className='text-stone-600 cursor-pointer active:opacity-70 select-none' >{each._id}</span>
                                                                <span className='ml-1'>
                                                                    <IconButton onClick={() => copyToClipboard(`https://wallet328.online/my-loan/${each._id}`)}>
                                                                        <CopyAllIcon className='text-[16px] text-stone-700' />
                                                                    </IconButton>
                                                                </span>
                                                            </p>
                                                            <p>Name: <span className='text-stone-600' >{each.customer_name}</span></p>
                                                            <p>Mobile: <span className='text-stone-600 underline' >{each.customer_mobile}</span></p>
                                                            <p>Amount:
                                                                <span className='text-stone-600' >
                                                                    ₹ {loan_amount_formatted((Number(each.loan_amount)))}
                                                                </span>
                                                            </p>
                                                            <p>Status: <span className='text-stone-600' >
                                                                {`${compareDate(each.repayment_date).status} ${compareDate(each.repayment_date).days || ""}`}
                                                            </span></p>
                                                            <p>Repayment: <span className='text-stone-600' >{each.repayment_date}</span></p>

                                                        </div>



                                                        <div className='flex items-center gap-1 flex-col' >
                                                            <Link target='_blank' href={`/my-loan/${each._id}`}>
                                                                <IconButton >
                                                                    <LaunchIcon />
                                                                </IconButton>
                                                            </Link>

                                                            <IconButton className='text-blue-500' onClick={() => { set_loan_id(each._id); toggle_modal("edit_loan_modal") }}>
                                                                <EditIcon />
                                                            </IconButton>

                                                            <IconButton className='text-red-500' onClick={() => { set_loan_id(each._id); toggle_modal("delete_loan_modal") }}>
                                                                <DeleteIcon className='' />
                                                            </IconButton>



                                                        </div>

                                                    </div>
                                                </div>
                                            ))}
                                            {/* Loan end */}

                                        </div>
                                        :
                                        <div className='w-full flex justify-center items-center'>
                                            <p className='text-[16px] text-stone-400' >No loans</p>
                                        </div>
                                    }
                                </>
                            }
                        </div>


                    </>
                }



                {customize === "app_customization" ?
                    <div className='w-full mt-4'>
                        <button type='button' onClick={() => update_payment_info_api(axios, values, set_values, set_API_loading)} className='bg-blue-500 text-[13px] text-white px-[10px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all w-full' >Update</button>
                    </div>
                    :
                    <>
                        <div className='w-full flex justify-end gap-10 mt-4'>
                            <button type='button' onClick={() => toggle_modal("add_loan_modal")} className='bg-blue-500 text-[13px] text-white px-[30px] py-[10px] rounded-lg font-medium active:opacity-60 transition-all' >Add New Loan</button>
                        </div>
                    </>
                }

            </form>
        </div >
    )
}

export default Settings