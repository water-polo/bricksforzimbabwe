'use client';

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { OrderProvider } from "@/context/OrderContext";
import { AuthProvider } from "@/context/AuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <title>Bricks for Zimbabwe | Quality Construction Materials</title>
        <meta name="description" content="Leading supplier of bricks, pavers, blocks, and construction materials in Zimbabwe. Formerly Cement City. Quality products, reliable delivery." />
        <meta name="keywords" content="bricks, pavers, blocks, construction, Zimbabwe, Harare, cement, building materials" />
      </head>
      <body className={inter.variable}>
        <AuthProvider>
          <CustomerAuthProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <WishlistProvider>
                    {!isAdminRoute && <Navbar />}
                    <main style={{ paddingTop: isAdminRoute ? 0 : 'var(--header-height)' }}>
                      {children}
                    </main>
                    {!isAdminRoute && <Footer />}
                    {!isAdminRoute && <ChatWidget />}
                  </WishlistProvider>
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </CustomerAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
