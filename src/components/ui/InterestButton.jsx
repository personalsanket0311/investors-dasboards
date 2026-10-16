'use client';
import { memo } from 'react';
import Icon from './Icon';

function InterestButton({ active, onToggle, withLabel = false }) {
  return (
    <button type="button" className={`interest ${active ? 'is-on' : ''}`} aria-pressed={active}
      aria-label={active ? 'Remove from my interests' : 'Save to my interests'} onClick={onToggle}>
      <Icon name="heart" size={18} filled={active} />
      {withLabel && <span>{active ? 'Saved' : 'Save deal'}</span>}
    </button>
  );
}
export default memo(InterestButton);
