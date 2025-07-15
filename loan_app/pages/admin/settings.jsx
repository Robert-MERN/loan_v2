import Head from 'next/head'
import axios from 'axios'
import Settings from '@/components/Settings'
import { get_cookie } from '@/utils/functions/cookie'
import connect_mongo from '@/utils/functions/connect_mongo'
import Users from '@/models/user_model'
import jwt from "jsonwebtoken"

export default function Home({ fullUrl, logoUrl }) {
    return (
        <>
            <Head>
                <title>Wallet | Admin | Settings</title>
                <meta property="og:title" content="Wallet | Admin | Settings" />
                <meta property="og:description" content="Wallet | Admin | Settings" />
                <meta property="og:type" content="Wallet | Admin | Settings" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <Settings axios={axios} />
            </div>
        </>
    )
}



export const getServerSideProps = async ({ req, res }) => {

    // validating user from cookie
    const user_account_token = get_cookie("user_account_token", { req });

    const protocol = req.headers["x-forwarded-proto"] || "http"; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the domain (localhost:3000 or production domain)
    const fullUrl = `${protocol}://${host}${req.url}`; // Fully dynamic URL
    const logoUrl = `${protocol}://${host}/images/og_logo.png`; // Fully dynamic URL

    if (user_account_token) {

        console.log("Connecting with DB")
        try {
            // connecting with monogDB
            await connect_mongo();
            console.log("Successfuly conneted with DB");

            const user = jwt.verify(user_account_token, process.env.JWT_KEY);
            const user_db = await Users.findOne({ email: user.email });

            if (user.password_update_count !== user_db.password_update_count) {
                return {
                    redirect: {
                        destination: "/login",
                        permanent: true,
                    },
                }
            }
            return { props: { user, fullUrl, logoUrl } }

        } catch (err) {
            console.error(err);
            return {
                redirect: {
                    destination: "/login",
                    permanent: true,
                },
            }
        }


    }


    return {
        redirect: {
            destination: "/login",
            permanent: true,
        },
    }
}