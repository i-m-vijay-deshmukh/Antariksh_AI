

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import './ChatBot.css';

// const ChatBot = () => {
//     const [messages, setMessages] = useState([
//         { sender: 'bot', text: 'Hello! I\'m your AI assistant. What would you like to know? 🌟' }
//     ]);
//     const [input, setInput] = useState('');
//     const [isTyping, setIsTyping] = useState(false);
//     const [isBotThinking, setIsBotThinking] = useState(false);
//     const messagesEndRef = useRef(null);
//     const inputRef = useRef(null);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//         inputRef.current?.focus();
//     }, [messages]);

//     const sendMessage = async () => {
//         if (!input.trim()) return;

//         const userMessage = { sender: 'user', text: input };
//         setMessages((prev) => [...prev, userMessage]);
//         setInput('');
//         setIsTyping(true);
//         setIsBotThinking(true);

//         try {
//             const response = await axios.post('http://localhost:5000/chat', {
//                 message: input,
//             });

//             const typingTime = Math.max(800, Math.min(2000, response.data.reply.length * 20));

//             setTimeout(() => {
//                 setIsBotThinking(false);
//                 const botReply = { sender: 'bot', text: response.data.reply };
//                 setMessages((prev) => [...prev, botReply]);
//                 setIsTyping(false);
//             }, typingTime);

//         } catch {
//             setTimeout(() => {
//                 const errorMsg = {
//                     sender: 'bot',
//                     text: "⚠️ Connection issue detected. Trying to reconnect...",
//                     isError: true
//                 };
//                 setMessages((prev) => [...prev, errorMsg]);
//                 setIsTyping(false);
//                 setIsBotThinking(false);
//             }, 1500);
//         }
//     };

//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     const getUserColor = () => {
//         const hue = Math.floor(Math.random() * 360);
//         return `hsl(${hue}, 80%, 80%)`;
//     };

//     return (
//         <div className="chatbot-container">
//             <div className="particles-bg">
//                 {[...Array(15)].map((_, i) => (
//                     <div key={i} className="particle" style={{
//                         width: `${Math.random() * 10 + 5}px`,
//                         height: `${Math.random() * 10 + 5}px`,
//                         top: `${Math.random() * 100}%`,
//                         left: `${Math.random() * 100}%`,
//                         animationDuration: `${Math.random() * 20 + 10}s`,
//                         animationDelay: `${Math.random() * 5}s`
//                     }} />
//                 ))}
//             </div>

//             <div className="chatbot-header">
//                 <div className="header-left">
//                     <div className="avatar-container">
//                         <div className="avatar-inner">🤖</div>
//                         <div className="status-dot"></div>
//                     </div>
//                     <div>
//                         <h1 className="chatbot-title">Neon AI</h1>
//                         <p className="chatbot-status">{isBotThinking ? 'Typing...' : 'Online'}</p>
//                     </div>
//                 </div>
//                 <div className="header-buttons">
//                     <button className="btn yellow"></button>
//                     <button className="btn green"></button>
//                     <button className="btn red"></button>
//                 </div>
//             </div>

//             <div className="chat-area">
//                 {messages.map((msg, idx) => (
//                     <div key={idx} className={`message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
//                         <div className={`message-wrapper ${msg.sender === 'user' ? 'reverse' : ''}`}>
//                             <div
//                                 className={`message-avatar ${msg.sender === 'user' ? 'user-avatar' : 'bot-avatar'}`}
//                                 style={msg.sender === 'user' ? { backgroundColor: getUserColor() } : {}}
//                             >
//                                 {msg.sender === 'user' ? '👤' : 'AI'}
//                             </div>
//                             <div className={`message-bubble ${msg.sender} ${msg.isError ? 'error' : ''}`}>
//                                 {msg.text}
//                                 <div className={`message-corner ${msg.sender}`}></div>
//                                 <div className="timestamp">
//                                     {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}

//                 {isTyping && (
//                     <div className="message-row bot">
//                         <div className="message-wrapper">
//                             <div className="message-avatar bot-avatar">AI</div>
//                             <div className="typing-indicator">
//                                 <div className="dot"></div>
//                                 <div className="dot delay-1"></div>
//                                 <div className="dot delay-2"></div>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div ref={messagesEndRef} />
//             </div>

//             <div className="input-area">
//                 <div className="input-wrapper">
//                     <input
//                         ref={inputRef}
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={handleKeyPress}
//                         placeholder="Ask me anything..."
//                         disabled={isTyping}
//                     />
//                     <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="send-btn">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
//                         </svg>
//                     </button>
//                 </div>
//                 <div className="helper-text">
//                     <span>Press Enter to send</span>
//                     <span>•</span>
//                     <span>Shift+Enter for new line</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatBot;

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I\'m your ISRO AI assistant. Ask me about MOSDAC, satellites, or space technology! 🛰️' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll and focus
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Call your FastAPI endpoint
            const response = await axios.post('http://localhost:10000/chat', {
                query: input
            });

            // Calculate typing delay based on response length
            const replyText = response.data.response || "I couldn't find information about that.";
            const sources = response.data.sources || [];
            const typingTime = Math.max(800, Math.min(2000, replyText.length * 20));

            // Add bot response after delay
            setTimeout(() => {
                const botReply = {
                    sender: 'bot',
                    text: replyText,
                    ...(sources.length > 0 && { 
                        sources: sources.filter(s => s) // Filter out empty sources
                    })
                };
                setMessages(prev => [...prev, botReply]);
                setIsTyping(false);
            }, typingTime);

        } catch (error) {
            console.error('API Error:', error);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: "⚠️ Sorry, I'm having trouble connecting to the ISRO knowledge base. Please try again later.",
                    isError: true
                }]);
                setIsTyping(false);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Format sources as links
    const renderSources = (sources) => {
        if (!sources || sources.length === 0) return null;
        
        return (
            <div className="sources-container">
                <p>Sources:</p>
                <ul>
                    {sources.map((source, index) => (
                        <li key={index}>
                            {source.startsWith('http') ? (
                                <a href={source} target="_blank" rel="noopener noreferrer">
                                    Source {index + 1}
                                </a>
                            ) : (
                                <span>{source}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="header-left">
                    <div className="avatar-container">
                        <div className="avatar-inner">🛰️</div>
                        <div className="status-dot"></div>
                    </div>
                    <div>
                        <h1 className="chatbot-title">ISRO Assistant</h1>
                        <p className="chatbot-status">{isTyping ? 'Researching...' : 'Online'}</p>
                    </div>
                </div>
            </div>

            <div className="chat-area">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                        <div className={`message-wrapper ${msg.sender === 'user' ? 'reverse' : ''}`}>
                            <div className={`message-avatar ${msg.sender === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
                                {msg.sender === 'user' ? '👤' : 'AI'}
                            </div>
                            <div className={`message-bubble ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                                {msg.text}
                                {msg.sources && renderSources(msg.sources)}
                                <div className="timestamp">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-row bot">
                        <div className="message-wrapper">
                            <div className="message-avatar bot-avatar">AI</div>
                            <div className="typing-indicator">
                                <span>Searching ISRO databases</span>
                                <div className="dot"></div>
                                <div className="dot delay-1"></div>
                                <div className="dot delay-2"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about MOSDAC, satellites, or space technology..."
                        disabled={isTyping}
                    />
                    <button 
                        onClick={sendMessage} 
                        disabled={!input.trim() || isTyping} 
                        className="send-btn"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="helper-text">
                    <span>Try: "What is MOSDAC?" or "Explain INSAT satellites"</span>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;