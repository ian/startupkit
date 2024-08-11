import { Header } from "@/components/app/Header";
import { Sidebar } from "@/components/app/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
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
