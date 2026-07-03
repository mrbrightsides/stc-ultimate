'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Video, 
  Users, 
  DollarSign, 
  Play, 
  Calendar, 
  Bell,
  MessageCircle,
  Share2,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';
import { liveStreamingService } from '@/lib/phase3-live-streaming';
import type { LiveStream } from '@/lib/phase3-live-streaming';

export function LiveStreamingPanel() {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  
  const activeStreams = liveStreamingService.getActiveStreams();
  const scheduledStreams = liveStreamingService.getScheduledStreams();
  const stats = liveStreamingService.getStats();

  const handleJoinStream = async (streamId: string) => {
    const result = await liveStreamingService.joinStream(streamId);
    if (result.success) {
      const stream = liveStreamingService.getStreamById(streamId);
      if (stream) setSelectedStream(stream);
    }
  };

  const handleSendChat = async () => {
    if (!selectedStream || !chatMessage.trim()) return;
    
    await liveStreamingService.sendChatMessage(
      selectedStream.id,
      chatMessage,
      'user-123',
      'Tourist User'
    );
    setChatMessage('');
  };

  const getStatusColor = (status: LiveStream['status']) => {
    switch (status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'scheduled': return 'bg-blue-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Streams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStreams.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.activeStreams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Viewers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{stats.totalViewers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {(stats.totalDonations / 1000000).toFixed(1)}M IDR
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live" className="gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Now ({activeStreams.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <Calendar className="w-4 h-4" />
            Scheduled ({scheduledStreams.length})
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Live Streams */}
        <TabsContent value="live" className="space-y-4">
          {selectedStream && selectedStream.status === 'live' ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedStream.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge className="bg-red-500">{selectedStream.quality}</Badge>
                      <span>{selectedStream.streamer.name}</span>
                      {selectedStream.streamer.verified && <span>✓</span>}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedStream(null)}>
                    Exit Stream
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Placeholder */}
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 mx-auto mb-4 text-red-500 animate-pulse" />
                    <p className="text-white">Live Stream: {selectedStream.destination}</p>
                    <div className="flex items-center justify-center gap-4 mt-2 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedStream.viewers.toLocaleString()} watching
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor((Date.now() - selectedStream.startedAt.getTime()) / 60000)} min ago
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="border border-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Live Chat
                  </h4>
                  <div className="h-48 overflow-y-auto mb-3 space-y-2">
                    {selectedStream.chat.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No messages yet. Be the first to chat!
                      </p>
                    ) : (
                      selectedStream.chat.map((msg) => (
                        <div key={msg.id} className="text-sm">
                          <span className="font-semibold">{msg.username}: </span>
                          <span className="text-muted-foreground">{msg.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                    />
                    <Button onClick={handleSendChat}>Send</Button>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedStream.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Engagement</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Donations: {selectedStream.donations.toLocaleString()} IDR</div>
                      <div>Shares: {selectedStream.shareCount}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Streamer</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Followers: {selectedStream.streamer.followers.toLocaleString()}</div>
                      <div>Language: {selectedStream.language}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activeStreams.map((stream) => (
                <Card key={stream.id} className="hover:border-red-500/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getStatusColor(stream.status)}>
                        {stream.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{stream.category}</Badge>
                    </div>
                    <CardTitle className="text-base">{stream.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="text-2xl">{stream.thumbnail}</span>
                      <div>
                        <div>{stream.streamer.name}</div>
                        <div className="text-xs">{stream.destination}</div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="flex items-center gap-1 text-red-400">
                        <Users className="w-4 h-4" />
                        {stream.viewers.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {Math.floor((Date.now() - stream.startedAt.getTime()) / 60000)} min
                      </span>
                      <Badge variant="secondary">{stream.quality}</Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinStream(stream.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Stream
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Scheduled Streams */}
        <TabsContent value="scheduled">
          <div className="grid md:grid-cols-2 gap-4">
            {scheduledStreams.map((stream) => (
              <Card key={stream.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getStatusColor(stream.status)}>
                      {stream.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{stream.category}</Badge>
                  </div>
                  <CardTitle className="text-base">{stream.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className="text-2xl">{stream.thumbnail}</span>
                    <div>
                      <div>{stream.streamer.name}</div>
                      <div className="text-xs">{stream.destination}</div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>
                        {stream.scheduledFor?.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{stream.duration} minutes</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Live Streaming Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Avg Viewers/Stream</div>
                  <div className="text-2xl font-bold">{stats.averageViewersPerStream.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Most Popular</div>
                  <div className="text-2xl font-bold">{stats.mostPopularDestination}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Peak Time</div>
                  <div className="text-2xl font-bold">{stats.peakViewerTime}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Total Watch Time</h4>
                <div className="text-3xl font-bold text-purple-400">
                  {stats.totalWatchTime.toLocaleString()} hours
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
