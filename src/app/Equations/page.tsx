"use client";
import React, { Component } from "react";
import { EditorState, convertToRaw, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface State {
  editorState: EditorState;
  htmlContent: string;
}

class RichTextEditor extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      htmlContent: "",
    };
  }

  onEditorStateChange = (editorState: EditorState) => {
    const htmlContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    this.setState({ editorState, htmlContent });
  };

  insertText = (text: string) => {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const contentStateWithText = Modifier.insertText(
      contentState,
      selectionState,
      text
    );
    const newEditorState = EditorState.push(
      editorState,
      contentStateWithText,
      "insert-characters"
    );
    this.setState({ editorState: newEditorState });
  };

  logEquation = () => {
    if (typeof window !== "undefined") {
      const { htmlContent } = this.state;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      const plainText = tempDiv.innerText || tempDiv.textContent || "";
      const formattedText = plainText.replace(/[\n]/g, " ").trim();
      console.log({ equation: formattedText });
    }
  };

  convertToLatex = () => {
    if (typeof window !== "undefined") {
      const { htmlContent } = this.state;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      const latexContent = tempDiv.innerHTML
        .replace(/<p><\/p>/g, "") // Remove empty <p> tags
        .replace(/<p>(.*?)<\/p>/g, "$1") // Keep content only
        .replace(/\n/g, "") // Remove newlines
        .replace(/<sup>(.*?)<\/sup>/g, "^{$1}")
        .replace(/<sub>(.*?)<\/sub>/g, "_{$1}")
        .replace(/<br\s*\/?>/g, "\\\\")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');

      console.log({ latexEquation: latexContent.trim() });
    }
  };

  render() {
    const { editorState, htmlContent } = this.state;

    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: ["inline", "history"],
            inline: {
              options: ["superscript", "subscript"],
            },
          }}
          editorStyle={{
            backgroundColor: "#f0f0f0",
            height: "200px",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() => this.insertText("→")}
            className="toolbar-button"
            style={{ marginRight: "10px" }}
          >
            {"→"}
          </button>
          <button
            onClick={this.logEquation}
            className="toolbar-button"
            style={{ marginRight: "10px" }}
          >
            Log Equation
          </button>
          <button onClick={this.convertToLatex} className="toolbar-button">
            Convert to LaTeX
          </button>
        </div>

        <div
          style={{
            marginTop: "10px",
            width: "60%",
            minHeight: "50px",
            fontSize: "4vh",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            overflow: "auto",
            whiteSpace: "pre-line",
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }
}

export default RichTextEditor;
