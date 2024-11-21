import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { Home } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountnav from './UserAccountnav';

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="py-4 w-full px-8 md:px-16 border-b-2">
            <div className="container flex items-center justify-between">

                <Link href="/" aria-label="Go to Home" className="flex items-center text-lg font-bold text-gray-900">
                    <Home className="mr-2" />
                    Home
                </Link>

                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <span className="font-bold text-gray-700">Hi! {session?.user.username}</span>
                            <UserAccountnav />
                        </>

                    ) : (
                        <Link href="/sign-in" className={buttonVariants()}>
                            Sign In
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Navbar;
