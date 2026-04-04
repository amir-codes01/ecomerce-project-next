import Navbar from "@/components/navbar/Mainnavbar";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
