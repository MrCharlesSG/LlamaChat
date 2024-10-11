import { Inter, Kanit } from "next/font/google";
import "./globals.css";
import { Audiowide, Carter_One } from "next/font/google";

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });
const yesteryear = Carter_One({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LlamaChat",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`w-full h-full bg-background ${yesteryear.className}`}>
      <head>
        {/* Link to the favicon in the public directory */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* You can also add other sizes or formats if needed */}
        {/* <link rel="icon" href="/favicon.png" type="image/png" /> */}
      </head>
      <body className="w-full h-full">
        <main className="w-full h-full">{children}</main>
      </body>
    </html>
  );
}
