
"use client";
import { useRouter } from "next/navigation";
import "../globals.css";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

 
  const handleNavigate = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <>
     
      <Navbar onNavigate={handleNavigate} />
      {children}
    </>
  );
}
