import React from 'react';
import type { ValidationError } from '../types';

interface ValidationPanelProps {
  errors: ValidationError[];
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="ap-template-editor__validation" role="alert">
      {errors.map((err, i) => (
        <div
          key={i}
          className={`ap-template-editor__validation-item ap-template-editor__validation-item--${err.severity}`}
        >
          <span className="ap-template-editor__validation-icon">
            {err.severity === 'error' ? '⛔' : '⚠️'}
          </span>
          <span className="ap-template-editor__validation-message">{err.message}</span>
          {err.location && (err.location.line != null || err.location.nodeType) && (
            <span className="ap-template-editor__validation-location">
              {err.location.line != null && (
                <span>
                  {err.location.line}
                  {err.location.column != null ? `:${err.location.column}` : ''}
                </span>
              )}
              {err.location.nodeType && (
                <span>
                  {' '}
                  [{err.location.nodeType}
                  {err.location.nodeName ? ` "${err.location.nodeName}"` : ''}]
                </span>
              )}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
