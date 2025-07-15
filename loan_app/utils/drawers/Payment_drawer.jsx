import React, { useState } from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useStateContext from '@/context/ContextProvider';
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/router';

const Payment_drawer = ({ drawer_state, toggle_drawer, axios }) => {

    const {

    } = useStateContext()

    const router = useRouter();

    const open_payment_tab = (id) => {
        router.push(`/repayment-tab/${id}`)
        toggle_drawer("payment_drawer")
    }


    return (
        <>
            <SwipeableDrawer
                open={drawer_state.payment_drawer}
                onClose={() => toggle_drawer("payment_drawer")}
                onOpen={() => toggle_drawer("payment_drawer")}
                anchor='bottom'
            >
                <div className='w-full transition-all duration-300 pb-[15px] bg-[#f0f0f0]'>
                    <div className='py-[13px] bg-white border-b border-stone-400'>
                        <p className='text-center'>Please select</p>
                    </div>

                    <div className='w-full px-[20px]'>

                        <button onClick={() => open_payment_tab(router.query.id)} className='w-full flex justify-between items-center py-[13px] border-b border-stone-400 cursor-pointer active:bg-stone-100 select-none transition-all'>
                            <p className='text-[16px] font-semibold text-stone-800'>Payment Method - 1</p>
                            <CheckIcon className='text-stone-400 text-[22px]' />
                        </button>

                        <button onClick={() => open_payment_tab(router.query.id)} className='w-full flex justify-between items-center py-[13px] border-b border-stone-400 cursor-pointer active:bg-stone-100 select-none transition-all'>
                            <p className='text-[16px] font-semibold text-stone-800'>Payment Method - 2</p>
                            <CheckIcon className='text-stone-400 text-[22px]' />
                        </button>

                        <button onClick={() => open_payment_tab(router.query.id)} className='w-full flex justify-between items-center py-[13px] border-b border-stone-400 cursor-pointer active:bg-stone-100 select-none transition-all'>
                            <p className='text-[16px] font-semibold text-stone-800'>Payment Method - 3</p>
                            <CheckIcon className='text-stone-400 text-[22px]' />
                        </button>
                    </div>

                </div >
            </SwipeableDrawer >
        </>
    )
}

export default Payment_drawer