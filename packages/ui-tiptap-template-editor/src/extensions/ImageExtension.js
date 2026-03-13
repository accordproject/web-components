import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateImageNodeView } from '../nodeViews/TemplateImageNodeView';
/**
 * Image extension configured for TemplateMark.
 * Maps to org.accordproject.commonmark@0.5.0.Image
 *
 * Attributes match CommonMark spec: destination, title
 */
export const ImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            // Map TipTap's 'src' to TemplateMark's 'destination'
            src: {
                default: null,
                parseHTML: (element) => element.getAttribute('src'),
                renderHTML: (attributes) => {
                    if (!attributes.src)
                        return {};
                    return { src: attributes.src };
                },
            },
            alt: {
                default: null,
                parseHTML: (element) => element.getAttribute('alt'),
                renderHTML: (attributes) => {
                    if (!attributes.alt)
                        return {};
                    return { alt: attributes.alt };
                },
            },
            title: {
                default: null,
                parseHTML: (element) => element.getAttribute('title'),
                renderHTML: (attributes) => {
                    if (!attributes.title)
                        return {};
                    return { title: attributes.title };
                },
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(TemplateImageNodeView);
    },
});
