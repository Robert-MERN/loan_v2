import React from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';



const Delete_loan_modal = ({
    axios,
    toggle_modal,
    modals_state,
    delete_loan_api,
    loan_id,
    set_API_loading,
}) => {


    const handle_delete = () => {
        delete_loan_api(axios, loan_id, set_API_loading)
    };

    return (
        <Dialog
            open={modals_state.delete_loan_modal}
            onClose={() => toggle_modal("delete_loan_modal")}
        >
            <div className='w-full md:w-[500px]' >
                <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[8px] bg-slate-50' >
                    <p className='text-[15px] md:text-[18px] font-medium text-stone-700 '>
                        Delete Loan
                    </p>
                    <IconButton onClick={() => toggle_modal("delete_loan_modal")}>
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-500 font-medium border-b border-stone-300 p-[20px]' >
                    Are you sure do you want to delete this loan?
                </p>
                <div className='w-full flex justify-end gap-3 p-[20px] ' >
                    <button onClick={() => toggle_modal("delete_loan_modal")} className='bg-slate-200 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-stone-700 text-[12px] font-medium md:text-[15px] transition-all' >Cancel</button>
                    <button onClick={handle_delete} className='bg-red-600 hover:opacity-85 active:opacity-60 px-[14px] py-[6px] md:py-[8px] rounded text-white text-[12px] font-medium md:text-[15px] transition-all' >Delete</button>
                </div>

            </div>
        </Dialog>
    )
}

export default Delete_loan_modal