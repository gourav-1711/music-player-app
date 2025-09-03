const { NextResponse } = require("next/server");

export async function GET() {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&videoCategoryId=10&maxResults=30&key=${process.env.YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: `YouTube API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data.items || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch music videos", details: error.message },
      { status: 500 }
    );
  }
}
