import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BsChatDotsFill, BsX, BsArrowLeft, BsSendFill } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    // Component State
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('userList');
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [unreadCount, setUnreadCount] = useState(0);
    const { user: currentUser } = useAuth();
    const chatBodyRef = useRef(null);

    // --- DATA FETCHING ---
    const fetchUserAndConversationList = useCallback(async () => {
        if (!currentUser) return;
        // Don't show loading spinner for background polling
        if (isOpen) {
             setLoading(true);
        }
        try {
            const response = await fetch(`http://localhost/library-management/backend/api/users/get_conversation_list.php?user_id=${currentUser.Student_id}`);
            const data = await response.json();
            const fetchedList = data.data || [];
            setUserList(fetchedList);
            const count = fetchedList.filter(u => u.is_unread).length;
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to fetch user list:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser, isOpen]);

    const fetchConversationMessages = useCallback(async (otherUser) => {
        if (!otherUser) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost/library-management/backend/api/messages/get_conversation.php?user1_id=${currentUser.Student_id}&user2_id=${otherUser.id}`);
            const data = await response.json();
            setMessages(data.data || []);
        } catch (error) {
            console.error("Failed to fetch conversation messages:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUser.Student_id]);

    // --- EVENT HANDLERS ---
    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        setView('conversation');
        if (user.is_unread) {
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
            setUserList(currentList =>
                currentList.map(u =>
                    u.id === user.id ? { ...u, is_unread: 0 } : u
                )
            );
            await fetch('http://localhost/library-management/backend/api/messages/mark_as_read.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiver_id: currentUser.Student_id, sender_id: user.id })
            });
        }
    };
    
    const handleBackToUsers = () => {
        setSelectedUser(null);
        setMessages([]);
        setView('userList');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedUser) return;
        try {
            await fetch('http://localhost/library-management/backend/api/messages/create_message.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender_id: currentUser.Student_id, receiver_id: selectedUser.id, message_content: newMessage })
            });
            setNewMessage('');
            fetchConversationMessages(selectedUser);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // --- EFFECTS ---

    // THIS IS THE KEY FIX: Fetch data on initial load and then poll for updates.
    useEffect(() => {
        if (currentUser) {
            fetchUserAndConversationList(); // Fetch immediately when component loads
            const intervalId = setInterval(fetchUserAndConversationList, 15000); // Poll every 15 seconds
            return () => clearInterval(intervalId); // Cleanup on component unmount
        }
    }, [currentUser, fetchUserAndConversationList]);

    useEffect(() => {
        if (selectedUser) {
            fetchConversationMessages(selectedUser);
        }
    }, [selectedUser, fetchConversationMessages]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);
    
    // --- RENDER LOGIC ---
    const formatTime = (timestamp) => {
        if (!timestamp || timestamp === '0000-00-00 00:00:00') return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getFilteredUsers = () => {
        let listToFilter = userList;
        if (searchTerm) {
            listToFilter = listToFilter.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (activeTab === 'all') return listToFilter;
        return listToFilter.filter(u => u.role.toLowerCase() === activeTab);
    };

    const renderHeader = () => {
        if (view === 'conversation' && selectedUser) {
            return (
                <>
                    <button onClick={handleBackToUsers} className="back-btn"><BsArrowLeft size={20} /></button>
                    <h3>{selectedUser.name}</h3>
                    <button onClick={() => setIsOpen(false)} className="close-chat-btn"><BsX size={24} /></button>
                </>
            );
        }
        return (
            <>
                <h3>Messages</h3>
                <button onClick={() => setIsOpen(false)} className="close-chat-btn"><BsX size={24} /></button>
            </>
        );
    };

    const renderBody = () => {
        if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>;
        
        if (view === 'userList') {
            const filteredList = getFilteredUsers();
            return (
                <div className="user-list-container">
                    <div className="chat-search-bar"><input type="text" placeholder="Search for users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                    <div className="chat-tabs">
                        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
                        <button className={activeTab === 'student' ? 'active' : ''} onClick={() => setActiveTab('student')}>Students</button>
                        <button className={activeTab === 'librarian' ? 'active' : ''} onClick={() => setActiveTab('librarian')}>Librarians</button>
                    </div>
                    <ul className="user-list-body">
                        {filteredList.length > 0 ? filteredList.map((user) => (
                            <li key={user.id} onClick={() => handleSelectUser(user)} className={user.is_unread ? 'unread' : ''}>
                                <div className="user-info"><span className="user-name">{user.name}</span>{user.last_message_time && <span className="last-message-time">{formatTime(user.last_message_time)}</span>}</div>
                                <div className="last-message">{user.last_message ? user.last_message : `Click to start a conversation`}</div>
                            </li>
                        )) : <p className="no-results-msg">No users found.</p>}
                    </ul>
                </div>
            );
        }

        if (view === 'conversation') {
            return (
                <>
                    <div className="messages-body" ref={chatBodyRef}>
                        {messages.length > 0 ? messages.map(msg => (
                            <div key={msg.id} className={`message-bubble-container ${msg.sender_id === currentUser.Student_id ? 'sent' : 'received'}`}><div className="message-bubble">{msg.content}</div><div className="message-time">{formatTime(msg.sent_at)}</div></div>
                        )) : <p className="no-results-msg">No messages yet. Start the conversation!</p>}
                    </div>
                    <form className="message-form" onSubmit={handleSendMessage}><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." /><button type="submit"><BsSendFill /></button></form>
                </>
            );
        }
    };

    return (
        <div className="chat-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">{renderHeader()}</div>
                    <div className="chat-body">{renderBody()}</div>
                </div>
            )}
            <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
                <BsChatDotsFill size={28} />
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>
        </div>
    );
};

export default Chat;