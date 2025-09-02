import { connectDB } from "@/lib/db";
import User from "@/lib/model/user"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🔑 Create JWT
    const token = jwt.sign(
      { user },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Store JWT in cookie
    cookies().set({
      name: "user",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return Response.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
