import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import user from "@/lib/model/user";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = await user.create({
      name,
      email,
      password: hashedPassword,
    });

    // 🔑 Create JWT with minimal payload
    const token = jwt.sign(
      { _id: userObj._id, email: userObj.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Store JWT in cookie
    cookieStore.set("music-user", token, {
      httpOnly: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    cookieStore.set(
      "details",
      JSON.stringify({
        name: userObj.name,
        email: userObj.email,
      }),
      {
        httpOnly: false,
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      }
    );

    // Strip password before sending user back
    const { password: _, ...safeUser } = userObj.toObject();

    return NextResponse.json({
      message: "User registered successfully",
      user: safeUser,
      token, // optional
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
