// ContextProvider.tsx
import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  ReactNode
} from 'react';
import * as fabric from 'fabric';

interface AppContextProps {
  selectedTool: string | null;
  setSelectedTool: (tool: string | null) => void;
  fabricCanvas: fabric.Canvas | null;
  setFabricCanvas: (canvas: fabric.Canvas | null) => void;
  fetchCanvases: () => void;
  saveCanvas: (emailAddress: string, canvasName: string) => void;
  loadCanvas: (emailAddress: string, canvasName: string) => void;
  canvases: string[];
}

export const AppContext = createContext < AppContextProps | undefined > (undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC < AppContextProviderProps > = ({
  children
}) => {
  const [selectedTool, setSelectedTool] = useState < string | null > (null);
  const [fabricCanvas, setFabricCanvas] = useState < fabric.Canvas | null > (null);
  const [canvases, setCanvases] = useState < string[] > ([]);
  const canvasRef = useRef < fabric.Canvas | null > (null);

  useEffect(() => {
      if (fabricCanvas) {
          canvasRef.current = fabricCanvas;
      }
  }, [fabricCanvas])

  const fetchCanvases = () => {
      const emailAddress = 'user@example.com';

      if (emailAddress) {
          fetch(`/api/canvas/${emailAddress}`, {})
              .then((res) => res.json())
              .then((data) => setCanvases(data))
              .catch((err) => console.error('Error fetching canvases:', err));
      }
  };

  const saveCanvas = (emailAddress: string, canvasName: string) => {
      if (!emailAddress || !canvasName) {
          alert('All fields are required');
          return;
      }

      let canvasData = fabricCanvas?.toJSON();
      fetch('https://architect-api.vercel.app/canvas', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: emailAddress,
                  drawingName: canvasName.trim(),
                  canvasData: canvasData,
              }),
          })
          .then(async (res) => {
              if (!res.ok) {
                  const error = await res.json();
                  throw new Error(error.message || 'Save failed');
              }
              return res.json();
          })
          .then((data) => {
              alert(data.wasCreated ?
                  `New canvas "${canvasName}" saved!` :
                  `Updated existing "${canvasName}"`
              );
              fetchCanvases();
          })
          .catch((err) => {
              console.error('Save error:', err);
              alert(`Save failed: ${err.message}`);
          });
  };

  const loadCanvas = (emailAddress: string, canvasName: string) => {
      if (!emailAddress || !canvasName) return;

      fetch(`https://architect-api.vercel.app/canvas/${emailAddress}/${canvasName}`)
          .then((res) => res.json())
          .then((data) => {
              console.log('Loaded canvas data:', data);
              if (fabricCanvas) {
                  fabricCanvas.loadFromJSON(data, () => { //LOAD FROM JSON
                      fabricCanvas.renderAll(); //Then render everything.
                  });
              }
          })
          .catch((err) => console.error('Error loading canvas:', err));
  };

  return ( <
      AppContext.Provider value = {
          {
              selectedTool,
              setSelectedTool,
              fabricCanvas,
              setFabricCanvas,
              fetchCanvases,
              saveCanvas,
              loadCanvas,
              canvases,
          }
      } > {
          children
      } </AppContext.Provider>
  );
};
