import Head from 'next/head'
import axios from 'axios'
import Repayment_tab from '@/components/Repayment_tab'



export default function Home({ fullUrl, logoUrl }) {
    return (
        <>
            <Head>
                <title>Wallet | Repayment</title>
                <meta property="og:title" content="Wallet | Repayment" />
                <meta property="og:description" content="Wallet | Repayment" />
                <meta property="og:type" content="Wallet | Repayment" />
            </Head>
            <div className='w-screen min-h-screen flex flex-col items-center bg-[#f5f5f5]'>
                <Repayment_tab axios={axios} />
            </div>
        </>
    )
}
