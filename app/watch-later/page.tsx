import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import WatchLaterClient from '@/components/WatchLaterClient'; 
import { auth } from '@/auth'; 
import { fetchActivities } from '@/lib/data'; 
import { redirect } from "next/navigation";

export default async function WatchLaterPage() {
  const session = await auth();
  
  // If the session is null, immediately redirect on the server.
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Ensure email is available before fetching activities
  const userEmail = session.user?.email || "";
  
  // Fetch data required by the layout on the server
  const activities = await fetchActivities(1, userEmail); 

  // Pass the fetched data down to AuthenticatedLayout
  return (
    <AuthenticatedLayout session={session} activities={activities}>
      {/* The client-side logic is contained within WatchLaterClient */}
      <WatchLaterClient />
    </AuthenticatedLayout>
  );
}