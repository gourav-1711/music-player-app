import { NextResponse } from "next/server";

const playlistId = "PLhNyfL3WbvS3RpbQm1eMWFLPEu6BcY166"; // popular on spotify

export async function GET() {
  const unwanted = ["bhojpuri", "bhajan", "devotional", "bhakti", "punjabi", "#video"];

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items) {
    return NextResponse.json({ error: "No items found" , raw : data  }, { status: 500 } );
  }

  const filtered = data.items.filter(item => {
    const title = item.snippet?.title?.toLowerCase() || "";
    return !unwanted.some(word => title.includes(word));
  });

  return NextResponse.json(filtered);
}
