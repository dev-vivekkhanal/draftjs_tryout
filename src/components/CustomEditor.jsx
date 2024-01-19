import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  ContentState,
  SelectionState,
} from "draft-js";
import "draft-js/dist/Draft.css";
// import "../Editor.css";

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(
    // Load from local storage or create an empty EditorState
    EditorState.createWithContent(EditorState.createEmpty().getCurrentContent())
  );
  const editorRef = useRef(null);

  // Auto-focus the editor when the component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Load content from local storage on component mount
    // const savedContent = localStorage.getItem("editorContent");
    // if (savedContent) {
    //   const contentState = EditorState.createWithContent(
    //     EditorState.createWithText(savedContent).getCurrentContent()
    //   );
    //   setEditorState(contentState);
    // }

    const savedContent = localStorage.getItem("editorContent");
    const savedCursorPos = localStorage.getItem("cursorPosition");
    const savedInlineStyles = localStorage.getItem("editorInlineStyles");

    if (savedContent) {
      let editorState;

      if (savedCursorPos) {
        // If there is saved selection, create EditorState with selection
        const selectionState = JSON.parse(savedCursorPos);
        editorState = EditorState.createWithContent(
          EditorState.createWithText(savedContent).getCurrentContent(),
          null, // Use default decorator
          selectionState
        );
      } else if (savedInlineStyles) {
        // If there are saved inline styles, apply them to the content
        const inlineStyles = JSON.parse(savedInlineStyles);
        const contentState = ContentState.createFromText(
          savedContent,
          inlineStyles
        );
        editorState = EditorState.createWithContent(contentState);
      } else {
        // If no saved selection, create EditorState without selection
        editorState = EditorState.createWithContent(
          EditorState.createWithText(savedContent).getCurrentContent()
        );
      }

      setEditorState(editorState);
    }
  }, []);

  // Function to update the editor state
  const onChange = (newState) => {
    setEditorState(newState);
  };

  // Custom styles for red text using **
  const styleMap = {
    REDTEXT: {
      color: "red",
    },
  };

  // Handle text input before it's inserted into the editor
  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = contentState.getBlockForKey(selection.getStartKey());
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const replacedText =
      block.getText().substring(0, start) +
      chars +
      block.getText().substring(end);

    const replacedContent = Modifier.replaceText(
      contentState,
      selection.merge({ anchorOffset: 0, focusOffset: end }),
      replacedText
    );

    const newEditorState = EditorState.push(
      editorState,
      replacedContent,
      "replace-text"
    );

    if (chars === " ") {
      // Handle special formatting characters
      if (replacedText.trim() === "#") {
        const updatedStart = selection.getStartOffset() - 1;
        const updatedSelection = selection.merge({
          anchorOffset: updatedStart,
        });
        const replacedContent = Modifier.replaceText(
          contentState,
          updatedSelection,
          " "
        );
        const updatedEditorState = EditorState.push(
          newEditorState,
          replacedContent,
          "replace-text"
        );
        onChange(RichUtils.toggleBlockType(updatedEditorState, "header-one"));
        return "handled";
      }

      if (replacedText.trim() === "*") {
        const updatedStart = selection.getStartOffset() - 1;
        const updatedSelection = selection.merge({
          anchorOffset: updatedStart,
        });
        const replacedContent = Modifier.replaceText(
          contentState,
          updatedSelection,
          " "
        );
        const updatedEditorState = EditorState.push(
          newEditorState,
          replacedContent,
          "replace-text"
        );
        onChange(RichUtils.toggleInlineStyle(updatedEditorState, "BOLD"));
        return "handled";
      }

      if (replacedText.trim() === "**") {
        const updatedStart = selection.getStartOffset() - 2;
        const updatedSelection = selection.merge({
          anchorOffset: updatedStart,
        });
        const replacedContent = Modifier.replaceText(
          contentState,
          updatedSelection,
          " "
        );
        const updatedEditorState = EditorState.push(
          newEditorState,
          replacedContent,
          "replace-text"
        );
        onChange(RichUtils.toggleInlineStyle(updatedEditorState, "REDTEXT"));
        return "handled";
      }

      if (replacedText.trim() === "***") {
        const updatedStart = selection.getStartOffset() - 3;
        const updatedSelection = selection.merge({
          anchorOffset: updatedStart,
        });
        const replacedContent = Modifier.replaceText(
          contentState,
          updatedSelection,
          " "
        );
        const updatedEditorState = EditorState.push(
          newEditorState,
          replacedContent,
          "replace-text"
        );
        onChange(RichUtils.toggleInlineStyle(updatedEditorState, "UNDERLINE"));
        return "handled";
      }
    }

    return "not-handled";
  };

  // Handle Enter Key
  const handleKeyCommand = (command, editorState) => {
    if (command === "split-block") {
      console.log("spli-block");
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();

      // Create a new unstyled block after Enter key press
      const newContentState = Modifier.splitBlock(contentState, selection);
      const unstyledBlockKey = newContentState
        .getSelectionAfter()
        .getStartKey();

      const contentWithUnstyled = Modifier.setBlockType(
        newContentState,
        newContentState.getSelectionAfter(),
        "unstyled"
      );

      const newEditorState = EditorState.push(
        editorState,
        contentWithUnstyled,
        "split-block"
      );

      // Move the selection to the new unstyled block
      const updatedEditorState = EditorState.forceSelection(
        newEditorState,
        newEditorState.getSelection().merge({
          anchorKey: unstyledBlockKey,
          anchorOffset: 0,
          focusKey: unstyledBlockKey,
          focusOffset: 0,
        })
      );
      onChange(updatedEditorState);

      // Clear inline styles after Enter key press
      const contentWithoutStyles = Modifier.replaceText(
        newEditorState.getCurrentContent(),
        newEditorState.getSelection().merge({
          anchorOffset: 0,
          focusOffset: 0,
        }),
        " "
      );
      onChange(
        EditorState.push(
          newEditorState,
          contentWithoutStyles,
          "remove-inline-styles"
        )
      );

      return "handled";
    }

    return "not-handled";
  };

  // Define custom key bindings
  const keyBindingFn = (e) => {
    if (e.key === "Enter") {
      return "split-block";
    }
    return getDefaultKeyBinding(e);
  };

  //   Save content to local storage
  const saveContentToLocalStorage = (state) => {
    const content = state.getCurrentContent().getPlainText();
    localStorage.setItem("editorContent", content);

    const selection = JSON.stringify(state.getSelection().toJSON());
    localStorage.setItem("cursorPosition", selection);

    const inlineStyles = state.getCurrentInlineStyle();
    localStorage.setItem(
      "editorInlineStyles",
      JSON.stringify(inlineStyles.toArray())
    );
  };

  return (
    <div>
      <button onClick={() => saveContentToLocalStorage(editorState)}>
        Save
      </button>
      {/* Draft.js Editor Component */}
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={styleMap}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        placeholder="Start writting..."
      />
    </div>
  );
};

export default CustomEditor;
