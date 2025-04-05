// hooks/useCanvasSetup.ts
import {
    useEffect
} from 'react';
import * as fabric from 'fabric';

interface UseCanvasSetupProps {
    canvasRef: React.RefObject < HTMLCanvasElement | null > ;
    setFabricCanvas: (canvas: fabric.Canvas | null) => void;
}

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
            return () => {
                canvas.dispose();
                setFabricCanvas(null);
            };
        }
    }, [canvasRef, setFabricCanvas]);
};
