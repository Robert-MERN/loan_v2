import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, IconButton } from '@mui/material';



const Edit_loan_modal = ({
    axios,
    modals_state,
    toggle_modal,
    values_2, set_values_2, default_state_2,
    update_loan_api,
    loan_id,
    set_API_loading,
    get_loan_api,
}) => {



    function convertDateFormat(dateStr) {
        // Input: YYYY-MM-DD
        const [year, month, day] = dateStr.split("-");
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const handle_change = (e) => {
        const { name, value } = e.target;
        if (name === "repayment_date") {
            set_values_2(prev => ({ ...prev, [name]: convertDateFormat(value) }));
        } else {
            set_values_2(prev => ({ ...prev, [name]: value }));
        }
    }


    const validate_form = (field_name, value) => {
        let error = '';
        switch (field_name) {
            case 'customer_name':
                if (!value) {
                    error = 'Please enter a customer name';
                }
                break;
            case 'customer_mobile':
                if (!value) {
                    error = 'Please enter a customer mobile';
                }
                break;
            case 'loan_amount':
                if (!value) {
                    error = 'Please enter a loan amount';
                }
                break;
            case 'repayment_date':
                if (!value) {
                    error = 'Please enter a repayment date';
                }
                break;
            case 'period':
                if (!value) {
                    error = 'Please enter a period';
                }
                break;
            default:
                break;
        }
        return error;
    }


    const handle_submit = (e) => {
        e.preventDefault();
        const errors = {};
        Object.keys(values_2).forEach((field_name) => {
            const error = validate_form(field_name, values_2[field_name]);
            if (error) {
                errors[field_name] = error;
            }
        });
        set_values_2((prev_state) => ({
            ...prev_state,
            errors,
        }));
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            const { errors, ...other } = values_2;
            update_loan_api(axios, other, loan_id, set_API_loading);
        }
    }

    const [is_loading, set_is_loading] = useState(true);


    useEffect(() => {
        if (loan_id && modals_state.edit_loan_modal) {
            get_loan_api(axios, loan_id, set_values_2, set_is_loading);
        }
        if (!modals_state.edit_loan_modal) {
            set_values_2(default_state_2);
        }
    }, [modals_state.edit_loan_modal]);

    return (
        <Dialog
            open={modals_state.edit_loan_modal}
            onClose={() => toggle_modal("edit_loan_modal")}
            className=''
        >
            <div className='w-full flex justify-between items-center pl-[20px] pr-[15px] py-[4px] bg-slate-50'>
                <p className='text-[15px] font-semibold text-stone-700 '>
                    Edit Loan
                </p>
                <IconButton onClick={() => toggle_modal("edit_loan_modal")}>
                    <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                </IconButton>
            </div>

            {is_loading ?
                <div className='w-full h-full flex justify-center items-center' >
                    <CircularProgress color="inherit" />
                </div>
                :
                <form onSubmit={handle_submit} className='w-full md:w-[500px] px-[20px] pt-[20px] pb-[30px] flex flex-col gap-4' >


                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Name</label>
                        < input
                            placeholder='Customer Name'
                            type="text"
                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                            name="customer_name"
                            value={values_2.customer_name}
                            onChange={handle_change}
                        />
                        {values_2.errors.customer_name && <FormHelperText error>{values_2.errors.customer_name}</FormHelperText>}
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Mobile</label>
                        < input
                            placeholder='Customer Mobile'
                            type="text"
                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                            name="customer_mobile"
                            value={values_2.customer_mobile}
                            onChange={handle_change}
                        />
                        {values_2.errors.customer_mobile && <FormHelperText error>{values_2.errors.customer_mobile}</FormHelperText>}
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Loan Amount</label>
                        < input
                            placeholder='00.00'
                            type="text"
                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                            name="loan_amount"
                            value={values_2.loan_amount}
                            onChange={handle_change}
                        />
                        {values_2.errors.loan_amount && <FormHelperText error>{values_2.errors.loan_amount}</FormHelperText>}
                    </div>


                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Repayment Date ({values_2.repayment_date})</label>
                        < input
                            type="date"
                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                            name="repayment_date"
                            onChange={handle_change}
                        />
                        {values_2.errors.repayment_date && <FormHelperText error>{values_2.errors.repayment_date}</FormHelperText>}
                    </div>

                    <div className='w-full flex flex-col gap-1'>
                        <label className='text-[13px] font-bold text-stone-700' htmlFor="">Period</label>
                        < input
                            placeholder='0'
                            type="text"
                            className='text-[14px] font-medium text-stone-700 bg-white px-[15px] py-[10px] rounded-md border border-stone-200 outline-none w-full'
                            name="period"
                            value={values_2.period}
                            onChange={handle_change}
                        />
                        {values_2.errors.period && <FormHelperText error>{values_2.errors.period}</FormHelperText>}
                    </div>

                    <div className='w-full flex justify-end'>
                        <button
                            type="submit"
                            className='bg-blue-500 text-[13px] text-white px-[40px] py-[8px] rounded-lg font-medium active:opacity-60 transition-all'
                        >
                            Update
                        </button>
                    </div>

                </form>
            }
        </Dialog>
    )
}

export default Edit_loan_modal