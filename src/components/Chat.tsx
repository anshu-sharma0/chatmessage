import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Send, Search, MoreHorizontal, Phone, Video, Info, Smile, Paperclip, Divide } from "lucide-react";

// API functions using fetch
const API_BASE = 'https://chat-be-j9tf.onrender.com/api/chat';

const api = {
    getUsers: async () => {
        try {
            const response = await fetch(`${API_BASE}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            // Fallback data for demo
            return [
                { _id: "1", name: "Sarah Wilson", email: "sarah@example.com" },
                { _id: "2", name: "John Doe", email: "john@example.com" },
                { _id: "3", name: "Alex Chen", email: "alex@example.com" },
                { _id: "4", name: "Emma Davis", email: "emma@example.com" },
                { _id: "5", name: "Mike Johnson", email: "mike@example.com" }
            ];
        }
    },

    createConversation: async (user1: string, user2: string) => {
        try {
            const response = await fetch(`${API_BASE}/conversation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1, user2 })
            });
            if (!response.ok) throw new Error('Failed to create conversation');
            return await response.json();
        } catch (error) {
            console.error('Error creating conversation:', error);
            // Fallback
            return { _id: `conv_${user1}_${user2}`, participants: [user1, user2] };
        }
    },

    getMessages: async (conversationId: string) => {
        try {
            const response = await fetch(`${API_BASE}/messages/${conversationId}`);
            if (!response.ok) throw new Error('Failed to fetch messages');
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Return empty array when API fails
            return [];
        }
    },

    sendMessage: async (conversationId: string, senderId: string, message: string) => {
        try {
            const response = await fetch(`${API_BASE}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId,
                    senderId,
                    message
                })
            });
            if (!response.ok) throw new Error('Failed to send message');
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback for demo
            return {
                _id: `msg_${Date.now()}`,
                senderId,
                message,
                timestamp: new Date().toISOString()
            };
        }
    }
};

type MessageType = {
    _id?: string;
    senderId: string;
    message: string;
    timestamp: string;
};

type UserType = {
    _id: string;
    name: string;
    email: string;
};

type Inputs = {
    message: string;
};

// Simple emoji picker component
const SimpleEmojiPicker = ({ onEmojiClick, onClose }: { onEmojiClick: (emoji: string) => void, onClose: () => void }) => {
    const emojis = ['😀', '😂', '🥰', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏', '🤝', '💪', '🙏'];

    return (
        <div className="absolute bottom-16 left-6 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-2xl">
            <div className="grid grid-cols-5 gap-2 max-w-[200px]">
                {emojis.map((emoji, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            onEmojiClick(emoji);
                            onClose();
                        }}
                        className="text-2xl hover:bg-white/20 rounded-lg p-2 transition-all duration-200 hover:scale-110"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <button
                onClick={onClose}
                className="mt-2 w-full text-xs text-white/70 hover:text-white transition-colors"
            >
                Close
            </button>
        </div>
    );
};

const Chat = () => {
    const { register, reset, handleSubmit, getValues, setValue } = useForm<Inputs>();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [currentUserId, setCurrentUserId] = useState<any>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function handleEmojiClick(emoji: string) {
        const currentMessage = getValues("message") || "";
        setValue("message", currentMessage + emoji);
    }

    const getUsers = async () => {
        try {
            setIsLoading(true);
            const usersData = await api.getUsers();
            setUsers(usersData);
        } catch (err) {
            console.error('Failed to get users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const initializeChat = async (user: UserType) => {
        if (!user._id || user._id === currentUserId) return;

        try {
            setIsLoading(true);

            // Create or get conversation
            const convoRes = await api.createConversation(currentUserId, user._id);
            const convoId = convoRes._id;
            setConversationId(convoId);

            // Get existing messages from API
            const messages = await api.getMessages(convoId);
            setMessages(messages);
        } catch (err) {
            console.error('Error initializing chat:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (newMessageText: string) => {
        if (!conversationId || !newMessageText.trim()) return;

        try {
            const newMessage = await api.sendMessage(conversationId, currentUserId, newMessageText);
            setMessages(prev => [...prev, newMessage]);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const onSubmit: SubmitHandler<Inputs> = data => {
        if (data.message.trim()) {
            sendMessage(data.message);
            reset();
        }
    };

    const handleUserSelect = (user: UserType) => {
        setSelectedUser(user);
        setMessages([]); // Clear previous messages
        setConversationId(null);
        initializeChat(user);
    };

    // Static placeholder avatar
    const getAvatarUrl = (index: number) => {
        const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500'];
        return colors[index % colors.length];
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    useEffect(() => {
        getUsers();
        const userId = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUserId(userId.id);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-7xl mx-auto h-[95vh] backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="w-80 border-r border-white/20 flex flex-col backdrop-blur-sm bg-white/5">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/20">
                            <h2 className="text-xl font-bold text-white">Messages</h2>
                            <button className="p-2 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group">
                                <MoreHorizontal className="w-5 h-5 text-white/70 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto">
                            {users && (
                                users.map((user, i) => {
                                    console.log({ user });
                                    if (user?._id !== currentUserId) {
                                        return (
                                            <div
                                                key={user._id}
                                                className={`flex items-center gap-4 p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer border-b border-white/10 ${selectedUser?._id === user._id ? 'bg-white/10' : ''
                                                    }`}
                                                onClick={() => handleUserSelect(user)}
                                            >
                                                <div className="relative">
                                                    <div className={`w-12 h-12 rounded-full ${getAvatarUrl(i)} flex items-center justify-center text-white font-semibold ring-2 ring-white/20`}>
                                                        {getInitials(user.name)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                        <span className="text-xs text-white/50">online</span>
                                                    </div>
                                                    <p className="text-xs text-white/60 truncate mt-1">Click to start chatting</p>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                            )}
                        </div>

                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between p-6 border-b border-white/20 backdrop-blur-sm bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full ${getAvatarUrl(users.findIndex(u => u._id === selectedUser._id))} flex items-center justify-center text-white font-semibold ring-2 ring-white/20`}>
                                                {getInitials(selectedUser.name)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20"></div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-white">{selectedUser.name}</p>
                                            <p className="text-sm text-white/60">Active now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-3 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group">
                                            <Phone className="w-5 h-5 text-white/70 group-hover:text-white" />
                                        </button>
                                        <button className="p-3 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group">
                                            <Video className="w-5 h-5 text-white/70 group-hover:text-white" />
                                        </button>
                                        <button className="p-3 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group">
                                            <Info className="w-5 h-5 text-white/70 group-hover:text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Message Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-black/10">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/70"></div>
                                        </div>
                                    ) : (
                                        messages.map((message, index) => (
                                            <div
                                                key={message._id || index}
                                                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'items-start gap-3'} animate-in slide-in-from-bottom-4 duration-300`}
                                            >
                                                {message.senderId !== currentUserId && (
                                                    <div className={`w-8 h-8 rounded-full ${getAvatarUrl(users.findIndex(u => u._id === selectedUser._id))} flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white/20`}>
                                                        {getInitials(selectedUser.name)}
                                                    </div>
                                                )}
                                                <div className={`relative px-4 py-3 pr-12 rounded-2xl shadow-lg max-w-sm ${message.senderId === currentUserId
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto'
                                                    : 'bg-white/20 backdrop-blur-sm text-white border border-white/20'
                                                    }`}>
                                                    <p className="text-sm">{message.message}</p>
                                                    <div className="text-[10px] absolute bottom-1.5 right-3 text-white/60">
                                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300">
                                            <div className={`w-8 h-8 rounded-full ${getAvatarUrl(users.findIndex(u => u._id === selectedUser._id))} flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white/20`}>
                                                {getInitials(selectedUser.name)}
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-6 border-t relative border-white/20 backdrop-blur-sm bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="p-3 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group"
                                            >
                                                <Paperclip className="w-5 h-5 text-white/70 group-hover:text-white" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEmojiOpen(!emojiOpen)}
                                                className={`p-3 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group ${emojiOpen ? 'bg-white/10' : ''}`}
                                            >
                                                <Smile className="w-5 h-5 text-white/70 group-hover:text-white" />
                                            </button>
                                        </div>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Type your message..."
                                                {...register("message", { required: true })}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleSubmit(onSubmit)();
                                                    }
                                                }}
                                                className="w-full px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                                            />
                                        </div>
                                        <button
                                            className="bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white p-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            onClick={handleSubmit(onSubmit)}
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {emojiOpen && (
                                        <SimpleEmojiPicker
                                            onEmojiClick={handleEmojiClick}
                                            onClose={() => setEmojiOpen(false)}
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Welcome Screen */
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Send className="w-12 h-12 text-white/70" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Welcome to Chat</h3>
                                    <p className="text-white/60">Select a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;