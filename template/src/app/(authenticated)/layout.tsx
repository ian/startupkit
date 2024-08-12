import { Header } from "@/components/app/Header";
import { Sidebar } from "@/components/app/Sidebar";
import { getUser } from "@startupkit/auth/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = await getUser();

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <>
      <main>
        <div className="hidden sm:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <Sidebar />
        </div>

        <Header />

        <div className="flex items-center justify-center h-screen pt-16 lg:pl-72 bg-gray-50">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </>
  );
}
