'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Minus,
  IndentDecrease,
  IndentIncrease
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = 'Start writing...' }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'editor-content min-h-[300px] p-4 focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    disabled, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    title?: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-8 w-8 p-0 flex items-center justify-center',
        isActive && 'bg-accent text-accent-foreground hover:bg-accent/90'
      )}
      title={title}
    >
      {children}
    </Button>
  );

  const Divider = () => <div className="w-px h-6 bg-border mx-1" />;

  return (
    <div className="border rounded-md border-input">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        
        <Divider />
        
        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        
        <Divider />
        
        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          title="Indent List"
        >
          <IndentIncrease className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          title="Outdent List"
        >
          <IndentDecrease className="h-4 w-4" />
        </ToolbarButton>
        
        <Divider />
        
        {/* Block Elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        
        <Divider />
        
        {/* Link */}
        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        
        <Divider />
        
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      
      {/* Editor Content - with proper styling for all elements */}
      <div className="editor-wrapper">
        <style jsx global>{`
          .editor-content h1 {
            font-size: 2rem;
            font-weight: 700;
            font-family: var(--font-playfair), serif;
            margin-bottom: 0.5rem;
            margin-top: 1.5rem;
            color: oklch(0.2 0.04 260);
          }
          
          .editor-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            font-family: var(--font-playfair), serif;
            margin-bottom: 0.5rem;
            margin-top: 1.25rem;
            color: oklch(0.2 0.04 260);
          }
          
          .editor-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            font-family: var(--font-playfair), serif;
            margin-bottom: 0.5rem;
            margin-top: 1rem;
            color: oklch(0.2 0.04 260);
          }
          
          .editor-content p {
            margin-bottom: 0.75rem;
            line-height: 1.75;
            color: oklch(0.4 0.02 260);
          }
          
          .editor-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .editor-content ul li {
            margin-bottom: 0.25rem;
          }
          
          .editor-content ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .editor-content ol li {
            margin-bottom: 0.25rem;
          }
          
          .editor-content blockquote {
            border-left: 4px solid oklch(0.75 0.08 85);
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: oklch(0.4 0.02 260);
            background: oklch(0.92 0.01 260);
            padding: 0.75rem;
          }
          
          .editor-content a {
            color: oklch(0.75 0.08 85);
            text-decoration: underline;
          }
          
          .editor-content code {
            background: oklch(0.92 0.01 260);
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.875rem;
          }
          
          .editor-content pre {
            background: oklch(0.2 0.04 260);
            color: oklch(0.98 0 0);
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          
          .editor-content pre code {
            background: transparent;
            padding: 0;
            color: inherit;
          }
          
          .editor-content hr {
            border: none;
            border-top: 2px solid oklch(0.85 0.01 260);
            margin: 1.5rem 0;
          }
          
          .editor-content ul[data-type="taskList"] {
            list-style: none;
            padding-left: 0;
          }
          
          .editor-content ul[data-type="taskList"] li {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .editor-content ul[data-type="taskList"] li input[type="checkbox"] {
            margin-top: 0.25rem;
          }
          
          /* Placeholder */
          .editor-content p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: oklch(0.55 0.02 260);
            pointer-events: none;
            height: 0;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}