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
  return <DemoContext.Provider value={value}>{children}{toast && <div className="fixed bottom-5 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-5 rounded-xl bg-[#373F32] px-5 py-4 text-xs leading-relaxed text-[#F7F4ED] shadow-xl sm:text-sm" role="status"><span>{toast}</span><button className="cursor-pointer rounded px-1 text-xl text-[#878477] hover:text-[#F7F4ED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D4938]" aria-label="Dismiss notification" onClick={() => setToast('')}>×</button></div>}</DemoContext.Provider>;
}
export const useDemo = () => useContext(DemoContext);
