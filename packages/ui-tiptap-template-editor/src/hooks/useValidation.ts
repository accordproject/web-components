import { useState, useEffect } from 'react';
import type { ModelManager } from '@accordproject/concerto-core';
import type { TemplateMarkDocument } from '../types/TemplateMark';
import type { ValidationError } from '../types';
import { validateTemplate } from '../utils/validateTemplate';

const DEBOUNCE_MS = 300;

export function useValidation(
  doc: TemplateMarkDocument | null,
  enabled: boolean,
  onValidation?: (errors: ValidationError[]) => void,
  modelManager?: ModelManager
): ValidationError[] {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (!enabled || !doc) {
      setErrors([]);
      return;
    }

    const id = setTimeout(() => {
      void validateTemplate(doc, modelManager).then((errs) => {
        setErrors(errs);
        onValidation?.(errs);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [doc, enabled, onValidation, modelManager]);

  return errors;
}
