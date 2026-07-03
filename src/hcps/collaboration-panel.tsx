'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, PenTool, Video, Send, UserCircle2 } from 'lucide-react';
import { getCollaborationSessions, addChatMessage, type CollaborationSession } from '@/lib/phase4-collaboration';

export function CollaborationPanel() {
  const [sessions, setSessions] = useState<CollaborationSession[]>(getCollaborationSessions());
  const [selectedSession, setSelectedSession] = useState<CollaborationSession | null>(sessions[0] || null);
  const [chatMessage, setChatMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (!selectedSession || !chatMessage.trim()) return;

    const newMessage = addChatMessage(
      selectedSession.id,
      'current-user',
      'You',
      chatMessage
    );

    if (newMessage) {
      const updatedSessions = getCollaborationSessions();
      setSessions(updatedSessions);
      setSelectedSession(updatedSessions.find(s => s.id === selectedSession.id) || null);
      setChatMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Active Collaboration Sessions</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time multi-user planning and communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1 space-y-4">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedSession?.id === session.id
                      ? 'bg-emerald-500/20 border-emerald-500'
                      : 'bg-gray-800/50 border-gray-700 hover:border-emerald-500/50'
                  }`}
                >
                  <h3 className="font-semibold text-white mb-1">{session.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{session.description}</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">{session.participants.length} participants</span>
                  </div>
                  <Badge className="mt-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
                    {session.status}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Session Details */}
            {selectedSession && (
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                    <TabsTrigger value="chat" className="data-[state=active]:bg-emerald-500/20">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="whiteboard" className="data-[state=active]:bg-cyan-500/20">
                      <PenTool className="h-4 w-4 mr-2" />
                      Whiteboard
                    </TabsTrigger>
                    <TabsTrigger value="video" className="data-[state=active]:bg-blue-500/20">
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </TabsTrigger>
                  </TabsList>

                  {/* Chat Tab */}
                  <TabsContent value="chat" className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h3 className="font-semibold text-white mb-3">Participants</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSession.participants.map((participant) => (
                          <div 
                            key={participant.id}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 rounded-lg"
                          >
                            <UserCircle2 className={`h-4 w-4 ${
                              participant.status === 'online' ? 'text-green-400' :
                              participant.status === 'away' ? 'text-yellow-400' : 'text-gray-400'
                            }`} />
                            <span className="text-sm text-white">{participant.name}</span>
                            <Badge className="bg-gray-700 text-gray-300 text-xs">
                              {participant.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ScrollArea className="h-[400px] p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="space-y-4">
                        {selectedSession.chat.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white text-sm">{message.senderName}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300">{message.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-gray-800 border-gray-700 text-white"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Whiteboard Tab */}
                  <TabsContent value="whiteboard" className="space-y-4">
                    <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700 min-h-[500px]">
                      <h3 className="font-semibold text-white mb-4">Whiteboard Annotations</h3>
                      <div className="space-y-3">
                        {selectedSession.whiteboard.map((annotation) => (
                          <div 
                            key={annotation.id}
                            className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/30"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <PenTool className="h-4 w-4 text-cyan-400" />
                              <span className="font-semibold text-white text-sm">{annotation.userName}</span>
                              <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">
                                {annotation.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300">
                              {annotation.data.text || 'Drawing annotation'}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 text-center text-gray-500 text-sm">
                        {selectedSession.whiteboard.length} annotations • Collaborative whiteboard
                      </div>
                    </div>
                  </TabsContent>

                  {/* Video Tab */}
                  <TabsContent value="video" className="space-y-4">
                    <div className="p-8 bg-gray-800/50 rounded-lg border border-gray-700 min-h-[500px] flex flex-col items-center justify-center">
                      {selectedSession.videoConference ? (
                        <div className="text-center space-y-4">
                          <Video className="h-16 w-16 text-blue-400 mx-auto" />
                          <h3 className="font-semibold text-white text-xl">Video Conference Active</h3>
                          <p className="text-gray-400">
                            {selectedSession.videoConference.participants.length} participants in call
                          </p>
                          <div className="flex gap-3">
                            <Badge className="bg-green-500/20 text-green-300">
                              🎥 Camera On
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300">
                              🎤 Microphone On
                            </Badge>
                            {selectedSession.videoConference.screenSharing && (
                              <Badge className="bg-purple-500/20 text-purple-300">
                                🖥️ Screen Sharing
                              </Badge>
                            )}
                          </div>
                          <Button className="mt-4 bg-red-500 hover:bg-red-600 text-white">
                            Leave Call
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <Video className="h-16 w-16 text-gray-600 mx-auto" />
                          <h3 className="font-semibold text-gray-400 text-xl">No Active Video Conference</h3>
                          <p className="text-gray-500">Start a video call with session participants</p>
                          <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                            <Video className="h-4 w-4 mr-2" />
                            Start Video Call
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Collaboration Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/30">
              <div className="text-2xl font-bold text-emerald-400 mb-1">1,847</div>
              <div className="text-sm text-gray-400">Total Sessions</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30">
              <div className="text-2xl font-bold text-cyan-400 mb-1">23,456</div>
              <div className="text-sm text-gray-400">Messages Exchanged</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400 mb-1">8,934</div>
              <div className="text-sm text-gray-400">Whiteboard Annotations</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400 mb-1">45.3 min</div>
              <div className="text-sm text-gray-400">Avg Session Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
