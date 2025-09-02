import { connectDB } from "@/lib/db";
import User from "@/lib/model/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("user")?.value;
  try {
    await connectDB();

    // 1. Read cookies
    if (!token) {
      return Response.json({ error: "No token found" }, { status: 401 });
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { favoriteSongs, history, name } = await req.json();

    // 3. Update data (overwrite arrays)
    const updateData = {};
    if (favoriteSongs !== undefined) updateData.favoriteSongs = favoriteSongs;
    if (history !== undefined) updateData.history = history;
    if (name !== undefined) updateData.name = name;

    const user = await User.findByIdAndUpdate(
      decoded.user._id, // 👈 comes from token
      { $set: updateData },
      { new: true }
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "User updated" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
