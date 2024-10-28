import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { Home } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserAccountnav from './UserAccountnav';

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className='my-4 w-full top-0 px-16'>
            <div className='container flex items-center justify-between'>
                <Link href='/'>
                    <Home />
                </Link>

                {session?.user ? (
                    <UserAccountnav />
                ) : (
                    <Link className={buttonVariants()} href="/sign-in">
                        Sign In
                    </Link>
                )}

            </div>
        </div>
    );
};

export default Navbar;