import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Send, Search, MoreHorizontal, Phone, Video, Info, Smile, Paperclip } from "lucide-react";

type Inputs = {
    message: string,
};

const Chat = () => {
    const { register, reset, handleSubmit } = useForm<Inputs>();
    const [messages, setMessages] = useState<{ text: string; time: string; isOwn: boolean }[]>([
        { text: "Hey! How's everything going?", time: "9:30 AM", isOwn: false },
        { text: "Pretty good! Just working on some new projects. How about you?", time: "9:32 AM", isOwn: true },
        { text: "Same here! Excited about the new designs we're working on", time: "9:33 AM", isOwn: false }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = (newMessageText: string) => {
        const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const newMessage = {
            text: newMessageText,
            time: currentTime,
            isOwn: true
        };

        setMessages(prev => [...prev, newMessage]);

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                text: "That sounds great! 🎉",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false
            }]);
        }, 2000);
    };

    const onSubmit: SubmitHandler<Inputs> = data => {
        if (data.message.trim()) {
            sendMessage(data.message);
            reset();
        }
    };

    const chatContacts = [
        { name: "Sarah Wilson", message: "Let's catch up soon!", time: "2m", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150", active: true, unread: 2 },
        { name: "John Doe", message: "Hey! How's everything going?", time: "5m", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", active: false, unread: 0 },
        { name: "Alex Chen", message: "The project looks amazing!", time: "1h", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", active: false, unread: 1 },
        { name: "Emma Davis", message: "Thanks for the help today", time: "3h", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", active: false, unread: 0 },
        { name: "Mike Johnson", message: "See you tomorrow!", time: "1d", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", active: false, unread: 0 }
    ];

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
                            {chatContacts.map((contact, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-4 p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer border-b border-white/10 ${i === 1 ? 'bg-white/10' : ''
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={contact.avatar}
                                            alt="profile"
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                                        />
                                        {contact.active && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-white truncate">{contact.name}</p>
                                            <span className="text-xs text-white/50">{contact.time}</span>
                                        </div>
                                        <p className="text-xs text-white/60 truncate mt-1">{contact.message}</p>
                                    </div>
                                    {contact.unread > 0 && (
                                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-xs text-white font-bold">{contact.unread}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/20 backdrop-blur-sm bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                                        alt="profile"
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20"></div>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">John Doe</p>
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
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.isOwn ? 'justify-end' : 'items-start gap-3'} animate-in slide-in-from-bottom-4 duration-300`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {!message.isOwn && (
                                        <img
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                                            alt="profile"
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                                        />
                                    )}
                                    <div
                                        className={`relative px-4 py-3 pb-5 pr-12 rounded-2xl shadow-lg max-w-sm ${message.isOwn
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto'
                                            : 'bg-white/20 backdrop-blur-sm text-white border border-white/20'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <div
                                            className={`text-[10px] absolute bottom-1.5 right-3 ${message.isOwn ? 'text-white/70' : 'text-white/50'
                                                }`}
                                        >
                                            {message.time}
                                        </div>
                                    </div>

                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                                        alt="profile"
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                                    />
                                    <div className="bg-white/20 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-2xl">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-6 border-t border-white/20 backdrop-blur-sm bg-white/5">
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
                                        className="p-3 cursor-pointer rounded-full hover:bg-white/10 transition-all duration-200 group"
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
                                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-200"
                                    />
                                </div>
                                <button
                                    className="bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 text-white p-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
