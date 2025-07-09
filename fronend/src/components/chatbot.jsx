import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Hello! I\'m your Antariksh AI assistant. Ask me about MOSDAC, satellites, or space technology! 🛰️',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll and focus
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
    }, [messages, isTyping]);

    const sendMessage = async () => {
        if (!input.trim() || !isActive) return;

        // Add user message
        const userMessage = {
            sender: 'user',
            text: input,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setIsActive(false);

        try {
            // Simulate API call with mock data for demonstration
            const mockResponses = {
                "what is mosdac": {
                    response: "MOSDAC (Meteorological & Oceanographic Satellite Data Archival Centre) is ISRO's repository for all weather and ocean-related satellite data. It archives data from satellites like INSAT-3D, SCATSAT-1, and Oceansat-2, providing valuable information for weather forecasting, cyclone prediction, and climate studies.",
                    sources: ["https://www.mosdac.gov.in", "https://www.isro.gov.in/mosdac-overview"]
                },
                "explain insat satellites": {
                    response: "The INSAT (Indian National Satellite System) is a series of multipurpose geostationary satellites launched by ISRO to serve telecommunications, broadcasting, meteorology, and search and rescue operations. Key satellites include INSAT-3DR for advanced weather imaging and INSAT-4GS for direct-to-home broadcasting.",
                    sources: ["https://www.isro.gov.in/insat-series", "https://en.wikipedia.org/wiki/Indian_National_Satellite_System"]
                },
                "what is chandrayaan": {
                    response: "Chandrayaan is India's lunar exploration program. Chandrayaan-1 (2008) confirmed water molecules on the Moon. Chandrayaan-2 (2019) included an orbiter, lander, and rover. Chandrayaan-3 (2023) successfully landed near the lunar south pole, making India the fourth country to achieve a soft landing on the Moon.",
                    sources: ["https://www.isro.gov.in/Chandrayaan3.html", "https://en.wikipedia.org/wiki/Chandrayaan_programme"]
                },
                "How can I track the next ISRO satellite launch in real-time?": {
                    response: "You can track the next ISRO satellite launch in real-time through several reliable sources. The most direct way is by visiting the official ISRO website (www.isro.gov.in), where ISRO provides official announcements, mission updates, and live-stream links for upcoming launches. ISRO also broadcasts live coverage of its launches, including countdowns and mission commentary, on its official YouTube channel. For broader launch tracking, websites like RocketLaunch.Live and NextSpaceflight.com maintain real-time status updates, launch schedules, and often embed live-stream links as the event nears. These platforms are useful if you want to set reminders or view launch windows in your local time zone. Once the satellite is launched, you can track its orbit and position in real-time using satellite tracking services such as N2YO.com. These tools provide live satellite location, orbital paths, and even overpass alerts for your specific location. By combining ISRO’s official channels with these third-party resources, you can stay fully informed before, during, and after the launch.",
                    sources: ["https://www.isro.gov.in/LaunchMissions.html", "https://rocketlaunch.org/launch-schedule/indian-space-research-organization"]
                },
                "What are the key differences between Chandrayaan-3 and Chandrayaan-2 missions?": {
                    response: "Chandrayaan-3 and Chandrayaan-2 were both lunar missions by ISRO, but they differed significantly in design, objectives, and execution. Chandrayaan-2, launched in 2019, consisted of an orbiter, a lander (Vikram), and a rover (Pragyan). While the orbiter continues to function successfully, the lander crash-landed on the Moon due to last-minute trajectory issues. In contrast, Chandrayaan-3, launched in 2023, was a more focused mission that included only a lander and a rover, relying on the Chandrayaan-2 orbiter for communication support. The Chandrayaan-3 mission incorporated key improvements such as stronger landing legs, better sensors, and advanced navigation systems, all of which contributed to its successful soft landing on the Moon's south pole on August 23, 2023. While Chandrayaan-2 aimed for both orbital and surface exploration, Chandrayaan-3 focused solely on demonstrating a safe and precise landing and conducting surface experiments through the rover. This mission marked a significant achievement for India, making it the first country to land near the lunar south pole.",
                    sources: ["https://staragile.com/blog/difference-between-chandrayaan2-and-chandrayaan3", "https://www.ndtv.com/india-news/chandrayaan-3-indias-moon-mission-chandrayaan-2-vs-chandrayaan-3-know-the-difference-4321770"]
                },
                "How can I apply for an internship or career at ISRO as a student?": {
                    response: "As a student, you can apply for an internship or a career at ISRO through several official pathways. For internships, ISRO offers opportunities to engineering and science students, usually in their pre-final or final year. To apply, you need to submit a formal request letter from your college’s Head of Department or Training and Placement Officer, along with a cover letter expressing your interest, to the director of the specific ISRO center where you wish to intern. Popular centers like VSSC (Thiruvananthapuram), SAC (Ahmedabad), and URSC (Bengaluru) regularly accept interns in fields such as satellite communication, rocket systems, and remote sensing. Each center has its own selection process, and it's advisable to apply at least 2-3 months in advance. For careers after graduation, ISRO recruits scientists and engineers through the ICRB (ISRO Centralised Recruitment Board) exam, which is open to candidates with at least 65% marks in engineering degrees, typically in branches like electronics, mechanical, and computer science. Apart from these, students can also participate in various ISRO outreach programs like the Young Scientist Programme (YUVIKA), IIRS courses, and nano-satellite initiatives like UNNATI. All official notifications and opportunities are regularly updated on ISRO’s website, making it important for aspiring candidates to stay informed through (www.isro.gov.in).",
                    sources: ["https://www.isro.gov.in/InternshipAndProjects.html", "https://www.isro.gov.in/Internship.html"]
                }
            };

            const query = input.toLowerCase();
            let responseData = {
                response: "I can provide information about MOSDAC, INSAT satellites, and ISRO missions. Try asking about Chandrayaan or Mangalyaan!",
                sources: []
                //I can provide information about MOSDAC, INSAT satellites, and ISRO missions. Try asking about Chandrayaan or Mangalyaan!
            };

            // if (mockResponses[query]) {
            //     responseData = mockResponses[query];
            // }
            const matchedKey = Object.keys(mockResponses).find(key => query.includes(key.toLowerCase()));

            if (matchedKey) {
                responseData = mockResponses[matchedKey];
            }


            const replyText = responseData.response;
            const sources = responseData.sources || [];
            const typingTime = Math.max(800, Math.min(2000, replyText.length * 20));

            // Add bot response after delay
            setTimeout(() => {
                const botReply = {
                    sender: 'bot',
                    text: replyText,
                    timestamp: new Date(),
                    ...(sources.length > 0 && {
                        sources: sources.filter(s => s)
                    })
                };
                setMessages(prev => [...prev, botReply]);
                setIsTyping(false);
                setIsActive(true);
            }, typingTime);

        } catch (error) {
            console.error('API Error:', error);
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: "⚠️ Sorry, I'm having trouble connecting to the Antariksh AI knowledge base. Please try again later.",
                    isError: true,
                    timestamp: new Date()
                }]);
                setIsTyping(false);
                setIsActive(true);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && isActive) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Format sources as links
    const renderSources = (sources) => {
        if (!sources || sources.length === 0) return null;

        return (
            <div className="sources-container">
                <div className="sources-label">Sources:</div>
                <div className="sources-grid">
                    {sources.map((source, index) => (
                        <a
                            key={index}
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-link"
                        >
                            <span>📎 Source {index + 1}</span>
                        </a>
                    ))}
                </div>
            </div>
        );
    };

    // Format timestamp
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const clearChat = () => {
        setMessages([
            {
                sender: 'bot',
                text: 'Hello! I\'m your Antariksh AI assistant. Ask me about MOSDAC, satellites, or space technology! 🛰️',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <div className="container">
            <div className="chatbot-container">
                <div className="space-background">
                    <div className="stars"></div>
                    <div className="clouds"></div>
                    <div className="earth"></div>
                    <div className="satellite"><img src="/satellite.svg" alt="Satellite" /></div>
                </div>
                <div className="chatbot-header">
                    <div className="header-left">
                        <div className="avatar-container">
                            <div className="avatar-inner"><img src="/react.svg" alt="" /></div>
                            <div className={`status-dot ${isTyping ? 'pulsing' : ''}`}></div>
                        </div>
                        <div className="header-info">
                            <h1 className="chatbot-title">Antariksh Space Assistant</h1>
                            <p className="chatbot-status">{isTyping ? 'Researching...' : isActive ? 'Online' : 'Processing'}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn" onClick={clearChat} title="Clear chat">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="chat-area">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`message-row ${msg.sender}`}
                            style={{ animation: `fadeIn 0.4s ease-out ${idx * 0.05}s both` }}
                        >
                            <div className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                                {/* User avatar now comes BEFORE message content */}
                                {msg.sender === 'user' && (
                                    <div className="message-avatar user-avatar">
                                        <span>👤</span>
                                    </div>
                                )}

                                {/* Bot avatar remains in same position */}
                                {msg.sender === 'bot' && (
                                    <div className="message-avatar bot-avatar">
                                        <img src="https://www.isro.gov.in/media_isro/image/favicon.png.webp" alt="" />
                                    </div>
                                )}

                                <div className={`message-content ${msg.sender}`}>
                                    <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
                                        {msg.text}
                                        {msg.sources && renderSources(msg.sources)}
                                    </div>
                                    <div className="message-footer">
                                        <span className="timestamp">{formatTime(msg.timestamp)}</span>
                                        {msg.sender === 'user' && (
                                            <div className="message-status">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message-row bot">
                            <div className="message-wrapper bot">
                                <div className="message-avatar bot-avatar">
                                    <img src="https://www.isro.gov.in/media_isro/image/favicon.png.webp" alt="" />
                                </div>
                                <div className="typing-indicator">
                                    <div className="radar-scan">
                                        <div className="radar-dish"></div>
                                        <div className="radar-beam"></div>
                                    </div>
                                    <span>Scanning satellite data...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                    <div className="input-wrapper">
                        <div className="input-actions">
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask about MOSDAC, satellites, or space technology..."
                            disabled={!isActive}
                        />
                        <div className="input-actions right">
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || !isActive}
                                className="send-btn"
                                aria-label="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="helper-text">
                        <span>Powered by Antariksh SpaceTech • Try: "What is MOSDAC?" or "Explain INSAT satellites"</span>
                    </div>
                </div>
            </div>
        </div>);
};

export default ChatBot;