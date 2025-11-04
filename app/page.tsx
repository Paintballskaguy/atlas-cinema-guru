import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import MovieGrid from "@/components/MovieGrid";

export default async function Page() {
  return (
    <AuthenticatedLayout>
      <MovieGrid />
    </AuthenticatedLayout>
  );
}