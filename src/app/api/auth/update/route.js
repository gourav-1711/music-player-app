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
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { message: "please log in again" },
          { status: 401 }
        );
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { favoriteSongs, history, name, oldPassword, newPassword, playlist } =
      await req.json();

    // 3. Prepare update data
    const updateData = {};
    if (favoriteSongs !== undefined) updateData.favoriteSongs = favoriteSongs;
    if (history !== undefined) updateData.history = history;
    if (name !== undefined) updateData.name = name;
    if (playlist !== undefined) updateData.playlist = playlist;

    // 4. Handle password change
    if (oldPassword && newPassword) {
      const userObj = await user.findById(decoded._id);
      if (!userObj) {
        return NextResponse.json(
          { message: "user not found" },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        userObj.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Old password is incorrect" },
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
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    // Strip password
    const { password: _, ...safeUser } = userObj.toObject();

     // 6. Refresh token only once per day
     const now = Math.floor(Date.now() / 1000); // seconds
     const hour = 60 * 60;

 
     if (!decoded.iat || now - decoded.iat > hour) {
       const newToken = jwt.sign(
         { _id: safeUser._id, email: safeUser.email },
         process.env.JWT_SECRET,
         { expiresIn: "7d" }
       );
 
       cookieStore.set("music-user", newToken, {
         httpOnly: false, // ⚠️ should be true in production
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
     }

    return NextResponse.json({
      message:
        oldPassword && newPassword
          ? "Password changed successfully"
          : "user updated successfully",
      user: safeUser,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
