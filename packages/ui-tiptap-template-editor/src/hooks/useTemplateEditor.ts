import { useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/core';

import { VariableExtension } from '../extensions/VariableExtension';
import { FormattedVariableExtension } from '../extensions/FormattedVariableExtension';
import { EnumVariableExtension } from '../extensions/EnumVariableExtension';
import { FormulaExtension } from '../extensions/FormulaExtension';
import { ConditionalExtension } from '../extensions/ConditionalExtension';
import { OptionalExtension } from '../extensions/OptionalExtension';
import { WithExtension } from '../extensions/WithExtension';
import { ListBlockExtension } from '../extensions/ListBlockExtension';
import { ListItemExtension } from '../extensions/ListItemExtension';
import { ForeachExtension } from '../extensions/ForeachExtension';
import { JoinExtension } from '../extensions/JoinExtension';

// Block-level TemplateMark extensions
import { ClauseExtension } from '../extensions/ClauseExtension';
import { ContractExtension } from '../extensions/ContractExtension';
import { WithBlockExtension } from '../extensions/WithBlockExtension';
import {
  ConditionalBlockExtension,
  ConditionalBranchTrueExtension,
  ConditionalBranchFalseExtension,
} from '../extensions/ConditionalBlockExtension';
import {
  OptionalBlockExtension,
  OptionalBranchSomeExtension,
  OptionalBranchNoneExtension,
} from '../extensions/OptionalBlockExtension';

// CommonMark extensions
import { ImageExtension } from '../extensions/ImageExtension';
import { ThematicBreakExtension } from '../extensions/ThematicBreakExtension';
import { HtmlInlineExtension, HtmlBlockExtension } from '../extensions/HtmlExtensions';

import { createVariableSyncPlugin } from '../plugins/VariableSyncPlugin';
import { createFormulaDependencyPlugin } from '../plugins/FormulaDependencyPlugin';

import { templateMarkToTipTap } from '../serializer/TemplateMarkToTipTap';
import { tiptapToTemplateMark } from '../serializer/TipTapToTemplateMark';
import type { TemplateMarkDocument } from '../types/TemplateMark';

import { PasteTemplateMarkExtension } from '../extensions/PasteTemplateMarkExtension';
import type { TemplateEditorProps } from '../types';

export interface UseTemplateEditorResult {
  editor: Editor | null;
  nameRef: React.MutableRefObject<string>;
  currentDoc: React.MutableRefObject<TemplateMarkDocument | null>;
}

export function useTemplateEditor(props: TemplateEditorProps): UseTemplateEditorResult {
  const nameRef = useRef<string>('template');
  if (props.value && 'name' in props.value && typeof props.value.name === 'string') {
    nameRef.current = (props.value as { name: string }).name || 'template';
  }

  const propsRef = useRef(props);
  propsRef.current = props;

  const currentDoc = useRef<TemplateMarkDocument | null>(props.value ?? null);

  // Set to true when a change originates from the editor; suppresses the
  // external-value sync in the useEffect so we don't reset the cursor.
  const internalChange = useRef(false);

  const CustomPluginsExtension = Extension.create({
    name: 'templateEditorPlugins',
    addProseMirrorPlugins() {
      return [
        createVariableSyncPlugin(),
        createFormulaDependencyPlugin(),
      ];
    },
  });

  const initialContent = props.value
    ? templateMarkToTipTap(props.value)
    : { type: 'doc', content: [{ type: 'paragraph' }] };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        listItem: false,
        horizontalRule: false, // We use ThematicBreakExtension instead
      }),
      // Inline TemplateMark nodes
      VariableExtension,
      FormattedVariableExtension,
      EnumVariableExtension,
      FormulaExtension,
      ConditionalExtension,
      OptionalExtension,
      WithExtension,
      ListBlockExtension,
      ListItemExtension,
      ForeachExtension,
      JoinExtension,
      // Block-level TemplateMark nodes
      ClauseExtension,
      ContractExtension,
      WithBlockExtension,
      ConditionalBlockExtension,
      ConditionalBranchTrueExtension,
      ConditionalBranchFalseExtension,
      OptionalBlockExtension,
      OptionalBranchSomeExtension,
      OptionalBranchNoneExtension,
      // CommonMark nodes
      ImageExtension,
      ThematicBreakExtension,
      HtmlInlineExtension,
      HtmlBlockExtension,
      // Plugins
      CustomPluginsExtension,
      PasteTemplateMarkExtension,
    ],
    content: initialContent,
    onUpdate: ({ editor: e }) => {
      const currentProps = propsRef.current;
      const tm = tiptapToTemplateMark(e.getJSON(), nameRef.current);
      currentDoc.current = tm;
      internalChange.current = true;
      currentProps.onChange?.(tm);
    },
  });

  // Sync external value changes into the editor — but skip when the change
  // originated from the editor itself (would reset the cursor position).
  useEffect(() => {
    if (!editor || !props.value) return;
    if (internalChange.current) {
      internalChange.current = false;
      return;
    }
    if ('name' in props.value && typeof props.value.name === 'string') {
      nameRef.current = (props.value as { name: string }).name || 'template';
    }
    editor.commands.setContent(templateMarkToTipTap(props.value), false);
  }, [editor, props.value]);

  return { editor, nameRef, currentDoc };
}
