export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "lofi chill";

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoCategoryId=10&maxResults=10&key=${process.env.YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  return Response.json(data.items);
}
