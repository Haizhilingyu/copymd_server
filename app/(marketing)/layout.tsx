import { Footer } from "./footer";
import { Header } from "./header";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
  );
}
