import { auth } from "@/auth";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { fetchActivities } from "@/lib/data";
import { redirect } from "next/navigation";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const activities = await fetchActivities(1, session.user?.email || "");

  return (
    <div className="min-h-screen bg-[#00003c]">
      <Header />
      <Sidebar activities={activities} />
      <main className="pt-16 pl-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}