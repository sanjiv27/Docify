import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Users, FileText, Edit3, BookOpen, Shuffle } from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';
import DecryptedText from './DecryptedText';

const templates = [
  { name: "Blank Document", icon: FileText, description: "Start fresh" },
  { name: "Meeting Notes", icon: Users, description: "Team meetings" },
  { name: "Project Plan", icon: BookOpen, description: "Project planning" },
  { name: "Daily Notes", icon: Edit3, description: "Daily updates" },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<"entry" | "editor">("entry");
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState({ h: 0, s: 100, l: 50 });
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" || "light";
    setTheme(savedTheme);
  }, []);

  // Assign random color on page load
  useEffect(() => {
    pickRandomColor();
  }, []);

  // Draw HSL color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 0.5) {
      for (let saturation = 0; saturation <= radius; saturation += 0.5) {
        const x = centerX + saturation * Math.cos(angle * Math.PI / 180);
        const y = centerY + saturation * Math.sin(angle * Math.PI / 180);
        
        ctx.fillStyle = `hsl(${angle}, ${(saturation / radius) * 100}%, 50%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Draw center circle for lightness control
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.l}%)`;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw selection indicator
    const selectionRadius = Math.min(selectedColor.s / 100 * radius, radius - 8);
    const selectionX = centerX + selectionRadius * Math.cos(selectedColor.h * Math.PI / 180);
    const selectionY = centerY + selectionRadius * Math.sin(selectedColor.h * Math.PI / 180);
    
    ctx.beginPath();
    ctx.arc(selectionX, selectionY, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [selectedColor]);

  const updateColorFromPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - canvas.width / 2;
    const y = clientY - rect.top - canvas.height / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const radius = Math.min(canvas.width, canvas.height) / 2 - 15;
    
    if (distance <= radius) {
      const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      const saturation = Math.min((distance / radius) * 100, 100);
      
      setSelectedColor(prev => ({
        h: angle,
        s: saturation,
        l: prev.l
      }));
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    updateColorFromPosition(event.clientX, event.clientY);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      updateColorFromPosition(event.clientX, event.clientY);
    }
  };

  const handleCanvasMouseUp = () => {
    isDragging.current = false;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    updateColorFromPosition(event.clientX, event.clientY);
  };

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      (window as any).applyTheme(newTheme);
    }
  };

  const handleStart = () => {
    if (roomName && username) {
      setCurrentScreen("editor");
    }
  };

  const handleCreateNew = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setRoomName(`Untitled ${template.name}`);
    if (username) {
      setCurrentScreen("editor");
    }
  };

  const getSelectedColorValue = () => {
    return `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.l}%)`;
  };

  const pickRandomColor = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSaturation = Math.floor(Math.random() * 60) + 40; // 40-100%
    const randomLightness = Math.floor(Math.random() * 30) + 35; // 35-65%
    
    setSelectedColor({
      h: randomHue,
      s: randomSaturation,
      l: randomLightness
    });
  };

  if (currentScreen === "editor") {
    return (
      <CollaborativeEditor
        roomName={roomName}
        username={username}
        password=""
        userColor={{ name: "Custom", value: getSelectedColorValue(), class: "" }}
        onLeave={() => setCurrentScreen("entry")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="pt-4">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-center">
          <h1 className="text-5xl font-light tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <DecryptedText 
              text="Ephmera" 
              animateOn="view"
              revealDirection="center"
              speed={35}
              maxIterations={20}
              className="text-5xl font-light tracking-tight"
            />
          </h1>

          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2 rounded-md absolute right-6"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light mb-3 tracking-tight">
            <DecryptedText 
              text="One Room. Infinite Ideas." 
              animateOn="view"
              revealDirection="center"
              speed={30}
              maxIterations={22}
              className="text-4xl font-light tracking-tight"
            />
          </h2>
          <p className="text-lg text-muted-foreground">
            <DecryptedText 
              text="Ephmera lets you instantly start writing with anyone — no accounts, no clutter — just pure collaboration. Great for ideas, notes, or chaos." 
              animateOn="view"
              revealDirection="left"
              speed={25}
              maxIterations={24}
              className="text-lg text-muted-foreground"
            />
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Side - Templates and Color Picker */}
          <div className="space-y-8">
            {/* Templates */}
            <div>
              <h3 className="text-lg font-medium mb-4">Choose a template</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-sm ${
                      selectedTemplate.name === template.name
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <template.icon className="w-5 h-5 mb-2 text-muted-foreground" />
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-3 block">Your color</label>
                <canvas
                  ref={canvasRef}
                  width={140}
                  height={140}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onClick={handleCanvasClick}
                  className="cursor-crosshair border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Pick a lucky color!</span>
                <button
                  onClick={pickRandomColor}
                  className="btn btn-outline p-3 rounded-full hover:scale-105 transition-all"
                  title="Pick random color"
                >
                  <Shuffle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Document Name, Username and Start */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Document details</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="room" className="text-sm font-medium mb-2 block">
                    Document name
                  </label>
                  <input
                    id="room"
                    type="text"
                    placeholder="My document"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="text-sm font-medium mb-2 block">
                    Your name
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-border">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: getSelectedColorValue() }}
                    >
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{username || 'Your name'}</div>
                      <div className="text-xs text-muted-foreground">Ready to collaborate</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!roomName || !username}
                  className="btn btn-primary w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
                >
                  Start writing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
