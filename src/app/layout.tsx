import type { Metadata } from 'next';
import './globals.css';
import './scene-transitions.css';
export const metadata: Metadata = { title: 'Huy — Frontend Developer & Trader', description: 'Huy, Frontend Developer working with Next.js, React and TypeScript. Explore BillMate and BoardRealm, plus a trading focus on NQ / ES / YM, QT × ICT and NYAM.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
