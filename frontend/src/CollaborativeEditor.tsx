import React, { useEffect, useRef, useState } from 'react';
import { Users, LogOut, Moon, Sun, Copy, Download, Share2, Eye, EyeOff } from 'lucide-react';
import TipTapEditor from './TipTapEditor';

interface CollaborativeEditorProps {
  roomName: string;
  username: string;
  password: string;
  userColor: { name: string; value: string; class: string };
  onLeave: () => void;
}

// Mock users for demonstration
const mockUsers = [
  { name: "Alice", color: "#06b6d4", active: true },
  { name: "Bob", color: "#8b5cf6", active: true },
  { name: "Charlie", color: "#ec4899", active: false },
];

function CollaborativeEditor({ roomName, username, password, userColor, onLeave }: CollaborativeEditorProps) {
  const [content, setContent] = useState<string>('');
  const [showUsers, setShowUsers] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      (window as any).applyTheme(newTheme);
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${roomName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allUsers = [{ name: username, color: userColor.value, active: true }, ...mockUsers];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 h-8">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="btn btn-ghost p-2 hover:bg-accent transition-all duration-200 flex items-center justify-center"
              title="Show collaborators">
              <Users className="w-5 h-5" />
            </button>

            <h1 className="text-2xl font-semibold tracking-tight flex items-center h-8">
              {roomName}
            </h1>
          </div>


          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="btn btn-ghost p-2 relative"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
              {showCopyFeedback && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Copied!
                </div>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="btn btn-ghost p-2"
              title="Download document"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="btn btn-ghost p-2"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={onLeave}
              className="btn btn-ghost px-3 py-1 flex items-center gap-2 text-sm"
              title="Leave room"
            >
              <LogOut className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Overlay for drawer */}
        {showUsers && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-5"
            onClick={() => setShowUsers(false)}
            style={{ zIndex: 5 }}
          />
        )}

        {/* Animated Users Drawer */}
        <div 
          className={`fixed left-0 top-0 h-full bg-background/95 backdrop-blur-sm border-r border-border/50 transition-transform duration-300 ease-in-out ${
            showUsers ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ width: '280px', zIndex: 10 }}
        >
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Collaborators</h3>
                <button
                  onClick={() => setShowUsers(false)}
                  className="btn btn-ghost p-2"
                  title="Close collaborators"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {allUsers.map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      user.active ? "bg-accent/50" : "opacity-50"
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: user.color }} />
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.name === username && (
                      <div className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground ml-auto">
                        You
                      </div>
                    )}
                    {user.active && user.name !== username && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-auto animate-pulse" />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <button className="w-full flex items-center gap-2 text-muted-foreground hover:text-foreground p-3 rounded-lg hover:bg-accent transition-colors text-sm">
                  <Share2 className="w-4 h-4" />
                  Invite Others
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="w-full h-full min-h-[600px]">
              <TipTapEditor
                roomName={roomName}
                username={username}
                userColor={userColor.value}
                onChange={handleContentChange}
              />
            </div>
          </div>

          {/* Status Bar */}
          <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm px-6 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Room: {roomName}</span>
                <span>•</span>
                <span>Connected as {username}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                  {wordCount} words
                </div>
                <div className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                  {charCount} chars
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default CollaborativeEditor; 