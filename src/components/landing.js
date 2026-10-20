'use client';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Users, ClipboardList, ShieldCheck, UserRoundCheck, CalendarDays, MessageSquare, Check } from 'lucide-react';
import { useDemo } from '@/context/demo-context';

const features = [
  { title: 'Students', description: 'Find a student, view their profile, or add someone new.', href: '/admin/students', icon: Users },
  { title: 'Academic results', description: 'Enter semester results and review GPA and credits.', href: '/admin/results', icon: ClipboardList },
  { title: 'Probation records', description: 'Review academic standing and semester history.', href: '/admin/probation', icon: ShieldCheck },
  { title: 'Advisors', description: 'Find the people supporting your students.', href: '/admin/advisors', icon: UserRoundCheck },
  { title: 'Semesters', description: 'Keep academic terms and results organized.', href: '/admin/semesters', icon: CalendarDays },
  { title: 'Advising notes', description: 'Review your students and write a helpful action plan.', href: '/advisor/feedback', icon: MessageSquare },
];

export default function Landing() {
  const d = useDemo();
  const probation = d.cases.filter(c => c.semesterId === d.semesterId && c.status === 'Probation').length;
  return <div className="landing">
    <a className="skip-link" href="#landing-main">Skip to main content</a>
    <header className="landing-header"><Link className="simple-brand" href="/"><span><GraduationCap size={23} /></span>Academia<span className="brand-period">.</span></Link><nav aria-label="Home navigation"><a href="#features">Explore features</a><Link className="button primary" href="/admin/dashboard">View dashboard<ArrowRight size={16} /></Link></nav></header>
    <main id="landing-main">
      <section className="landing-hero"><div className="hero-copy"><span className="landing-kicker"><span />University Probation System</span><h1>Student progress.<br /><span>Made simple.</span></h1><p>Manage results, keep track of academic standing, and give students the support they need. Everything you need, in one easy place.</p><div className="hero-actions"><Link className="button primary" href="/admin/dashboard">View dashboard<ArrowRight size={18} /></Link><a className="button" href="#features">Explore features</a></div><div className="hero-reassurance"><Check size={16} />Simple tools. Clear information. Better support.</div></div>
        <div className="landing-preview"><div className="preview-header"><span className="preview-logo"><GraduationCap size={18} />Your workspace</span><span className="preview-tag">At a glance</span></div><div className="preview-body"><div className="preview-greeting"><span>ACADEMIC OVERVIEW</span><h2>A little clarity goes a long way.</h2><p>{d.semesters.find(s => s.id === d.semesterId)?.name}</p></div><div className="preview-stats"><div><Users size={19} /><strong>{d.students.length}</strong><span>Students</span></div><div><ShieldCheck size={19} /><strong>{probation}</strong><span>On probation</span></div><div><UserRoundCheck size={19} /><strong>{d.advisors.length}</strong><span>Advisors</span></div></div><div className="preview-task"><span className="preview-task-icon"><ClipboardList size={20} /></span><div><strong>Ready for the next semester?</strong><span>Start with your students and their results.</span></div><Link href="/admin/results" aria-label="Open academic results"><ArrowRight size={18} /></Link></div><Link className="preview-bottom-link" href="/admin/students">View student records<ArrowRight size={15} /></Link></div></div>
      </section>
      <section className="landing-features" id="features"><div className="landing-section-heading"><span className="landing-kicker">YOUR EVERYDAY TOOLS</span><h2>What would you like to do?</h2><p>Choose a task and get straight to it.</p></div><div className="landing-feature-grid">{features.map(({ title, description, href, icon: Icon }) => <Link className="landing-feature" href={href} key={title}><div className="feature-top"><span><Icon size={22} /></span><ArrowRight size={19} /></div><h3>{title}</h3><p>{description}</p></Link>)}</div></section>
      <section className="landing-roles"><div><h2>A view for everyone.</h2><p>Open the workspace that fits your role.</p></div><div><Link href="/admin/dashboard">Academic officer<ArrowRight size={15} /></Link><Link href="/advisor/dashboard">Advisor<ArrowRight size={15} /></Link><Link href="/student/dashboard">Student<ArrowRight size={15} /></Link></div></section>
    </main><footer className="landing-footer"><span>Academia · University Probation System</span><span>Frontend demo · Fictional data · Changes reset on refresh</span></footer>
  </div>;
}
