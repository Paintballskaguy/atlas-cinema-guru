import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import FavoritesClient from '@/components/FavoritesClient'; 
import { auth } from '@/auth'; 
import { fetchActivities } from '@/lib/data'; 
import { redirect } from "next/navigation"; // Import redirect here

export default async function FavoritesPage() {
  const session = await auth();
  
  // 🛑 FIX: If the session is null, immediately redirect on the server.
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Ensure email is available before fetching activities
  const userEmail = session.user?.email || "";
  
  // 1. Fetch data required by the layout on the server
  // We can trust session.user.email is available now.
  const activities = await fetchActivities(1, userEmail); 

  // 2. Pass the fetched data down to AuthenticatedLayout
  return (
    // We can now assert that 'session' is not null, since we checked above.
    <AuthenticatedLayout session={session} activities={activities}>
      {/* The client-side logic is now contained within FavoritesClient */}
      <FavoritesClient />
    </AuthenticatedLayout>
  );
}