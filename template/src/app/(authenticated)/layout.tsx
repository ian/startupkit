import Link from "next/link";
import { Bell } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@startupkit/auth/server";
import { Sidebar } from "@/components/app/sidebar";
import { Header } from "@/components/app/header";

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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex flex-col h-full max-h-screen gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                alt="StartupKit"
                src="/startupkit-light.svg"
                className="w-auto h-8"
                width={363}
                height={100}
              />
            </Link>
            <Button variant="outline" size="icon" className="w-8 h-8 ml-auto">
              <Bell className="w-4 h-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <Sidebar className="text-sm font-medium px-3" />
          </div>
          <div className="p-4 mt-auto">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex items-center justify-center grow bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
