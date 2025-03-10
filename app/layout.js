import Header from "@/app/_components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Josefin_Sans } from 'next/font/google';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
});

console.log(josefin);

import '@/app/_styles/globals.css';
import { ReservationProvider } from "./_components/ReservationContext";

const metadata = {
  // title: 'The Wild Oasis',
  title: {
    template: 'The Wild Oasis || %s',
    default: 'Welcome || The Wild Oasis',
  },
  description: 'Luxurious cabin hotel located in the heart of the Italian DOlomites, surrounded by beautiful mountains and dark forests',
};

function RootLayout({ children }) {

  return <html lang="en">
    <body className={`${josefin.className} antialiased bg-primary-950 text-primary-100 min-h-screen flex flex-col relative`}>
      <Header />


      <div className="flex-1 px-8 py-12 grid">
        <main className="w-full max-w-7xl mx-auto">
          <ReservationProvider>
            {children}
          </ReservationProvider>
          <SpeedInsights />
        </main>
      </div>


    </body>
  </html>;
}

export { metadata };

export default RootLayout;