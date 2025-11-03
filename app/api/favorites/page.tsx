import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default async function FavoritesPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <p className="text-gray-300">Your favorite movies will appear here.</p>
      </div>
    </AuthenticatedLayout>
  );
}