import { Schema, connection } from "mongoose"

const loansSchema = new Schema(
    {
        customer_name: {
            type: String,
        },
        customer_mobile: {
            type: String,
        },
        loan_amount: {
            type: String,
            default: "00",

        },
        repayment_date: {
            type: String,
            default: "DD-MM-YYYY",
        },
        period: {
            type: String,
        },
    },
    { timestamps: true });

const Db = connection.useDb("Loan_v2");
const Loans = Db.models.Loans || Db.model('Loans', loansSchema);
export default Loans