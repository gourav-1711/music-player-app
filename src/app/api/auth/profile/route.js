import { connectDB } from "@/lib/db";
import user from "@/lib/model/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("music-user")?.value;

  try {
    await connectDB();

    if (!token) {
      return Response.json({ error: "No token found" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
    
    // fetch user (exclude password)
    const user = await user.findById(decoded._id).select("-password");

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
