import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    
    return Response.json({
      success: true,
      session
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    return Response.json({
      success: false,
      session: null
    });
  }
}