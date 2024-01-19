// import { Editor, EditorState, RichUtils } from "draft-js";
// import React from "react";

// class MyEditor extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { editorState: EditorState.createEmpty() };
//     this.onChange = (editorState) => this.setState({ editorState });
//     this.handleKeyCommand = this.handleKeyCommand.bind(this);
//   }

//   handleKeyCommand(command, editorState) {
//     const newState = RichUtils.handleKeyCommand(editorState, command);

//     if (newState) {
//       this.onChange(newState);
//       return "handled";
//     }

//     return "not-handled";
//   }

//   _onBoldClick() {
//     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={this._onBoldClick.bind(this)}>Bold</button>
//         <Editor
//           editorState={this.state.editorState}
//           handleKeyCommand={this.handleKeyCommand}
//           onChange={this.onChange}
//         />
//       </div>
//     );
//   }
// }

// export default MyEditor;

// #################################

// import React, { useState } from "react";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   Modifier,
//   getDefaultKeyBinding,
// } from "draft-js";
// import "draft-js/dist/Draft.css";
// import "../Editor.css"; // Import your global styles

// const CustomEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const onChange = (newState) => {
//     setEditorState(newState);
//   };

//   const styleMap = {
//     REDTEXT: {
//       color: "red",
//     },
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const block = contentState.getBlockForKey(selection.getStartKey());
//     const start = selection.getStartOffset() - 1;
//     const end = selection.getEndOffset();
//     const replacedText =
//       block.getText().substring(0, start) +
//       " " +
//       block.getText().substring(end);

//     const replacedContent = Modifier.replaceText(
//       contentState,
//       selection.merge({ anchorOffset: 0, focusOffset: end }),
//       replacedText
//     );

//     const newEditorState = EditorState.push(
//       editorState,
//       replacedContent,
//       "replace-text"
//     );

//     if (chars === " ") {
//       const offset = replacedText.length - 1; // Calculate offset after replacing text

//       // If Enter is pressed, clear inline styles and toggle unstyled block
//       if (replacedText.trim() === "") {
//         const contentWithoutStyles = Modifier.removeInlineStyle(
//           newEditorState.getCurrentContent(),
//           newEditorState.getSelection().merge({
//             anchorOffset: offset,
//             focusOffset: offset,
//           }),
//           "BOLD"
//         );

//         const editorStateWithoutStyles = EditorState.push(
//           newEditorState,
//           contentWithoutStyles,
//           "change-inline-style"
//         );

//         onChange(
//           RichUtils.toggleBlockType(editorStateWithoutStyles, "unstyled")
//         );
//         return "handled";
//       }

//       // Handle special formatting characters
//       if (replacedText.trim() === "#") {
//         onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
//         return "handled";
//       }

//       if (replacedText.trim() === "*") {
//         onChange(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
//         return "handled";
//       }

//       if (replacedText.trim() === "**") {
//         onChange(RichUtils.toggleInlineStyle(newEditorState, "REDTEXT"));
//         return "handled";
//       }

//       if (replacedText.trim() === "***") {
//         onChange(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
//         return "handled";
//       }
//     }

//     return "not-handled";
//   };

//   const handleKeyCommand = (command, editorState) => {
//     if (command === "split-block") {
//       const contentState = editorState.getCurrentContent();
//       const selection = editorState.getSelection();

//       // Create a new unstyled block after Enter key press
//       const newContentState = Modifier.splitBlock(contentState, selection);
//       const unstyledBlockKey = newContentState
//         .getSelectionAfter()
//         .getStartKey();

//       const contentWithUnstyled = Modifier.setBlockType(
//         newContentState,
//         newContentState.getSelectionAfter(),
//         "unstyled"
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         contentWithUnstyled,
//         "split-block"
//       );

//       // Move the selection to the new unstyled block
//       const updatedEditorState = EditorState.forceSelection(
//         newEditorState,
//         newEditorState.getSelection().merge({
//           anchorKey: unstyledBlockKey,
//           anchorOffset: 0,
//           focusKey: unstyledBlockKey,
//           focusOffset: 0,
//         })
//       );

