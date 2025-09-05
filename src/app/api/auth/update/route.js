import { connectDB } from "@/lib/db";
import user from "@/lib/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Read cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("music-user")?.value;
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

    const { favoriteSongs, history, name, oldPassword, newPassword } =
      await req.json();

    // 3. Prepare update data
    const updateData = {};
    if (favoriteSongs !== undefined) updateData.favoriteSongs = favoriteSongs;
    if (history !== undefined) updateData.history = history;
    if (name !== undefined) updateData.name = name;

    // 4. Handle password change
    if (oldPassword && newPassword) {
      const userObj = await user.findById(decoded._id);
      if (!userObj) {
        return NextResponse.json({ error: "user not found" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        userObj.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Old password is incorrect" },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // 5. Update user
    const userObj = await user.findByIdAndUpdate(
      decoded._id,
      { $set: updateData },
      { new: true }
    );

    if (!userObj) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // Strip password
    const { password: _, ...safeUser } = userObj.toObject();

    return NextResponse.json({
      message:
        oldPassword && newPassword
          ? "Password changed successfully"
          : "user updated successfully",
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
