import "./globals.css";

export const metadata = {
  title: "OmniClip Studio",
  description: "Content repurposing studio with video trimmer and calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}