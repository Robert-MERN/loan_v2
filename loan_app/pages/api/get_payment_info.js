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

        const paymentInfo = await PaymentInfo.find();

        return res.status(200).json(paymentInfo[0])
    }

    catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

} 