import Loans from '@/models/loan_model';
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

        const loan = await Loans.findById(req.query.id);

        return res.status(200).json(loan)
    }

    catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

} 