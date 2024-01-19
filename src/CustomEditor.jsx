import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(contentRaw));
  }, [editorState]);

  const onChange = (newState) => {
    setEditorState(newState);
  };

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = contentState.getBlockForKey(selection.getStartKey());
    const start = selection.getStartOffset();
    const line = block.getText();

    const newEditorState = EditorState.push(
      editorState,
      contentState,
      "insert-characters"
    );

    if (line.startsWith("# ") && start === 2) {
      onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
      return "handled";
    } else if (line.startsWith("* ") && start === 2) {
      onChange(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
      return "handled";
    } else if (line.startsWith("** ") && start === 3) {
      onChange(RichUtils.toggleInlineStyle(newEditorState, "ITALIC"));
      return "handled";
    } else if (line.startsWith("*** ") && start === 4) {
      onChange(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
      return "handled";
    }

    return "not-handled";
  };

  const handleKeyCommand = (command, currentEditorState) => {
    let newEditorState = RichUtils.handleKeyCommand(
      currentEditorState,
      command
    );

    if (!newEditorState && command === "toggle-heading") {
      newEditorState = RichUtils.toggleBlockType(
        currentEditorState,
        "header-one"
      );
    }

    if (newEditorState) {
      onChange(newEditorState);
      return "handled";
    }

    return "not-handled";
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const contentRaw = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(contentRaw));
    alert("Content saved!");
  };

  return (
    <div>
      <h1>Custom Text Editor</h1>
      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "200px",
          padding: "10px",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default CustomEditor;
