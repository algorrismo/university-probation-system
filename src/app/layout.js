import './globals.css';
import { DemoProvider } from '@/context/demo-context';

export const metadata = { title: 'Academia | Student Success', description: 'University academic probation and advising frontend. Fictional data, meaningful student support.' };

export default function RootLayout({ children }) {
  return <html lang="en"><body className="min-h-screen bg-[#F7F4ED] font-sans text-sm text-[#373C32] selection:bg-[#E2D6C5] antialiased"><DemoProvider>{children}</DemoProvider></body></html>;
}
