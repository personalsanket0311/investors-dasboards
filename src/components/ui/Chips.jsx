export default function Chips({ options, selected, onToggle, label }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={selected.includes(o)} className={`chip ${selected.includes(o) ? 'is-on' : ''}`} onClick={() => onToggle(o)}>{o}</button>
      ))}
    </div>
  );
}
