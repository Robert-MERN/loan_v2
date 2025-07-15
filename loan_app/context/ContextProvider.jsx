import React, { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router';






const StateContext = createContext();

export const ContextProvider = ({ children }) => {

    const router = useRouter();

    // Settings
    const [loan, set_loan] = useState(null);
    const [all_loans, set_all_loans] = useState([]);
    const [loan_id, set_loan_id] = useState("");
    const [payment_info, set_payment_info] = useState(null);


    // Notification logic
    const [snackbar_alert, set_snackbar_alert] = useState({
        open: false,
        message: "",
        severity: "primary"
    });
    const close_snackbar = () => {
        set_snackbar_alert(prev => ({ ...prev, open: false }));
    };


    // Modal Logic
    const default_modals_state = {
        logout_modal: false,
        add_loan_modal: false,
        edit_loan_modal: false,
        delete_loan_modal: false,
    };
    const [modals_state, set_modals_state] = useState(default_modals_state);

    const toggle_modal = (modal) => {
        set_modals_state(prev => ({ ...prev, [modal]: !prev[modal] }));
    };

    // Drawer Logic
    const default_drawer_state = {
        add_loan_drawer: false,
        edit_loan_drawer: false,
        payment_drawer: false
    }
    const [drawer_state, set_drawer_state] = useState(default_drawer_state);

    const toggle_drawer = (drawer) => {
        set_drawer_state(prev => ({ ...prev, [drawer]: !prev[drawer] }));

    };


    const default_state = {
        app_name: "",
        upi_id: "",
        qr_scanner: "",
    }

    const default_state_2 = {
        customer_name: "",
        customer_mobile: "",
        loan_amount: "",
        repayment_date: "",
        period: "",
        errors: {
            customer_name: '',
            customer_mobile: '',
            loan_amount: '',
            repayment_date: '',
            period: '',
        },
    }


    const [values, set_values] = useState(default_state);

    const [values_2, set_values_2] = useState(default_state_2);






    //<----------------------- API Calls and Handlers [Back-end] ----------------------->


    // API loader
    const [API_loading, set_API_loading] = useState(false);



    // ------------- Loan Settings --------------

    // Get Loan API
    const get_loan_api = async (axios, loan_id, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_loan?id=${loan_id}`);
            set_state({ ...default_state_2, ...res.data });
        } catch (err) {
            // set_snackbar_alert({
            //     open: true,
            //     message: err.response.data.message,
            //     severity: "error",
            // })
            console.error(err.response.data.message);
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }

    // Get All Loans API
    const get_all_loans_api = async (axios, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_all_loans`);
            set_state(res.data);
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }

    // Create Loan API
    const add_loan_api = async (axios, data, set_is_loading) => {
        // start loading
        set_is_loading(true);

        try {

            // Perform the API call
            const res = await axios.post("/api/add_loan", data);

            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });

            await get_all_loans_api(axios, set_all_loans, set_API_loading);

            set_values_2(default_state_2);
            set_modals_state(default_modals_state);
            set_drawer_state(default_drawer_state);
        } catch (err) {

            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };

    // Update Loan API 
    const update_loan_api = async (axios, data, loan_id, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.post(`/api/update_loan?id=${loan_id}`, data);

            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });

            await get_all_loans_api(axios, set_all_loans, set_API_loading);
            set_values_2(default_state_2);
            set_modals_state(default_modals_state);
            set_loan_id("");
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };

    // Delete Loan API 
    const delete_loan_api = async (axios, loan_id, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.post(`/api/delete_loan?id=${loan_id}`);

            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "error",
            });

            await get_all_loans_api(axios, set_all_loans, set_API_loading);
            set_loan_id("");
            set_modals_state(default_modals_state);
            set_values_2(default_state_2);

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }



    // --------- Payment Settings -----------

    // Get Payment Info API
    const get_payment_info_api = async (axios, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.get(`/api/get_payment_info`);
            if (res.data) {
                set_state(res.data);
            }
        } catch (err) {
            // set_snackbar_alert({
            //     open: true,
            //     message: err.response.data.message,
            //     severity: "error",
            // })
            console.error(err.response.data.message);
        } finally {
            // finish loading
            set_is_loading(false);
        }
    }

    // Update Payment Info API 
    const update_payment_info_api = async (axios, data, set_state, set_is_loading) => {
        // start loading
        set_is_loading(true);
        try {
            const res = await axios.post(`/api/update_payment_info`, data);

            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success",
            });

            await get_payment_info_api(axios, set_state, set_is_loading);

        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            // finish loading
            set_is_loading(false);
        }
    };




    // ---------- Login/Signup User ---------

    // Login API
    const login_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/login", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
            router.push("/admin/settings");
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }

    // Add User API
    const add_user_api = async (axios, data, set_is_loading) => {
        set_is_loading(true)
        try {
            const res = await axios.post("/api/signup", data);
            set_snackbar_alert({
                open: true,
                message: res.data.message,
                severity: "success"
            })
        } catch (err) {
            set_snackbar_alert({
                open: true,
                message: err.response.data.message,
                severity: "error",
            })
        } finally {
            set_is_loading(false)
        }
    }






    return (
        <StateContext.Provider
            value={{
                snackbar_alert, set_snackbar_alert, close_snackbar,

                toggle_modal, modals_state,

                toggle_drawer, drawer_state,

                API_loading, set_API_loading,

                login_api, add_user_api,

                default_state, values, set_values, default_state_2, values_2, set_values_2,

                loan, set_loan, all_loans, set_all_loans, loan_id, set_loan_id,

                payment_info, set_payment_info,

                add_loan_api, get_loan_api, get_all_loans_api, update_loan_api, delete_loan_api,

                get_payment_info_api, update_payment_info_api,

            }}
        >
            {children}
        </StateContext.Provider>
    )
}

const useStateContext = () => useContext(StateContext);



export default useStateContext