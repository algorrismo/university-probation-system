'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, ShieldAlert, UserRoundCheck, ArrowUpRight, ArrowRight, Plus, ChevronRight, ChevronLeft, CalendarDays, Download, X, Check, GraduationCap, BookOpen, MessageSquare, ClipboardList, ArrowLeft, CircleCheck, Info } from 'lucide-react';
import { useDemo } from '@/context/demo-context';
import { Avatar, Badge, Empty, Field, PageHeading, SearchBox } from './ui';
const departments = ['Computer Science', 'Business Administration', 'Electrical Engineering'];
function today() {
  return new Date().toISOString().slice(0, 10);
}
function uid() {
  return crypto.randomUUID();
}
function displayDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
function visibleStudents(d, role) {
  return d.students.filter(s => role === 'student' ? s.id === d.studentId : role === 'advisor' ? s.advisorId === d.advisorId : true);
}
function statusFor(d, id, semesterId = d.semesterId) {
  return d.cases.find(c => c.studentId === id && c.semesterId === semesterId)?.status || 'Unevaluated';
}
function resultFor(d, id) {
  return d.results.find(r => r.studentId === id && r.semesterId === d.semesterId);
}
function SemesterSelect({
  d
}) {
  return <div className="flex items-center gap-1 rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] pl-3 text-[#878477] [&>select]:border-0 [&>select]:bg-transparent"><CalendarDays size={16} /><select aria-label="Selected semester" value={d.semesterId} onChange={e => d.setSemesterId(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{d.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>;
}
function exportRows(name, rows) {
  const csv = rows.map(row => row.map(cell => {
    const value = String(cell ?? '');
    return `"${(/^[=+@\-\t\r]/.test(value) ? "'" : '') + value.replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
function StudentTable({
  students,
  d,
  role,
  compact = false
}) {
  return students.length ? <div className="relative overflow-x-auto"><table className="w-full border-collapse text-left whitespace-nowrap"><thead className="border-b border-[#D9D0C1] bg-[#F7F4ED]"><tr className="border-b border-[#E7DED0] last:border-0 hover:bg-[#F7F4ED]/50"><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Student</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Department</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">CGPA</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Status</th>{!compact && <th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Advisor</th>}<th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5"><span className="sr-only">Details</span></th></tr></thead><tbody>{students.map(s => {
          const result = resultFor(d, s.id);
          return <tr key={s.id} className="border-b border-[#E7DED0] last:border-0 hover:bg-[#F7F4ED]/50"><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><Link className="flex items-center gap-3 [&_strong]:block [&_strong]:text-xs [&_strong]:font-medium [&_strong]:text-[#373C32] [&_small]:mt-1 [&_small]:block [&_small]:text-[10px] [&_small]:text-[#747466] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" href={`/${role}/students/${s.id}`}><Avatar student={s} /><span><strong>{s.name}</strong><small>{s.id}</small></span></Link></td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><span className="text-[11px]">{s.department}</span></td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><span className={`text-[13px] font-semibold ${statusFor(d, s.id) === 'Probation' ? "text-[#8D4938]" : ''}`}>{result ? Number(result.cgpa).toFixed(2) : '—'}</span><small className="text-[9px] text-[#878477]"> / 4.00</small></td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><Badge status={statusFor(d, s.id)} /></td>{!compact && <td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{d.advisors.find(a => a.id === s.advisorId)?.name || 'Unassigned'}</td>}<td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><Link className="inline-flex rounded-md p-1.5 text-[#878477] hover:bg-[#EEE8DC] hover:text-[#8D4938] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" aria-label={`View ${s.name}`} href={`/${role}/students/${s.id}`}><ArrowUpRight size={17} /></Link></td></tr>;
        })}</tbody></table></div> : <Empty title="No students found" />;
}
export function Dashboard({
  role
}) {
  const d = useDemo();
  const [query, setQuery] = useState('');
  const students = visibleStudents(d, role);
  const probation = students.filter(s => statusFor(d, s.id) === 'Probation');
  const isStudent = role === 'student';
  const student = students[0];
  const result = student && resultFor(d, student.id);
  const filtered = students.filter(s => `${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()));
  const stats = isStudent ? [['Semester GPA', result ? Number(result.gpa).toFixed(2) : '—', 'Out of 4.00'], ['Cumulative GPA', result ? Number(result.cgpa).toFixed(2) : '—', 'Out of 4.00'], ['Advisor notes', d.notes.filter(n => n.studentId === d.studentId).length, 'Feedback and next steps']] : [[role === 'advisor' ? 'Your students' : 'Total students', students.length, 'In your workspace'], ['On probation', probation.length, 'May need extra support'], [role === 'advisor' ? 'Advising notes' : 'Academic advisors', role === 'advisor' ? d.notes.filter(n => n.advisorId === d.advisorId).length : d.advisors.length, role === 'advisor' ? 'Conversations recorded' : 'Here to support students']];
  const tasks = role === 'admin' ? [['Add a student', 'Create a student profile', '/admin/students/new', Users], ['Enter results', 'Record GPA and credits', '/admin/results', ClipboardList], ['Review probation', 'Check academic standing', '/admin/probation', ShieldAlert]] : role === 'advisor' ? [['View my students', 'See your assigned students', '/advisor/students', Users], ['Write an advising note', 'Share guidance and next steps', '/advisor/feedback', MessageSquare]] : [['View my results', 'See your semester results', '/student/results', BookOpen], ['Read advisor feedback', 'Find your next steps', '/student/feedback', MessageSquare], ['View probation history', 'Review your academic standing', '/student/probation', ShieldAlert]];
  return <>
    <PageHeading title={isStudent ? 'Your dashboard' : 'Dashboard'} description={isStudent ? 'Your results, academic standing, and next steps.' : 'A simple overview of your students and their progress.'}><SemesterSelect d={d} /></PageHeading>
    <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4 [&>section]:flex [&>section]:flex-col [&>section]:items-start [&>section]:gap-2.5 [&>section]:rounded-xl [&>section]:border [&>section]:border-[#D9D0C1] [&>section]:bg-[#FCFAF5] [&>section]:px-3 [&>section]:py-4 sm:[&>section]:p-6 [&_span]:min-h-8 [&_span]:text-[10px] [&_span]:text-[#747466] sm:[&_span]:min-h-0 sm:[&_span]:text-xs [&_strong]:font-serif [&_strong]:text-[32px] [&_strong]:leading-tight [&_strong]:font-normal [&_strong]:tracking-tight sm:[&_strong]:text-4xl [&_small]:min-h-7 [&_small]:text-[9px] [&_small]:leading-relaxed [&_small]:text-[#747466] sm:[&_small]:min-h-0 sm:[&_small]:text-[11px]">{stats.map(([label, value, note]) => <section key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></section>)}</div>
    <section className="mb-7 [&>h2]:mb-4 [&>h2]:font-serif [&>h2]:text-[22px] [&>h2]:font-normal [&>div]:grid [&>div]:gap-3 lg:[&>div]:grid-cols-3 [&_a]:flex [&_a]:items-center [&_a]:gap-3 [&_a]:rounded-lg [&_a]:border [&_a]:border-[#D9D0C1] [&_a]:bg-[#FCFAF5] [&_a]:p-4 [&_a]:transition-colors hover:[&_a]:border-[#BFB5A6] hover:[&_a]:bg-[#EEE8DC]/30 motion-reduce:[&_a]:transition-none [&_strong]:block [&_strong]:text-xs [&_strong]:font-medium [&_small]:mt-1 [&_small]:block [&_small]:text-[11px] [&_small]:text-[#747466] [&_a>svg]:ml-auto [&_a>svg]:text-[#878477]"><h2 className="font-serif text-xl font-normal tracking-tight">Quick actions</h2><div>{tasks.map(([title, description, href, Icon]) => <Link href={href} key={href} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EEE8DC] text-[#88917B]"><Icon size={20} /></span><span><strong>{title}</strong><small>{description}</small></span><ArrowRight size={18} /></Link>)}</div></section>
    {isStudent ? <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="flex items-center justify-between gap-4 p-5 sm:px-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466] [&>svg]:text-[#878477] [&>select]:max-w-36 [&>select]:text-[10px]"><h2 className="font-serif text-xl font-normal tracking-tight">Your academic standing</h2></div><div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6 [&>div]:flex [&>div]:flex-col [&>div]:items-start [&>div]:gap-3 [&>div>span:first-child]:text-xs [&>div>span:first-child]:text-[#747466] [&_p]:text-[11px] [&_p]:text-[#747466] [&_strong]:text-sm [&_strong]:font-medium"><div><span>Selected semester</span><Badge status={statusFor(d, d.studentId)} /><p>Fictional demonstration status</p></div><div><span>Your advisor</span><strong>{d.advisors.find(a => a.id === student?.advisorId)?.name || 'Unassigned'}</strong><Link className="inline-flex items-center gap-2 text-[11px] font-medium text-[#8D4938] hover:text-[#6F3C30] sm:text-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" href="/student/feedback">Read feedback<ArrowRight size={16} /></Link></div></div></section> : <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]" data-testid="student-overview"><div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:flex-nowrap sm:p-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:text-[#747466] [&>div:last-child]:w-full sm:[&>div:last-child]:w-64"><div><h2 className="font-serif text-xl font-normal tracking-tight">{role === 'advisor' ? 'Your students' : 'Students'}</h2><p>Search for a student to view their details.</p></div><SearchBox value={query} onChange={setQuery} placeholder="Search students..." /></div><StudentTable students={filtered.slice(0, 5)} d={d} role={role} compact /><div className="flex items-center justify-between gap-3 border-t border-[#D9D0C1] px-4 py-4 text-[10px] text-[#747466] sm:px-5 sm:text-[11px]"><span>Showing {Math.min(filtered.length, 5)} of {filtered.length} students</span><Link className="inline-flex items-center gap-2 text-[11px] font-medium text-[#8D4938] hover:text-[#6F3C30] sm:text-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" href={`/${role}/students`}>View all students<ArrowRight size={16} /></Link></div></section>}
  </>;
}
export function Students({
  role
}) {
  const d = useDemo();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [department, setDepartment] = useState('All departments');
  const [page, setPage] = useState(1);
  const students = visibleStudents(d, role).filter(s => `${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || statusFor(d, s.id) === status) && (department === 'All departments' || s.department === department));
  const pages = Math.max(1, Math.ceil(students.length / 6));
  const current = Math.min(page, pages);
  return <><PageHeading eyebrow="STUDENT DIRECTORY" title={role === 'advisor' ? 'Your students' : 'Students'} description="Know their journey. Help shape what comes next."><SemesterSelect d={d} />{role === 'admin' && <Link className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]" href="/admin/students/new"><Plus size={17} />Add student</Link>}</PageHeading><section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 [&>div:first-child]:w-full lg:[&>div:first-child]:w-72"><SearchBox value={query} onChange={v => {
          setQuery(v);
          setPage(1);
        }} /><div className="flex w-full flex-wrap items-center gap-2 lg:w-auto [&>select]:min-w-0 [&>select]:flex-1 [&>select]:text-[10px] sm:[&>select]:text-xs"><select aria-label="Filter department" value={department} onChange={e => {
            setDepartment(e.target.value);
            setPage(1);
          }} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60"><option>All departments</option>{departments.map(dep => <option key={dep}>{dep}</option>)}</select><select aria-label="Filter status" value={status} onChange={e => {
            setStatus(e.target.value);
            setPage(1);
          }} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{['All statuses', 'Good standing', 'Probation', 'Recovered', 'Unevaluated'].map(s => <option key={s}>{s}</option>)}</select><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#D9D0C1] bg-[#FCFAF5] text-[#58674E] hover:border-[#C8BFB1] hover:bg-[#F7F4ED]" title="Export filtered students" onClick={() => exportRows('students', [['ID', 'Name', 'Department', 'Status'], ...students.map(s => [s.id, s.name, s.department, statusFor(d, s.id)])])}><Download size={16} /><span>Export</span></button></div></div><StudentTable students={students.slice((current - 1) * 6, current * 6)} d={d} role={role} /><div className="flex items-center justify-between gap-3 border-t border-[#D9D0C1] px-4 py-4 text-[10px] text-[#747466] sm:px-5 sm:text-[11px]"><span>{students.length} students · Page {current} of {pages}</span><div className="flex items-center gap-1.5 [&_button]:flex [&_button]:size-7 [&_button]:cursor-pointer [&_button]:items-center [&_button]:justify-center [&_button]:rounded-md [&_button]:border [&_button]:border-[#D9D0C1] [&_button]:bg-[#FCFAF5] [&_button]:text-[#747466] [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-40 [&>span]:rounded-md [&>span]:bg-[#EEE8DC] [&>span]:px-2.5 [&>span]:py-1.5 [&>span]:text-[#8D4938]"><button aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]"><ChevronLeft size={16} /></button><span>{current}</span><button aria-label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]"><ChevronRight size={16} /></button></div></div></section></>;
}
export function StudentDetail({
  role,
  id
}) {
  const d = useDemo();
  const isNew = id === 'new';
  const student = visibleStudents(d, role).find(s => s.id === id);
  if (isNew && role === 'admin') return <StudentForm />;
  if (!student) return <Empty title="Student not found">Select a student from your directory.</Empty>;
  return <><Link className="mb-5 inline-flex items-center gap-2 text-xs text-[#747466] hover:text-[#8D4938] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" href={`/${role}/students`}><ArrowLeft size={16} />Back to students</Link><PageHeading eyebrow="STUDENT PROFILE" title={student.name} description={`${student.id} · ${student.department}`}><SemesterSelect d={d} /><Badge status={statusFor(d, student.id)} /></PageHeading><div className="mb-7 grid items-start gap-6 xl:grid-cols-[1fr_1.15fr]">{role === 'admin' ? <StudentForm student={student} /> : <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1]"><Avatar student={student} /><h2 className="font-serif text-xl font-normal tracking-tight">{student.name}</h2><p className="text-[11px] text-[#747466]">{student.email}</p><hr /><p>{student.department}</p><p>Advisor: {d.advisors.find(a => a.id === student.advisorId)?.name || 'Unassigned'}</p></section>}<section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="flex items-center justify-between gap-4 p-5 sm:px-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466] [&>svg]:text-[#878477] [&>select]:max-w-36 [&>select]:text-[10px]"><div><h2 className="font-serif text-xl font-normal tracking-tight">Academic history</h2><p>Results across semesters</p></div><BookOpen size={20} /></div><ResultTable d={d} students={[student]} allSemesters /><div className="flex items-center justify-between gap-4 p-5 sm:px-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466] [&>svg]:text-[#878477] [&>select]:max-w-36 [&>select]:text-[10px]"><div><h2 className="font-serif text-xl font-normal tracking-tight">Probation history</h2><p>Predefined fictional evaluations</p></div></div><CaseList d={d} students={[student]} allSemesters /></section></div><Feedback role={role} fixedStudent={student} embedded /></>;
}
function StudentForm({
  student
}) {
  const d = useDemo();
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.id = data.id.trim();
    data.name = data.name.trim();
    data.email = data.email.trim();
    if (!data.id || !data.name) return setError('Student ID and name cannot be blank.');
    if (d.students.some(s => s.id.toLowerCase() === data.id.toLowerCase() && s.id !== student?.id)) return setError('A student with this ID already exists.');
    setBusy(true);
    await new Promise(resolve => setTimeout(resolve, 250));
    if (student) d.setStudents(prev => prev.map(s => s.id === student.id ? {
      ...s,
      ...data
    } : s));else d.setStudents(prev => [...prev, {
      ...data,
      color: 'blue'
    }]);
    setBusy(false);
    d.notify(student ? 'Student details updated in demo state.' : 'Student added to the demo directory.');
    if (!student) router.push(`/admin/students/${encodeURIComponent(data.id)}`);
  }
  return <>{!student && <><Link className="mb-5 inline-flex items-center gap-2 text-xs text-[#747466] hover:text-[#8D4938] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" href="/admin/students"><ArrowLeft size={16} />Back to students</Link><PageHeading eyebrow="STUDENT DIRECTORY" title="Add a student" description="Create a fictional student record for this demo." /></>}<section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1]"><div className="mb-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466]"><h2 className="font-serif text-xl font-normal tracking-tight">{student ? 'Student details' : 'Student information'}</h2><p>Fields marked * are required.</p></div><form onSubmit={submit} className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Student ID *"><input required name="id" defaultValue={student?.id} readOnly={Boolean(student)} placeholder="e.g. 24-10984-1" maxLength={40} /></Field><Field label="Full name *"><input required name="name" defaultValue={student?.name} placeholder="Student full name" maxLength={100} /></Field><Field label="Email address *"><input required name="email" type="email" defaultValue={student?.email} placeholder="student@example.edu" /></Field><Field label="Department *"><select required name="department" defaultValue={student?.department || ''} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60"><option value="" disabled>Select department</option>{departments.map(dep => <option key={dep}>{dep}</option>)}</select></Field><Field label="Assigned advisor *"><select required name="advisorId" defaultValue={student?.advisorId || ''} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60"><option value="" disabled>Select advisor</option>{d.advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>{error && <p className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline col-span-full" role="alert">{error}</p>}<div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-[#D9D0C1] pt-5 [&>button]:ml-auto col-span-full"><span className="text-[11px] text-[#747466]">Saved for this demo session only.</span><button disabled={busy} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]" type="submit"><Check size={16} />{busy ? 'Saving...' : student ? 'Save changes' : 'Add student'}</button></div></form></section></>;
}
function ResultTable({
  d,
  students,
  allSemesters = false
}) {
  const results = d.results.filter(r => students.some(s => s.id === r.studentId) && (allSemesters || r.semesterId === d.semesterId));
  if (!results.length) return <Empty title="No results yet">There are no academic results for this selection.</Empty>;
  return <div className="relative overflow-x-auto"><table className="w-full border-collapse text-left whitespace-nowrap"><thead className="border-b border-[#D9D0C1] bg-[#F7F4ED]"><tr className="border-b border-[#E7DED0] last:border-0 hover:bg-[#F7F4ED]/50"><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Student / Semester</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">GPA</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">CGPA</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Credits</th></tr></thead><tbody>{results.map(r => <tr key={r.id} className="border-b border-[#E7DED0] last:border-0 hover:bg-[#F7F4ED]/50"><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><strong className="text-xs font-medium text-[#373C32]">{students.find(s => s.id === r.studentId)?.name}</strong><small className="mt-1.5 block text-[10px] text-[#747466]">{d.semesters.find(s => s.id === r.semesterId)?.name}</small></td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{Number(r.gpa).toFixed(2)}</td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{Number(r.cgpa).toFixed(2)}</td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{r.credits}</td></tr>)}</tbody></table></div>;
}
export function Results({
  role
}) {
  const d = useDemo();
  const students = visibleStudents(d, role);
  return <><PageHeading eyebrow="ACADEMIC RECORDS" title={role === 'student' ? 'Your academic results' : 'Academic results'} description="A semester-by-semester picture of academic progress."><SemesterSelect d={d} /><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#D9D0C1] bg-[#FCFAF5] text-[#58674E] hover:border-[#C8BFB1] hover:bg-[#F7F4ED]" onClick={() => exportRows('academic-results', [['Student ID', 'Semester', 'GPA', 'CGPA', 'Credits'], ...d.results.filter(r => students.some(s => s.id === r.studentId) && r.semesterId === d.semesterId).map(r => [r.studentId, d.semesters.find(s => s.id === r.semesterId)?.name, r.gpa, r.cgpa, r.credits])])}><Download size={16} />Export results</button></PageHeading><div className={role === 'admin' ? "mb-7 grid items-start gap-6 xl:grid-cols-[1fr_1.15fr]" : ''}>{role === 'admin' && <ResultForm />}<section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="flex items-center justify-between gap-4 p-5 sm:px-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466] [&>svg]:text-[#878477] [&>select]:max-w-36 [&>select]:text-[10px]"><div><h2 className="font-serif text-xl font-normal tracking-tight">{role === 'student' ? 'Semester results' : 'Recorded results'}</h2><p>Fictional records · GPA scale 0.00–4.00</p></div><ClipboardList size={20} /></div><ResultTable d={d} students={students} /><div className="flex items-center gap-2 border-t border-[#D9D0C1] bg-[#F7F4ED] px-5 py-4 text-[11px] leading-relaxed text-[#747466]"><Info size={15} />The GPA scale is a demo setting. Confirm your institution’s scale.</div></section></div></>;
}
function ResultForm() {
  const d = useDemo();
  const [selected, setSelected] = useState(d.students[0]?.id || '');
  const [semester, setSemester] = useState(d.semesterId);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const existing = d.results.find(r => r.studentId === selected && r.semesterId === semester);
  async function submit(e) {
    e.preventDefault();
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const gpa = Number(data.gpa),
      cgpa = Number(data.cgpa),
      credits = Number(data.credits);
    if (![gpa, cgpa, credits].every(Number.isFinite) || gpa < 0 || gpa > 4 || cgpa < 0 || cgpa > 4 || !Number.isInteger(credits) || credits < 0 || credits > 30) return setError('Use GPA values between 0 and 4, and whole credits between 0 and 30.');
    if (!d.students.some(s => s.id === selected) || !d.semesters.some(s => s.id === semester)) return setError('Select a valid student and semester.');
    setBusy(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const record = {
      id: existing?.id || uid(),
      studentId: selected,
      semesterId: semester,
      gpa,
      cgpa,
      credits
    };
    d.setResults(prev => [...prev.filter(r => !(r.studentId === selected && r.semesterId === semester)), record]);
    d.setCases(prev => prev.filter(c => !(c.studentId === selected && c.semesterId === semester)));
    d.setSemesterId(semester);
    setBusy(false);
    d.notify('Demo result saved. Its evaluation was cleared so you can review it again.');
  }
  return <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1]"><div className="mb-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466]"><h2 className="font-serif text-xl font-normal tracking-tight">Enter academic results</h2><p>Use fictional results for this demonstration.</p></div><form onSubmit={submit} className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Student *"><select required value={selected} onChange={e => setSelected(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{d.students.map(s => <option key={s.id} value={s.id}>{s.name} · {s.id}</option>)}</select></Field><Field label="Semester *"><select required value={semester} onChange={e => setSemester(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{d.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><div key={`${selected}-${semester}-${existing?.id || 'new'}`} className="grid grid-cols-1 gap-5 sm:grid-cols-2 col-span-full"><Field label="Semester GPA *" hint="Demo scale: 0.00–4.00"><input required type="number" min="0" max="4" step="0.01" name="gpa" defaultValue={existing?.gpa ?? ''} placeholder="0.00" /></Field><Field label="Cumulative GPA *" hint="Demo scale: 0.00–4.00"><input required type="number" min="0" max="4" step="0.01" name="cgpa" defaultValue={existing?.cgpa ?? ''} placeholder="0.00" /></Field><Field label="Semester credits *"><input required type="number" min="0" max="30" step="1" name="credits" defaultValue={existing?.credits ?? ''} placeholder="15" /></Field></div>{existing && <div className="flex items-start gap-2.5 rounded-lg border border-[#D9D0C1] bg-[#EEE8DC]/60 px-4 py-3 text-xs leading-relaxed text-[#6F3C30]/80 [&>svg]:mt-0.5 [&>svg]:shrink-0 col-span-full"><Info size={16} />Saving replaces this student’s existing result for the selected semester.</div>}{error && <p role="alert" className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline col-span-full">{error}</p>}<div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-[#D9D0C1] pt-5 [&>button]:ml-auto col-span-full"><span className="text-[11px] text-[#747466]">In-memory demo record</span><button disabled={busy || !selected} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]"><Check size={16} />{busy ? 'Saving...' : 'Save result'}</button></div></form></section>;
}
function CaseList({
  d,
  students,
  allSemesters = false,
  status = 'All statuses'
}) {
  const cases = d.cases.filter(c => students.some(s => s.id === c.studentId) && (allSemesters || c.semesterId === d.semesterId) && (status === 'All statuses' || c.status === status)).slice().sort((a, b) => b.date.localeCompare(a.date));
  if (!cases.length) return <Empty title="No evaluations to display">A student without an evaluation is shown as unevaluated.</Empty>;
  return <div className="divide-y divide-[#E7DED0]">{cases.map(c => <div className="border-t border-[#E7DED0] p-5 [&>p]:mt-3.5 [&>p]:text-xs [&>p]:leading-relaxed [&>p]:text-[#747466]" key={c.id} data-testid="evaluation-record"><div className="flex items-start justify-between gap-3 sm:items-center [&_strong]:block [&_strong]:text-xs [&_strong]:font-medium [&_strong]:text-[#58674E] [&_small]:mt-1.5 [&_small]:block [&_small]:text-[11px] [&_small]:text-[#747466]"><div><strong>{students.find(s => s.id === c.studentId)?.name}</strong><small>{d.semesters.find(s => s.id === c.semesterId)?.name} · {displayDate(c.date)}</small></div><Badge status={c.status} /></div><p>{c.reason}</p></div>)}</div>;
}
export function Probation({
  role
}) {
  const d = useDemo();
  const students = visibleStudents(d, role);
  const [status, setStatus] = useState('All statuses');
  return <><PageHeading eyebrow="GUIDANCE & RECOVERY" title={role === 'student' ? 'Your probation history' : 'Probation records'} description="Understand the journey and support the next step forward."><SemesterSelect d={d} /></PageHeading><div className="flex items-start gap-2.5 rounded-lg border border-[#D9D0C1] bg-[#EEE8DC]/60 px-4 py-3 text-xs leading-relaxed text-[#6F3C30]/80 [&>svg]:mt-0.5 [&>svg]:shrink-0 mb-6"><Info size={17} />All evaluations are predefined fictional examples, not official academic decisions.</div><div className={role === 'admin' ? "mb-7 grid items-start gap-6 xl:grid-cols-[1fr_1.15fr]" : ''}>{role === 'admin' && <EvaluationForm />}<section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="flex items-center justify-between gap-4 p-5 sm:px-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466] [&>svg]:text-[#878477] [&>select]:max-w-36 [&>select]:text-[10px]"><div><h2 className="font-serif text-xl font-normal tracking-tight">Evaluation history</h2><p>Previous semester records stay available in student profiles.</p></div><select aria-label="Filter evaluations by status" value={status} onChange={e => setStatus(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{['All statuses', 'Probation', 'Good standing', 'Recovered'].map(s => <option key={s}>{s}</option>)}</select></div><CaseList d={d} students={students} status={status} /></section></div></>;
}
function EvaluationForm() {
  const d = useDemo();
  const [studentId, setStudentId] = useState(d.students[0]?.id || '');
  const [example, setExample] = useState('Probation');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const hasResult = d.results.some(r => r.studentId === studentId && r.semesterId === d.semesterId);
  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!hasResult) return setError('Enter a result for this student and semester first.');
    setBusy(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    const reasons = {
      Probation: 'Fictional probation example: arrange an advisor meeting and create a study plan.',
      'Good standing': 'Fictional good-standing example: continue regular study and academic check-ins.',
      Recovered: 'Fictional recovery example: acknowledge progress and continue the agreed support plan.'
    };
    const record = {
      id: uid(),
      studentId,
      semesterId: d.semesterId,
      status: example,
      reason: reasons[example],
      date: today()
    };
    d.setCases(prev => [...prev.filter(c => !(c.studentId === studentId && c.semesterId === d.semesterId)), record]);
    setBusy(false);
    d.notify('Demo evaluation displayed. Earlier semester history is preserved.');
  }
  return <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1]"><div className="mb-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466]"><h2 className="font-serif text-xl font-normal tracking-tight">Simulate an evaluation</h2><p>Choose a fictional outcome to preview the interface.</p></div><form onSubmit={submit} className="grid gap-5"><Field label="Student *"><select required value={studentId} onChange={e => {
          setStudentId(e.target.value);
          setError('');
        }} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{d.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Semester"><input readOnly value={d.semesters.find(s => s.id === d.semesterId)?.name || ''} /></Field><Field label="Predefined demo outcome *"><select value={example} onChange={e => setExample(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{['Probation', 'Good standing', 'Recovered'].map(s => <option key={s}>{s}</option>)}</select></Field>{!hasResult && <p className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline">No academic result exists for this selection. <Link href="/admin/results" className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]">Enter a result first.</Link></p>}{error && <p role="alert" className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline">{error}</p>}<div className="flex items-start gap-2.5 rounded-lg border border-[#D9D0C1] bg-[#EEE8DC]/60 px-4 py-3 text-xs leading-relaxed text-[#6F3C30]/80 [&>svg]:mt-0.5 [&>svg]:shrink-0"><Info size={16} />This selects a demo status without applying academic policy. A repeat evaluation replaces the same semester’s example.</div><button disabled={busy || !hasResult} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]"><ShieldAlert size={16} />{busy ? 'Simulating...' : 'Run demo evaluation'}</button></form></section>;
}
export function Advisors() {
  const d = useDemo();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.name = data.name.trim();
    data.email = data.email.trim();
    if (!data.name) return setError('Enter an advisor name.');
    if (d.advisors.some(a => a.email.toLowerCase() === data.email.toLowerCase())) return setError('An advisor with this email already exists.');
    d.setAdvisors(prev => [...prev, {
      id: uid(),
      ...data
    }]);
    setShowForm(false);
    setError('');
    d.notify('Advisor added to the demo workspace.');
  }
  return <><PageHeading eyebrow="A NETWORK OF SUPPORT" title="Academic advisors" description="The people helping every student find their path."><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]" onClick={() => setShowForm(!showForm)}>{showForm ? <X size={17} /> : <Plus size={17} />}{showForm ? 'Close form' : 'Add advisor'}</button></PageHeading>{showForm && <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1] mb-6"><div className="mb-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466]"><h2 className="font-serif text-xl font-normal tracking-tight">Add an advisor</h2></div><form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={submit}><Field label="Full name *"><input name="name" required maxLength={100} placeholder="Dr. Taylor Smith" /></Field><Field label="Email *"><input name="email" type="email" required placeholder="advisor@example.edu" /></Field><Field label="Department *"><select name="department" required className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{departments.map(dep => <option key={dep}>{dep}</option>)}</select></Field>{error && <p className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline" role="alert">{error}</p>}<div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-[#D9D0C1] pt-5 [&>button]:ml-auto col-span-full"><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]"><Plus size={16} />Add advisor</button></div></form></section>}<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{d.advisors.map((a, i) => <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] px-5 py-8 text-center [&>span:first-child]:size-15 [&>span:first-child]:text-lg [&>h2]:mt-4 [&>h2]:font-serif [&>h2]:text-[22px] [&>h2]:font-normal [&>p]:mt-2 [&>p]:text-xs [&>p]:text-[#747466] [&>a]:mt-2 [&>a]:block [&>a]:text-xs [&>a]:text-[#8D4938] [&>a]:wrap-anywhere [&>button]:mt-5 [&>button]:w-full" key={a.id}><Avatar student={{
          name: a.name.replace('Dr. ', ''),
          color: ['blue', 'purple', 'green'][i % 3]
        }} /><h2 className="font-serif text-xl font-normal tracking-tight">{a.name}</h2><p>{a.department}</p><a href={`mailto:${a.email}`} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]">{a.email}</a><div className="mt-6 flex items-center justify-center gap-2 border-t border-[#D9D0C1] pt-5 text-xs text-[#747466] [&_strong]:font-medium"><Users size={17} /><strong>{d.students.filter(s => s.advisorId === a.id).length}</strong>assigned students</div><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#D9D0C1] bg-[#FCFAF5] text-[#58674E] hover:border-[#C8BFB1] hover:bg-[#F7F4ED]" onClick={() => {
          d.setAdvisorId(a.id);
          d.notify(`Demo advisor selected: ${a.name}`);
        }}><UserRoundCheck size={16} />{d.advisorId === a.id ? 'Selected demo advisor' : 'Select demo advisor'}</button></section>)}</div><div className="flex items-start gap-2.5 rounded-lg border border-[#D9D0C1] bg-[#EEE8DC]/60 px-4 py-3 text-xs leading-relaxed text-[#6F3C30]/80 [&>svg]:mt-0.5 [&>svg]:shrink-0 mt-6"><Info size={16} />Select an advisor, then switch to the Advisor role to explore their assigned students.</div></>;
}
export function Semesters() {
  const d = useDemo();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.name = data.name.trim();
    if (!data.name) return setError('Enter a semester name.');
    if (data.start >= data.end) return setError('The end date must be after the start date.');
    if (d.semesters.some(s => s.name.toLowerCase() === data.name.toLowerCase())) return setError('A semester with this name already exists.');
    d.setSemesters(prev => [...prev, {
      id: uid(),
      ...data
    }].sort((a, b) => b.start.localeCompare(a.start)));
    setShowForm(false);
    setError('');
    d.notify('Semester added. It is now available throughout the workspace.');
  }
  return <><PageHeading eyebrow="THE ACADEMIC CALENDAR" title="Semesters" description="Organize academic records, one semester at a time."><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]" onClick={() => setShowForm(!showForm)}>{showForm ? <X size={17} /> : <Plus size={17} />}{showForm ? 'Close form' : 'Add semester'}</button></PageHeading>{showForm && <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1] mb-6"><form onSubmit={submit} className="grid grid-cols-1 gap-5 sm:grid-cols-2"><Field label="Semester name *"><input name="name" required placeholder="Spring 2027" maxLength={60} /></Field><Field label="Start date *"><input required type="date" name="start" /></Field><Field label="End date *"><input required type="date" name="end" /></Field>{error && <p className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline" role="alert">{error}</p>}<div className="mt-1 flex flex-wrap items-center justify-between gap-4 border-t border-[#D9D0C1] pt-5 [&>button]:ml-auto col-span-full"><button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]"><Plus size={16} />Add semester</button></div></form></section>}<section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="relative overflow-x-auto"><table className="w-full border-collapse text-left whitespace-nowrap"><thead className="border-b border-[#D9D0C1] bg-[#F7F4ED]"><tr className="border-b border-[#E7DED0] last:border-0 hover:bg-[#F7F4ED]/50"><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Semester</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Start date</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">End date</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Result records</th><th className="px-4 py-3 text-[11px] font-medium text-[#747466] sm:px-5">Selection</th></tr></thead><tbody>{d.semesters.map(s => <tr key={s.id} className="border-b border-[#E7DED0] last:border-0 hover:bg-[#F7F4ED]/50"><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><span className="flex items-center gap-3 text-[#58674E]"><CalendarDays size={18} />{s.name}</span></td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{displayDate(s.start)}</td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{displayDate(s.end)}</td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5">{d.results.filter(r => r.semesterId === s.id).length}</td><td className="px-4 py-4 text-xs text-[#747466] sm:px-5"><button className={d.semesterId === s.id ? "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#D8DECF] bg-[#EDF0E7] text-[#58674E] hover:bg-[#EDF0E7]" : "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#D9D0C1] bg-[#FCFAF5] text-[#58674E] hover:border-[#C8BFB1] hover:bg-[#F7F4ED]"} onClick={() => {
                  d.setSemesterId(s.id);
                  d.notify(`${s.name} selected for the workspace.`);
                }}>{d.semesterId === s.id ? <><Check size={15} />Selected</> : 'Select semester'}</button></td></tr>)}</tbody></table></div></section></>;
}
export function Feedback({
  role,
  fixedStudent,
  embedded = false
}) {
  const d = useDemo();
  const students = fixedStudent ? [fixedStudent] : visibleStudents(d, role);
  const [selected, setSelected] = useState(fixedStudent?.id || students[0]?.id || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const notes = d.notes.filter(n => students.some(s => s.id === n.studentId)).slice().sort((a, b) => b.date.localeCompare(a.date));
  const canWrite = role === 'advisor';
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setError('');
    if (!data.note.trim() || !data.plan.trim()) return setError('Enter both a meeting note and an action plan.');
    const target = fixedStudent?.id || selected;
    if (!students.some(s => s.id === target && s.advisorId === d.advisorId)) return setError('Select one of your assigned demo students.');
    setBusy(true);
    await new Promise(resolve => setTimeout(resolve, 250));
    d.setNotes(prev => [...prev, {
      id: uid(),
      studentId: target,
      advisorId: d.advisorId,
      semesterId: d.semesterId,
      date: data.date,
      note: data.note.trim(),
      plan: data.plan.trim()
    }]);
    setBusy(false);
    form.reset();
    d.notify('Advising note added. The student can view it in their feedback.');
  }
  return <>{embedded ? <div className="mb-4 flex items-center justify-between gap-4 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:text-[#747466]"><div><h2 className="font-serif text-xl font-normal tracking-tight">Advising notes & action plans</h2><p>Conversations that help students move forward.</p></div></div> : <PageHeading eyebrow="CONVERSATIONS THAT COUNT" title={role === 'student' ? 'Your advisor’s feedback' : 'Advising notes'} description="Thoughtful guidance and practical steps for the semester ahead."><SemesterSelect d={d} /></PageHeading>}<div className={canWrite ? "mb-7 grid items-start gap-6 xl:grid-cols-[1fr_1.15fr]" : ''}>{canWrite && <section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5] p-5 sm:p-6 [&>h2]:mt-4 [&>h2]:mb-2 [&>p]:leading-relaxed [&>hr]:my-5 [&>hr]:border-[#D9D0C1]"><div className="mb-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466]"><h2 className="font-serif text-xl font-normal tracking-tight">Add an advising note</h2><p>Keep guidance clear, supportive, and actionable.</p></div><form onSubmit={submit} className="grid gap-5"><Field label="Student *"><select required value={fixedStudent?.id || selected} onChange={e => setSelected(e.target.value)} disabled={Boolean(fixedStudent)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Meeting date *"><input required type="date" name="date" defaultValue={today()} max={today()} /></Field><Field label="Meeting note *"><textarea required name="note" rows={4} maxLength={2000} placeholder="What did you discuss?" /></Field><Field label="Action plan *"><textarea required name="plan" rows={3} maxLength={2000} placeholder="What are the next steps?" /></Field>{error && <p className="rounded-lg border border-[#E5D2C4] bg-[#F3E8DD] p-3 text-xs leading-relaxed text-[#8D4938] [&_a]:underline" role="alert">{error}</p>}<button disabled={busy || !students.length} className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]"><Plus size={16} />{busy ? 'Adding note...' : 'Add advising note'}</button></form></section>}<section className="min-w-0 overflow-hidden rounded-xl border border-[#D9D0C1] bg-[#FCFAF5]"><div className="flex items-center justify-between gap-4 p-5 sm:px-6 [&_h2]:font-serif [&_h2]:text-[22px] [&_h2]:font-normal [&_p]:mt-1.5 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-[#747466] [&>svg]:text-[#878477] [&>select]:max-w-36 [&>select]:text-[10px]"><div><h2 className="font-serif text-xl font-normal tracking-tight">{role === 'student' ? 'Feedback & next steps' : 'Note history'}</h2><p>{notes.length} {notes.length === 1 ? 'conversation' : 'conversations'} across all semesters</p></div><MessageSquare size={19} /></div>{notes.length ? notes.map(n => {
          const student = d.students.find(s => s.id === n.studentId);
          return <article className="border-t border-[#E7DED0] p-5 [&>p]:mt-2.5 [&>p]:text-[13px] [&>p]:leading-relaxed [&>p]:text-[#747466]" key={n.id} data-testid="advising-note"><div className="flex items-center justify-between gap-3 [&>small]:text-[10px] [&>small]:text-[#747466]"><div className="flex items-center gap-3 [&_strong]:block [&_strong]:text-xs [&_strong]:font-medium [&_strong]:text-[#373C32] [&_small]:mt-1 [&_small]:block [&_small]:text-[10px] [&_small]:text-[#747466]"><Avatar student={student} small /><span><strong>{student.name}</strong><small>{d.advisors.find(a => a.id === n.advisorId)?.name}</small></span></div><small>{displayDate(n.date)}</small></div><span className="mt-4 block text-[9px] tracking-wider text-[#747466] uppercase">{d.semesters.find(s => s.id === n.semesterId)?.name}</span><p>{n.note}</p><div className="mt-4 rounded-lg border border-[#D8DECF] bg-[#EDF0E7]/50 p-3.5 [&>strong]:flex [&>strong]:items-center [&>strong]:gap-2 [&>strong]:text-xs [&>strong]:font-medium [&>strong]:text-[#58674E] [&>p]:mt-1.5 [&>p]:text-xs [&>p]:leading-relaxed [&>p]:text-[#58674E]/80"><strong><CircleCheck size={15} />Action plan</strong><p>{n.plan}</p></div></article>;
        }) : <Empty title="No advising notes yet">New notes and action plans will appear here.</Empty>}</section></div></>;
}
export function Login() {
  const d = useDemo();
  const router = useRouter();
  const [role, setRole] = useState('admin');
  return <main className="grid min-h-screen bg-[#FCFAF5] md:grid-cols-2"><section className="relative flex flex-col overflow-hidden bg-[#373F32] px-7 py-8 text-[#F7F4ED] md:px-12 md:py-12 [&>div]:my-auto [&>div]:py-10 [&_h1]:my-6 [&_h1]:font-serif [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:font-normal [&_h1]:tracking-tight lg:[&_h1]:text-7xl [&_em]:font-serif [&_em]:font-normal [&_em]:text-[#88917B] [&_p]:max-w-sm [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[#878477]"><Link className="flex items-center gap-2.5 text-2xl font-bold tracking-tight [&_small]:mt-1.5 [&_small]:block [&_small]:text-[7px] [&_small]:font-normal [&_small]:tracking-widest [&_small]:text-[#878477] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938]" href="/"><span className="flex items-center justify-center text-[#88917B]"><GraduationCap size={28} /></span><span>academia<span className="text-[#88917B]">.</span><small>STUDENT SUCCESS PLATFORM</small></span></Link><div><div className="text-[9px] font-medium tracking-widest text-[#878477]">A LITTLE GUIDANCE. A BRIGHTER FUTURE.</div><h1>Every student<br />has a way<br /><em>forward.</em></h1><p>A thoughtful workspace for academic progress, meaningful conversations, and new beginnings.</p></div><span className="hidden text-[11px] text-[#878477] md:block">Built around the people behind the numbers.</span></section><section className="flex flex-col items-center justify-center gap-10 px-7 py-10 md:px-10"><form className="my-auto flex w-full max-w-sm flex-col gap-5 [&>h2]:font-serif [&>h2]:text-4xl [&>h2]:font-normal [&>h2]:tracking-tight [&>p]:-mt-2 [&>p]:text-xs [&>p]:text-[#747466] [&>button]:justify-between" onSubmit={e => {
        e.preventDefault();
        router.push(`/${role}/dashboard`);
      }}><span className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-[#EEE8DC] text-[#8D4938]"><GraduationCap size={30} /></span><div className="text-[9px] font-medium tracking-widest text-[#878477]">WELCOME TO YOUR WORKSPACE</div><h2 className="font-serif text-xl font-normal tracking-tight">Good to see you.</h2><p>Choose a demo role to explore Academia.</p><Field label="View the workspace as"><select value={role} onChange={e => setRole(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60"><option value="admin">Academic Officer</option><option value="advisor">Academic Advisor</option><option value="student">Student</option></select></Field>{role === 'advisor' && <Field label="Demo advisor"><select value={d.advisorId} onChange={e => d.setAdvisorId(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{d.advisors.map(a => <option value={a.id} key={a.id}>{a.name}</option>)}</select></Field>}{role === 'student' && <Field label="Demo student"><select value={d.studentId} onChange={e => d.setStudentId(e.target.value)} className="min-h-10 min-w-0 cursor-pointer rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2 text-xs text-[#58674E] outline-none focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] disabled:cursor-not-allowed disabled:opacity-60">{d.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>}<button className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D4938] border-[#373F32] bg-[#373F32] text-[#F7F4ED] hover:border-[#505A47] hover:bg-[#505A47]">Enter demo workspace<ArrowRight size={17} /></button><div className="flex items-start gap-2.5 rounded-lg border border-[#D9D0C1] bg-[#EEE8DC]/60 px-4 py-3 text-xs leading-relaxed text-[#6F3C30]/80 [&>svg]:mt-0.5 [&>svg]:shrink-0"><Info size={17} /><span>This is a frontend demonstration with fictional records. Changes reset when you refresh.</span></div></form><small className="text-[10px] text-[#747466]">© 2026 Academia · Student success starts here.</small></section></main>;
}
