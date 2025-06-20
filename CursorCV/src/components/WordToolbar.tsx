
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
  DollarSign
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface WordToolbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onImportDocument: (content: string) => void;
}

const WordToolbar: React.FC<WordToolbarProps> = ({ onToggleSidebar, sidebarOpen, onImportDocument }) => {
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
    document.execCommand(command, false, value);
  };

  const handleInsertTable = () => {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.innerHTML = `
      <tr>
        <td style="border: 1px solid #000; padding: 8px;">Cell 1</td>
        <td style="border: 1px solid #000; padding: 8px;">Cell 2</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 8px;">Cell 3</td>
        <td style="border: 1px solid #000; padding: 8px;">Cell 4</td>
      </tr>
    `;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.insertNode(table);
    }
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target?.result as string;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
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
      // Use modern approach instead of deprecated window.find
      const range = document.createRange();
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        if (document.body.innerText.includes(searchTerm)) {
          // Simple text search implementation
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
          <div className="flex items-start gap-4 p-4">
            {/* Clipboard */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-12 p-1" onClick={() => handleFormatting('paste')}>
                  <ClipboardPaste className="h-5 w-5" />
                  <span className="text-xs">Paste</span>
                </Button>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-8 p-0 text-xs" onClick={() => handleFormatting('cut')}>
                    <Scissors className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-8 p-0 text-xs" onClick={() => handleFormatting('copy')}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <span className="text-xs text-gray-600 text-center">Clipboard</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Font */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <select 
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    handleFormatting('fontName', e.target.value);
                  }}
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
                <select 
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-12"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(e.target.value);
                    handleFormatting('fontSize', e.target.value);
                  }}
                >
                  {fontSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('underline')}>
                  <Underline className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('strikeThrough')}>
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('subscript')}>
                  <Subscript className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('superscript')}>
                  <Superscript className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('hiliteColor', 'yellow')}>
                  <Highlighter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('foreColor', 'red')}>
                  <Palette className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Font</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Paragraph */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('insertUnorderedList')}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('insertOrderedList')}>
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('outdent')}>
                  <Indent className="h-4 w-4 rotate-180" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('indent')}>
                  <Indent className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('justifyLeft')}>
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('justifyCenter')}>
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('justifyRight')}>
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleFormatting('justifyFull')}>
                  <AlignJustify className="h-4 w-4" />
                </Button>
                <select 
                  className="border border-gray-300 rounded px-1 py-0 text-xs w-12 h-6"
                  value={lineSpacing}
                  onChange={(e) => setLineSpacing(e.target.value)}
                >
                  {lineSpacings.map(spacing => (
                    <option key={spacing} value={spacing}>{spacing}</option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-gray-600 text-center">Paragraph</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Styles */}
            <div className="flex flex-col">
              <div className="grid grid-cols-2 gap-1 mb-2">
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-6" onClick={() => handleFormatting('formatBlock', 'p')}>Normal</Button>
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-6" onClick={() => handleFormatting('formatBlock', 'h1')}>Heading 1</Button>
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-6" onClick={() => handleFormatting('formatBlock', 'h2')}>Heading 2</Button>
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-6" onClick={() => handleFormatting('formatBlock', 'h3')}>Heading 3</Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Styles</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Editing */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-12 p-1" onClick={handleFind}>
                  <Search className="h-4 w-4" />
                  <span className="text-xs">Find</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-12 p-1" onClick={() => {
                  const findText = prompt('Find:');
                  const replaceText = prompt('Replace with:');
                  if (findText && replaceText) {
                    handleFormatting('selectAll');
                    const content = document.getSelection()?.toString() || '';
                    const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
                    handleFormatting('insertText', newContent);
                  }
                }}>
                  <Replace className="h-4 w-4" />
                  <span className="text-xs">Replace</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Editing</span>
            </div>
          </div>
        )}

        {/* Insert Tab */}
        {activeTab === 'Insert' && (
          <div className="flex items-start gap-4 p-4">
            {/* Pages */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={() => {
                  const pageBreak = document.createElement('div');
                  pageBreak.style.pageBreakBefore = 'always';
                  pageBreak.innerHTML = '<br>';
                  const selection = window.getSelection();
                  if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.insertNode(pageBreak);
                  }
                }}>
                  <FileType className="h-4 w-4" />
                  <span className="text-xs">Page Break</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Pages</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Tables */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={handleInsertTable}>
                  <Table className="h-4 w-4" />
                  <span className="text-xs">Table</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Tables</span>
            </div>
            <Separator orientation="vertical" className="h-16" />
            
            {/* Illustrations */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={handleInsertImage}>
                  <Image className="h-4 w-4" />
                  <span className="text-xs">Picture</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Square className="h-4 w-4" />
                  <span className="text-xs">Shapes</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Illustrations</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Links */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={() => {
                  const url = prompt('Enter URL:');
                  const text = prompt('Enter link text:');
                  if (url && text) {
                    handleFormatting('createLink', url);
                  }
                }}>
                  <Link className="h-4 w-4" />
                  <span className="text-xs">Link</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <Bookmark className="h-4 w-4" />
                  <span className="text-xs">Bookmark</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Links</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Header & Footer */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <FileImage className="h-4 w-4" />
                  <span className="text-xs">Header</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1">
                  <FileType className="h-4 w-4" />
                  <span className="text-xs">Footer</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Header & Footer</span>
            </div>
            <Separator orientation="vertical" className="h-16" />

            {/* Symbols */}
            <div className="flex flex-col">
              <div className="flex gap-1 mb-2">
                <Button variant="ghost" size="sm" className="flex flex-col items-center h-12 w-16 p-1" onClick={() => {
                  const symbols = ['©', '®', '™', '§', '¶', '†', '‡', '•', '…', '€', '£', '¥', '¢'];
                  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                  handleFormatting('insertText', symbol);
                }}>
                  <Hash className="h-4 w-4" />
                  <span className="text-xs">Symbol</span>
                </Button>
              </div>
              <span className="text-xs text-gray-600 text-center">Symbols</span>
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
