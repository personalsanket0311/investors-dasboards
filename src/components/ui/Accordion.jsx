'use client';
import { useState } from 'react';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={item.title} className={`accordion__item ${open === i ? 'is-open' : ''}`}>
          <button className="accordion__btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{item.title}</span><span className="accordion__chev" aria-hidden="true" />
          </button>
          <div className="accordion__body"><div><p>{item.body}</p></div></div>
        </div>
      ))}
    </div>
  );
}
