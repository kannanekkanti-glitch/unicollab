import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  MessageSquare, Send, Paperclip, Search, 
  CheckCheck, User, Sparkles, Building, ShieldCheck 
} from 'lucide-react';
import { Conversation, Message, User as UserType } from '../types';
import { api, uploadFile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');
  const { user: currentUser } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Load conversations
  const loadConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);

      // If user param provided, check if existing conversation with that user
      if (targetUserId) {
        const found = data.find(c =>
          !c.is_group && c.participants.some(p => p.id === Number(targetUserId))
        );
        if (found) {
          setSelectedConversation(found);
        } else {
          // If no existing conversation, load candidate user to start fresh conversation
          const targetUser = await api.getUser(Number(targetUserId));
          // Create temporary pseudo-conversation
          const tempConv: any = {
            id: 0,
            is_group: false,
            participants: [targetUser],
            updated_at: new Date().toISOString(),
          };
          setSelectedConversation(tempConv);
        }
      } else if (!selectedConversation && data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [targetUserId]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation || selectedConversation.id === 0) {
      setMessages([]);
      return;
    }

    const fetchMsgs = async () => {
      try {
        const msgs = await api.getMessages(selectedConversation.id);
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        console.error(err);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 4000); // Polling fallback for live message sync
    return () => clearInterval(interval);
  }, [selectedConversation]);

  // WebSocket connection setup
  useEffect(() => {
    if (!currentUser) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/v1/chat/ws/${currentUser.id}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_MESSAGE') {
          const incomingMsg = data.message;
          if (selectedConversation && incomingMsg.conversation_id === selectedConversation.id) {
            setMessages(prev => [...prev, incomingMsg]);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
          loadConversations();
        }
      } catch (e) {
        console.error(e);
      }
    };

    return () => {
      ws.close();
    };
  }, [currentUser, selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachmentUrl) return;

    setSending(true);
    try {
      let convId = selectedConversation?.id;
      let recipientId: number | undefined = undefined;

      if (!convId || convId === 0) {
        const otherParticipant = selectedConversation?.participants.find(p => p.id !== currentUser?.id);
        recipientId = otherParticipant?.id;
      }

      const sent = await api.sendMessage({
        conversation_id: convId && convId !== 0 ? convId : undefined,
        recipient_id: recipientId,
        content: newMessage.trim(),
        attachment_url: attachmentUrl || undefined,
      });

      setMessages(prev => [...prev, sent]);
      setNewMessage('');
      setAttachmentUrl('');
      await loadConversations();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const otherParticipant = selectedConversation?.participants.find(p => p.id !== currentUser?.id) || selectedConversation?.participants[0];

  return (
    <div className="h-[calc(100vh-8rem)] rounded-3xl glass-card border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* Conversations List Column */}
      <div className="w-full md:w-80 flex-shrink-0 border-r border-slate-200/80 dark:border-white/10 flex flex-col bg-slate-50/50 dark:bg-[#030712]/50">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Campus Messages</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">
            {conversations.length} active
          </span>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {conversations.length === 0 && !targetUserId ? (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <p>No messages yet.</p>
              <p className="text-[11px] text-slate-500">
                Connect with peers on the Find Teammates tab to start a discussion!
              </p>
            </div>
          ) : (
            conversations.map((c) => {
              const peer = c.participants.find(p => p.id !== currentUser?.id) || c.participants[0];
              const isSelected = selectedConversation?.id === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConversation(c)}
                  className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-500/15 via-indigo-500/10 to-transparent text-brand-900 dark:text-brand-200 font-bold border border-brand-500/30 shadow-sm'
                      : 'hover:bg-white dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <Avatar
                    src={peer?.avatar_url}
                    name={peer?.full_name || 'Student'}
                    size="md"
                    isVerified={peer?.verification_status === 'VERIFIED'}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold truncate">
                        {c.title || peer?.full_name}
                      </p>
                      {c.last_message && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {c.last_message ? c.last_message.content : 'Started conversation'}
                    </p>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                      {c.unread_count}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Active Conversation Messages Column */}
      <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-[#070a12]/50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 px-6 border-b border-slate-200/80 dark:border-white/10 glass-panel flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={otherParticipant?.avatar_url}
                  name={otherParticipant?.full_name || 'Student'}
                  size="sm"
                  isVerified={otherParticipant?.verification_status === 'VERIFIED'}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedConversation.title || otherParticipant?.full_name}
                    </h4>
                    {otherParticipant?.college && (
                      <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                        {otherParticipant.college.short_code}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {otherParticipant?.major || 'Verified College Student'}
                  </p>
                </div>
              </div>

              {otherParticipant && (
                <Link
                  to={`/profile/${otherParticipant.id}`}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View Profile &rarr;
                </Link>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs space-y-1">
                  <p className="font-bold text-slate-600 dark:text-slate-300">
                    Beginning of encrypted campus chat
                  </p>
                  <p className="text-[11px]">Say hi to start collaborating!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <Avatar
                          src={msg.sender.avatar_url}
                          name={msg.sender.full_name}
                          size="sm"
                        />
                      )}
                      <div
                        className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 rounded-br-none shadow-md shadow-amber-500/25 font-semibold'
                            : 'glass-card text-stone-800 dark:text-stone-200 rounded-bl-none shadow-sm font-medium border border-stone-200/70 dark:border-amber-500/[0.1]'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`text-[9px] mt-1 text-right font-medium ${
                            isMe ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 glass-panel border-t border-stone-200/80 dark:border-amber-500/[0.1] flex items-center gap-2.5">
              <input
                type="text"
                placeholder="Type your message to teammate..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-stone-100/90 dark:bg-[#100b07]/90 rounded-2xl border border-stone-200/70 dark:border-amber-500/[0.1] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white dark:focus:bg-[#1c140f] focus:outline-none transition-all duration-300 placeholder:text-stone-400 text-stone-900 dark:text-white"
              />

              <button
                type="submit"
                disabled={sending || (!newMessage.trim() && !attachmentUrl)}
                className="luxury-shimmer-btn px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-stone-950 rounded-2xl text-xs font-black shadow-md shadow-amber-500/25 disabled:opacity-50 transition-all duration-200 hover:scale-105 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Your Campus Messaging Hub
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Select an existing chat or click "Message" on any student profile to initiate a direct peer conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
