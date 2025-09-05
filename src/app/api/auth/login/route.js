import { connectDB } from "@/lib/db";
import user from "@/lib/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const userObj = await user.findOne({ email });
    if (!userObj) {
      return NextResponse.json(
        { message: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, userObj.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    // 🔑 Create JWT with minimal payload
    const token = jwt.sign(
      { _id: userObj._id, email: userObj.email }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Store JWT in cookie
    cookies().set("music-user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Strip password before sending user
    const { password: _, ...safeUser } = userObj.toObject();

    return NextResponse.json({
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
