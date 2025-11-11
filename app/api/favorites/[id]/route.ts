import { deleteFavorite, favoriteExists, insertFavorite } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Define a type for the context object to improve clarity and type safety
type RouteContext = { params: { id: string } };

/**
 * POST /api/favorites/:id - Adds a movie to the user's favorites.
 */
export const POST = async (req: NextRequest, context: RouteContext) => {
  // Use await auth() internally instead of wrapping the function
  const session = await auth();
  
  // Access id safely
  const id = context.params.id; 

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in or missing email" },
      { status: 401 }
    );
  }

  const userEmail = session.user.email;

  try {
    const exists = await favoriteExists(id, userEmail);
    if (exists) {
      // 200 OK because the resource state is already as requested
      return NextResponse.json({ message: "Already favorited" });
    }

    await insertFavorite(id, userEmail);
    return NextResponse.json({ message: "Favorite Added" }, { status: 201 }); // Use 201 Created
  } catch (error) {
    console.error(`Database error during POST favorite for ${userEmail}:`, error);
    return NextResponse.json(
      { error: "Internal server error during database operation" },
      { status: 500 }
    );
  }
};

/**
 * DELETE /api/favorites/:id - Removes a movie from the user's favorites.
 */
export const DELETE = async (req: NextRequest, context: RouteContext) => {
  // Use await auth() internally instead of wrapping the function
  const session = await auth();

  // Access id safely
  const id = context.params.id; 

  // Ensure user is authenticated
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = session.user.email;

  try {
    await deleteFavorite(id, userEmail);
    return NextResponse.json({ message: "Favorite removed" });
  } catch (error) {
    console.error(`Database error during DELETE favorite for ${userEmail}:`, error);
    return NextResponse.json(
      { error: "Internal server error during database operation" },
      { status: 500 }
    );
  }
};

