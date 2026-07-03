'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send, X } from 'lucide-react';
import { useWhitepaper } from '@/contexts/whitepaper-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export function CommentWidget(): JSX.Element {
  const { language, comments, addComment, activeSection } = useWhitepaper();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');

  const sectionComments = comments.filter((c) => c.section === activeSection);

  const handleSubmit = (): void => {
    if (!commentText.trim() || !authorName.trim()) return;

    addComment({
      section: activeSection,
      text: commentText,
      author: authorName,
    });

    setCommentText('');
    // Keep author name for next comment
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg shadow-purple-500/50 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 z-40"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {sectionComments.length > 0 && (
          <span className="absolute -top-1 -right-1 h-6 w-6 bg-cyan-500 rounded-full text-xs flex items-center justify-center font-bold">
            {sectionComments.length}
          </span>
        )}
      </Button>

      {/* Comment Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] bg-black/95 border-purple-500/30 backdrop-blur-xl z-40 flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-purple-400">
                {language === 'en' ? 'Comments & Feedback' : 'Komentar & Masukan'}
              </h3>
              <p className="text-xs text-gray-400">
                {language === 'en' ? 'Section: ' : 'Bagian: '}
                {activeSection || (language === 'en' ? 'None selected' : 'Belum dipilih')}
              </p>
            </div>
          </div>

          {/* Comments List */}
          <ScrollArea className="flex-1 p-4">
            {sectionComments.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                {language === 'en' 
                  ? 'No comments yet. Be the first!' 
                  : 'Belum ada komentar. Jadilah yang pertama!'}
              </div>
            ) : (
              <div className="space-y-3">
                {sectionComments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-purple-400 text-sm">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(comment.timestamp, 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Comment Form */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Input
              placeholder={language === 'en' ? 'Your name...' : 'Nama Anda...'}
              value={authorName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorName(e.target.value)}
              className="bg-black/40 border-white/20"
            />
            <div className="flex gap-2">
              <Textarea
                placeholder={language === 'en' ? 'Add a comment...' : 'Tambahkan komentar...'}
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                className="bg-black/40 border-white/20 resize-none h-20"
              />
              <Button
                onClick={handleSubmit}
                disabled={!commentText.trim() || !authorName.trim() || !activeSection}
                className="bg-purple-500 hover:bg-purple-600 h-20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
