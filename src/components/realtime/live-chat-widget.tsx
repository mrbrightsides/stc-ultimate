'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLiveChat, type UserRole } from '@/hooks/use-live-chat';
import { MessageCircle, Send, Users, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { slideInFromRight, slideInFromLeft, fadeIn } from '@/lib/animations';

interface LiveChatWidgetProps {
  roomId: string;
  roomName: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: UserRole;
  className?: string;
}

const roleColors: Record<UserRole, string> = {
  traveler: 'bg-blue-100 text-blue-700',
  guide: 'bg-green-100 text-green-700',
  hotel_staff: 'bg-purple-100 text-purple-700'
};

const roleLabels: Record<UserRole, string> = {
  traveler: 'Traveler',
  guide: 'Guide',
  hotel_staff: 'Hotel Staff'
};

export function LiveChatWidget({
  roomId,
  roomName,
  currentUserId,
  currentUserName,
  currentUserRole,
  className
}: LiveChatWidgetProps) {
  const {
    messages,
    typingUsers,
    isConnected,
    participantCount,
    sendMessage,
    setTyping
  } = useLiveChat(roomId, currentUserId, currentUserName, currentUserRole);

  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Typing indicator
    if (!isTyping) {
      setIsTyping(true);
      setTyping(true);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    sendMessage(inputValue.trim());
    setInputValue('');
    setIsTyping(false);
    setTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div {...fadeIn}>
      <Card className={cn("flex flex-col h-[500px] md:h-[600px]", className)}>
      <CardHeader className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            {roomName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              <Users className="mr-1 h-3 w-3" />
              {participantCount}
            </Badge>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
          <div className="space-y-3 md:space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                className={cn(
                  "flex gap-3",
                  message.userId === currentUserId ? "flex-row-reverse" : "flex-row",
                  message.isSystem && "justify-center"
                )}
              >
                {!message.isSystem && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={cn("text-xs", roleColors[message.userRole])}>
                      {message.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={cn(
                  "flex flex-col max-w-[70%]",
                  message.userId === currentUserId ? "items-end" : "items-start",
                  message.isSystem && "items-center max-w-full"
                )}>
                  {!message.isSystem && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {message.userName}
                      </span>
                      <Badge variant="outline" className={cn("text-xs px-1 py-0", roleColors[message.userRole])}>
                        {roleLabels[message.userRole]}
                      </Badge>
                    </div>
                  )}

                  <div className={cn(
                    "rounded-lg px-3 py-2",
                    message.isSystem
                      ? "bg-gray-100 text-gray-600 text-xs italic"
                      : message.userId === currentUserId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>

                    <span className="text-xs text-gray-400 mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicators */}
            <AnimatePresence>
              {typingUsers.filter(t => t.userId !== currentUserId).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2 text-xs text-gray-500 italic"
                >
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>
                  {typingUsers
                    .filter(t => t.userId !== currentUserId)
                    .map(t => t.userName)
                    .join(', ')}{' '}
                    {typingUsers.filter(t => t.userId !== currentUserId).length === 1 ? 'is' : 'are'} typing...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 md:p-4 bg-gray-50">
          {!isConnected && (
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 text-center">
              You're offline. Messages will be sent when connection is restored.
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              autoComplete="off"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 text-sm md:text-base"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 min-w-[44px] min-h-[44px] md:min-w-[40px] md:min-h-[40px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
