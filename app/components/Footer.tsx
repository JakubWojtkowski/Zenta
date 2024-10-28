const Footer = () => {
    return (
        <div className='m-16 flex justify-center'>
            <ul className="flex md:flex-row justify-between sm:gap-16 gap-8 flex-col md:text-base text-sm">
                <li className="text-slate-400 flex-1">Copyright © 2024 Jakub Wojtkowski</li>
                <ul className="flex flex-row justify-between sm:gap-16 gap-8">
                    <li>Privacy</li>
                    <li>Settings</li>
                    <li>Home</li>
                </ul>
            </ul>
        </div>
    );
}

export default Footer; 