import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./Editor.css";

const HeadingEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (newState) => {
    setEditorState(newState);
  };

  const handleBeforeInput = (chars, editorState) => {
    if (
      chars === " " &&
      editorState.getCurrentContent().getPlainText().trim() === "#"
    ) {
      // Replace the '#' with a space to toggle heading
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const block = contentState.getBlockForKey(selection.getStartKey());
      const blockKey = block.getKey();
      const blockText = block.getText();
      const start = selection.getStartOffset() - 1; // Adjust for the '#' character
      const end = selection.getEndOffset();
      const replacedText =
        blockText.substring(0, start) + " " + blockText.substring(end);

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
      onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
      // onChange(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
      return "handled";
    }
    return "not-handled";
  };
  return (
    <div>
      <Editor
        editorState={editorState}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
};

export default HeadingEditor;

// ###########################################################################

// import React, { useState } from "react";
// import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
// // import "draft-js/dist/Draft.css";
// import "./Editor.css";

// const HeadingEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const onChange = (newState) => {
//     setEditorState(newState);
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     if (
//       chars === " " &&
//       editorState.getCurrentContent().getPlainText().trim() === "#"
//     ) {
//       // Replace the '#' with a space to toggle heading
//       const contentState = editorState.getCurrentContent();
//       const selection = editorState.getSelection();
//       const block = contentState.getBlockForKey(selection.getStartKey());
//       const start = selection.getStartOffset() - 1; // Adjust for the '#' character
//       const end = selection.getEndOffset();
//       const replacedText =
//         block.getText().substring(0, start) +
//         " " +
//         block.getText().substring(end);

//       const replacedContent = Modifier.replaceText(
//         contentState,
//         selection.merge({ anchorOffset: 0, focusOffset: end }),
//         replacedText
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         replacedContent,
//         "replace-text"
//       );
//       onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
//       return "handled";
//     }
//     return "not-handled";
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={onChange}
//         handleBeforeInput={handleBeforeInput}
//       />
//       <style>{`
//         .heading-editor h1 {
//           font-size: 96px; /* Adjust the font size as needed */
//           font-weight: bold;
//           margin-bottom: 12px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HeadingEditor;
