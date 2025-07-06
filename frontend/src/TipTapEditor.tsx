import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import './TipTapEditor.css';
import TipTapToolbar from './TipTapToolbar';

interface TipTapEditorProps {
  roomName: string;
  username: string;
  userColor: string;
  onChange?: (content: string) => void;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  roomName,
  username,
  userColor,
  onChange
}) => {
  const [ydoc] = useState(() => new Y.Doc());
  const [provider] = useState(() => new WebsocketProvider('wss://your-backend.fly.dev', roomName, ydoc));
  const [yText] = useState(() => ydoc.getText('content'));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable history as we're using Yjs
      }),
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          id: username,
          name: username,
          color: userColor,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline.configure(),
    ],
    content: yText.toString(),
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      // Set up awareness for user presence
      const awareness = provider.awareness;
      awareness.setLocalStateField('user', {
        id: username,
        name: username,
        color: userColor,
      });
    }
  }, [editor, provider, username, userColor]);

  useEffect(() => {
    return () => {
      provider.destroy();
    };
  }, [provider]);

  return (
    <div className="w-full h-full">
      <TipTapToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="w-full h-full min-h-[600px] prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
};

export default TipTapEditor; 