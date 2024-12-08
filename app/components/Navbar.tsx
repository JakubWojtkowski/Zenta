import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountnav from './UserAccountnav';

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="py-4 w-full px-6 md:px-10 border-b-4 border-gray-200 bg-gray-100 text-gray-800">
            <div className="container flex items-center justify-between">

                <Link href="/" aria-label="Go to Home" className="flex items-center text-lg font-bold text-blue-600">
                    ZENTA
                </Link>

                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <span className="font-bold">Hi ! {session?.user.username}</span>
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
