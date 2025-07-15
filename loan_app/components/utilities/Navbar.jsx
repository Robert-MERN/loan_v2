import React, { useState, useEffect } from 'react'
import useStateContext from '@/context/ContextProvider';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/router';



const Navbar = ({ back_btn, disable_headset, admin, app_settings }) => {
    const { toggle_modal, set_API_loading } = useStateContext();
    const router = useRouter();


    return (
        <div className='fixed left-0 top-0 right-0 bg-[#536DFE] z-50' >
            <div className={`p-[15px] w-screen h-[52px]`} >
                <nav className='w-full flex justify-between items-center relative' >


                    <ArrowBackIosNewIcon className='text-white active:opacity-60 transition-all cursor-pointer' />


                    <button className='font-bold text-[15px] text-white text-center select-none capitalize' >
                        Admin
                    </button>


                    <button onClick={() => toggle_modal("logout_modal")} className='font-bold text-[15px] text-white text-center select-none capitalize flex items-center gap-2' >
                        Logout
                        <LogoutIcon className='text-[20px]'/>
                    </button>



                </nav>
            </div>
        </div >

    )
}

export default Navbar