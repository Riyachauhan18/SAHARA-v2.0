import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming Inter is available or I should check. Next.js default usually has it.
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "District Health Live",
    description: "Real-time Bed & Blood Availability Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <SiteHeader />
                        <main className="flex-1">{children}</main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
