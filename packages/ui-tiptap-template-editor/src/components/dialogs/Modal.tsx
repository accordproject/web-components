import React, { useState, useCallback } from 'react';
import '../../styles/modal.css';

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

/**
 * A centered modal dialog with backdrop.
 */
export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <>
      <div className="ap-modal-backdrop" onClick={onClose} />
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <span className="ap-modal__title">{title}</span>
          <button className="ap-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </>
  );
};

// ── BranchModal for Conditional/Optional blocks ────────────────────────────────

export interface BranchConfig {
  label: string;
  initialMd: string;
}

export interface BranchModalProps {
  title: string;
  branches: BranchConfig[];
  onSave: (values: string[]) => void;
  onClose: () => void;
  helpText?: string;
}

/**
 * Modal for editing multiple TemplateMark branches (e.g., whenTrue/whenFalse).
 */
export const BranchModal: React.FC<BranchModalProps> = ({
  title,
  branches,
  onSave,
  onClose,
  helpText = 'Edit each branch as TemplateMark markdown. Use {{varName}} for variables.',
}) => {
  const [values, setValues] = useState<string[]>(branches.map((b) => b.initialMd));

  const handleSave = useCallback(() => onSave(values), [onSave, values]);

  const update = (i: number, v: string) =>
    setValues((prev) => prev.map((x, j) => (j === i ? v : x)));

  return (
    <>
      <div className="ap-modal-backdrop" onClick={onClose} />
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <span className="ap-modal__title">{title}</span>
          <button className="ap-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="ap-modal__body">
          <p className="ap-modal__help">{helpText}</p>
          {branches.map((b, i) => (
            <div key={i} className="ap-modal__field">
              <label className="ap-modal__label">{b.label}</label>
              <textarea
                className="ap-modal__textarea"
                value={values[i]}
                onChange={(e) => update(i, e.target.value)}
                spellCheck={false}
                rows={5}
              />
            </div>
          ))}
        </div>
        <div className="ap-modal__footer">
          <button className="ap-modal__btn ap-modal__btn--secondary" onClick={onClose}>Cancel</button>
          <button className="ap-modal__btn ap-modal__btn--primary" onClick={handleSave}>Save branches</button>
        </div>
      </div>
    </>
  );
};

// ── InsertDialog for toolbar insert actions ────────────────────────────────────

export interface InsertFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  defaultValue?: string;
}

export interface InsertDialogProps {
  title: string;
  fields: InsertFieldConfig[];
  onInsert: (values: Record<string, string>) => void;
  onClose: () => void;
}

/**
 * Generic insert dialog for toolbar buttons (Variable, Clause, Image, etc.)
 */
export const InsertDialog: React.FC<InsertDialogProps> = ({
  title,
  fields,
  onInsert,
  onClose,
}) => {
  const initialValues: Record<string, string> = {};
  fields.forEach((f) => { initialValues[f.name] = f.defaultValue ?? ''; });
  const [values, setValues] = useState(initialValues);

  const update = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleInsert = () => {
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) return;
    }
    onInsert(values);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' && e.metaKey) || (e.key === 'Enter' && e.ctrlKey)) handleInsert();
    if (e.key === 'Escape') onClose();
  };

  return (
    <>
      <div className="ap-modal-backdrop" onClick={onClose} />
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <span className="ap-modal__title">{title}</span>
          <button className="ap-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="ap-modal__body" onKeyDown={handleKeyDown}>
          {fields.map((f, i) => (
            <div key={f.name} className="ap-modal__field">
              <label className="ap-modal__label">
                {f.label}
                {f.required && <span className="ap-modal__required">*</span>}
              </label>
              {f.type === 'text' && (
                <input
                  className="ap-modal__input"
                  autoFocus={i === 0}
                  value={values[f.name]}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.placeholder}
                />
              )}
              {f.type === 'select' && (
                <select
                  className="ap-modal__select"
                  value={values[f.name]}
                  onChange={(e) => update(f.name, e.target.value)}
                >
                  {f.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {f.type === 'textarea' && (
                <textarea
                  className="ap-modal__textarea"
                  value={values[f.name]}
                  onChange={(e) => update(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                />
              )}
            </div>
          ))}
        </div>
        <div className="ap-modal__footer">
          <button className="ap-modal__btn ap-modal__btn--secondary" onClick={onClose}>Cancel</button>
          <button className="ap-modal__btn ap-modal__btn--primary" onClick={handleInsert}>Insert</button>
        </div>
      </div>
    </>
  );
};
