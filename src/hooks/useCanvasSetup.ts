// hooks/useCanvasSetup.ts
import {
    useEffect
} from 'react';
import * as fabric from 'fabric';
import { handleDelete } from '../utils/canvasUtils';

interface UseCanvasSetupProps {
    canvasRef: React.RefObject < HTMLCanvasElement | null > ;
    setFabricCanvas: (canvas: fabric.Canvas | null) => void;
}

// This is our GridSize that we need to have defined
const gridSize = 50;

export const useCanvasSetup = ({
    canvasRef,
    setFabricCanvas
}: UseCanvasSetupProps) => {
    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (canvasElement) {
            const canvas = new fabric.Canvas(canvasElement, {
                width: canvasElement.offsetWidth,
                height: canvasElement.offsetHeight,
                backgroundColor: 'white',
            });
            setFabricCanvas(canvas);

            const createGrid = (canvas: fabric.Canvas, gridSize: number) => {
                const gridColor = '#ccc';
                const width = canvas.width || 0;
                const height = canvas.height || 0;

                for (let i = 0; i < (width / gridSize); i++) {
                    canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, height], {
                        stroke: gridColor,
                        selectable: false
                    }));
                    canvas.add(new fabric.Line([0, i * gridSize, width, i * gridSize], {
                        stroke: gridColor,
                        selectable: false
                    }));
                }
                canvas.requestRenderAll();
            };

            // Add grid here
            createGrid(canvas, gridSize);

            canvas.on('object:moving', (options) => {
                if (options.target) {
                    options.target.set({
                        left: Math.round(options.target.left! / gridSize) * gridSize,
                        top: Math.round(options.target.top! / gridSize) * gridSize
                    });
                }
            });

            // Add zoom functionality
            canvas.on('mouse:wheel', (opt: fabric.TEvent < WheelEvent > ) => {
                const event = opt.e as WheelEvent;
                const delta = event.deltaY;
                let zoom = canvas.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;

                // Get the pointer position
                const pointer = canvas.getPointer(event);

                // Calculate the zoom point
                const zoomPoint = new fabric.Point(pointer.x, pointer.y);

                // Set the zoom
                canvas.zoomToPoint(zoomPoint, zoom);

                opt.e.preventDefault();
                opt.e.stopPropagation();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    handleDelete(canvas);
                }
            });


            return () => {
                document.removeEventListener('keydown', (e) => {
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        handleDelete(canvas);
                    }
                });
                setFabricCanvas(null);
                canvas.dispose();
            };
        }
    }, [canvasRef, setFabricCanvas]);
};
