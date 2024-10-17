// src/declarations.d.ts

// src/@types/draftjs-to-html.d.ts
declare module "draftjs-to-html" {
  import { ContentState } from "draft-js";

  export default function draftToHtml(
    contentState: ContentState,
    options?: any
  ): string;
}

// src/@types/react-draft-wysiwyg.d.ts
declare module "react-draft-wysiwyg" {
  import { Component } from "react";
  import { EditorState } from "draft-js";

  export interface EditorProps {
    editorState: EditorState;
    onEditorStateChange: (editorState: EditorState) => void;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbar?: any; // You can specify a more precise type here if needed
    editorStyle?: React.CSSProperties;
    toolbarClassName?: string;
  }

  export class Editor extends Component<EditorProps> {}
}

// src/@types/draft-js.d.ts
declare module "draft-js" {
  import { ContentState, EditorState } from "draft-js";

  export interface RawDraftContentState {
    blocks: Array<{
      key: string;
      text: string;
      type: string;
      depth: number;
      inlineStyleRanges: Array<{
        offset: number;
        length: number;
        style: string;
      }>;
      entityRanges: Array<{
        offset: number;
        length: number;
        key: number;
      }>;
      data: object;
    }>;
    entityMap: { [key: string]: any };
  }

  export function convertToRaw(
    contentState: ContentState
  ): RawDraftContentState;

  export function convertFromRaw(
    rawContentState: RawDraftContentState
  ): ContentState;

  export class EditorState {
    static createWithContent(contentStateWithText: ContentState) {
      throw new Error('Method not implemented.');
    }
    static push(editorState: EditorState, contentStateWithText: ContentState, arg2: string) {
      throw new Error('Method not implemented.');
    }
    static createEmpty(): EditorState;
    getCurrentContent(): ContentState;
    getSelection(): any;
  }

  export namespace Modifier {
    function insertText(
      contentState: ContentState,
      selectionState: any,
      text: string,
      inlineStyle?: string | null,
      entityKey?: string | null
    ): ContentState;
  }

  export class ContentState {
    // Define methods and properties as needed
  }
}
