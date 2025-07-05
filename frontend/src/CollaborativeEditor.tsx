import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { Users, LogOut, Moon, Sun, Copy, Download, Share2, Eye, EyeOff } from 'lucide-react';

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

const defaultValue = '# Welcome to Docify!\n\nStart typing to collaborate in real-time...';

function CollaborativeEditor({ roomName, username, password, userColor, onLeave }: CollaborativeEditorProps) {
  const [content, setContent] = useState<string>(defaultValue);
  const [showUsers, setShowUsers] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const ignoreRemote = useRef(false);

  // Initialize Yjs and WebSocket provider
  const ydoc = useRef(new Y.Doc());
  const provider = useRef(new WebsocketProvider('wss://your-backend.fly.dev', roomName, ydoc.current));
  const yText = useRef(ydoc.current.getText('codemirror'));
  const awareness = useRef(provider.current.awareness);

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

  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  useEffect(() => {
    // Set my presence color
    awareness.current.setLocalStateField('user', { color: userColor.value, name: username });
    // Listen for awareness updates
    const onAwarenessChange = () => {
      const states = Array.from(awareness.current.getStates().values());
      // setUsers(states.map((s: any) => s.user).filter(Boolean)); // This line was removed
    };
    awareness.current.on('change', onAwarenessChange);
    onAwarenessChange();
    return () => { awareness.current.off('change', onAwarenessChange); };
  }, [username, userColor.value]);

  useEffect(() => {
    const update = () => {
      if (!ignoreRemote.current) {
        setContent(yText.current.toString() || defaultValue);
      }
    };
    yText.current.observe(update);
    return () => yText.current.unobserve(update);
  }, []);

  const handleChange = (val: string) => {
    ignoreRemote.current = true;
    yText.current.delete(0, yText.current.length);
    yText.current.insert(0, val);
    setContent(val);
    setTimeout(() => { ignoreRemote.current = false; }, 0);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
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
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Users className="w-3 h-3 text-white" />
              </div>
              <h1 className="font-semibold text-lg">{roomName}</h1>
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="btn btn-ghost p-2"
            >
              {showUsers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopy}
              className="btn btn-ghost p-2"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="btn btn-ghost p-2"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="btn btn-ghost p-2"
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
            >
              <LogOut className="w-4 h-4" />
              Leave
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Users Sidebar */}
        {showUsers && (
          <aside className="w-64 border-r border-border/50 bg-background/50 backdrop-blur-sm p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  Active Users ({allUsers.filter((u) => u.active).length})
                </h3>
                <div className="space-y-2">
                  {allUsers.map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        user.active ? "bg-accent/50" : "opacity-50"
                      }`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
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
              </div>

              <div className="pt-4 border-t border-border/50">
                <button className="w-full flex items-center gap-2 text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-accent transition-colors text-sm">
                  <Share2 className="w-4 h-4" />
                  Invite Others
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Editor */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="w-full h-full min-h-[600px]">
              <CodeMirror
                value={content}
                height="600px"
                extensions={[markdown()]}
                theme={theme}
                basicSetup={{ lineNumbers: false }}
                onChange={handleChange}
                placeholder="Start typing..."
                className="w-full h-full"
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default CollaborativeEditor; 