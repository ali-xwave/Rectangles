// src/@types/react-canvas-draw.d.ts
declare module "react-canvas-draw" {
  import * as React from "react";

  interface CanvasDrawProps {
      brushColor?: string;
      canvasWidth?: number;
      canvasHeight?: number;
      imgSrc?: string | undefined;
      // Add more props here as necessary
      // Check the library documentation for more props
  }

  export default class CanvasDraw extends React.Component<CanvasDrawProps> {
      clear: () => void;
      getDataURL: () => string;
      // Add more methods here as necessary
  }
}
