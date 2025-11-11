"use server";

import { signOut } from "@/auth";

// Export a single, reusable Server Action for sign out
export async function logoutAction() {
  await signOut();
}