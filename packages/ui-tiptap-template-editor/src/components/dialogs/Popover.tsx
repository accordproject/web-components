import React from 'react';
import '../../styles/popover.css';

export interface PopoverProps {
  anchor: HTMLElement | null;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

/**
 * A reusable popover component that attaches to an anchor element.
 * Renders via portal positioning below the anchor.
 */
export const Popover: React.FC<PopoverProps> = ({ anchor, onClose, children, width = 220 }) => {
  const rect = anchor?.getBoundingClientRect();
  const top = rect ? rect.bottom + window.scrollY + 4 : 100;
  const left = rect ? rect.left + window.scrollX : 100;

  return (
    <>
      <div
        className="ap-popover-backdrop"
        onClick={onClose}
      />
      <div
        className="ap-popover"
        style={{ top, left, minWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
};

// ── CSS Class Names ───────────────────────────────────────────────────────────
// These constants provide the CSS class names for popover form elements.
// Use these instead of inline styles for proper theming support.

export const popoverClasses = {
  label: 'ap-popover__label',
  input: 'ap-popover__input',
  select: 'ap-popover__select',
  textarea: 'ap-popover__textarea',
  buttonRow: 'ap-popover__buttons',
  saveBtn: 'ap-popover__btn ap-popover__btn--primary',
  cancelBtn: 'ap-popover__btn ap-popover__btn--secondary',
};

// ── Legacy Styles (deprecated) ────────────────────────────────────────────────
// These inline styles are kept for backward compatibility.
// Please migrate to popoverClasses for proper theming support.

/** @deprecated Use popoverClasses instead for proper theming support */
export const popoverStyles = {
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#4a5568',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  input: {
    padding: '4px 6px',
    border: '1px solid #cbd5e0',
    borderRadius: 4,
    fontSize: 13,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  select: {
    padding: '4px 6px',
    border: '1px solid #cbd5e0',
    borderRadius: 4,
    fontSize: 13,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    background: '#fff',
  },
  textarea: {
    padding: '6px 8px',
    border: '1px solid #cbd5e0',
    borderRadius: 4,
    fontSize: 13,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    fontFamily: 'monospace',
    resize: 'vertical' as const,
  },
  buttonRow: {
    display: 'flex',
    gap: 6,
    marginTop: 6,
  },
  saveBtn: {
    flex: 1,
    padding: '4px 0',
    background: '#3182ce',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
  },
  cancelBtn: {
    flex: 1,
    padding: '4px 0',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
  },
};
