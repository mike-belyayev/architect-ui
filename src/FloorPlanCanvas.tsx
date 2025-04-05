import React, {
    useRef,
    useContext
} from 'react';
import * as fabric from 'fabric';
import {
    AppContext
} from './ContextProvider';
import './FloorPlanCanvas.css';
import {
    useCanvasSetup
} from './hooks/useCanvasSetup';
import {
    useCanvasEvents
} from './hooks/useCanvasEvents';

interface FloorPlanCanvasProps {
    selectedTool: string | null;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = () => {
    const {
        selectedTool,
        fabricCanvas,
        setFabricCanvas
    } = useContext(AppContext)!;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useCanvasSetup({
        canvasRef,
        setFabricCanvas
    });

    useCanvasEvents({
        canvas: fabricCanvas,
        selectedTool,
    });

    return (<div className="floorPlanCanvasContainer" >
        <
            canvas ref={
                canvasRef
            }
            className="floorPlanCanvas" />
    </div>
    );
};

export default FloorPlanCanvas;
