"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, SendHorizonal, CornerDownLeft, MessageSquare, X, Loader2 } from 'lucide-react';
import { getChatbotAnswer } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

const quickQuestions = [
  'What are the admission requirements?',
  'What programs are available?',
  'When does the school year start?',
  'How do I apply?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (question: string) => {
    if (!question.trim()) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    startTransition(async () => {
      const botResponseText = await getChatbotAnswer(question);
      const botMessage: Message = { id: Date.now() + 1, sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="flex items-center gap-3 font-headline text-xl">
              <Bot className="h-7 w-7 text-primary" />
              AI Assistant
            </SheetTitle>
            <SheetDescription>
              Ask me anything about our school, programs, or admissions.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="font-semibold">Try asking one of these questions:</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickQuestions.map(q => (
                       <Button key={q} variant="outline" size="sm" className="h-auto py-2 text-xs" onClick={() => handleSendMessage(q)}>
                         {q}
                       </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.sender === 'bot' && (
                      <Avatar className="w-8 h-8">
                         <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      "max-w-xs md:max-w-sm rounded-xl px-4 py-3 text-sm",
                      message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary rounded-bl-none'
                    )}>
                      {message.text}
                    </div>
                     {message.sender === 'user' && (
                      <Avatar className="w-8 h-8">
                         <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
               {isPending && (
                <div className="flex items-start gap-3 justify-start">
                   <Avatar className="w-8 h-8">
                     <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                   </Avatar>
                  <div className="bg-secondary rounded-xl px-4 py-3 text-sm flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <form onSubmit={handleSubmit} className="relative">
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Type your question..."
                className="pr-12 h-12 text-base"
                disabled={isPending}
              />
              <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9" disabled={isPending || !inputValue.trim()}>
                <SendHorizonal className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
             <p className="text-xs text-muted-foreground text-center mt-2">
              Our AI can make mistakes. Please verify important information.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
