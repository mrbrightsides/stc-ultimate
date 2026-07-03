'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCollaborativeItinerary, type ItineraryActivity } from '@/hooks/use-collaborative-itinerary';
import { 
  Users, Plus, ThumbsUp, ThumbsDown, Clock, DollarSign, 
  MapPin, Trash2, CheckCircle, Circle, RefreshCw, Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollaborativeItineraryWidgetProps {
  itineraryId: string;
  currentUserId: string;
  currentUserName: string;
  className?: string;
}

export function CollaborativeItineraryWidget({
  itineraryId,
  currentUserId,
  currentUserName,
  className
}: CollaborativeItineraryWidgetProps) {
  const {
    itinerary,
    recentUpdates,
    onlineParticipants,
    syncStatus,
    createItinerary,
    addActivity,
    updateActivity,
    removeActivity,
    voteActivity,
    getTotalCost,
    getActivityByDate
  } = useCollaborativeItinerary(itineraryId, currentUserId, currentUserName);

  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    destinationId: '',
    date: '',
    time: '',
    duration: 60,
    cost: 0,
    status: 'proposed' as const
  });

  // Initialize itinerary if it doesn't exist
  const handleInitialize = () => {
    createItinerary(
      'My Trip to Indonesia',
      'Collaborative trip planning',
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      5000
    );
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.date || !newActivity.time) {
      alert('Please fill in required fields');
      return;
    }

    addActivity(newActivity);
    
    // Reset form
    setNewActivity({
      title: '',
      description: '',
      destinationId: '',
      date: '',
      time: '',
      duration: 60,
      cost: 0,
      status: 'proposed'
    });
    
    setIsAddingActivity(false);
  };

  const handleVote = (activityId: string, vote: 'up' | 'down') => {
    voteActivity(activityId, vote);
  };

  const handleToggleStatus = (activity: ItineraryActivity) => {
    const newStatus = activity.status === 'proposed' ? 'confirmed' : 'proposed';
    updateActivity(activity.id, { status: newStatus });
  };

  const handleRemoveActivity = (activityId: string) => {
    if (confirm('Are you sure you want to remove this activity?')) {
      removeActivity(activityId);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!itinerary) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Itinerary Yet</h3>
          <p className="text-sm text-gray-500 mb-4">Create a collaborative itinerary to start planning with friends</p>
          <Button onClick={handleInitialize} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Itinerary
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalCost = getTotalCost();
  const budgetPercentage = (totalCost / itinerary.budget) * 100;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            {itinerary.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={syncStatus === 'synced' ? 'default' : syncStatus === 'syncing' ? 'secondary' : 'destructive'}
              className="bg-white border"
            >
              {syncStatus === 'synced' && <CheckCircle className="mr-1 h-3 w-3" />}
              {syncStatus === 'syncing' && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
              {syncStatus.charAt(0).toUpperCase() + syncStatus.slice(1)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{itinerary.description}</p>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Participants */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Participants</span>
          </div>
          <div className="flex -space-x-2">
            {itinerary.participants.slice(0, 5).map((participant) => (
              <Avatar key={participant.userId} className="h-7 w-7 border-2 border-white">
                <AvatarFallback className={cn(
                  "text-xs",
                  participant.isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                )}>
                  {participant.userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {itinerary.participants.length > 5 && (
              <div className="h-7 w-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                +{itinerary.participants.length - 5}
              </div>
            )}
          </div>
        </div>

        {/* Budget Status */}
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Budget</span>
            <span className="text-sm font-semibold">${totalCost.toFixed(2)} / ${itinerary.budget.toFixed(2)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                budgetPercentage > 100 ? "bg-red-500" : budgetPercentage > 75 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Updates */}
        {recentUpdates.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Recent Updates</span>
            </div>
            <div className="space-y-1">
              {recentUpdates.slice(-3).reverse().map((update, index) => (
                <div key={index} className="text-xs text-blue-600">
                  <span className="font-medium">{update.userName}</span> {update.type}ed an activity • {formatTime(update.timestamp)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Activities</h3>
            <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-1 h-3 w-3" />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Activity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      placeholder="e.g., Visit Borobudur Temple"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      placeholder="Add details about this activity"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newActivity.time}
                        onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newActivity.duration}
                        onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cost">Cost ($)</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={newActivity.cost}
                        onChange={(e) => setNewActivity({ ...newActivity, cost: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddActivity} className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Activity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {itinerary.activities.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No activities yet. Add your first activity to start planning!
                </div>
              ) : (
                itinerary.activities.map((activity) => (
                  <Card key={activity.id} className="border-gray-200">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-800">{activity.title}</h4>
                            <Badge 
                              variant={activity.status === 'confirmed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveActivity(activity.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.date} • {activity.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${activity.cost.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVote(activity.id, 'up')}
                            className={cn(
                              "h-7 px-2",
                              activity.votes.get(currentUserId) === 'up' && "bg-green-50 border-green-200"
                            )}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {Array.from(activity.votes.values()).filter(v => v === 'up').length}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVote(activity.id, 'down')}
                            className={cn(
                              "h-7 px-2",
                              activity.votes.get(currentUserId) === 'down' && "bg-red-50 border-red-200"
                            )}
                          >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            {Array.from(activity.votes.values()).filter(v => v === 'down').length}
                          </Button>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(activity)}
                          className="h-7 px-2"
                        >
                          {activity.status === 'confirmed' ? (
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                          ) : (
                            <Circle className="h-3 w-3 mr-1" />
                          )}
                          {activity.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                        </Button>
                      </div>

                      <div className="text-xs text-gray-400">
                        Added by {activity.addedByName} • {formatTime(activity.timestamp)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
