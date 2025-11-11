import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import MovieGrid from "@/components/MovieGrid";
import { auth } from '@/auth'; 
import { fetchActivities } from '@/lib/data'; 
import { redirect } from "next/navigation"; 

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect("/signin");
  }

  const userEmail = session.user?.email || "";
  
  const activities = await fetchActivities(1, userEmail); 

  return (
    <AuthenticatedLayout session={session} activities={activities}>
      <MovieGrid />
    </AuthenticatedLayout>
  );
}