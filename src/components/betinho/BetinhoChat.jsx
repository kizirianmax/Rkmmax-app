import React, { useState, useEffect } from 'react';

const BetinhoChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Fetch messages from the server
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        // Simulate an API call
        setTimeout(() => {
            setMessages([
                { id: 1, text: 'Hello there!' },
                { id: 2, text: 'Welcome to Betinho Chat!'
                }
            ]);
            setLoading(false);
        }, 1000);
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: inputMessage }]);
            setInputMessage('');
        }
    };

    const handleAuthorization = () => {
        // Here you would implement authorization logic
        setIsAuthorized(true);
    };

    if (!isAuthorized) {
        return <div>
            <h2>Login Required</h2>
            <button onClick={handleAuthorization}>Login</button>
        </div>;
    }

    return (
        <div>
            <h1>Betinho Chat</h1>
            <div>
                {loading ? <p>Loading messages...</p> : messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
            </div>
            <input 
                type="text" 
                value={inputMessage} 
                onChange={handleInputChange} 
                placeholder="Type your message..." 
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default BetinhoChat;