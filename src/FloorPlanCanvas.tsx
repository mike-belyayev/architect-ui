import React, { useRef, useEffect } from 'react';
import * as fabric from 'fabric';

interface FloorPlanCanvasProps {
  width?: number;
  height?: number;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      // Initialize Fabric.js canvas
      fabricRef.current = new fabric.Canvas(canvasElement, {
        width: width,
        height: height,
        backgroundColor: '#f0f0f0',
      });

      const canvas = fabricRef.current;

      // Example: Add a rectangle
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'blue',
        width: 200,
        height: 50,
        selectable: true,
      });
      canvas.add(rect);

      // Example: Add a line
      const line = new fabric.Line([50, 50, 250, 150], {
        stroke: 'black',
        strokeWidth: 3,
      });
      canvas.add(line);

      // Cleanup function
      return () => {
        if (fabricRef.current) {
          fabricRef.current.dispose();
        }
      };
    }
  }, [width, height]);

  return <canvas ref={canvasRef} id="fabricCanvas" width={width} height={height} />;
};

export default FloorPlanCanvas;
