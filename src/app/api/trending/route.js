import { NextResponse } from "next/server";

const playlistId = "PL4fGSI1pDJn5RgLW0Sb_zECecWdH_4zOX"; // Trending Bollywood Songs

export async function GET() {
  const unwanted = [
    "bhojpuri",
    "bhajan",
    "devotional",
    "bhakti",
    "punjabi",
    "#video",
  ];

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    const errorData = await res.json();
    console.error("YouTube API Error:", errorData);
    return NextResponse.json(
      { error: "YouTube API request failed", details: errorData },
      { status: res.status }
    );
  }

  if (!data.items) {
    return NextResponse.json(
      { error: "No items found", raw: data },
      { status: 500 }
    );
  }

  const filtered = data.items.filter((item) => {
    const title = item.snippet?.title?.toLowerCase() || "";
    return !unwanted.some((word) => title.includes(word));
  });

  return NextResponse.json(filtered);
}
