import { Editor, Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import type { Plugin } from 'prosemirror-state';

import { VariableExtension } from '../../src/extensions/VariableExtension';
import { FormattedVariableExtension } from '../../src/extensions/FormattedVariableExtension';
import { EnumVariableExtension } from '../../src/extensions/EnumVariableExtension';
import { FormulaExtension } from '../../src/extensions/FormulaExtension';
import { ConditionalExtension } from '../../src/extensions/ConditionalExtension';
import { OptionalExtension } from '../../src/extensions/OptionalExtension';
import { WithExtension } from '../../src/extensions/WithExtension';
import { ListBlockExtension } from '../../src/extensions/ListBlockExtension';
import { ListItemExtension } from '../../src/extensions/ListItemExtension';
import { ForeachExtension } from '../../src/extensions/ForeachExtension';
import { JoinExtension } from '../../src/extensions/JoinExtension';
import { ImageExtension } from '../../src/extensions/ImageExtension';
import { ThematicBreakExtension } from '../../src/extensions/ThematicBreakExtension';
import { ClauseExtension } from '../../src/extensions/ClauseExtension';
import { ContractExtension } from '../../src/extensions/ContractExtension';
import { WithBlockExtension } from '../../src/extensions/WithBlockExtension';
import {
  ConditionalBlockExtension,
  ConditionalBranchTrueExtension,
  ConditionalBranchFalseExtension,
} from '../../src/extensions/ConditionalBlockExtension';
import {
  OptionalBlockExtension,
  OptionalBranchSomeExtension,
  OptionalBranchNoneExtension,
} from '../../src/extensions/OptionalBlockExtension';
import { createVariableSyncPlugin } from '../../src/plugins/VariableSyncPlugin';
import { createFormulaDependencyPlugin } from '../../src/plugins/FormulaDependencyPlugin';
import { templateMarkToTipTap } from '../../src/serializer/TemplateMarkToTipTap';
import type { TemplateMarkDocument } from '../../src/types/TemplateMark';

const BasePluginsExtension = Extension.create({
  name: 'testEditorPlugins',
  addProseMirrorPlugins(): Plugin[] {
    return [createVariableSyncPlugin(), createFormulaDependencyPlugin()];
  },
});

/** Create a headless TipTap Editor for testing (no DOM rendering). */
export function createTestEditor(doc?: TemplateMarkDocument): Editor {
  const content = doc
    ? templateMarkToTipTap(doc)
    : { type: 'doc', content: [{ type: 'paragraph' }] };

  return new Editor({
    extensions: [
      StarterKit.configure({ listItem: false }),
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
      ImageExtension,
      ThematicBreakExtension,
      ClauseExtension,
      ContractExtension,
      WithBlockExtension,
      ConditionalBlockExtension,
      ConditionalBranchTrueExtension,
      ConditionalBranchFalseExtension,
      OptionalBlockExtension,
      OptionalBranchSomeExtension,
      OptionalBranchNoneExtension,
      BasePluginsExtension,
    ],
    content,
  });
}
