import Link from 'next/link';
import { Home, Settings, FileText, LogOut } from 'lucide-react'; // Example icons
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { buttonVariants } from './ui/button';

const Sidebar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="h-screen flex-[0.2] bg-gray-800 text-white flex flex-col py-6 px-4">
            {/* Logo or Home Link */}
            <Link href="/" className="flex items-center gap-2 mb-10 text-lg font-bold">
                <Home className="w-6 h-6" />
                <span>Dashboard</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4">
                <Link href="/projects" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
                    <FileText className="w-5 h-5" />
                    <span>Projects</span>
                </Link>

                <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>

                {/* Additional links... */}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-700 my-6"></div>

            {/* User Account Section */}
            {session?.user ? (
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <p className="text-sm mb-4">Logged in as {session.user.name}</p>
                        <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
                            <Settings className="w-5 h-5" />
                            <span>Profile</span>
                        </Link>
                    </div>

                    <Link href="/sign-out" className={buttonVariants({ variant: 'ghost' })}>
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            ) : (
                <Link href="/sign-in" className={buttonVariants({ variant: 'outline' })}>
                    Sign In
                </Link>
            )}
        </div>
    );
};

export default Sidebar;
