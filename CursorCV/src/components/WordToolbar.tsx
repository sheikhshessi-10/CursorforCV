import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Type,
  Palette,
  Copy,
  Undo,
  Redo,
  Search,
  Replace,
  FileText,
  Save,
  FolderOpen,
  Printer,
  Download,
  Upload,
  Image,
  Table,
  Link,
  Bookmark,
  FileImage,
  FileType,
  Columns,
  Indent,
  MoreHorizontal,
  ChevronDown,
  Scissors,
  ClipboardPaste,
  PaintBucket,
  Layers,
  Edit,
  Grid3X3,
  Square,
  Circle,
  Triangle,
  Minus,
  Plus,
  Settings,
  Eye,
  ZoomIn,
  ZoomOut,
  Calendar,
  Mail,
  MessageSquare,
  Clock,
  Users,
  Book,
  Globe,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Outdent
} from 'lucide-react';
import { cn } from "@/lib/utils";
import type { Editor } from '@tiptap/react';

interface WordToolbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onImportDocument: (content: string) => void;
  editor?: Editor;
}

const WordToolbar: React.FC<WordToolbarProps> = ({ onToggleSidebar, sidebarOpen, onImportDocument, editor }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [fontSize, setFontSize] = useState('11');
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [lineSpacing, setLineSpacing] = useState('1.0');

  const tabs = [
    'File', 'Home', 'Insert', 'Draw', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View', 'Help'
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
  const fontFamilies = ['Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Tahoma', 'Courier New', 'Comic Sans MS', 'Impact'];
  const lineSpacings = ['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'];

  const handleFormatting = (command: string, value?: string) => {
    if (!editor) return;
    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'undo':
        editor.chain().focus().undo().run();
        break;
      case 'redo':
        editor.chain().focus().redo().run();
        break;
      case 'insertUnorderedList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'insertOrderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'selectAll':
        editor.chain().focus().selectAll().run();
        break;
      case 'createLink':
        editor.chain().focus().setLink({ href: value }).run();
        break;
      default:
        break;
    }
  };

  const handleInsertTable = () => {
    if (editor) editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleInsertImage = () => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          editor.chain().focus().setImage({ src: event.target?.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleInsertLink = () => {
    if (!editor) return;
    const url = prompt('Enter the URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImportWordDocument = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          
          if (result.messages && result.messages.length > 0) {
            console.warn('Import warnings:', result.messages);
          }
          
          onImportDocument(result.value);
        } catch (error) {
          console.error('Error importing document:', error);
          alert('Failed to import document. Please try again.');
        }
      }
    };
    input.click();
  };

  const handleFind = () => {
    const searchTerm = prompt('Find:');
    if (searchTerm) {
      const range = document.createRange();
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        if (document.body.innerText.includes(searchTerm)) {
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
          );
          
          let node;
          while (node = walker.nextNode()) {
            const text = node.textContent || '';
            const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (index !== -1) {
              range.setStart(node, index);
              range.setEnd(node, index + searchTerm.length);
              selection.addRange(range);
              break;
            }
          }
        }
      }
    }
  };

  const handleUnderline = () => {
    if (editor) editor.chain().focus().toggleUnderline().run();
  };

  return (
    <div className="bg-white border-b border-gray-300">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-blue-600 text-white text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xs">W</span>
          </div>
          <span className="font-medium">Document1 - Word</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-6 w-6 p-0">−</Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-6 w-6 p-0">□</Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700 h-6 w-6 p-0">×</Button>
        </div>
      </div>

      {/* Quick Access Toolbar */}
      <div className="flex items-center px-2 py-1 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('save')}>
            <Save className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('undo')}>
            <Undo className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('redo')}>
            <Redo className="h-3 w-3" />
          </Button>
        </div>
        <div className="ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? 'Hide AI Chat' : 'Show AI Chat'}
          </Button>
        </div>
      </div>

      {/* Ribbon Tabs */}
      <div className="flex items-center px-2 bg-gray-50">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-3 text-sm rounded-none border-b-2 border-transparent",
              activeTab === tab ? "bg-white border-blue-500" : "hover:bg-gray-100"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
        {/* Import Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 ml-2 bg-green-500 hover:bg-green-600 text-white rounded"
          onClick={handleImportWordDocument}
          title="Import Word Document"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Content */}
      <div className="bg-white border-b border-gray-200 min-h-[80px]">
        {/* File Tab */}
        {activeTab === 'File' && (
          <div className="flex gap-6 p-4">
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <FileText className="h-6 w-6" />
                <span className="text-xs">New</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <FolderOpen className="h-6 w-6" />
                <span className="text-xs">Open</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2" onClick={handleImportWordDocument}>
                <Upload className="h-6 w-6" />
                <span className="text-xs">Import</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <Save className="h-6 w-6" />
                <span className="text-xs">Save</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <Download className="h-6 w-6" />
                <span className="text-xs">Save As</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <Printer className="h-6 w-6" />
                <span className="text-xs">Print</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" className="flex flex-col items-center h-16 w-20 p-2">
                <Download className="h-6 w-6" />
                <span className="text-xs">Export</span>
              </Button>
            </div>
          </div>
        )}

        {/* Home Tab */}
        {activeTab === 'Home' && (
          <div className="flex items-start p-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="flex border rounded-sm overflow-hidden mb-1">
                <select
                  className="px-2 py-0.5 text-xs border-r"
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    handleFormatting('fontName', e.target.value);
                  }}
                >
                  {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
                <select
                  className="px-2 py-0.5 text-xs"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    handleFormatting('fontSize', e.target.value);
                  }}
                >
                  {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleUnderline}>
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Font</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('insertOrderedList')}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('insertUnorderedList')}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('outdent')}>
                  <Outdent className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('indent')}>
                  <Indent className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1 ml-4 border-l pl-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => editor?.chain().focus().setTextAlign('left').run()} title="Align Left">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => editor?.chain().focus().setTextAlign('center').run()} title="Align Center">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => editor?.chain().focus().setTextAlign('right').run()} title="Align Right">
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => editor?.chain().focus().setTextAlign('justify').run()} title="Align Justify">
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Paragraph</span>
            </div>
          </div>
        )}

        {/* Insert Tab */}
        {activeTab === 'Insert' && (
          <div className="flex items-start p-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={handleInsertTable}>
                  <TableIcon className="h-4 w-4" />
                  <span className="text-xs">Table</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={handleInsertImage}>
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-xs">Picture</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col">
                <div className="flex gap-1 mb-2">
                  <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={handleInsertLink}>
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-xs">Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs with enhanced content */}
        {activeTab === 'Draw' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Edit className="h-4 w-4" />
                  <span className="text-xs">Draw</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Highlighter className="h-4 w-4" />
                  <span className="text-xs">Highlight</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Tools</span>
            </div>
          </div>
        )}

        {activeTab === 'Layout' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Margins</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <FileType className="h-4 w-4" />
                  <span className="text-xs">Orientation</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Columns className="h-4 w-4" />
                  <span className="text-xs">Columns</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Page Setup</span>
            </div>
          </div>
        )}

        {activeTab === 'References' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <List className="h-4 w-4" />
                  <span className="text-xs">Table of Contents</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Book className="h-4 w-4" />
                  <span className="text-xs">Footnote</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Table of Contents</span>
            </div>
          </div>
        )}

        {activeTab === 'Mailings' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-xs">Envelopes</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Labels</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Create</span>
            </div>
          </div>
        )}

        {activeTab === 'Review' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Search className="h-4 w-4" />
                  <span className="text-xs">Spelling</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Book className="h-4 w-4" />
                  <span className="text-xs">Grammar</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Proofing</span>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Edit className="h-4 w-4" />
                  <span className="text-xs">Track Changes</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Comments</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Tracking</span>
            </div>
          </div>
        )}

        {activeTab === 'View' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Print Layout</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">Web Layout</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Views</span>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <ZoomIn className="h-4 w-4" />
                  <span className="text-xs">Zoom</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">100%</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Zoom</span>
            </div>
          </div>
        )}

        {activeTab === 'Help' && (
          <div className="flex items-start gap-4 p-4">
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Search className="h-4 w-4" />
                  <span className="text-xs">Help</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Contact</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Help</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordToolbar;
