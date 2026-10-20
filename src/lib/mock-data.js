export const initialAdvisors = [
  { id: 'a1', name: 'Dr. Sarah Ahmed', email: 'sarah.ahmed@example.edu', department: 'Computer Science' },
  { id: 'a2', name: 'Dr. Michael Chen', email: 'michael.chen@example.edu', department: 'Business Administration' },
  { id: 'a3', name: 'Dr. Nadia Rahman', email: 'nadia.rahman@example.edu', department: 'Electrical Engineering' },
];
export const initialSemesters = [{ id: 's1', name: 'Fall 2026', start: '2026-09-01', end: '2026-12-20' }, { id: 's2', name: 'Summer 2026', start: '2026-05-01', end: '2026-08-20' }, { id: 's3', name: 'Spring 2026', start: '2026-01-01', end: '2026-04-20' }];
export const initialStudents = [
  { id: '23-10482-1', name: 'Aarav Hassan', email: 'aarav@example.edu', department: 'Computer Science', advisorId: 'a1', color: 'blue' },
  { id: '23-10516-2', name: 'Sofia Rahman', email: 'sofia@example.edu', department: 'Business Administration', advisorId: 'a2', color: 'pink' },
  { id: '22-10305-1', name: 'Ethan Chowdhury', email: 'ethan@example.edu', department: 'Electrical Engineering', advisorId: 'a3', color: 'amber' },
  { id: '24-10824-1', name: 'Maya Islam', email: 'maya@example.edu', department: 'Computer Science', advisorId: 'a1', color: 'purple' },
  { id: '23-10672-2', name: 'Liam Ahmed', email: 'liam@example.edu', department: 'Business Administration', advisorId: 'a2', color: 'green' },
  { id: '22-10291-1', name: 'Olivia Sultana', email: 'olivia@example.edu', department: 'Computer Science', advisorId: 'a1', color: 'pink' },
  { id: '24-10935-1', name: 'Noah Karim', email: 'noah@example.edu', department: 'Electrical Engineering', advisorId: 'a3', color: 'blue' },
  { id: '23-10741-2', name: 'Amelia Khan', email: 'amelia@example.edu', department: 'Business Administration', advisorId: 'a2', color: 'purple' },
];
const statuses = ['Probation', 'Good standing', 'Probation', 'Recovered', 'Good standing', 'Probation', 'Good standing', 'Unevaluated'];
const scores = [1.86, 3.68, 1.92, 2.74, 3.42, 1.78, 3.21, 2.88];
export const initialResults = initialStudents.flatMap((student, i) => [
  { id: `r${i}`, studentId: student.id, semesterId: 's1', gpa: scores[i], cgpa: +(scores[i] + 0.12).toFixed(2), credits: 15 },
  { id: `past${i}`, studentId: student.id, semesterId: 's2', gpa: +(scores[i] - 0.1).toFixed(2), cgpa: scores[i], credits: 15 },
]);
export const initialCases = initialStudents.flatMap((student, i) => [
  ...(statuses[i] === 'Unevaluated' ? [] : [{ id: `c${i}`, studentId: student.id, semesterId: 's1', status: statuses[i], reason: 'Predefined fictional example for interface demonstration.', date: '2026-10-18' }]),
  { id: `cp${i}`, studentId: student.id, semesterId: 's2', status: i === 3 ? 'Probation' : statuses[i] === 'Unevaluated' ? 'Good standing' : statuses[i], reason: 'Fictional previous semester example.', date: '2026-08-18' },
]);
export const initialNotes = [
  { id: 'n1', studentId: '23-10482-1', advisorId: 'a1', semesterId: 's1', date: '2026-10-19', note: 'Discussed study habits and challenges with core courses. Aarav is motivated to improve this semester.', plan: 'Attend weekly tutoring sessions and meet again in two weeks.' },
  { id: 'n2', studentId: '24-10824-1', advisorId: 'a1', semesterId: 's1', date: '2026-10-18', note: 'A positive improvement in academic performance. Keep up the consistent effort.', plan: 'Continue the current study plan and attend office hours.' },
];
