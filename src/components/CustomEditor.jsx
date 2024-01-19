import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "../Editor.css"; // Import your global styles

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (newState) => {
    setEditorState(newState);
  };

  const styleMap = {
    REDTEXT: {
      color: "red",
    },
  };

  const handleBeforeInput = (chars, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = contentState.getBlockForKey(selection.getStartKey());
    const start = selection.getStartOffset() - 1;
    const end = selection.getEndOffset();
    const replacedText =
      block.getText().substring(0, start) +
      " " +
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

    const applyInlineStyle = (style) => {
      onChange(RichUtils.toggleInlineStyle(newEditorState, style));
      return "handled";
    };

    if (chars === " ") {
      const offset = replacedText.length - 1;

      //   If Enter is pressed, clear all inline styles
      if (replacedText.trim() === "") {
        const contentWithoutStyles = Modifier.replaceText(
          newEditorState.getCurrentContent(),
          newEditorState.getSelection().merge({
            anchorOffset: offset,
            focusOffset: offset,
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

      // Handle special formatting characters
      if (replacedText.trim() === "#") {
        onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
        return "handled";
      }

      if (replacedText.trim() === "*") {
        return applyInlineStyle("BOLD");
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

      return "not-handled";
    }
  };

  const handleKeyCommand = (command, editorState) => {
    if (command === "split-block") {
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

      return "handled";
    }

    return "not-handled";
  };

  const keyBindingFn = (e) => {
    if (e.key === "Enter") {
      return "split-block";
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={styleMap}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
      />
    </div>
  );
};

export default CustomEditor;
