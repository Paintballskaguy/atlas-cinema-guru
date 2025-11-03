import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default async function WatchLaterPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Watch Later</h1>
        <p className="text-gray-300">Movies you want to watch later will appear here.</p>
      </div>
    </AuthenticatedLayout>
  );
}