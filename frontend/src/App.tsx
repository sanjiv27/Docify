import React, { useState, useEffect } from 'react';
import { Moon, Sun, Users, Clock, FileText, Edit3, BookOpen } from 'lucide-react';
import CollaborativeEditor from './CollaborativeEditor';

const colors = [
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
  { name: "Purple", value: "#8b5cf6", class: "bg-purple-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500" },
  { name: "Green", value: "#10b981", class: "bg-emerald-500" },
  { name: "Teal", value: "#14b8a6", class: "bg-teal-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Yellow", value: "#eab308", class: "bg-yellow-500" },
];

const templates = [
  { name: "Blank Document", icon: FileText, description: "Start fresh" },
  { name: "Meeting Notes", icon: Users, description: "Team meetings" },
  { name: "Project Plan", icon: BookOpen, description: "Project planning" },
  { name: "Daily Notes", icon: Edit3, description: "Daily updates" },
];

const recentDocuments = [
  { name: "Team Meeting Notes", lastModified: "2 hours ago", collaborators: 3 },
  { name: "Project Roadmap", lastModified: "Yesterday", collaborators: 5 },
  { name: "Weekly Review", lastModified: "3 days ago", collaborators: 2 },
];

function App() {
  const [currentScreen, setCurrentScreen] = useState<"entry" | "editor">("entry");
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" || "light";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      (window as any).applyTheme(newTheme);
    }
  };

  const handleStart = () => {
    if (roomName && username && password) {
      // TODO: Validate room password with backend before proceeding
      // For now, we'll proceed directly to the editor
      setCurrentScreen("editor");
    }
  };

  const handleCreateNew = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setRoomName(`Untitled ${template.name}`);
    if (username && password) {
      setCurrentScreen("editor");
    }
  };

  if (currentScreen === "editor") {
    return (
      <CollaborativeEditor
        roomName={roomName}
        username={username}
        password={password}
        userColor={selectedColor}
        onLeave={() => setCurrentScreen("entry")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className="pt-4">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-center">
          <h1 className="text-5xl font-light tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Ephmera</h1>

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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-light mb-3 tracking-tight">One Room. Infinite Ideas.</h2>
          <p className="text-lg text-muted-foreground">Ephmera lets you instantly start writing with anyone — no accounts, no clutter — just pure collaboration. Great for ideas, notes, or chaos.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create New */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Create new document</h3>

              {/* Templates */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                      selectedTemplate.name === template.name
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <template.icon className="w-4 h-4 mb-1 text-muted-foreground" />
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground">{template.description}</div>
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="room" className="text-sm font-medium mb-1 block">
                    Document name
                  </label>
                  <input
                    id="room"
                    type="text"
                    placeholder="My document"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="text-sm font-medium mb-1 block">
                    Your name
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm font-medium mb-1 block">
                    Room password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter room password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your color</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded transition-all hover:scale-110 ${color.class} ${
                          selectedColor.name === color.name
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  disabled={!roomName || !username || !password}
                  className="btn btn-primary w-full h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start writing
                </button>
              </div>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Recent documents</h3>
              <div className="space-y-2">
                {recentDocuments.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handleCreateNew({ name: doc.name, icon: FileText, description: "Recent document" })}
                    className="w-full p-3 rounded-lg border border-border hover:border-primary/50 text-left transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {doc.collaborators}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {doc.lastModified}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
