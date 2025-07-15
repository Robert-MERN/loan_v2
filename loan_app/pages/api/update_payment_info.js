import PaymentInfo from '@/models/payment_info_model';
import connect_mongo from '@/utils/functions/connect_mongo';



/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {

    console.log("Connecting with DB");

    try {
        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");

        const existing_paymentInfo = await PaymentInfo.find();

        if (existing_paymentInfo.length) {
            await PaymentInfo.findByIdAndUpdate(existing_paymentInfo[0]._id, req.body)
            return res.status(200).json({ success: true, message: "The payment info has been updated" });
        } else {
            const paymentInfo = new PaymentInfo(req.body);
            await paymentInfo.save();
            return res.status(200).json({ success: true, message: "The payment info has been created" });

        }

    }

    catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

} 