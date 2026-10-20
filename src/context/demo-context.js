'use client';
import { createContext, useContext, useState } from 'react';
import { initialStudents, initialAdvisors, initialSemesters, initialResults, initialCases, initialNotes } from '@/lib/mock-data';

const DemoContext = createContext(null);
export function DemoProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [advisors, setAdvisors] = useState(initialAdvisors);
  const [semesters, setSemesters] = useState(initialSemesters);
  const [results, setResults] = useState(initialResults);
  const [cases, setCases] = useState(initialCases);
  const [notes, setNotes] = useState(initialNotes);
  const [semesterId, setSemesterId] = useState('s1');
  const [studentId, setStudentId] = useState(initialStudents[0].id);
  const [advisorId, setAdvisorId] = useState('a1');
  const [toast, setToast] = useState('');
  function notify(message) { setToast(message); }
  const value = { students, setStudents, advisors, setAdvisors, semesters, setSemesters, results, setResults, cases, setCases, notes, setNotes, semesterId, setSemesterId, studentId, setStudentId, advisorId, setAdvisorId, notify };
  return <DemoContext.Provider value={value}>{children}{toast && <div className="toast" role="status"><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast('')}>×</button></div>}</DemoContext.Provider>;
}
export const useDemo = () => useContext(DemoContext);
