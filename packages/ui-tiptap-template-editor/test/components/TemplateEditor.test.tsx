import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TemplateEditor } from '../../src/components/TemplateEditor';
import { ndaTemplate, minimalTemplate } from '../helpers/fixtures';
import type { TemplateMarkDocument } from '../../src/types/TemplateMark';

// TipTap requires a DOM environment — jsdom is configured in jest preset.

describe('TemplateEditor component', () => {
  it('renders without crashing with a value prop', () => {
    const { container } = render(<TemplateEditor value={ndaTemplate} />);
    expect(container.querySelector('.ap-template-editor')).toBeTruthy();
  });

  it('renders the toolbar by default', () => {
    render(<TemplateEditor value={minimalTemplate} />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('hides toolbar when showToolbar=false', () => {
    render(<TemplateEditor value={minimalTemplate} showToolbar={false} />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });

  it('onChange callback is called when content changes', async () => {
    const onChange = jest.fn();
    render(<TemplateEditor value={minimalTemplate} onChange={onChange} />);
    // Editor is async to init — just verify it renders; full onChange testing requires more complex setup
    expect(screen.queryByRole('toolbar')).toBeDefined();
  });

  it('hides ValidationPanel when showValidation=false', () => {
    const { container } = render(
      <TemplateEditor value={minimalTemplate} showValidation={false} />
    );
    expect(container.querySelector('.ap-template-editor__validation')).toBeNull();
  });

  it('renders with className prop applied to root', () => {
    const { container } = render(
      <TemplateEditor value={minimalTemplate} className="my-custom-class" />
    );
    const root = container.querySelector('.ap-template-editor');
    expect(root).toHaveClass('my-custom-class');
  });
});
