import { Header } from "@/components/app/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="p-5">{children}</main>
    </>
  );
}
