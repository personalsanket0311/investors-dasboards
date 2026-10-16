'use client';
import { useState } from 'react';

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);
  return (
    <div>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === active} className={`tabs__tab ${t.id === active ? 'is-active' : ''}`} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tabs__panel" role="tabpanel" key={active}>{current.content}</div>
    </div>
  );
}
