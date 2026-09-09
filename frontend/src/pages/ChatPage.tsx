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
    <div className="h-[calc(100vh-8rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Conversations List Column */}
      <div className="w-full md:w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Campus Messages</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">
            {conversations.length} chats
          </span>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                  className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition ${
                    isSelected
                      ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/60 dark:text-brand-200 font-semibold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
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
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {c.last_message ? c.last_message.content : 'Started conversation'}
                    </p>
                  </div>
                  {c.unread_count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center font-bold">
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
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3.5 px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
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
                      <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                        ({otherParticipant.college.short_code})
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {otherParticipant?.major || 'Verified College Student'}
                  </p>
                </div>
              </div>

              {otherParticipant && (
                <Link
                  to={`/profile/${otherParticipant.id}`}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View Profile
                </Link>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {messages.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs space-y-1">
                  <p className="font-semibold text-slate-600 dark:text-slate-300">
                    Beginning of conversation
                  </p>
                  <p className="text-[11px]">Say hi to start collaborating!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <Avatar
                          src={msg.sender.avatar_url}
                          name={msg.sender.full_name}
                          size="sm"
                        />
                      )}
                      <div
                        className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`text-[9px] mt-1 text-right ${
                            isMe ? 'text-brand-200' : 'text-slate-400'
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
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message to teammate..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Select a conversation to start messaging
            </p>
            <p className="text-[11px] max-w-xs">
              Chat directly with verified student peers, hackathon squad members, and club organizers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
