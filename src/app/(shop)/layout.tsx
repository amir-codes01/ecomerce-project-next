import Navbar from "@/components/navbar/Mainnavbar";
import Footer from "@/components/shop/Footer";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
        <Footer />
      </main>
    </>
  );
}
