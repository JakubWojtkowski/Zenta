import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { Home } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountnav from './UserAccountnav';

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="my-4 w-full px-8 md:px-16">
            <div className="container flex items-center justify-between">
                {/* Home Icon Link */}
                <Link href="/" aria-label="Go to Home" className="flex items-center text-lg font-bold text-gray-900">
                    <Home className="mr-2" />
                    Home
                </Link>

                {session?.user ? (
                    <UserAccountnav />
                ) : (
                    <Link href="/sign-in" className={buttonVariants()}>
                        Sign In
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
