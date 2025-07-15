import Head from 'next/head'

export default function FourOhFour() {
    return (
        <div className={`w-screen h-[95vh] text-stone-700 justify-center flex items-center flex-col gap-16`} >
            <Head>
                <title>Wallet | Link Expired</title>
                <meta property="og:title" content="Wallet | Link Expired" />
                <meta property="og:description" content="This link has been expired" />
                <meta property="og:type" content="Link Expired" />
                <link rel="icon" href="/images/icon.png" />
            </Head>
            <div className='flex flex-col md:flex-row items-center' >

                <h1 className='text-[26px] md:text-[46px] font-bold px-[15px] mr-[15px] md:px-[25px] md:mr-[25px] md:border-r-2 md:border-stone-300' >Link Expired {";("}</h1>
                <p className='text-[13px] md:text-[16px] font-medium' >This link is expired contact the company agent</p>
            </div>
        </div>
    )
}

