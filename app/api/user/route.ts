import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

// Define a schema for input validation
const userSchema = z.
    object({
        username: z.string().min(1, "Username is required").max(100),
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must have more min. 8 characters"),
    });

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        // Check if email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });
        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 });
        }

        // Check if username already exists
        const existingUserByUsername = await db.user.findUnique({
            where: { username: username }
        });
        if (existingUserByUsername) {
            return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 409 });
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create a new user with the default role 'user'
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: "user"
            }
        });

        // Remove password from the response
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
