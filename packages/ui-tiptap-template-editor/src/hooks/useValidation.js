import { useState, useEffect } from 'react';
import { validateTemplate } from '../utils/validateTemplate';
const DEBOUNCE_MS = 300;
export function useValidation(doc, enabled, onValidation) {
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        if (!enabled || !doc) {
            setErrors([]);
            return;
        }
        const id = setTimeout(() => {
            void validateTemplate(doc).then((errs) => {
                setErrors(errs);
                onValidation?.(errs);
            });
        }, DEBOUNCE_MS);
        return () => clearTimeout(id);
    }, [doc, enabled, onValidation]);
    return errors;
}
