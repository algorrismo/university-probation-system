import './globals.css';
import './simple.css';
import { DemoProvider } from '@/context/demo-context';

export const metadata = { title: 'Academia | Student Success', description: 'University academic probation and advising frontend. Fictional data, meaningful student support.' };

export default function RootLayout({ children }) {
  return <html lang="en"><body><DemoProvider>{children}</DemoProvider></body></html>;
}
