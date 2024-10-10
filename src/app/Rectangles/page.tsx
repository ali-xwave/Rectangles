"use client";
import React, { useState, useRef, useEffect } from "react";
import CanvasDraw from "react-canvas-draw";

type Rectangle = {
  startX: number;
  startY: number;
  width: number;
  height: number;
  color: string;
};

const DrawPage: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<CanvasDraw | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 300, height: 300 });
  const canvasOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]); // Store rectangles
  const [color, setColor] = useState<string>("black"); // Track selected color

  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    if (canvas) {
      canvas.width = canvasDimensions.width;
      canvas.height = canvasDimensions.height;
      const context = canvas.getContext("2d");
      if (context) {
        contextRef.current = context;
      }
    }
  }, [canvasDimensions]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    setRectangles([]); // Clear rectangles
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    }
  };

  const undoLast = () => {
    if (rectangles.length > 0) {
      const newRectangles = rectangles.slice(0, -1); // Remove last rectangle
      setRectangles(newRectangles);

      // Clear the canvas overlay and redraw remaining rectangles
      if (contextRef.current) {
        contextRef.current.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
        newRectangles.forEach((rect) => {
          contextRef.current!.strokeStyle = rect.color;
          contextRef.current?.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
        });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result as string);
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            setCanvasDimensions({ width: img.width + 10, height: img.height + 10 });
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDrawing = () => {
    if (canvasRef.current) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasDimensions.width;
      tempCanvas.height = canvasDimensions.height;
      const ctx = tempCanvas.getContext("2d");

      if (ctx) {
        // Draw the background image if it exists
        if (imageSrc) {
          const backgroundImg = new Image();
          backgroundImg.src = imageSrc;
          backgroundImg.onload = () => {
            ctx.drawImage(backgroundImg, 0, 0, canvasDimensions.width, canvasDimensions.height);

            // Draw the user's drawing on top
            const drawing = canvasRef.current?.getDataURL();
            if (drawing) {
              const drawingImg = new Image();
              drawingImg.src = drawing;
              drawingImg.onload = () => {
                ctx.drawImage(drawingImg, 0, 0, canvasDimensions.width, canvasDimensions.height);

                rectangles.forEach((rect) => {
                  ctx.strokeStyle = rect.color;
                  ctx.lineWidth = 2;
                  ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
                });

                const finalImage = tempCanvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = finalImage;
                link.download = "drawing.png";
                link.click();
              };
            }
          };
        }
      }
    }
  };

  const startDrawingRectangle = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasBounds = canvasOverlayRef.current?.getBoundingClientRect();
    if (canvasBounds) {
      startX.current = event.clientX - canvasBounds.left;
      startY.current = event.clientY - canvasBounds.top;
      setIsDrawing(true);
    }
  };

  const drawRectangle = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const canvasBounds = canvasOverlayRef.current?.getBoundingClientRect();
    if (canvasBounds) {
      const currentX = event.clientX - canvasBounds.left;
      const currentY = event.clientY - canvasBounds.top;
      const width = currentX - startX.current;
      const height = currentY - startY.current;

      // Clear the overlay before drawing a new rectangle preview
      contextRef.current.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);

      // Redraw all previously drawn rectangles
      rectangles.forEach((rect) => {
        contextRef.current!.strokeStyle = rect.color;
        contextRef.current?.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
      });

      // Draw the new rectangle as a preview
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = 5;
      contextRef.current.strokeRect(startX.current, startY.current, width, height);
    }
  };

  const stopDrawingRectangle = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return; // Prevent adding rectangle if not drawing
    setIsDrawing(false);
    const canvasBounds = canvasOverlayRef.current?.getBoundingClientRect();
    if (canvasBounds) {
      const currentX = event.clientX - canvasBounds.left;
      const currentY = event.clientY - canvasBounds.top;
      const width = currentX - startX.current;
      const height = currentY - startY.current;

      // Save the drawn rectangle with the selected color
      setRectangles((prev) => [
        ...prev,
        { startX: startX.current, startY: startY.current, width, height, color },
      ]);
    }
  };

  // Function to set rectangle color
  const selectColor = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Image Upload */}
      <label htmlFor="image-upload">Upload Background Image: </label>
      <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Color Buttons */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => selectColor("red")} style={{ backgroundColor: "red", color: "white", marginRight: "5px" }}>
          Red
        </button>
        <button onClick={() => selectColor("green")} style={{ backgroundColor: "green", color: "white", marginRight: "5px" }}>
          Green
        </button>
        <button onClick={() => selectColor("blue")} style={{ backgroundColor: "blue", color: "white", marginRight: "5px" }}>
          Blue
        </button>
        <button onClick={() => selectColor("#C71585")} style={{ backgroundColor: "#C71585", color: "white", marginRight: "5px" }}>
          Pink
        </button>
        <button onClick={() => selectColor("#8B4513")} style={{ backgroundColor: "#8B4513", color: "white", marginRight: "5px" }}>
          Brown
        </button>

        <button onClick={() => selectColor("Yellow")} style={{ backgroundColor: "Yellow", color: "black", marginRight: "5px" }}>
          Yellow
        </button>
      </div>
      {/* Canvas */}
      <div style={{ position: "relative" }}>
        <CanvasDraw
          ref={canvasRef}
          brushColor="black"
          brushRadius={4}
          lazyRadius={4}
          canvasWidth={canvasDimensions.width}
          canvasHeight={canvasDimensions.height}
          imgSrc={imageSrc || undefined}
          style={{ border: "1px solid black", marginTop: "20px", padding: "10px" }}
        />
        {/* Rectangle Drawing Canvas */}
        <canvas
          ref={canvasOverlayRef}
          onMouseDown={startDrawingRectangle}
          onMouseMove={drawRectangle}
          onMouseUp={stopDrawingRectangle}
          onMouseLeave={stopDrawingRectangle}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            border: "1px solid transparent", // Transparent border to keep it over the main canvas
          }}
        />
      </div>
      {/* Controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={clearCanvas}>Clear Canvas</button>
        <button onClick={undoLast}>Undo Last Rectangle</button>
        <button onClick={saveDrawing}>Save Drawing</button>
      </div>
    </div>
  );
};
export default DrawPage;