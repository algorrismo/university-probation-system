'use client';
import { Search, Inbox } from 'lucide-react';
import { cloneElement, useId } from 'react';

export function Badge({ status = 'Unevaluated' }) { return <span className={`badge ${status.toLowerCase().replaceAll(' ', '-')}`}><i />{status}</span>; }
export function Avatar({ student, small = false }) { return <span className={`avatar ${student.color || 'blue'} ${small ? 'small' : ''}`}>{student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>; }
export function Empty({ title = 'Nothing here yet', children }) { return <div className="empty"><Inbox size={30} /><h3>{title}</h3><p>{children || 'Try changing your filters or add a new record.'}</p></div>; }
export function SearchBox({ value, onChange, placeholder = 'Search by name or student ID...' }) { return <div className="search-box"><Search size={17} /><input aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />{value && <button aria-label="Clear search" onClick={() => onChange('')}>×</button>}</div>; }
export function Field({ label, children, hint }) {
  const id = useId();
  return <div className="field"><label htmlFor={id}>{label}</label>{cloneElement(children, { id, 'aria-describedby': hint ? `${id}-hint` : undefined })}{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function PageHeading({ eyebrow, title, description, children }) { return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div><div className="heading-actions">{children}</div></div>; }
