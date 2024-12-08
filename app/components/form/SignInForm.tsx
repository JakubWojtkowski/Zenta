'use client';

import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"


const FormSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must have more than 8 characters'),
});

const SignInForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const signInData = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false
        });
        if (signInData?.error) {
            toast({
                title: "Error",
                description: "Oops! Something went wrong!",
                variant: "destructive",
            })
        } else {
            toast({
                title: "Success",
                description: "You are logged in!",
                variant: "default",
            })
            router.push("/");
            router.refresh();
        }
    };

    return (
        <Form {...form}>

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 800 400" opacity="1"><defs><filter id="bbblurry-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB" className='w-full'>
                <feGaussianBlur stdDeviation="37" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur></filter></defs><g filter="url(#bbblurry-filter)"><ellipse rx="150" ry="150" cx="600.2307106537344" cy="170.7195317133559" fill="hsla(207, 73%, 53%, 1.00)"></ellipse><ellipse rx="150" ry="150" cx="168.3105086081939" cy="357.5819996139767" fill="hsla(311, 38%, 68%, 1.00)"></ellipse><ellipse rx="150" ry="150" cx="568.538561756074" cy="634.4071418802151" fill="hsl(185, 100%, 57%)"></ellipse></g></svg>

            <div className='flex flex-col justify-center items-center h-[100vh] absolute'>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[400px] min-w-[300px]">
                    <div className='space-y-2'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder='mail@example.com' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Enter your password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button className='w-full mt-6' type='submit'>
                        Sign in
                    </Button>
                </form>
                <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                    or
                </div>
                <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
                <p className='text-center text-sm text-gray-600 mt-2'>
                    If you don&apos;t have an account, please&nbsp;
                    <Link className='text-blue-500 hover:underline' href='/sign-up'>
                        Sign up
                    </Link>
                </p>
            </div>
        </Form>
    );
};

export default SignInForm;
