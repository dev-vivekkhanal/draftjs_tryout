import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  ContentState,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const HeadingEditorTwo = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command, currentEditorState) => {
    if (command === "toggle-heading") {
      setEditorState(RichUtils.toggleInlineStyle(currentEditorState, "BOLD"));
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFunction = (e) => {
    if (e.key === "#" && e.nativeEvent.keyCode === 32) {
      // Handle '#' followed by space to toggle heading
      return "toggle-heading";
    }
    return getDefaultKeyBinding(e);
  };

  const onChange = (newState) => {
    setEditorState(newState);
  };

  const handleBeforeInput = (chars, editorState) => {
    if (
      chars === " " &&
      editorState.getCurrentContent().getPlainText() === "#"
    ) {
      // Replace the '#' with a space to toggle heading
      const contentState = ContentState.createFromText(" ");
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        "insert-characters"
      );
      onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
      // onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));

      return "handled";
    }
    if (
      chars === " " &&
      editorState.getCurrentContent().getPlainText() === "*"
    ) {
      // Replace the '#' with a space to toggle heading
      const contentState = ContentState.createFromText(" ");
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        "insert-characters"
      );
      onChange(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
      // onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));

      return "handled";
    }
    if (
      chars === " " &&
      editorState.getCurrentContent().getPlainText() === "**"
    ) {
      // Replace the '#' with a space to toggle heading
      const contentState = ContentState.createFromText(" ");
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        "insert-characters"
      );
      onChange(RichUtils.toggleInlineStyle(newEditorState, "ITALIC"));
      // onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));

      return "handled";
    }
    if (
      chars === " " &&
      editorState.getCurrentContent().getPlainText() === "***"
    ) {
      // Replace the '#' with a space to toggle heading
      const contentState = ContentState.createFromText(" ");
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        "insert-characters"
      );
      onChange(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
      // onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));

      return "handled";
    }
    return "not-handled";
  };

  return (
    <div>
      <h1>Heading Editor</h1>
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFunction}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
};

export default HeadingEditorTwo;
