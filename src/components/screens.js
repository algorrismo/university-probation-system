'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, ShieldAlert, UserRoundCheck, ArrowUpRight, ArrowRight, Plus, ChevronRight, ChevronLeft, CalendarDays, Download, X, Check, GraduationCap, BookOpen, MessageSquare, ClipboardList, ArrowLeft, CircleCheck, Info } from 'lucide-react';
import { useDemo } from '@/context/demo-context';
import { Avatar, Badge, Empty, Field, PageHeading, SearchBox } from './ui';

const departments = ['Computer Science', 'Business Administration', 'Electrical Engineering'];
function today() { return new Date().toISOString().slice(0, 10); }
function uid() { return crypto.randomUUID(); }
function displayDate(date) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function visibleStudents(d, role) { return d.students.filter(s => role === 'student' ? s.id === d.studentId : role === 'advisor' ? s.advisorId === d.advisorId : true); }
function statusFor(d, id, semesterId = d.semesterId) { return d.cases.find(c => c.studentId === id && c.semesterId === semesterId)?.status || 'Unevaluated'; }
function resultFor(d, id) { return d.results.find(r => r.studentId === id && r.semesterId === d.semesterId); }
function SemesterSelect({ d }) { return <div className="semester-select"><CalendarDays size={16} /><select aria-label="Selected semester" value={d.semesterId} onChange={e => d.setSemesterId(e.target.value)}>{d.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>; }
function exportRows(name, rows) {
  const csv = rows.map(row => row.map(cell => { const value = String(cell ?? ''); return `"${(/^[=+@\-\t\r]/.test(value) ? "'" : '') + value.replaceAll('"', '""')}"`; }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = `${name}.csv`; link.click(); URL.revokeObjectURL(url);
}
function StudentTable({ students, d, role, compact = false }) {
  return students.length ? <div className="table-scroll"><table><thead><tr><th>Student</th><th>Department</th><th>CGPA</th><th>Status</th>{!compact && <th>Advisor</th>}<th><span className="sr-only">Details</span></th></tr></thead><tbody>{students.map(s => { const result = resultFor(d, s.id); return <tr key={s.id}><td><Link className="student-cell" href={`/${role}/students/${s.id}`}><Avatar student={s} /><span><strong>{s.name}</strong><small>{s.id}</small></span></Link></td><td><span className="department">{s.department}</span></td><td><span className={`gpa ${statusFor(d, s.id) === 'Probation' ? 'gpa-low' : ''}`}>{result ? Number(result.cgpa).toFixed(2) : '—'}</span><small className="gpa-scale"> / 4.00</small></td><td><Badge status={statusFor(d, s.id)} /></td>{!compact && <td>{d.advisors.find(a => a.id === s.advisorId)?.name || 'Unassigned'}</td>}<td><Link className="row-arrow" aria-label={`View ${s.name}`} href={`/${role}/students/${s.id}`}><ArrowUpRight size={17} /></Link></td></tr>; })}</tbody></table></div> : <Empty title="No students found" />;
}

export function Dashboard({ role }) {
  const d = useDemo();
  const [query, setQuery] = useState('');
  const students = visibleStudents(d, role);
  const probation = students.filter(s => statusFor(d, s.id) === 'Probation');
  const isStudent = role === 'student';
  const student = students[0];
  const result = student && resultFor(d, student.id);
  const filtered = students.filter(s => `${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()));
  const stats = isStudent ? [
    ['Semester GPA', result ? Number(result.gpa).toFixed(2) : '—', 'Out of 4.00'],
    ['Cumulative GPA', result ? Number(result.cgpa).toFixed(2) : '—', 'Out of 4.00'],
    ['Advisor notes', d.notes.filter(n => n.studentId === d.studentId).length, 'Feedback and next steps'],
  ] : [
    [role === 'advisor' ? 'Your students' : 'Total students', students.length, 'In your workspace'],
    ['On probation', probation.length, 'May need extra support'],
    [role === 'advisor' ? 'Advising notes' : 'Academic advisors', role === 'advisor' ? d.notes.filter(n => n.advisorId === d.advisorId).length : d.advisors.length, role === 'advisor' ? 'Conversations recorded' : 'Here to support students'],
  ];
  const tasks = role === 'admin' ? [
    ['Add a student', 'Create a student profile', '/admin/students/new', Users],
    ['Enter results', 'Record GPA and credits', '/admin/results', ClipboardList],
    ['Review probation', 'Check academic standing', '/admin/probation', ShieldAlert],
  ] : role === 'advisor' ? [
    ['View my students', 'See your assigned students', '/advisor/students', Users],
    ['Write an advising note', 'Share guidance and next steps', '/advisor/feedback', MessageSquare],
  ] : [
    ['View my results', 'See your semester results', '/student/results', BookOpen],
    ['Read advisor feedback', 'Find your next steps', '/student/feedback', MessageSquare],
    ['View probation history', 'Review your academic standing', '/student/probation', ShieldAlert],
  ];
  return <>
    <PageHeading title={isStudent ? 'Your dashboard' : 'Dashboard'} description={isStudent ? 'Your results, academic standing, and next steps.' : 'A simple overview of your students and their progress.'}><SemesterSelect d={d} /></PageHeading>
    <div className="minimal-stats">{stats.map(([label, value, note]) => <section key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></section>)}</div>
    <section className="minimal-actions"><h2>Quick actions</h2><div>{tasks.map(([title, description, href, Icon]) => <Link href={href} key={href}><span className="task-icon"><Icon size={20} /></span><span><strong>{title}</strong><small>{description}</small></span><ArrowRight size={18} /></Link>)}</div></section>
    {isStudent ? <section className="panel"><div className="panel-heading"><h2>Your academic standing</h2></div><div className="summary-cards"><div><span>Selected semester</span><Badge status={statusFor(d, d.studentId)} /><p>Fictional demonstration status</p></div><div><span>Your advisor</span><strong>{d.advisors.find(a => a.id === student?.advisorId)?.name || 'Unassigned'}</strong><Link className="text-link" href="/student/feedback">Read feedback<ArrowRight size={16} /></Link></div></div></section> : <section className="panel student-overview"><div className="minimal-table-heading"><div><h2>{role === 'advisor' ? 'Your students' : 'Students'}</h2><p>Search for a student to view their details.</p></div><SearchBox value={query} onChange={setQuery} placeholder="Search students..." /></div><StudentTable students={filtered.slice(0, 5)} d={d} role={role} compact /><div className="table-footer"><span>Showing {Math.min(filtered.length, 5)} of {filtered.length} students</span><Link className="text-link" href={`/${role}/students`}>View all students<ArrowRight size={16} /></Link></div></section>}
  </>;
}
export function Students({ role }) {
  const d = useDemo();
  const [query, setQuery] = useState(''); const [status, setStatus] = useState('All statuses'); const [department, setDepartment] = useState('All departments'); const [page, setPage] = useState(1);
  const students = visibleStudents(d, role).filter(s => `${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || statusFor(d, s.id) === status) && (department === 'All departments' || s.department === department));
  const pages = Math.max(1, Math.ceil(students.length / 6)); const current = Math.min(page, pages);
  return <><PageHeading eyebrow="STUDENT DIRECTORY" title={role === 'advisor' ? 'Your students' : 'Students'} description="Know their journey. Help shape what comes next."><SemesterSelect d={d} />{role === 'admin' && <Link className="button primary" href="/admin/students/new"><Plus size={17} />Add student</Link>}</PageHeading><section className="panel"><div className="list-toolbar"><SearchBox value={query} onChange={v => { setQuery(v); setPage(1); }} /><div className="filter-controls"><select aria-label="Filter department" value={department} onChange={e => { setDepartment(e.target.value); setPage(1); }}><option>All departments</option>{departments.map(dep => <option key={dep}>{dep}</option>)}</select><select aria-label="Filter status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>{['All statuses', 'Good standing', 'Probation', 'Recovered', 'Unevaluated'].map(s => <option key={s}>{s}</option>)}</select><button className="button" title="Export filtered students" onClick={() => exportRows('students', [['ID', 'Name', 'Department', 'Status'], ...students.map(s => [s.id, s.name, s.department, statusFor(d, s.id)])])}><Download size={16} /><span>Export</span></button></div></div><StudentTable students={students.slice((current - 1) * 6, current * 6)} d={d} role={role} /><div className="table-footer"><span>{students.length} students · Page {current} of {pages}</span><div className="pagination"><button aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)}><ChevronLeft size={16} /></button><span>{current}</span><button aria-label="Next page" disabled={current === pages} onClick={() => setPage(current + 1)}><ChevronRight size={16} /></button></div></div></section></>;
}

export function StudentDetail({ role, id }) {
  const d = useDemo(); const isNew = id === 'new'; const student = visibleStudents(d, role).find(s => s.id === id);
  if (isNew && role === 'admin') return <StudentForm />;
  if (!student) return <Empty title="Student not found">Select a student from your directory.</Empty>;
  return <><Link className="back-link" href={`/${role}/students`}><ArrowLeft size={16} />Back to students</Link><PageHeading eyebrow="STUDENT PROFILE" title={student.name} description={`${student.id} · ${student.department}`}><SemesterSelect d={d} /><Badge status={statusFor(d, student.id)} /></PageHeading><div className="detail-grid">{role === 'admin' ? <StudentForm student={student} /> : <section className="panel padded"><Avatar student={student} /><h2>{student.name}</h2><p className="muted">{student.email}</p><hr /><p>{student.department}</p><p>Advisor: {d.advisors.find(a => a.id === student.advisorId)?.name || 'Unassigned'}</p></section>}<section className="panel"><div className="panel-heading"><div><h2>Academic history</h2><p>Results across semesters</p></div><BookOpen size={20} /></div><ResultTable d={d} students={[student]} allSemesters /><div className="panel-heading"><div><h2>Probation history</h2><p>Predefined fictional evaluations</p></div></div><CaseList d={d} students={[student]} allSemesters /></section></div><Feedback role={role} fixedStudent={student} embedded /></>;
}

function StudentForm({ student }) {
  const d = useDemo(); const router = useRouter(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setError(''); const data = Object.fromEntries(new FormData(e.currentTarget));
    data.id = data.id.trim(); data.name = data.name.trim(); data.email = data.email.trim();
    if (!data.id || !data.name) return setError('Student ID and name cannot be blank.');
    if (d.students.some(s => s.id.toLowerCase() === data.id.toLowerCase() && s.id !== student?.id)) return setError('A student with this ID already exists.');
    setBusy(true); await new Promise(resolve => setTimeout(resolve, 250));
    if (student) d.setStudents(prev => prev.map(s => s.id === student.id ? { ...s, ...data } : s));
    else d.setStudents(prev => [...prev, { ...data, color: 'blue' }]);
    setBusy(false); d.notify(student ? 'Student details updated in demo state.' : 'Student added to the demo directory.'); if (!student) router.push(`/admin/students/${encodeURIComponent(data.id)}`);
  }
  return <>{!student && <><Link className="back-link" href="/admin/students"><ArrowLeft size={16} />Back to students</Link><PageHeading eyebrow="STUDENT DIRECTORY" title="Add a student" description="Create a fictional student record for this demo." /></>}<section className="panel padded"><div className="form-title"><h2>{student ? 'Student details' : 'Student information'}</h2><p>Fields marked * are required.</p></div><form onSubmit={submit} className="form-grid"><Field label="Student ID *"><input required name="id" defaultValue={student?.id} readOnly={Boolean(student)} placeholder="e.g. 24-10984-1" maxLength={40} /></Field><Field label="Full name *"><input required name="name" defaultValue={student?.name} placeholder="Student full name" maxLength={100} /></Field><Field label="Email address *"><input required name="email" type="email" defaultValue={student?.email} placeholder="student@example.edu" /></Field><Field label="Department *"><select required name="department" defaultValue={student?.department || ''}><option value="" disabled>Select department</option>{departments.map(dep => <option key={dep}>{dep}</option>)}</select></Field><Field label="Assigned advisor *"><select required name="advisorId" defaultValue={student?.advisorId || ''}><option value="" disabled>Select advisor</option>{d.advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>{error && <p className="form-error full-width" role="alert">{error}</p>}<div className="form-actions full-width"><span className="muted">Saved for this demo session only.</span><button disabled={busy} className="button primary" type="submit"><Check size={16} />{busy ? 'Saving...' : student ? 'Save changes' : 'Add student'}</button></div></form></section></>;
}

function ResultTable({ d, students, allSemesters = false }) {
  const results = d.results.filter(r => students.some(s => s.id === r.studentId) && (allSemesters || r.semesterId === d.semesterId));
  if (!results.length) return <Empty title="No results yet">There are no academic results for this selection.</Empty>;
  return <div className="table-scroll"><table><thead><tr><th>Student / Semester</th><th>GPA</th><th>CGPA</th><th>Credits</th></tr></thead><tbody>{results.map(r => <tr key={r.id}><td><strong className="table-name">{students.find(s => s.id === r.studentId)?.name}</strong><small className="table-sub">{d.semesters.find(s => s.id === r.semesterId)?.name}</small></td><td>{Number(r.gpa).toFixed(2)}</td><td>{Number(r.cgpa).toFixed(2)}</td><td>{r.credits}</td></tr>)}</tbody></table></div>;
}

export function Results({ role }) {
  const d = useDemo(); const students = visibleStudents(d, role);
  return <><PageHeading eyebrow="ACADEMIC RECORDS" title={role === 'student' ? 'Your academic results' : 'Academic results'} description="A semester-by-semester picture of academic progress."><SemesterSelect d={d} /><button className="button" onClick={() => exportRows('academic-results', [['Student ID', 'Semester', 'GPA', 'CGPA', 'Credits'], ...d.results.filter(r => students.some(s => s.id === r.studentId) && r.semesterId === d.semesterId).map(r => [r.studentId, d.semesters.find(s => s.id === r.semesterId)?.name, r.gpa, r.cgpa, r.credits])])}><Download size={16} />Export results</button></PageHeading><div className={role === 'admin' ? 'detail-grid' : ''}>{role === 'admin' && <ResultForm />}<section className="panel"><div className="panel-heading"><div><h2>{role === 'student' ? 'Semester results' : 'Recorded results'}</h2><p>Fictional records · GPA scale 0.00–4.00</p></div><ClipboardList size={20} /></div><ResultTable d={d} students={students} /><div className="panel-note"><Info size={15} />The GPA scale is a demo setting. Confirm your institution’s scale.</div></section></div></>;
}

function ResultForm() {
  const d = useDemo(); const [selected, setSelected] = useState(d.students[0]?.id || ''); const [semester, setSemester] = useState(d.semesterId); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const existing = d.results.find(r => r.studentId === selected && r.semesterId === semester);
  async function submit(e) {
    e.preventDefault(); setError(''); const data = Object.fromEntries(new FormData(e.currentTarget));
    const gpa = Number(data.gpa), cgpa = Number(data.cgpa), credits = Number(data.credits);
    if (![gpa, cgpa, credits].every(Number.isFinite) || gpa < 0 || gpa > 4 || cgpa < 0 || cgpa > 4 || !Number.isInteger(credits) || credits < 0 || credits > 30) return setError('Use GPA values between 0 and 4, and whole credits between 0 and 30.');
    if (!d.students.some(s => s.id === selected) || !d.semesters.some(s => s.id === semester)) return setError('Select a valid student and semester.');
    setBusy(true); await new Promise(resolve => setTimeout(resolve, 300));
    const record = { id: existing?.id || uid(), studentId: selected, semesterId: semester, gpa, cgpa, credits };
    d.setResults(prev => [...prev.filter(r => !(r.studentId === selected && r.semesterId === semester)), record]);
    d.setCases(prev => prev.filter(c => !(c.studentId === selected && c.semesterId === semester)));
    d.setSemesterId(semester); setBusy(false); d.notify('Demo result saved. Its evaluation was cleared so you can review it again.');
  }
  return <section className="panel padded"><div className="form-title"><h2>Enter academic results</h2><p>Use fictional results for this demonstration.</p></div><form onSubmit={submit} className="form-grid"><Field label="Student *"><select required value={selected} onChange={e => setSelected(e.target.value)}>{d.students.map(s => <option key={s.id} value={s.id}>{s.name} · {s.id}</option>)}</select></Field><Field label="Semester *"><select required value={semester} onChange={e => setSemester(e.target.value)}>{d.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><div key={`${selected}-${semester}-${existing?.id || 'new'}`} className="form-grid full-width"><Field label="Semester GPA *" hint="Demo scale: 0.00–4.00"><input required type="number" min="0" max="4" step="0.01" name="gpa" defaultValue={existing?.gpa ?? ''} placeholder="0.00" /></Field><Field label="Cumulative GPA *" hint="Demo scale: 0.00–4.00"><input required type="number" min="0" max="4" step="0.01" name="cgpa" defaultValue={existing?.cgpa ?? ''} placeholder="0.00" /></Field><Field label="Semester credits *"><input required type="number" min="0" max="30" step="1" name="credits" defaultValue={existing?.credits ?? ''} placeholder="15" /></Field></div>{existing && <div className="inline-note full-width"><Info size={16} />Saving replaces this student’s existing result for the selected semester.</div>}{error && <p role="alert" className="form-error full-width">{error}</p>}<div className="form-actions full-width"><span className="muted">In-memory demo record</span><button disabled={busy || !selected} className="button primary"><Check size={16} />{busy ? 'Saving...' : 'Save result'}</button></div></form></section>;
}

function CaseList({ d, students, allSemesters = false, status = 'All statuses' }) {
  const cases = d.cases.filter(c => students.some(s => s.id === c.studentId) && (allSemesters || c.semesterId === d.semesterId) && (status === 'All statuses' || c.status === status)).slice().sort((a, b) => b.date.localeCompare(a.date));
  if (!cases.length) return <Empty title="No evaluations to display">A student without an evaluation is shown as unevaluated.</Empty>;
  return <div className="case-list">{cases.map(c => <div className="case-item" key={c.id}><div className="case-item-top"><div><strong>{students.find(s => s.id === c.studentId)?.name}</strong><small>{d.semesters.find(s => s.id === c.semesterId)?.name} · {displayDate(c.date)}</small></div><Badge status={c.status} /></div><p>{c.reason}</p></div>)}</div>;
}

export function Probation({ role }) {
  const d = useDemo(); const students = visibleStudents(d, role); const [status, setStatus] = useState('All statuses');
  return <><PageHeading eyebrow="GUIDANCE & RECOVERY" title={role === 'student' ? 'Your probation history' : 'Probation records'} description="Understand the journey and support the next step forward."><SemesterSelect d={d} /></PageHeading><div className="inline-note mb"><Info size={17} />All evaluations are predefined fictional examples, not official academic decisions.</div><div className={role === 'admin' ? 'detail-grid' : ''}>{role === 'admin' && <EvaluationForm />}<section className="panel"><div className="panel-heading"><div><h2>Evaluation history</h2><p>Previous semester records stay available in student profiles.</p></div><select aria-label="Filter evaluations by status" value={status} onChange={e => setStatus(e.target.value)}>{['All statuses', 'Probation', 'Good standing', 'Recovered'].map(s => <option key={s}>{s}</option>)}</select></div><CaseList d={d} students={students} status={status} /></section></div></>;
}

function EvaluationForm() {
  const d = useDemo(); const [studentId, setStudentId] = useState(d.students[0]?.id || ''); const [example, setExample] = useState('Probation'); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const hasResult = d.results.some(r => r.studentId === studentId && r.semesterId === d.semesterId);
  async function submit(e) {
    e.preventDefault(); setError(''); if (!hasResult) return setError('Enter a result for this student and semester first.');
    setBusy(true); await new Promise(resolve => setTimeout(resolve, 400));
    const reasons = { Probation: 'Fictional probation example: arrange an advisor meeting and create a study plan.', 'Good standing': 'Fictional good-standing example: continue regular study and academic check-ins.', Recovered: 'Fictional recovery example: acknowledge progress and continue the agreed support plan.' };
    const record = { id: uid(), studentId, semesterId: d.semesterId, status: example, reason: reasons[example], date: today() };
    d.setCases(prev => [...prev.filter(c => !(c.studentId === studentId && c.semesterId === d.semesterId)), record]); setBusy(false); d.notify('Demo evaluation displayed. Earlier semester history is preserved.');
  }
  return <section className="panel padded"><div className="form-title"><h2>Simulate an evaluation</h2><p>Choose a fictional outcome to preview the interface.</p></div><form onSubmit={submit} className="form-stack"><Field label="Student *"><select required value={studentId} onChange={e => { setStudentId(e.target.value); setError(''); }}>{d.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Semester"><input readOnly value={d.semesters.find(s => s.id === d.semesterId)?.name || ''} /></Field><Field label="Predefined demo outcome *"><select value={example} onChange={e => setExample(e.target.value)}>{['Probation', 'Good standing', 'Recovered'].map(s => <option key={s}>{s}</option>)}</select></Field>{!hasResult && <p className="form-error">No academic result exists for this selection. <Link href="/admin/results">Enter a result first.</Link></p>}{error && <p role="alert" className="form-error">{error}</p>}<div className="inline-note"><Info size={16} />This selects a demo status without applying academic policy. A repeat evaluation replaces the same semester’s example.</div><button disabled={busy || !hasResult} className="button primary"><ShieldAlert size={16} />{busy ? 'Simulating...' : 'Run demo evaluation'}</button></form></section>;
}

export function Advisors() {
  const d = useDemo(); const [showForm, setShowForm] = useState(false); const [error, setError] = useState('');
  function submit(e) { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); data.name = data.name.trim(); data.email = data.email.trim(); if (!data.name) return setError('Enter an advisor name.'); if (d.advisors.some(a => a.email.toLowerCase() === data.email.toLowerCase())) return setError('An advisor with this email already exists.'); d.setAdvisors(prev => [...prev, { id: uid(), ...data }]); setShowForm(false); setError(''); d.notify('Advisor added to the demo workspace.'); }
  return <><PageHeading eyebrow="A NETWORK OF SUPPORT" title="Academic advisors" description="The people helping every student find their path."><button className="button primary" onClick={() => setShowForm(!showForm)}>{showForm ? <X size={17} /> : <Plus size={17} />}{showForm ? 'Close form' : 'Add advisor'}</button></PageHeading>{showForm && <section className="panel padded mb"><div className="form-title"><h2>Add an advisor</h2></div><form className="form-grid" onSubmit={submit}><Field label="Full name *"><input name="name" required maxLength={100} placeholder="Dr. Taylor Smith" /></Field><Field label="Email *"><input name="email" type="email" required placeholder="advisor@example.edu" /></Field><Field label="Department *"><select name="department" required>{departments.map(dep => <option key={dep}>{dep}</option>)}</select></Field>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions full-width"><button className="button primary"><Plus size={16} />Add advisor</button></div></form></section>}<div className="advisor-grid">{d.advisors.map((a, i) => <section className="panel advisor-card" key={a.id}><Avatar student={{ name: a.name.replace('Dr. ', ''), color: ['blue', 'purple', 'green'][i % 3] }} /><h2>{a.name}</h2><p>{a.department}</p><a href={`mailto:${a.email}`}>{a.email}</a><div className="advisor-count"><Users size={17} /><strong>{d.students.filter(s => s.advisorId === a.id).length}</strong>assigned students</div><button className="button" onClick={() => { d.setAdvisorId(a.id); d.notify(`Demo advisor selected: ${a.name}`); }}><UserRoundCheck size={16} />{d.advisorId === a.id ? 'Selected demo advisor' : 'Select demo advisor'}</button></section>)}</div><div className="inline-note mt"><Info size={16} />Select an advisor, then switch to the Advisor role to explore their assigned students.</div></>;
}

export function Semesters() {
  const d = useDemo(); const [showForm, setShowForm] = useState(false); const [error, setError] = useState('');
  function submit(e) { e.preventDefault(); const data = Object.fromEntries(new FormData(e.currentTarget)); data.name = data.name.trim(); if (!data.name) return setError('Enter a semester name.'); if (data.start >= data.end) return setError('The end date must be after the start date.'); if (d.semesters.some(s => s.name.toLowerCase() === data.name.toLowerCase())) return setError('A semester with this name already exists.'); d.setSemesters(prev => [...prev, { id: uid(), ...data }].sort((a, b) => b.start.localeCompare(a.start))); setShowForm(false); setError(''); d.notify('Semester added. It is now available throughout the workspace.'); }
  return <><PageHeading eyebrow="THE ACADEMIC CALENDAR" title="Semesters" description="Organize academic records, one semester at a time."><button className="button primary" onClick={() => setShowForm(!showForm)}>{showForm ? <X size={17} /> : <Plus size={17} />}{showForm ? 'Close form' : 'Add semester'}</button></PageHeading>{showForm && <section className="panel padded mb"><form onSubmit={submit} className="form-grid"><Field label="Semester name *"><input name="name" required placeholder="Spring 2027" maxLength={60} /></Field><Field label="Start date *"><input required type="date" name="start" /></Field><Field label="End date *"><input required type="date" name="end" /></Field>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions full-width"><button className="button primary"><Plus size={16} />Add semester</button></div></form></section>}<section className="panel"><div className="table-scroll"><table><thead><tr><th>Semester</th><th>Start date</th><th>End date</th><th>Result records</th><th>Selection</th></tr></thead><tbody>{d.semesters.map(s => <tr key={s.id}><td><span className="semester-name"><CalendarDays size={18} />{s.name}</span></td><td>{displayDate(s.start)}</td><td>{displayDate(s.end)}</td><td>{d.results.filter(r => r.semesterId === s.id).length}</td><td><button className={`button ${d.semesterId === s.id ? 'selected-semester' : ''}`} onClick={() => { d.setSemesterId(s.id); d.notify(`${s.name} selected for the workspace.`); }}>{d.semesterId === s.id ? <><Check size={15} />Selected</> : 'Select semester'}</button></td></tr>)}</tbody></table></div></section></>;
}

export function Feedback({ role, fixedStudent, embedded = false }) {
  const d = useDemo(); const students = fixedStudent ? [fixedStudent] : visibleStudents(d, role); const [selected, setSelected] = useState(fixedStudent?.id || students[0]?.id || ''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const notes = d.notes.filter(n => students.some(s => s.id === n.studentId)).slice().sort((a, b) => b.date.localeCompare(a.date));
  const canWrite = role === 'advisor';
  async function submit(e) {
    e.preventDefault(); const form = e.currentTarget; const data = Object.fromEntries(new FormData(form)); setError('');
    if (!data.note.trim() || !data.plan.trim()) return setError('Enter both a meeting note and an action plan.');
    const target = fixedStudent?.id || selected;
    if (!students.some(s => s.id === target && s.advisorId === d.advisorId)) return setError('Select one of your assigned demo students.');
    setBusy(true); await new Promise(resolve => setTimeout(resolve, 250));
    d.setNotes(prev => [...prev, { id: uid(), studentId: target, advisorId: d.advisorId, semesterId: d.semesterId, date: data.date, note: data.note.trim(), plan: data.plan.trim() }]); setBusy(false); form.reset(); d.notify('Advising note added. The student can view it in their feedback.');
  }
  return <>{embedded ? <div className="section-heading"><div><h2>Advising notes & action plans</h2><p>Conversations that help students move forward.</p></div></div> : <PageHeading eyebrow="CONVERSATIONS THAT COUNT" title={role === 'student' ? 'Your advisor’s feedback' : 'Advising notes'} description="Thoughtful guidance and practical steps for the semester ahead."><SemesterSelect d={d} /></PageHeading>}<div className={canWrite ? 'detail-grid' : ''}>{canWrite && <section className="panel padded"><div className="form-title"><h2>Add an advising note</h2><p>Keep guidance clear, supportive, and actionable.</p></div><form onSubmit={submit} className="form-stack"><Field label="Student *"><select required value={fixedStudent?.id || selected} onChange={e => setSelected(e.target.value)} disabled={Boolean(fixedStudent)}>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Meeting date *"><input required type="date" name="date" defaultValue={today()} max={today()} /></Field><Field label="Meeting note *"><textarea required name="note" rows={4} maxLength={2000} placeholder="What did you discuss?" /></Field><Field label="Action plan *"><textarea required name="plan" rows={3} maxLength={2000} placeholder="What are the next steps?" /></Field>{error && <p className="form-error" role="alert">{error}</p>}<button disabled={busy || !students.length} className="button primary"><Plus size={16} />{busy ? 'Adding note...' : 'Add advising note'}</button></form></section>}<section className="panel"><div className="panel-heading"><div><h2>{role === 'student' ? 'Feedback & next steps' : 'Note history'}</h2><p>{notes.length} {notes.length === 1 ? 'conversation' : 'conversations'} across all semesters</p></div><MessageSquare size={19} /></div>{notes.length ? notes.map(n => { const student = d.students.find(s => s.id === n.studentId); return <article className="note-card" key={n.id}><div className="note-header"><div className="student-cell"><Avatar student={student} small /><span><strong>{student.name}</strong><small>{d.advisors.find(a => a.id === n.advisorId)?.name}</small></span></div><small>{displayDate(n.date)}</small></div><span className="note-semester">{d.semesters.find(s => s.id === n.semesterId)?.name}</span><p>{n.note}</p><div className="action-plan"><strong><CircleCheck size={15} />Action plan</strong><p>{n.plan}</p></div></article>; }) : <Empty title="No advising notes yet">New notes and action plans will appear here.</Empty>}</section></div></>;
}

export function Login() {
  const d = useDemo(); const router = useRouter(); const [role, setRole] = useState('admin');
  return <main className="login-page"><section className="login-story"><Link className="brand" href="/"><span className="brand-mark"><GraduationCap size={28} /></span><span>academia<span className="brand-dot">.</span><small>STUDENT SUCCESS PLATFORM</small></span></Link><div><div className="eyebrow">A LITTLE GUIDANCE. A BRIGHTER FUTURE.</div><h1>Every student<br />has a way<br /><em>forward.</em></h1><p>A thoughtful workspace for academic progress, meaningful conversations, and new beginnings.</p></div><span className="login-foot">Built around the people behind the numbers.</span></section><section className="login-form-wrap"><form className="login-form" onSubmit={e => { e.preventDefault(); router.push(`/${role}/dashboard`); }}><span className="login-icon"><GraduationCap size={30} /></span><div className="eyebrow">WELCOME TO YOUR WORKSPACE</div><h2>Good to see you.</h2><p>Choose a demo role to explore Academia.</p><Field label="View the workspace as"><select value={role} onChange={e => setRole(e.target.value)}><option value="admin">Academic Officer</option><option value="advisor">Academic Advisor</option><option value="student">Student</option></select></Field>{role === 'advisor' && <Field label="Demo advisor"><select value={d.advisorId} onChange={e => d.setAdvisorId(e.target.value)}>{d.advisors.map(a => <option value={a.id} key={a.id}>{a.name}</option>)}</select></Field>}{role === 'student' && <Field label="Demo student"><select value={d.studentId} onChange={e => d.setStudentId(e.target.value)}>{d.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>}<button className="button primary">Enter demo workspace<ArrowRight size={17} /></button><div className="inline-note"><Info size={17} /><span>This is a frontend demonstration with fictional records. Changes reset when you refresh.</span></div></form><small className="login-copyright">© 2026 Academia · Student success starts here.</small></section></main>;
}
