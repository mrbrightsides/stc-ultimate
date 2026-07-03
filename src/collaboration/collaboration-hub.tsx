'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, Users, MessageSquare, Video, Edit3, Send, Check, CheckCheck, Circle, UserCheck, ArrowRight, Zap, Info } from 'lucide-react';
import { 
  getCollaborationSystem,
  getSessions,
  getMessages,
  sendMessage,
  type CollaborationSession,
  type ChatMessage 
} from '@/lib/phase4-collaboration';

interface CollaborationHubProps {
  onBack: () => void;
}

export default function CollaborationHub({ onBack }: CollaborationHubProps) {
  const [activeTab, setActiveTab] = useState<string>('sessions');
  const [selectedSession, setSelectedSession] = useState<CollaborationSession | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);

  const collaborationSystem = getCollaborationSystem();
  const sessions = getSessions();

  useEffect(() => {
    if (selectedSession) {
      const messages = getMessages(selectedSession.id);
      setSessionMessages(messages);
    }
  }, [selectedSession]);

  const handleSendMessage = (): void => {
    if (!selectedSession || !messageInput.trim()) return;
    
    const newMessage = sendMessage(selectedSession.id, messageInput, 'You');
    setSessionMessages([...sessionMessages, newMessage]);
    setMessageInput('');
  };

  const handleJoinSession = (session: CollaborationSession): void => {
    setSelectedSession(session);
    setActiveTab('chat');
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      online: 'text-green-400',
      away: 'text-yellow-400',
      offline: 'text-gray-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusIcon = (status: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
      online: <Circle className="h-2 w-2 fill-green-400 text-green-400" />,
      away: <Circle className="h-2 w-2 fill-yellow-400 text-yellow-400" />,
      offline: <Circle className="h-2 w-2 fill-gray-400 text-gray-400" />
    };
    return icons[status] || <Circle className="h-2 w-2" />;
  };

  const getReadStatusIcon = (status: 'sent' | 'delivered' | 'read'): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
      sent: <Check className="h-4 w-4 text-gray-400" />,
      delivered: <CheckCheck className="h-4 w-4 text-gray-400" />,
      read: <CheckCheck className="h-4 w-4 text-blue-400" />
    };
    return icons[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Collaboration Hub
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        HCPS 5.0
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 border-purple-500/50 max-w-xs">
                      <p className="text-sm text-gray-300">
                        Powered by <strong className="text-purple-400">HCPS-Tourism 5.0</strong> framework.
                        Collaborate in real-time with group members on shared journey planning.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-gray-400 mt-2">Real-time teamwork for tourism planning</p>
            </div>
          </div>
        </div>

        {/* Contextual Link */}
        <Alert className="bg-emerald-500/10 border-emerald-500/30">
          <Info className="h-4 w-4 text-emerald-400" />
          <AlertDescription className="text-gray-300">
            <strong className="text-emerald-300">Use with your group:</strong> Create a collaboration session to plan your journey together, then book as a group in Journey Dashboard.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-emerald-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Sessions</p>
                  <p className="text-3xl font-bold text-emerald-400">{collaborationSystem.activeSessions}</p>
                </div>
                <Users className="h-10 w-10 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Participants</p>
                  <p className="text-3xl font-bold text-cyan-400">{collaborationSystem.totalParticipants.toLocaleString()}</p>
                </div>
                <UserCheck className="h-10 w-10 text-cyan-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Messages Sent</p>
                  <p className="text-3xl font-bold text-blue-400">{collaborationSystem.totalMessages.toLocaleString()}</p>
                </div>
                <MessageSquare className="h-10 w-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Satisfaction Rate</p>
                  <p className="text-3xl font-bold text-purple-400">{collaborationSystem.satisfactionRate}%</p>
                </div>
                <Check className="h-10 w-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            <TabsTrigger value="video">Video Calls</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid gap-6">
              {sessions.map((session) => (
                <Card key={session.id} className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl text-white">{session.name}</CardTitle>
                          <Badge className={session.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                            {session.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardDescription>{session.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.participants.length} participants
                          </span>
                          <span>•</span>
                          <span>Created {session.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleJoinSession(session)}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Participants */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {session.participants.map((participant, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full">
                          {getStatusIcon(participant.status)}
                          <span className="text-sm text-gray-300">{participant.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            {selectedSession ? (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Chat Area */}
                <div className="lg:col-span-3">
                  <Card className="bg-gray-900/50 border-gray-800 h-[600px] flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-emerald-400" />
                        {selectedSession.name}
                      </CardTitle>
                      <CardDescription>{selectedSession.participants.length} participants online</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      {/* Messages */}
                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4">
                          {sessionMessages.map((message) => (
                            <div key={message.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                                {message.sender.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-white">{message.sender}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-3">
                                  <p className="text-gray-300">{message.content}</p>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {getReadStatusIcon(message.readStatus)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 bg-gray-800"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Participants Panel */}
                <div className="lg:col-span-1">
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle>Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedSession.participants.map((participant, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                            {getStatusIcon(participant.status)}
                            <span className={`text-sm ${getStatusColor(participant.status)}`}>{participant.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertDescription className="text-gray-300">
                  Please select a session from the Sessions tab to start chatting
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Whiteboard Tab */}
          <TabsContent value="whiteboard" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-cyan-400" />
                  Collaborative Whiteboard
                </CardTitle>
                <CardDescription>Draw, sketch, and plan together in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Edit3 className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Whiteboard Feature</h3>
                      <p className="text-gray-600">Real-time collaborative drawing would be integrated here</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {collaborationSystem.whiteboardAnnotations.toLocaleString()} annotations across all sessions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Calls Tab */}
          <TabsContent value="video" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-400" />
                  Video Conferencing
                </CardTitle>
                <CardDescription>HD video calls with screen sharing capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Video className="h-16 w-16 text-blue-400 mx-auto" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Video Conference</h3>
                      <p className="text-gray-400">WebRTC-based video conferencing would be integrated here</p>
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {collaborationSystem.videoConferencing.activeRooms} active rooms
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          {collaborationSystem.videoConferencing.totalMinutes.toLocaleString()} total minutes
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
