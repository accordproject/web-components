import React, {
useState, useRef, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useEditor } from 'slate-react';
import { Editor, Transforms, Node } from 'slate';
import styled from 'styled-components';
import { Form, Input } from 'semantic-ui-react';
import { insertImage } from "../plugins/withImages"

import Portal from '../components/Portal';

const ImageWrapper = styled.div`
    position: absolute;
    z-index: 3000;
    top: -10000px;
    left: -10000px;
    margin-top: -6px;
    opacity: 0;
    background-color: #FFFFFF;
    border: 1px solid #d4d4d5;
    border-radius: .3rem;
    min-width:300px;
    line-height: 1.4285em;
    max-width: 250px;
    padding: .833em 1em;
    font-weight: 400;
    font-style: normal;
    color: rgba(0,0,0,.87);
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
    & > * {
        display: inline-block;
    }
`;

const ImageCaret = styled.div`
    position: absolute;
    z-index: 4000;
    left: calc(50% - 5px);
    top: -10px;
    height: 0;
    width: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid #d4d4d5;
    transition: opacity 0.75s;
`;

const InlineFormField = styled(Form.Field)`
display: flex;
flex-direction: row;
`;

const InputFieldWrapper = styled.div`
width: 270px;
display: flex;
flex-direction: column;
`;

const InputFieldLabel = styled.label`
font-weight: bold;
font-size: 12px;
`;

const InlineFormButton = styled.button`
margin-left: 10px;
align-self: flex-end;
height: 38px;
width: 90px;
border: none;
color: #fff;
border-radius: 3px;
background-color: #0043BA;
&:hover {
    background-color: #265FC4;
}
`;

const popupStyles = {
padding: '0.2em 0.5em 0.2em 0.5em',
zIndex: '9999'
};

// eslint-disable-next-line react/display-name
const ImageMenu = React.forwardRef(
({ ...props }, ref) => <ImageWrapper ref={ref} {...props} />
);

ImageMenu.displayName = 'ImageMenu';

// eslint-disable-next-line react/display-name
const ImageModal = React.forwardRef(({ ...props }, ref) => {
const refImageTextInput = useRef();
const editor = useEditor();
const [originalSelection, setOriginalSelection] = useState(null);
const [canApply, setApplyStatus] = useState(false);

const actionHandler = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
    props.setShowImageModal(false);
    }
}, [props, ref]);

useEffect(() => {
    document.addEventListener('mousedown', actionHandler);
    document.addEventListener('keydown', actionHandler);
    return () => {
    document.removeEventListener('mousedown', actionHandler);
    document.removeEventListener('keydown', actionHandler);
    };
}, [actionHandler]);

const defaultURLValue = React.useMemo(() => {
    const [imageNode] = Editor.nodes(editor, { match: n => n.type === 'image' });
    const text = imageNode[0].data.href
    return text
}, [editor]);

const defaultTextValue = React.useMemo(() => {
    const [imageNode] = Editor.nodes(editor, { match: n => n.type === 'image' });
    const text = imageNode[0].data.title
    return text;
}, [editor]);



useEffect(() => {
    // If the form is just opened, focus the Url input field
    if (props.showImageModal) {
    setOriginalSelection(editor.selection);
    setApplyStatus(!!refImageTextInput.current.props.defaultValue);
    const x = window.scrollX;
    const y = window.scrollY;
    refImageTextInput.current.focus();
    window.scrollTo(x, y);
    }
}, [editor, props.showImageModal]);

const validateUrl = (url) => {
    const isUrlInvalid = !(url.startsWith('http://') || url.startsWith('https://'));
    if (isUrlInvalid) {
    return `https://${url}`;
    }
    return url;
};

const applyURL = (event) => {
    const newUrl = validateUrl(event.target.url.value);
    Transforms.select(editor, originalSelection);
    Editor.deleteBackward(editor);
    insertImage(editor, newUrl, event.target.text.value);
    props.setShowImageModal(false);
    
};

const handleUrlInput = (event) => {
    Transforms.select(editor, originalSelection);
    setApplyStatus(!!event.target.value);
};

return (
    <Portal>
    <ImageMenu ref={ref}>
        <ImageCaret />
        <Form onSubmit={applyURL}>
        <InputFieldWrapper>
            <InputFieldLabel>Image Title</InputFieldLabel>
            <Input placeholder="Title" name="text"
                defaultValue={defaultTextValue}
            />
        </InputFieldWrapper>
        <InlineFormField>
            <InputFieldWrapper>
                <InputFieldLabel>Image URL</InputFieldLabel>
                <Input
                ref={refImageTextInput}
                placeholder={'https://docs.accordproject.org/docs/assets/020/template.png'}
                defaultValue={defaultURLValue}
                onChange={handleUrlInput}
                name="url"
                />
            </InputFieldWrapper>
            <InlineFormButton
                type="submit"
                disabled={!canApply}
            >
                Apply
            </InlineFormButton>
        </InlineFormField>
          
        </Form>
    </ImageMenu>
    </Portal>
);
});

ImageModal.displayName = 'ImageModal';

ImageModal.propTypes = {
setShowImageModal: PropTypes.func,
showImageModal: PropTypes.bool
};

export default ImageModal;