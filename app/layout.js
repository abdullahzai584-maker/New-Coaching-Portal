import "./globals.css";

export const metadata = {
  title: "OurCoaching Pro",
  description: "Next-Gen Coaching Management & Attendance OS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
