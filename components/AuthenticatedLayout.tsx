import  Header  from "../components/Header";
import  Sidebar  from "../components/Sidebar";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

// Define the type that fetchActivities is expected to return
type RecentActivityItem = {
  id: string;
  timestamp: Date;
  activity: "FAVORITED" | "WATCH_LATER";
  title: string; 
};

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  // ADDED PROPS to match usage in app/favorites/page.tsx
  session: Session | null;
  activities: RecentActivityItem[];
};

// This is now a Server Component, responsible for composing the layout.
// It accepts required data as props, removing redundant data fetching.
export default async function AuthenticatedLayout({
  children,
  session, // Use session from props
  activities, // Use activities from props
}: AuthenticatedLayoutProps) {

  // We check the session passed from the parent page
  if (!session) {
    redirect("/api/auth/signin");
  }
  
  return (
    <div className="min-h-screen bg-[#00003c]">
      {/* Header should be fixed in its own component (e.g., fixed top-0 h-16 z-50) */}
      <Header />
      
      {/* Sidebar should be fixed in its own component (e.g., fixed left-0 top-16 w-64 z-40) */}
      <Sidebar activities={activities} />
      
      {/* Main Content Area:
        - pt-16: Accounts for the fixed Header height (assuming h-16).
        - md:ml-64: Pushes the content away from the fixed Sidebar on desktop/tablet screens (assuming Sidebar is w-64).
        - px-4: Provides necessary horizontal padding for content.
      */}
      <main className="min-h-screen pt-16 md:ml-64 px-4 pb-8">
        {children}
      </main>
    </div>
  );
}