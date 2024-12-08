import Link from 'next/link';
import { Sparkles, BookOpenText, ClipboardMinus, User, FileText, LogOut, LayoutDashboardIcon } from 'lucide-react'; // Example icons

const Sidebar = async () => {

    return (
        <div className="h-screen bg-gray-100 flex flex-col py-4">
            {/* Logo or Home Link */}


            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 lg:text-base md:text-sm text-xs text-gray-700">
                <Link href="/" className="flex items-center gap-4 p-2 border-s-2 hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                </Link>
                <Link href={`/my-tasks`} className="flex items-center gap-4 p-2 border-s-2  hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <FileText className="w-5 h-5" />
                    <span>Projects</span>
                </Link>

                <Link href="/profile" className="flex items-center gap-4 p-2 border-s-2  hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                </Link>

                <div className='m-3 border-2'></div>
                {/* --- */}

                <Link href="/sign-out" className="flex items-center gap-4 p-2 border-s-2  hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <Sparkles className="w-5 h-5" />
                    <span>Issues</span>
                </Link>

                <Link href="/sign-out" className="flex items-center gap-4 p-2 border-s-2  hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <BookOpenText className="w-5 h-5" />
                    <span>Pages</span>
                </Link>

                <Link href="/sign-out" className="flex items-center gap-4 p-2 border-s-2  hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <ClipboardMinus className="w-5 h-5" />
                    <span>Reports</span>
                </Link>

                <Link href="/sign-out" className="flex items-center gap-4 p-2 border-s-2  hover:bg-gray-200 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </Link>
            </nav >
        </div >
    );
};

export default Sidebar;
