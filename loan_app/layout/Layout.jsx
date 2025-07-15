import React, { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Backdrop, CircularProgress, Slide } from '@mui/material';
import useStateContext from '@/context/ContextProvider';
import axios from "axios";
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Logout_modal from '@/utils/modals/Logout_modal';
import Add_loan_modal from '@/utils/modals/Add_loan_modal';
import Edit_loan_modal from '@/utils/modals/Edit_loan_modal';
import Delete_loan_modal from '@/utils/modals/Delete_loan_modal';
import Payment_drawer from '@/utils/drawers/Payment_drawer';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}
const Layout = ({ children }) => {

    const router = useRouter();

    const {
        snackbar_alert,
        close_snackbar,
        drawer_state,
        toggle_drawer,
        API_loading,
        modals_state,
        toggle_modal,
        values_2,
        set_values_2,
        set_values,
        loan_id,
        set_loan_id,
        set_API_loading,
        add_loan_api,
        update_loan_api,
        delete_loan_api,
        get_loan_api,
        default_state_2,
        default_state,
    } = useStateContext();

    // lock scroll when drawer opens
    useEffect(() => {
        if (Object.values(drawer_state).some(e => e === true)) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");// Cleanup on unmount
        };
    }, [drawer_state]);


    return (
        <div>

            {/* Loader Component */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={API_loading}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress color="inherit" />
                </Box>
            </Backdrop>
            {/* Notifications */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={TransitionDown}
                key={TransitionDown ? TransitionDown.name : ''}
                open={snackbar_alert.open}
                autoHideDuration={5000}
                onClose={close_snackbar}>
                <Alert onClose={close_snackbar} severity={snackbar_alert.severity} sx={{ width: '100%' }}>
                    {snackbar_alert.message}
                </Alert>
            </Snackbar>

            {/* Drawers */}
            <Payment_drawer
                toggle_drawer={toggle_drawer}
                drawer_state={drawer_state}
                axios={axios}
            />


            {/* Modals */}
            <Add_loan_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                values_2={values_2}
                set_values_2={set_values_2}
                set_API_loading={set_API_loading}
                add_loan_api={add_loan_api}
            />
            <Edit_loan_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                values_2={values_2}
                set_values_2={set_values_2}
                loan_id={loan_id}
                set_loan_id={set_loan_id}
                set_API_loading={set_API_loading}
                update_loan_api={update_loan_api}
                get_loan_api={get_loan_api}
                default_state_2={default_state_2}

            />

            <Delete_loan_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                loan_id={loan_id}
                set_loan_id={set_loan_id}
                set_API_loading={set_API_loading}
                delete_loan_api={delete_loan_api}
            />

            <Logout_modal
                axios={axios}
                modals_state={modals_state}
                toggle_modal={toggle_modal}
                set_loan_id={set_loan_id}
                default_state_2={default_state_2}
                set_values_2={set_values_2}
                default_state={default_state}
                set_values={set_values}

            />

            {children}

        </div >
    )
}

export default Layout