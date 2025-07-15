import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import verified from "@/public/images/verified.jpg"
import useStateContext from '@/context/ContextProvider'
import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'
import { DateTime } from 'luxon'


const My_loan = ({ axios }) => {

    const { set_API_loading, toggle_drawer, get_loan_api } = useStateContext();

    const router = useRouter();

    const [loan, set_loan] = useState(null);
    const [is_loading, set_is_loading] = useState(true);

    useEffect(() => {
        if (router.isReady) {
            console.log("Hi")
            get_loan_api(axios, router.query.id, set_loan, set_is_loading);
        }
    }, [router.isReady]);


    const dummy_loader = () => {
        set_API_loading(true);
        setTimeout(() => {
            set_API_loading(false);
        }, 1000);
    }



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

    return (
        <div className='w-screen h-full bg-white flex justify-center'>
            {is_loading ?
                <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center`} >
                    <CircularProgress />
                </div>

                : !loan ?
                    <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center flex-col gap-16`} >
                        <div className='flex flex-col md:flex-row items-center' >

                            <h1 className='text-[26px] md:text-[46px] font-bold px-[15px] mr-[15px] md:px-[25px] md:mr-[25px] md:border-r-2 md:border-stone-300' >Link Expired {";("}</h1>
                            <p className='text-[13px] md:text-[16px] font-medium' >This link is expired contact the company agent</p>
                        </div>
                    </div>
                    :
                    <div className='w-full h-full xl:w-[40vw] bg-[#f0f0f0] px-[15px] py-[25px]' >

                        <div className='w-full flex justify-center items-center gap-2' >
                            <Image className='w-[22px] object-contain' src={verified} />
                            <h1 className='text-[20px] text-stone-800 text-center'>Verify IFSC repays loan on time</h1>
                        </div>

                        <div className='bg-[#536DFE] w-full flex justify-center flex-col items-center px-[10px] pt-[20px] pb-[15px] rounded-b-xl mt-2' >

                            <div className='w-full text-center'>
                                {compareDate(loan.repayment_date).status === "Due date" ?
                                    <h1
                                        className={`text-[27px] font-bold text-[#ff4963] mt-2 mb-3`}
                                    >
                                        Due date
                                    </h1>
                                    :
                                    <>
                                        <h1
                                            className={`text-[40px] font-bold
                                        ${compareDate(loan.repayment_date).status === "Remain days" ? "text-orange-400" : "text-[#ff4963]"}
                                        `}
                                        >
                                            {compareDate(loan.repayment_date).days}
                                        </h1>
                                        <h3 className='text-[18px] font-bold text-stone-900'>
                                            {compareDate(loan.repayment_date).status}
                                        </h3>
                                    </>
                                }
                            </div>

                            <div className='flex w-full text-white mt-4'>
                                <div className='text-center w-full flex flex-col items-center border-r border-white'>
                                    <p className='text-[22px]'>₹ {loan_amount_formatted(Number(loan.loan_amount))}</p>
                                    <p>Repayment amount</p>
                                </div>
                                <div className='text-center w-full flex flex-col items-center'>
                                    <p className='text-[22px]'>{loan.repayment_date}</p>
                                    <p>Repayment date</p>
                                </div>
                            </div>

                        </div>


                        <div className='bg-white px-[20px] w-full shadow-md mt-6' >
                            <div className='w-full flex justify-between py-[12px]' >
                                <p className='text-gray-400'>period</p>
                                <p className='text-stone-600 text-right'>{loan.period} days</p>
                            </div>

                            <div className='w-full flex justify-between py-[12px] border-y border-stone-100' >
                                <p className='text-gray-400'>Loan status</p>
                                <p className={`text-right lowercase
                                       ${compareDate(loan.repayment_date).status === "Remain days" ? "text-stone-600" : "text-[#ff4963]"}
                                    `}>
                                    {compareDate(loan.repayment_date).status === "Remain days" || compareDate(loan.repayment_date).status === "Due date" ?
                                        "pending payment"
                                        :
                                        compareDate(loan.repayment_date).status}
                                </p>
                            </div>

                            <div className='w-full flex justify-between py-[12px]' >
                                <p className='text-gray-400'>Name: <span className='capitalize'>{loan.customer_name.toUpperCase()}</span></p>
                                <p className='text-right'>Mobile: {loan.customer_mobile}</p>
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className='w-full flex flex-col gap-12 mt-8 px-[10px]'>
                            <div className='w-full flex flex-col gap-6'>
                                <button onClick={() => toggle_drawer("payment_drawer")} className='bg-[#536DFE] text-white text-[18px] w-full active:opacity-75 transition-all rounded-full py-[8px]' >
                                    Go To Repay
                                </button>
                                <button onClick={dummy_loader} className='bg-[#536DFE] text-white text-[18px] w-full active:opacity-75 transition-all rounded-full py-[8px]' >
                                    Apply For Deferment
                                </button>
                            </div>

                            <button onClick={dummy_loader} className='bg-[#67c23a] text-white text-[18px] w-full active:opacity-75 transition-all rounded-full py-[8px]' >
                                Upload Payment Voucher
                            </button>

                        </div>


                        {/* Notice */}
                        <h1 className='text-[#ff0000] text-[18px] font-bold mt-8 px-[10px]'>Customer Notice:</h1>

                        <p className='text-[#ff0000] text-[18px] font-medium mt-2 px-[10px]' >
                            The company stipulates that staff can only notify repayment one day in advance and should not disturb your life at other times. If you violate the regulations, please save the staff's work number information and send an email to jk5253921@gmail.com to file a complaint.
                        </p>


                    </div>

            }

        </div>
    )
}

export default My_loan