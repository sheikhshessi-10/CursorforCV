
import React, { useState } from 'react';
import WordToolbar from '../components/WordToolbar';
import WordRuler from '../components/WordRuler';
import WordDocument from '../components/WordDocument';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [documentContent, setDocumentContent] = useState('<p>Start typing your document here...</p>');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI writing assistant. I can help you with formatting, editing, and improving your document. What would you like to work on?',
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you want help with: "${chatInput}". I can assist you with document formatting, content suggestions, and editing. Would you like me to help you improve the current document?`,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setChatInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImportDocument = (content: string) => {
    setDocumentContent(content);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <WordToolbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
        onImportDocument={handleImportDocument}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          <WordRuler />
          <WordDocument 
            content={documentContent} 
            onChange={setDocumentContent}
          />
        </div>

        {/* AI Chat Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-l border-gray-300 bg-white flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                AI Writing Assistant
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Get help with writing, formatting, and editing
              </p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {message.isUser && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <div className="text-sm">{message.content}</div>
                    </div>
                    <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your document..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
