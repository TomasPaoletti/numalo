import Footer from "@/components/shared/footer/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="container mx-auto w-full">{children}</div>
      <Footer />
    </>
  );
}
