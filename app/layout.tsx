import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "CDAC-Noida",
  description: "Made by Intern Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
