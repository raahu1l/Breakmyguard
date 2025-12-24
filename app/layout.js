import './globals.css';
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'Break My Guard',
  description: 'Challenge the AI. Break the system.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="text-white"
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {children}
      </body>
    </html>
  );
}
