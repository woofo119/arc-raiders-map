import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';
import useStore from '../store/useStore';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { user } = useStore();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const messageData = {
                text: input,
                sender: user ? user.username : '익명 (Anonymous)',
                timestamp: new Date().toISOString(),
            };
            socket.emit('chat message', messageData);
            setInput('');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end">
            {/* 채팅창 */}
            {isOpen && (
                <div className="mb-4 w-80 h-96 bg-[#1a1a1a]/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
                    {/* 헤더 */}
                    <div className="p-3 bg-gradient-to-r from-gray-900 to-[#1a1a1a] border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                            <MessageCircle size={16} className="text-arc-accent" />
                            실시간 채팅
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* 메시지 목록 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {messages.map((msg, index) => (
                            <div key={index} className="flex flex-col">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className={`text-xs font-bold ${msg.sender === (user?.username) ? 'text-arc-accent' : 'text-gray-400'}`}>
                                        {msg.sender}
                                    </span>
                                    <span className="text-[10px] text-gray-600">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="bg-gray-800/80 p-2 rounded-lg text-sm text-gray-200 break-words border border-gray-700/50">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 입력 폼 */}
                    <form onSubmit={sendMessage} className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-arc-accent border border-gray-700"
                        />
                        <button
                            type="submit"
                            className="bg-arc-accent hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* 토글 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95
          ${isOpen ? 'bg-gray-700 text-gray-300' : 'bg-arc-accent text-white shadow-arc-accent/40'}`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};

export default ChatWidget;
