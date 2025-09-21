import { deleteSession } from "@/lib/session";

export async function POST(request) {
  try {
    await deleteSession();
    
    return Response.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}