//       onChange(updatedEditorState);

//       return "handled";
//     }

//     return "not-handled";
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === "Enter") {
//       return "split-block";
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={onChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={styleMap}
//         handleKeyCommand={handleKeyCommand}
//         keyBindingFn={keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CustomEditor;

// #######################################

// import React, { useState } from "react";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   Modifier,
//   getDefaultKeyBinding,
// } from "draft-js";
// import "draft-js/dist/Draft.css";
// import "./Editor.css"; // Import your global styles

// const CustomEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const onChange = (newState) => {
//     setEditorState(newState);
//   };

//   const styleMap = {
//     REDTEXT: {
//       color: "red",
//     },
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const block = contentState.getBlockForKey(selection.getStartKey());
//     const start = selection.getStartOffset() - 1;
//     const end = selection.getEndOffset();
//     const replacedText =
//       block.getText().substring(0, start) +
//       " " +
//       block.getText().substring(end);

//     const replacedContent = Modifier.replaceText(
//       contentState,
//       selection.merge({ anchorOffset: 0, focusOffset: end }),
//       replacedText
//     );

//     const newEditorState = EditorState.push(
//       editorState,
//       replacedContent,
//       "replace-text"
//     );

//     if (chars === " ") {
//       const offset = replacedText.length - 1; // Calculate offset after replacing text

//       // If Enter is pressed, clear inline styles and toggle unstyled block
//       if (replacedText.trim() === "") {
//         const contentWithoutStyles = Modifier.removeInlineStyle(
//           newEditorState.getCurrentContent(),
//           newEditorState.getSelection().merge({
//             anchorOffset: offset,
//             focusOffset: offset,
//           }),
//           "BOLD"
//         );

//         const editorStateWithoutStyles = EditorState.push(
//           newEditorState,
//           contentWithoutStyles,
//           "change-inline-style"
//         );

//         onChange(
//           RichUtils.toggleBlockType(editorStateWithoutStyles, "unstyled")
//         );
//         return "handled";
//       }

//       // Handle special formatting characters
//       if (replacedText.trim() === "#") {
//         const updatedStart = selection.getStartOffset() - 2;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleBlockType(updatedEditorState, "header-one"));
//         return "handled";
//       }

//       if (replacedText.trim() === "*") {
//         const updatedStart = selection.getStartOffset() - 2;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "BOLD"));
//         return "handled";
//       }

//       if (replacedText.trim() === "**") {
//         const updatedStart = selection.getStartOffset() - 3;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "REDTEXT"));
//         return "handled";
//       }

//       if (replacedText.trim() === "***") {
//         const updatedStart = selection.getStartOffset() - 4;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "UNDERLINE"));
//         return "handled";
//       }
//     }

//     return "not-handled";
//   };

//   const handleKeyCommand = (command, editorState) => {
//     if (command === "split-block") {
//       const contentState = editorState.getCurrentContent();
//       const selection = editorState.getSelection();

//       // Create a new unstyled block after Enter key press
//       const newContentState = Modifier.splitBlock(contentState, selection);
//       const unstyledBlockKey = newContentState
//         .getSelectionAfter()
//         .getStartKey();

//       const contentWithUnstyled = Modifier.setBlockType(
//         newContentState,
//         newContentState.getSelectionAfter(),
//         "unstyled"
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         contentWithUnstyled,
//         "split-block"
//       );

//       // Move the selection to the new unstyled block
//       const updatedEditorState = EditorState.forceSelection(
//         newEditorState,
//         newEditorState.getSelection().merge({
//           anchorKey: unstyledBlockKey,
//           anchorOffset: 0,
//           focusKey: unstyledBlockKey,
//           focusOffset: 0,
//         })
//       );

//       onChange(updatedEditorState);

//       return "handled";
//     }

//     return "not-handled";
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === "Enter") {
//       return "split-block";
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={onChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={styleMap}
//         handleKeyCommand={handleKeyCommand}
//         keyBindingFn={keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CustomEditor;

// ############## MAIN ONE ##################### use one extra symbol #######

// import React, { useState } from "react";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   Modifier,
//   getDefaultKeyBinding,
// } from "draft-js";
// import "draft-js/dist/Draft.css";
// import "../Editor.css"; // Import your global styles

// const CustomEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const onChange = (newState) => {
//     setEditorState(newState);
//   };

//   const styleMap = {
//     REDTEXT: {
//       color: "red",
//     },
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const block = contentState.getBlockForKey(selection.getStartKey());
//     const start = selection.getStartOffset() - 1;
//     const end = selection.getEndOffset();
//     const replacedText =
//       block.getText().substring(0, start) +
//       " " +
//       block.getText().substring(end);

//     const replacedContent = Modifier.replaceText(
//       contentState,
//       selection.merge({ anchorOffset: 0, focusOffset: end }),
//       replacedText
//     );

//     const newEditorState = EditorState.push(
//       editorState,
//       replacedContent,
//       "replace-text"
//     );

//     const applyInlineStyle = (style) => {
//       onChange(RichUtils.toggleInlineStyle(newEditorState, style));
//       return "handled";
//     };

//     if (chars === " ") {
//       const offset = replacedText.length - 1;

//       if (replacedText.trim() === "") {
//         // If Enter is pressed, clear all inline styles
//         const contentWithoutStyles = Modifier.replaceText(
//           newEditorState.getCurrentContent(),
//           newEditorState.getSelection().merge({
//             anchorOffset: offset,
//             focusOffset: offset,
//           }),
//           " "
//         );

//         onChange(
//           EditorState.push(
//             newEditorState,
//             contentWithoutStyles,
//             "remove-inline-styles"
//           )
//         );
//         return "handled";
//       }

//       // Handle special formatting characters
//       if (replacedText.trim() === "#") {
//         onChange(RichUtils.toggleBlockType(newEditorState, "header-one"));
//         return "handled";
//       }

//       if (replacedText.trim() === "*") {
//         return applyInlineStyle("BOLD");
//       }

//       if (replacedText.trim() === "**") {
//         const updatedStart = selection.getStartOffset() - 2;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "REDTEXT"));
//         return "handled";
//       }

//       if (replacedText.trim() === "***") {
//         const updatedStart = selection.getStartOffset() - 3;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "UNDERLINE"));
//         return "handled";
//       }
//     }

//     return "not-handled";
//   };

//   const handleKeyCommand = (command, editorState) => {
//     if (command === "split-block") {
//       const contentState = editorState.getCurrentContent();
//       const selection = editorState.getSelection();

//       // Create a new unstyled block after Enter key press
//       const newContentState = Modifier.splitBlock(contentState, selection);
//       const unstyledBlockKey = newContentState
//         .getSelectionAfter()
//         .getStartKey();

//       const contentWithUnstyled = Modifier.setBlockType(
//         newContentState,
//         newContentState.getSelectionAfter(),
//         "unstyled"
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         contentWithUnstyled,
//         "split-block"
//       );

//       // Move the selection to the new unstyled block
//       const updatedEditorState = EditorState.forceSelection(
//         newEditorState,
//         newEditorState.getSelection().merge({
//           anchorKey: unstyledBlockKey,
//           anchorOffset: 0,
//           focusKey: unstyledBlockKey,
//           focusOffset: 0,
//         })
//       );

//       onChange(updatedEditorState);

//       return "handled";
//     }

//     return "not-handled";
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === "Enter") {
//       return "split-block";
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={onChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={styleMap}
//         handleKeyCommand={handleKeyCommand}
//         keyBindingFn={keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CustomEditor;

// export default CustomEditor;

import React from "react";

const MyEditor = () => {
  return <div>MyEditor</div>;
};

export default MyEditor;

// ######## Only * , **, * FORMAT is not reset
// import React, { useState } from "react";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   Modifier,
//   getDefaultKeyBinding,
// } from "draft-js";
// import "draft-js/dist/Draft.css";
// import "../Editor.css"; // Import your global styles

// const CustomEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const onChange = (newState) => {
//     setEditorState(newState);
//   };

//   const styleMap = {
//     REDTEXT: {
//       color: "red",
//     },
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const block = contentState.getBlockForKey(selection.getStartKey());
//     const start = selection.getStartOffset(); // Highlighted change
//     const end = selection.getEndOffset();
//     const replacedText =
//       block.getText().substring(0, start) +
//       chars + // Include the newly typed character
//       block.getText().substring(end);

//     const replacedContent = Modifier.replaceText(
//       contentState,
//       selection.merge({ anchorOffset: 0, focusOffset: end }),
//       replacedText
//     );

//     const newEditorState = EditorState.push(
//       editorState,
//       replacedContent,
//       "replace-text"
//     );

//     const applyInlineStyle = (style) => {
//       onChange(RichUtils.toggleInlineStyle(newEditorState, style));
//       return "handled";
//     };

//     if (chars === " ") {
//       const offset = replacedText.length - 1;

//       if (replacedText.trim() === "") {
//         // If Enter is pressed, clear all inline styles
//         const contentWithoutStyles = Modifier.replaceText(
//           newEditorState.getCurrentContent(),
//           newEditorState.getSelection().merge({
//             anchorOffset: offset,
//             focusOffset: offset,
//           }),
//           " "
//         );

//         onChange(
//           EditorState.push(
//             newEditorState,
//             contentWithoutStyles,
//             "remove-inline-styles"
//           )
//         );
//         return "handled";
//       }

//       // Handle special formatting characters
//       if (replacedText.trim() === "#") {
//         const updatedStart = selection.getStartOffset() - 1;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleBlockType(updatedEditorState, "header-one"));
//         return "handled";
//       }

//       if (replacedText.trim() === "*") {
//         const updatedStart = selection.getStartOffset() - 1;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "BOLD"));
//         return "handled";
//       }

//       if (replacedText.trim() === "**") {
//         const updatedStart = selection.getStartOffset() - 2;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "REDTEXT"));
//         return "handled";
//       }

//       if (replacedText.trim() === "***") {
//         const updatedStart = selection.getStartOffset() - 3;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "UNDERLINE"));
//         return "handled";
//       }
//     }

//     return "not-handled";
//   };

//   const handleKeyCommand = (command, editorState) => {
//     if (command === "split-block") {
//       const contentState = editorState.getCurrentContent();
//       const selection = editorState.getSelection();

//       // Create a new unstyled block after Enter key press
//       const newContentState = Modifier.splitBlock(contentState, selection);
//       const unstyledBlockKey = newContentState
//         .getSelectionAfter()
//         .getStartKey();

//       const contentWithUnstyled = Modifier.setBlockType(
//         newContentState,
//         newContentState.getSelectionAfter(),
//         "unstyled"
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         contentWithUnstyled,
//         "split-block"
//       );

//       // Move the selection to the new unstyled block
//       const updatedEditorState = EditorState.forceSelection(
//         newEditorState,
//         newEditorState.getSelection().merge({
//           anchorKey: unstyledBlockKey,
//           anchorOffset: 0,
//           focusKey: unstyledBlockKey,
//           focusOffset: 0,
//         })
//       );

//       onChange(updatedEditorState);

//       return "handled";
//     }

//     return "not-handled";
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === "Enter") {
//       return "split-block";
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={onChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={styleMap}
//         handleKeyCommand={handleKeyCommand}
//         keyBindingFn={keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CustomEditor;

// Finally all logic completed

// import React, { useState } from "react";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   Modifier,
//   getDefaultKeyBinding,
// } from "draft-js";
// import "draft-js/dist/Draft.css";
// import "../Editor.css"; // Import your global styles

// const CustomEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const onChange = (newState) => {
//     setEditorState(newState);
//   };

//   const styleMap = {
//     REDTEXT: {
//       color: "red",
//     },
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     const contentState = editorState.getCurrentContent();
//     const selection = editorState.getSelection();
//     const block = contentState.getBlockForKey(selection.getStartKey());
//     const start = selection.getStartOffset(); // Highlighted change
//     const end = selection.getEndOffset();
//     const replacedText =
//       block.getText().substring(0, start) +
//       chars + // Include the newly typed character
//       block.getText().substring(end);

//     const replacedContent = Modifier.replaceText(
//       contentState,
//       selection.merge({ anchorOffset: 0, focusOffset: end }),
//       replacedText
//     );

//     const newEditorState = EditorState.push(
//       editorState,
//       replacedContent,
//       "replace-text"
//     );

//     if (chars === " ") {
//       // Handle special formatting characters
//       if (replacedText.trim() === "#") {
//         const updatedStart = selection.getStartOffset() - 1;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleBlockType(updatedEditorState, "header-one"));
//         return "handled";
//       }

//       if (replacedText.trim() === "*") {
//         const updatedStart = selection.getStartOffset() - 1;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "BOLD"));
//         return "handled";
//       }

//       if (replacedText.trim() === "**") {
//         const updatedStart = selection.getStartOffset() - 2;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "REDTEXT"));
//         return "handled";
//       }

//       if (replacedText.trim() === "***") {
//         const updatedStart = selection.getStartOffset() - 3;
//         const updatedSelection = selection.merge({
//           anchorOffset: updatedStart,
//         });
//         const replacedContent = Modifier.replaceText(
//           contentState,
//           updatedSelection,
//           " "
//         );
//         const updatedEditorState = EditorState.push(
//           newEditorState,
//           replacedContent,
//           "replace-text"
//         );
//         onChange(RichUtils.toggleInlineStyle(updatedEditorState, "UNDERLINE"));
//         return "handled";
//       }
//     }

//     return "not-handled";
//   };

//   const handleKeyCommand = (command, editorState) => {
//     if (command === "split-block") {
//       console.log("spli-block");
//       const contentState = editorState.getCurrentContent();
//       const selection = editorState.getSelection();

//       // Create a new unstyled block after Enter key press
//       const newContentState = Modifier.splitBlock(contentState, selection);
//       const unstyledBlockKey = newContentState
//         .getSelectionAfter()
//         .getStartKey();

//       const contentWithUnstyled = Modifier.setBlockType(
//         newContentState,
//         newContentState.getSelectionAfter(),
//         "unstyled"
//       );

//       const newEditorState = EditorState.push(
//         editorState,
//         contentWithUnstyled,
//         "split-block"
//       );

//       // Move the selection to the new unstyled block
//       const updatedEditorState = EditorState.forceSelection(
//         newEditorState,
//         newEditorState.getSelection().merge({
//           anchorKey: unstyledBlockKey,
//           anchorOffset: 0,
//           focusKey: unstyledBlockKey,
//           focusOffset: 0,
//         })
//       );

//       onChange(updatedEditorState);

//       const contentWithoutStyles = Modifier.replaceText(
//         newEditorState.getCurrentContent(),
//         newEditorState.getSelection().merge({
//           anchorOffset: 0,
//           focusOffset: 0,
//         }),
//         " "
//       );

//       onChange(
//         EditorState.push(
//           newEditorState,
//           contentWithoutStyles,
//           "remove-inline-styles"
//         )
//       );

//       return "handled";
//     }

//     return "not-handled";
//   };

//   const keyBindingFn = (e) => {
//     if (e.key === "Enter") {
//       return "split-block";
//     }
//     return getDefaultKeyBinding(e);
//   };

//   return (
//     <div>
//       <Editor
//         editorState={editorState}
//         onChange={onChange}
//         handleBeforeInput={handleBeforeInput}
//         customStyleMap={styleMap}
//         handleKeyCommand={handleKeyCommand}
//         keyBindingFn={keyBindingFn}
//       />
//     </div>
//   );
// };

// export default CustomEditor;
