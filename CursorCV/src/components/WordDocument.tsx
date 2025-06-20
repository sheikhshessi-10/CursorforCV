
import React, { useRef, useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Eye } from 'lucide-react';

interface WordDocumentProps {
  content: string;
  onChange: (content: string) => void;
}

const WordDocument: React.FC<WordDocumentProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
      updateStats();
    }
  }, [content]);

  const updateStats = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharCount(text.length);
      
      // Estimate page count based on content height
      const contentHeight = editorRef.current.scrollHeight;
      const pageHeight = 1056; // A4 page height in pixels
      setPageCount(Math.max(1, Math.ceil(contentHeight / pageHeight)));
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateStats();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common Word shortcuts
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          document.execCommand('undo');
          break;
        case 'y':
          e.preventDefault();
          document.execCommand('redo');
          break;
        case 's':
          e.preventDefault();
          console.log('Save document');
          break;
        case 'p':
          e.preventDefault();
          window.print();
          break;
        case 'f':
          e.preventDefault();
          const searchTerm = prompt('Find:');
          if (searchTerm) {
            // Use modern approach instead of deprecated window.find
            const range = document.createRange();
            const selection = window.getSelection();
            if (selection && editorRef.current) {
              selection.removeAllRanges();
              const text = editorRef.current.innerText || '';
              const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
              if (index !== -1) {
                const walker = document.createTreeWalker(
                  editorRef.current,
                  NodeFilter.SHOW_TEXT,
                  null
                );
                
                let node;
                let currentIndex = 0;
                while (node = walker.nextNode()) {
                  const nodeText = node.textContent || '';
                  if (currentIndex + nodeText.length > index) {
                    const startIndex = index - currentIndex;
                    range.setStart(node, startIndex);
                    range.setEnd(node, startIndex + searchTerm.length);
                    selection.addRange(range);
                    break;
                  }
                  currentIndex += nodeText.length;
                }
              }
            }
          }
          break;
        case 'h':
          e.preventDefault();
          const findText = prompt('Find:');
          const replaceText = prompt('Replace with:');
          if (findText && replaceText && editorRef.current) {
            const content = editorRef.current.innerHTML;
            const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
            editorRef.current.innerHTML = newContent;
            onChange(newContent);
          }
          break;
        case 'a':
          e.preventDefault();
          document.execCommand('selectAll');
          break;
        case 'c':
          e.preventDefault();
          document.execCommand('copy');
          break;
        case 'v':
          e.preventDefault();
          document.execCommand('paste');
          break;
        case 'x':
          e.preventDefault();
          document.execCommand('cut');
          break;
        case '=':
        case '+':
          e.preventDefault();
          setZoom(prev => Math.min(200, prev + 10));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(50, prev - 10));
          break;
        case '0':
          e.preventDefault();
          setZoom(100);
          break;
      }
    }

    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        document.execCommand('outdent');
      } else {
        document.execCommand('indent');
      }
    }

    // Handle Enter key for new lines and lists
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const parentElement = selection.anchorNode.parentElement;
        if (parentElement && (parentElement.tagName === 'LI' || parentElement.closest('ul, ol'))) {
          return;
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target?.result as string;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '10px 0';
          
          if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.insertNode(img);
              range.collapse(false);
            } else {
              editorRef.current.appendChild(img);
            }
            handleInput();
          }
        };
        reader.readAsDataURL(file);
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        // Handle Word document drop
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const mammoth = await import('mammoth');
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const result = await mammoth.convertToHtml({ arrayBuffer });
            
            if (editorRef.current) {
              editorRef.current.innerHTML = result.value;
              handleInput();
            }
          } catch (error) {
            console.error('Error importing dropped document:', error);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 10));
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      {/* Document Container */}
      <div className="flex flex-col items-center py-8">
        <div 
          className="relative"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease'
          }}
        >
          {/* Document Shadow */}
          <div className="relative">
            <Card className="bg-white shadow-2xl min-h-[1056px] w-[816px] relative overflow-hidden">
              {/* Page margins visualization */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-dashed border-gray-200"></div>
              </div>
              
              {/* Document content */}
              <div
                ref={editorRef}
                className="min-h-full p-16 focus:outline-none"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  fontFamily: 'Calibri, sans-serif',
                  fontSize: '11pt',
                  lineHeight: '1.15',
                  color: '#000000'
                }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Card>
            
            {/* Page shadow */}
            <div className="absolute top-2 left-2 w-full h-full bg-gray-300 -z-10 rounded"></div>
          </div>
        </div>
        
        {/* Status bar */}
        <div className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-6 text-sm">
            <span>Page {pageCount} of {pageCount}</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span>English (United States)</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-blue-700 h-6 w-6 p-0"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs w-12 text-center">{zoom}%</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-blue-700 h-6 w-6 p-0"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-blue-700 h-6 px-2 text-xs"
                onClick={handleZoomReset}
              >
                <Eye className="h-3 w-3 mr-1" />
                Fit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDocument;
