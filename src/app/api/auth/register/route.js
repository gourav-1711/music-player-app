import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/lib/model/user"

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

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
      message: "User registered successfully",
      user,
      token, // optional: also send in JSON if you want
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
