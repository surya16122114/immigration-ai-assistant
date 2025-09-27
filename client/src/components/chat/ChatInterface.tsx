import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
  createdAt: string;
}

interface Conversation {
  id: string;
  title?: string;
  createdAt: string;
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Create new conversation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest("POST", "/api/conversations", { title });
      return response.json();
    },
    onSuccess: (data: Conversation) => {
      setCurrentConversationId(data.id);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  // Send chat message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, conversationId }: { message: string; conversationId: string }) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        conversationId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, data.userMessage, data.assistantMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Load conversation messages
  const { data: conversationMessages } = useQuery({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    enabled: !!currentConversationId,
    onSuccess: (data: Message[]) => {
      setMessages(data);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Create conversation if it doesn't exist
    if (!currentConversationId) {
      const conversationTitle = message.substring(0, 50) + (message.length > 50 ? "..." : "");
      await createConversationMutation.mutateAsync(conversationTitle);
      return; // Will retry after conversation is created
    }

    setIsTyping(true);
    const currentMessage = message;
    setMessage("");

    await sendMessageMutation.mutateAsync({
      message: currentMessage,
      conversationId: currentConversationId,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Start with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello! I'm your Immigration AI Assistant. I can help you with visa applications, green card processes, work permits, and more. All my information comes from official USCIS and Department of State sources.\n\nWhat immigration question can I help you with today?",
          createdAt: new Date().toISOString(),
        }
      ]);
    }
  }, []);

  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center">
          <i className="fas fa-robot text-primary mr-2"></i>
          Immigration AI Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions about visas, green cards, and immigration processes
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              
              <div className={`flex-1 ${msg.role === 'user' ? 'max-w-xs' : ''}`}>
                <div className={`rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Sources:</div>
                      {msg.sources.map((source, i) => (
                        <div key={i} className="p-2 bg-accent/10 border border-accent/20 rounded text-xs">
                          <div className="flex items-center text-accent font-medium mb-1">
                            <i className="fas fa-external-link-alt mr-1"></i>
                            {source.title}
                          </div>
                          <p className="text-muted-foreground">{source.excerpt}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {msg.role === 'assistant' && (
                    <div className="text-xs text-muted-foreground mt-2 flex items-center">
                      <i className="fas fa-info-circle mr-1"></i>
                      <span>I am not a lawyer. This is not legal advice.</span>
                    </div>
                  )}
                </div>
              </div>
              
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                <i className="fas fa-robot"></i>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about visa applications, deadlines, requirements..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
              data-testid="input-chat-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-send-message"
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
