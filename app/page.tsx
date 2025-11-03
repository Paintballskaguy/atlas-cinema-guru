import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default async function Page() {
  return (
    <AuthenticatedLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to Cinema Guru</h1>
      </div>
    </AuthenticatedLayout>
  );
}