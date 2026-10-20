'use client';

import { Search, Inbox, X } from 'lucide-react';
import { cloneElement, useId } from 'react';

const statusColors = {
  Probation: 'bg-[#F3E8DD] text-[#8D4938]',
  'Good standing': 'bg-[#EDF0E7] text-[#58674E]',
  Recovered: 'bg-[#EEE8DC] text-[#6F3C30]',
  Unevaluated: 'bg-[#EEE8DC] text-[#58674E]',
};

const avatarColors = {
  blue: 'bg-[#EDF0E7] text-[#58674E]',
  pink: 'bg-[#F3E8DD] text-[#8D4938]',
  amber: 'bg-[#F3E8DD] text-[#8D4938]',
  purple: 'bg-[#EDF0E7] text-[#58674E]',
  green: 'bg-[#EDF0E7] text-[#58674E]',
};

export function Badge({ status = 'Unevaluated' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-[10px] font-medium ${statusColors[status] || statusColors.Unevaluated}`}>
      <span className="size-1 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

export function Avatar({ student, small = false }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium ${small ? 'size-7 text-[9px]' : 'size-9 text-[10px]'} ${avatarColors[student.color] || avatarColors.blue}`}>
      {student.name.split(' ').map(name => name[0]).slice(0, 2).join('')}
    </span>
  );
}

export function Empty({ title = 'Nothing here yet', children }) {
  return (
    <div className="px-6 py-12 text-center text-[#747466]">
      <Inbox size={30} className="mx-auto mb-4 text-[#878477]" />
      <h3 className="font-serif text-xl font-normal">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed">{children || 'Try changing your filters or add a new record.'}</p>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = 'Search by name or student ID...' }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] pl-3 text-[#878477] focus-within:ring-2 focus-within:ring-[#BFB5A6]">
      <Search size={17} className="shrink-0" />
      <input className="min-h-10 w-full min-w-0 rounded-lg bg-transparent py-2 pr-3 text-xs text-[#373C32] outline-none placeholder:text-[#878477]" aria-label={placeholder} placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} />
      {value && <button type="button" className="mr-2 cursor-pointer rounded p-1 hover:bg-[#EEE8DC] focus-visible:outline-2 focus-visible:outline-[#8D4938]" aria-label="Clear search" onClick={() => onChange('')}><X size={14} /></button>}
    </div>
  );
}

export function Field({ label, children, hint }) {
  const id = useId();
  const controlClasses = 'min-h-11 w-full min-w-0 rounded-lg border border-[#D9D0C1] bg-[#FCFAF5] px-3 py-2.5 text-[13px] text-[#373C32] outline-none placeholder:text-[#878477] focus:border-[#BFB5A6] focus:ring-2 focus:ring-[#E7DED0] read-only:bg-[#F7F4ED] read-only:text-[#747466] disabled:cursor-not-allowed disabled:bg-[#F7F4ED] disabled:text-[#747466]';
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label className="text-xs font-medium text-[#58674E]" htmlFor={id}>{label}</label>
      {cloneElement(children, {
        id,
        className: `${controlClasses} ${children.type === 'textarea' ? 'min-h-20 resize-y' : ''} ${children.props.className || ''}`,
        'aria-describedby': hint ? `${id}-hint` : undefined,
      })}
      {hint && <small className="text-[11px] text-[#747466]" id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}

export function PageHeading({ title, description, children }) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-5 sm:flex-nowrap sm:items-center">
      <div><h1 className="font-serif text-4xl leading-tight font-normal tracking-[-0.04em] text-[#373C32] sm:text-5xl">{title}</h1><p className="mt-2 max-w-xl text-xs leading-relaxed text-[#747466] sm:text-[13px]">{description}</p></div>
      {children && <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">{children}</div>}
    </div>
  );
}
