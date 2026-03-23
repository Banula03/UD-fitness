import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import './ChatBox.css';

interface ChatBoxProps {
    currentUser: { _id: string, name: string };
    contactUser: { _id: string, name: string };
}

const ChatBox: React.FC<ChatBoxProps> = ({ currentUser, contactUser }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sort IDs to create a consistent room name regardless of who initiates
    const roomId = [currentUser._id, contactUser._id].sort().join('_');

    useEffect(() => {
        // Fetch history
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/chat/${currentUser._id}/${contactUser._id}`);
                const data = await res.json();
                if (data.success) {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };
        fetchMessages();

        // Socket logic
        socketRef.current = io('http://localhost:5000');
        
        socketRef.current.emit("join_room", roomId);

        const handleReceiveMessage = (message: any) => {
            setMessages((prev) => [...prev, message]);
        };

        socketRef.current.on("receive_message", handleReceiveMessage);

        return () => {
            if (socketRef.current) {
                socketRef.current.off("receive_message", handleReceiveMessage);
                socketRef.current.disconnect();
            }
        };
    }, [currentUser._id, contactUser._id, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socketRef.current) return;

        const messageData = {
            room: roomId,
            senderId: currentUser._id,
            receiverId: contactUser._id,
            content: newMessage,
        };

        socketRef.current.emit("send_message", messageData);
        setNewMessage('');
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox-header">
                <h3>Chat with {contactUser.name}</h3>
            </div>
            <div className="chatbox-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.senderId === currentUser._id ? 'sent' : 'received'}`}>
                        <div className="message-content">{msg.content}</div>
                        <div className="message-timestamp">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chatbox-input-form">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatBox;
