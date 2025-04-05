// App.tsx
import React, { useState } from 'react';
import './App.css';
import { SignedIn, UserButton, SignInButton, SignedOut, useUser, useSession } from '@clerk/clerk-react';
import FloorPlanCanvas from './FloorPlanCanvas';
import Toolbox from './Toolbox';

const App: React.FC = () => {
    const { user } = useUser();
    const { session } = useSession();
    const emailAddress = user?.primaryEmailAddress?.emailAddress;
    const sessionId = session?.id;

    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [selectedCanvas, setSelectedCanvas] = useState<string | null>(null);
    const [canvases, setCanvases] = useState<string[]>([]);


    const handleToolSelect = (tool: string | null) => {
        setSelectedTool(tool);
    };

    const fetchCanvases = () => {
        if (emailAddress) {
            fetch(`/api/canvas/${emailAddress}`, {
                headers: { Authorization: `Bearer ${sessionId}` },
            })
                .then((res) => res.json())
                .then((data) => setCanvases(data))
                .catch((err) => console.error('Error fetching canvases:', err));
        }
    };

    const handleSaveCanvas = (emailAddress: string, canvasName: string, canvasData: string) => {
        // Basic validation

        if (!emailAddress) {
            alert('Email is required');
            return;
        }

        if (!canvasName?.trim()) {
            alert('Please enter a valid canvas name');
            return;
        }

        if (!canvasData) {
            alert('Canvas data is missing');
            return;
        }

        fetch('https://architect-api.vercel.app/canvas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //Authorization: `Bearer ${sessionId}`,
            },
            body: JSON.stringify({
                email: emailAddress,
                drawingName: canvasName.trim(),
                canvasData,
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
                alert(data.wasCreated
                    ? `New canvas "${canvasName}" saved!`
                    : `Updated existing "${canvasName}"`
                );
                if (typeof fetchCanvases === 'function') {
                    fetchCanvases();
                }
            })
            .catch((err) => {
                console.error('Save error:', err);
                alert(`Save failed: ${err.message}`);
            });
    };

    const handleLoadCanvas = () => {
        if (!emailAddress || !selectedCanvas) return;

        fetch(`/api/canvas/${emailAddress}/${selectedCanvas}`, {
            headers: { Authorization: `Bearer ${sessionId}` },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Loaded canvas data:', data);
                // Add logic to render canvas data on your floor plan board
            })
            .catch((err) => console.error('Error loading canvas:', err));
    };

    return (
        <div className="App">
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            <h1>Draw your floor plan</h1>
            <Toolbox />
            <FloorPlanCanvas selectedTool={selectedTool} />
        </div>
    );
};

export default App;
