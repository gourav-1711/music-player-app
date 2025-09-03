import { connectDB } from "@/lib/db";
import User from "@/lib/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Read cookie
    const token = await cookies().get("user")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { favoriteSongs, history, name, oldPassword, newPassword } = await req.json();

    // 3. Prepare update data
    const updateData = {};
    if (favoriteSongs !== undefined) updateData.favoriteSongs = favoriteSongs;
    if (history !== undefined) updateData.history = history;
    if (name !== undefined) updateData.name = name;

    // 4. Handle password change
    if (oldPassword && newPassword) {
      const user = await User.findById(decoded._id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 5. Update user
    const user = await User.findByIdAndUpdate(
      decoded._id,
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Strip password
    const { password: _, ...safeUser } = user.toObject();

    return NextResponse.json({
      message: oldPassword && newPassword
        ? "Password changed successfully"
        : "User updated successfully",
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
