import { Schema, connection } from "mongoose"

const paymentInfoSchema = new Schema(
    {
        app_name: {
            type: String,
        },
        upi_id: {
            type: String,
        },
        qr_scanner: {
            type: String,
        }
    },
    { timestamps: true });

const Db = connection.useDb("Loan_v2");
const PaymentInfo = Db.models.PaymentInfo || Db.model('PaymentInfo', paymentInfoSchema);
export default PaymentInfo