import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  SelectionState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(
    // Load from local storage or create an empty EditorState
    EditorState.createWithContent(EditorState.createEmpty().getCurrentContent())
  );
  const editorRef = useRef(null);

  const loadContentFromLocalStorage = () => {
    const savedContent = localStorage.getItem("editorContent");
    const savedCursorPosition = localStorage.getItem("cursorPosition");

    if (savedContent) {
      const rawContentState = JSON.parse(savedContent);
      const contentState = convertFromRaw(rawContentState);

      let editorState;

      if (savedCursorPosition) {
        const cursorPosition = JSON.parse(savedCursorPosition);
        const selection = new SelectionState(cursorPosition);

        // Use EditorState.moveFocusToEnd to set the cursor position at the end
        editorState = EditorState.createWithContent(contentState);
        editorState = EditorState.moveFocusToEnd(editorState);

        // Now, apply the saved cursor position
        editorState = EditorState.forceSelection(editorState, selection);
      } else {
        // If no saved cursor position, create EditorState without selection
        editorState = EditorState.createWithContent(contentState);
      }

      setEditorState(editorState);
    }
  };

  // Auto-focus the editor when the component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    loadContentFromLocalStorage();
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

  //  Save content in Local Storage
  const saveContentToLocalStorage = (state) => {
    const contentState = state.getCurrentContent();

    // Save content state
    const rawContentState = JSON.stringify(convertToRaw(contentState));
    localStorage.setItem("editorContent", rawContentState);

    // Save cursor position
    const selection = state.getSelection();
    const cursorPosition = {
      anchorKey: selection.getAnchorKey(),
      anchorOffset: selection.getAnchorOffset(),
    };
    localStorage.setItem("cursorPosition", JSON.stringify(cursorPosition));

    alert("Document Updated!");
  };

  const clearAllHandler = () => {
    localStorage.clear();
    setEditorState(EditorState.createEmpty());
  };

  return (
    <div className=" app_container">
      {/* heading and button */}
      <div className="bg_light_slate">
        <div className="heading_and_button_container">
          <h1 className="heading ">Demo Editor by Vivek Khanal</h1>
          <div className="btn_container">
            <button
              className="save_btn"
              onClick={() => saveContentToLocalStorage(editorState)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {/* editor */}
      <div className="editor_container">
        {/* Draft.js Editor Component */}
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={onChange}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          placeholder="Start writting here..."
        />
      </div>
      <div className="clear_container">
        <button className="clear_btn" onClick={clearAllHandler}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CustomEditor;
