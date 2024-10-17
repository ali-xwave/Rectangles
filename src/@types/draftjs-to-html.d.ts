declare module "draftjs-to-html" {
  import { ContentState } from "draft-js";

  export interface DraftToHtmlOptions {
    [key: string]: unknown; // Replace any with a more specific type
  }

  export default function draftToHtml(
    contentState: ContentState,
    options?: DraftToHtmlOptions
  ): string;
}

declare module "react-draft-wysiwyg" {
  import { Component } from "react";
  import { EditorState } from "draft-js";

  export interface ToolbarOptions {
    options?: string[];
    [key: string]: unknown; // Dynamic key support
  }

  export interface EditorProps {
    editorState: EditorState;
    onEditorStateChange: (editorState: EditorState) => void;
    wrapperClassName?: string;
    editorClassName?: string;
    toolbar?: ToolbarOptions;
    editorStyle?: React.CSSProperties;
    toolbarClassName?: string;
  }

  export class Editor extends Component<EditorProps> {}
}

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
    entityMap: Record<string, unknown>; // Use Record type instead of any
  }

  export function convertToRaw(
    contentState: ContentState
  ): RawDraftContentState;

  export function convertFromRaw(
    rawContentState: RawDraftContentState
  ): ContentState;

  export class EditorState {
    static createWithContent(contentStateWithText: ContentState): EditorState;
    static push(
      editorState: EditorState,
      contentStateWithText: ContentState,
      arg2: string
    ): EditorState;
    static createEmpty(): EditorState;
    getCurrentContent(): ContentState;
    getSelection(): unknown;
  }

  export namespace Modifier {
    function insertText(
      contentState: ContentState,
      selectionState: unknown, // Specify unknown for selectionState
      text: string,
      inlineStyle?: string | null,
      entityKey?: string | null
    ): ContentState;
  }

  export class ContentState {
    // Define methods and properties as needed
  }
}
