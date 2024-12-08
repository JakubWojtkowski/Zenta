const Footer = () => {
    return (
        <div className="flex justify-center items-center flex-col bg-blue-600 h-[100vh] mt-16">
            <h1 className="text-white lg:text-[360px] md:text-[240px] sm:text-[180px] text-[104px] tracking-tighter font-bold">ZENTA</h1>
            <h2 className="text-white lg:text-[80px] md:text-[60px] sm:text-[40px] text-[30px] tracking-tighter font-bold mb-8">action starts with control.</h2>
            <ul className="flex md:flex-row justify-between pb-4 `sm:gap-16 gap-8 flex-col md:text-sm text-xs">
                <li className="text-slate-800 flex-1 font-bold">Copyright © 2024 Jakub Wojtkowski</li>
                <ul className="flex flex-row justify-between sm:gap-12 gap-8 text-white">
                    <li>Privacy</li>
                    <li>About</li>
                    <li>Home</li>
                </ul>
            </ul>
        </div>
    );
}

export default Footer; 