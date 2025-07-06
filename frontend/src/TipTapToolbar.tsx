import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface TipTapToolbarProps {
  editor: any;
}

const TipTapToolbar: React.FC<TipTapToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleHeading1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const setHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();
  const setTextAlign = (align: 'left' | 'center' | 'right') => editor.chain().focus().setTextAlign(align).run();

  return (
    <div className="border-b border-border/50 bg-background/50 backdrop-blur-sm p-2 flex flex-wrap items-center gap-1">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-border/50 pr-2">
        <button
          onClick={toggleBold}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItalic}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={toggleUnderline}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('underline') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 border-r border-border/50 pr-2">
        <button
          onClick={toggleHeading1}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleHeading2}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleHeading3}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-border/50 pr-2">
        <button
          onClick={toggleBulletList}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={toggleOrderedList}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Text Alignment */}
      <div className="flex items-center gap-1 border-r border-border/50 pr-2">
        <button
          onClick={() => setTextAlign('left')}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTextAlign('center')}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTextAlign('right')}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : ''}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Blocks */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleBlockquote}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={toggleCodeBlock}
          className={`btn btn-ghost btn-sm p-1 ${editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''}`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          onClick={setHorizontalRule}
          className="btn btn-ghost btn-sm p-1"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TipTapToolbar; 