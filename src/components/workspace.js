'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, Menu, X, ArrowLeft } from 'lucide-react';
import { useDemo } from '@/context/demo-context';
import { Dashboard, Students, StudentDetail, Results, Probation, Advisors, Semesters, Feedback, Login } from './screens';

const nav = {
  admin: [['dashboard', 'Dashboard'], ['students', 'Students'], ['results', 'Academic results'], ['probation', 'Probation records'], ['advisors', 'Advisors'], ['semesters', 'Semesters']],
  advisor: [['dashboard', 'Dashboard'], ['students', 'My students'], ['feedback', 'Advising notes']],
  student: [['dashboard', 'Dashboard'], ['results', 'My results'], ['probation', 'Probation history'], ['feedback', 'Advisor feedback']],
};

export default function Workspace() {
  const pathname = usePathname();
  const router = useRouter();
  const d = useDemo();
  const [mobile, setMobile] = useState(false);
  const parts = pathname.split('/').filter(Boolean);
  const role = ['admin', 'advisor', 'student'].includes(parts[0]) ? parts[0] : 'admin';
  const section = parts[1] || 'dashboard';
  if (pathname === '/login') return <Login />;
  const active = nav[role].find(n => n[0] === section);
  let content;
  if (!active) content = <div className="empty"><h1>Page not found</h1><Link className="button primary" href={`/${role}/dashboard`}>Go to dashboard</Link></div>;
  else if (section === 'dashboard') content = <Dashboard role={role} />;
  else if (section === 'students') content = parts[2] ? <StudentDetail role={role} id={decodeURIComponent(parts[2])} /> : <Students role={role} />;
  else if (section === 'results') content = <Results role={role} />;
  else if (section === 'probation') content = <Probation role={role} />;
  else if (section === 'advisors') content = <Advisors />;
  else if (section === 'semesters') content = <Semesters />;
  else content = <Feedback role={role} />;
  return <div className="simple-app"><a className="skip-link" href="#main-content">Skip to main content</a>
    <header className="simple-header"><div className="simple-header-inner"><Link className="simple-brand" href="/"><span><GraduationCap size={23} /></span>Academia<span className="brand-period">.</span></Link><div className="simple-header-actions"><Link href="/" className="home-link"><ArrowLeft size={15} />Home</Link><Link href="/login" className="button">Switch role</Link><button className="simple-menu" aria-label={mobile ? 'Close navigation' : 'Open navigation'} aria-expanded={mobile} aria-controls="workspace-nav" onClick={() => setMobile(!mobile)}>{mobile ? <X size={22} /> : <Menu size={22} />}</button></div></div></header>
    <nav id="workspace-nav" className={`simple-navigation ${mobile ? 'is-open' : ''}`} aria-label="Main navigation"><div>{nav[role].map(([key, label]) => <Link aria-current={section === key ? 'page' : undefined} key={key} href={`/${role}/${key}`} className={section === key ? 'active' : ''} onClick={() => setMobile(false)}>{label}</Link>)}</div></nav>
    <main id="main-content" className="simple-main"><div className="simple-controls"><span className="simple-demo-label">Demo workspace <span>· Fictional records</span></span><div className="simple-role-controls"><label className="sr-only" htmlFor="role-switch">Demo role</label><select id="role-switch" value={role} onChange={e => router.push(`/${e.target.value}/dashboard`)}><option value="admin">Academic officer</option><option value="advisor">Advisor</option><option value="student">Student</option></select>{role === 'student' && <select aria-label="Demo student" value={d.studentId} onChange={e => d.setStudentId(e.target.value)}>{d.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>}{role === 'advisor' && <select aria-label="Demo advisor" value={d.advisorId} onChange={e => d.setAdvisorId(e.target.value)}>{d.advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>}</div></div>
      <div key={`${role}-${section}-${parts[2] || ''}-${d.studentId}-${d.advisorId}`}>{content}</div>
      <footer className="simple-footer"><span>Academia · Student support, simplified.</span><span>Demo changes reset on refresh.</span></footer>
    </main>
  </div>;
}
