import Footer from "@/components/shared/footer/Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-525">
      {children}
      <Footer />
    </div>
  );
}
