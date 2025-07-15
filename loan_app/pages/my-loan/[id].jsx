import Head from 'next/head'
import axios from 'axios'
import My_loan from '@/components/My_loan'



export default function Home({ fullUrl, logoUrl }) {
    return (
        <>
            <Head>
                <title>Wallet | My Loan</title>
                <meta property="og:title" content="Wallet | My Loan" />
                <meta property="og:description" content="Wallet | My Loan" />
                <meta property="og:type" content="Wallet | My Loan" />
            </Head>
            <div className='w-screen flex flex-col items-center'>
                <My_loan axios={axios} />
            </div>
        </>
    )
}
