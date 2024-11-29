import Link from 'next/link';
import { Settings, FileText, LogOut, LayoutDashboardIcon } from 'lucide-react'; // Example icons

const Sidebar = async () => {

    return (
        <div className="h-screen bg-gray-800 text-white flex flex-col py-4">
            {/* Logo or Home Link */}


            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 lg:text-base md:text-sm text-xs">
                <Link href="/" className="flex items-center gap-2 p-2 hover:bg-gray-700 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                </Link>
                <Link href={`/my-tasks`} className="flex items-center gap-2 p-2 hover:bg-gray-700 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <FileText className="w-5 h-5" />
                    <span>Projects</span>
                </Link>

                <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-700 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>

                <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-700 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <Settings className="w-5 h-5" />
                    <span>Profile</span>
                </Link>

                <Link href="/sign-out" className="flex items-center gap-2 p-2 hover:bg-gray-700 hover:border-s-2 md:pl-10 pl-6 pr-4">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </Link>
            </nav >
        </div >
    );
};

export default Sidebar;
