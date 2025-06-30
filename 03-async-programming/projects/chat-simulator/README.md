# Chat Simulator Project 💬

## Overview

Build a real-time chat application simulator that demonstrates WebSocket-like communication, message queuing, and real-time UI updates. This project focuses on advanced async patterns, state management, and creating responsive chat interfaces without requiring a backend server.

## Learning Objectives

- Simulate WebSocket communication patterns
- Handle real-time message delivery and queuing
- Implement typing indicators and presence status
- Manage complex async state in chat applications
- Create responsive chat UI with virtual scrolling
- Handle offline/online state and message synchronization

## Features to Implement

### Core Features (Required)

1. **Multi-User Chat Simulation**

   - Simulate multiple users with automated responses
   - Random message generation with delays
   - User typing indicators and online status
   - Message timestamps and delivery status

2. **Real-Time Message Flow**

   - Instant message delivery simulation
   - Message queuing for offline users
   - Read receipts and delivery confirmations
   - Typing indicators with realistic delays

3. **Chat Interface**

   - Scrollable message history
   - Responsive message bubbles
   - Emoji picker and reactions
   - File attachment simulation
   - Message search functionality

4. **Connection Management**
   - Simulate connection drops and reconnection
   - Message retry mechanism
   - Offline queue with sync on reconnect
   - Connection status indicators

### Advanced Features (Optional)

1. **Advanced Chat Features**

   - Group chat with multiple participants
   - Message threading and replies
   - Voice message simulation
   - Video call UI mockup
   - Screen sharing preview

2. **Message Encryption Simulation**

   - End-to-end encryption visualization
   - Key exchange simulation
   - Security indicators
   - Message verification status

3. **Chat Bots**

   - Automated response bots
   - Command processing (/help, /weather)
   - AI-powered conversation simulation
   - Interactive chat games

4. **Advanced UI**
   - Message reactions and emoji responses
   - Custom themes and chat backgrounds
   - Message formatting (bold, italic, code)
   - Dark/light mode switching

## Project Structure

```
chat-simulator/
├── README.md              # This file
├── index.html             # Main chat interface
├── styles.css             # Chat styling
├── script.js              # Main application logic
├── core/
│   ├── chatEngine.js      # Core chat simulation engine
│   ├── messageQueue.js    # Message queuing system
│   ├── userManager.js     # User management and presence
│   └── connectionSim.js   # Connection simulation
├── ui/
│   ├── chatInterface.js   # Chat UI management
│   ├── messageRenderer.js # Message display logic
│   ├── inputHandler.js    # User input processing
│   └── statusIndicators.js # Typing, online status UI
├── bots/
│   ├── echoBot.js         # Simple echo response bot
│   ├── weatherBot.js      # Weather information bot
│   ├── helpBot.js         # Help and command bot
│   └── randomBot.js       # Random conversation bot
└── utils/
    ├── messageGenerator.js # Random message generation
    ├── encryption.js       # Encryption simulation
    └── storage.js          # Message persistence
```

## Technical Implementation

### WebSocket Simulation

```javascript
class WebSocketSimulator {
  constructor() {
    this.isConnected = true;
    this.messageQueue = [];
    this.connectionLatency = 100; // ms
    this.dropRate = 0.05; // 5% message drop rate
  }

  send(message) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < this.dropRate) {
          reject(new Error("Message dropped"));
        } else {
          this.deliverMessage(message);
          resolve();
        }
      }, this.connectionLatency);
    });
  }
}
```

### Message Queue System

```javascript
class MessageQueue {
  constructor() {
    this.pendingMessages = [];
    this.deliveredMessages = [];
    this.failedMessages = [];
  }

  async queueMessage(message) {
    this.pendingMessages.push(message);
    try {
      await this.attemptDelivery(message);
      this.markAsDelivered(message);
    } catch (error) {
      this.markAsFailed(message, error);
    }
  }
}
```

### User Presence System

```javascript
class UserManager {
  constructor() {
    this.users = new Map();
    this.typingUsers = new Set();
    this.presenceUpdateInterval = 5000;
  }

  updateUserStatus(userId, status) {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      user.lastSeen = new Date();
      this.notifyPresenceChange(userId, status);
    }
  }
}
```

## Chat Features Implementation

### 1. Message Types

- **Text Messages**: Basic text with formatting
- **Emoji Messages**: Unicode emoji and custom reactions
- **File Attachments**: Simulated file uploads with progress
- **System Messages**: Join/leave notifications
- **Rich Media**: Images, videos, links with previews

### 2. Typing Indicators

```javascript
class TypingIndicator {
  constructor() {
    this.typingTimeout = 3000; // 3 seconds
    this.typingUsers = new Map();
  }

  startTyping(userId) {
    this.typingUsers.set(userId, Date.now());
    this.showTypingIndicator(userId);

    setTimeout(() => {
      this.stopTyping(userId);
    }, this.typingTimeout);
  }
}
```

### 3. Message Delivery Status

- **Sending**: Message queued for delivery
- **Sent**: Message transmitted successfully
- **Delivered**: Message received by server
- **Read**: Message viewed by recipient
- **Failed**: Delivery failed, retry available

### 4. Conversation Management

- **Private Chats**: One-on-one conversations
- **Group Chats**: Multiple participants
- **Channels**: Topic-based discussions
- **Threads**: Replies to specific messages

## Bot System

### Echo Bot

```javascript
class EchoBot {
  constructor() {
    this.name = "EchoBot";
    this.responseDelay = 1000;
  }

  async processMessage(message) {
    await this.simulateTyping();
    return {
      text: `Echo: ${message.text}`,
      timestamp: new Date(),
      sender: this.name
    };
  }
}
```

### Weather Bot

```javascript
class WeatherBot {
  constructor() {
    this.name = "WeatherBot";
    this.commands = ["/weather", "/forecast"];
  }

  async processMessage(message) {
    if (this.isWeatherCommand(message.text)) {
      const location = this.extractLocation(message.text);
      return await this.getWeatherResponse(location);
    }
    return null;
  }
}
```

## UI Components

### Message Bubble

```html
<div class="message-bubble" data-sender="user">
  <div class="message-header">
    <span class="sender-name">John Doe</span>
    <span class="message-time">14:30</span>
  </div>
  <div class="message-content">
    <p>Hello everyone! 👋</p>
  </div>
  <div class="message-status">
    <span class="delivery-status">✓✓</span>
  </div>
</div>
```

### Typing Indicator

```html
<div class="typing-indicator">
  <span class="typing-user">Alice</span>
  <span class="typing-text">is typing</span>
  <div class="typing-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
```

## Simulation Scenarios

### Network Conditions

1. **Normal Connection**: 100ms latency, 99% delivery
2. **Slow Network**: 500ms latency, 95% delivery
3. **Poor Connection**: 1000ms+ latency, 85% delivery
4. **Offline Mode**: Queue messages, sync on reconnect

### User Behaviors

1. **Active Users**: Regular messaging, quick responses
2. **Lurkers**: Online but not messaging
3. **Busy Users**: Long response delays, brief messages
4. **Offline Users**: Message queuing and delivery on return

## Error Handling

### Connection Errors

- Automatic reconnection attempts
- Exponential backoff for retries
- User notification of connection issues
- Fallback to cached messages

### Message Errors

- Failed delivery notifications
- Retry mechanisms with user control
- Message corruption detection
- Duplicate message prevention

## Performance Optimizations

### Virtual Scrolling

```javascript
class VirtualScroller {
  constructor(container, itemHeight) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleItems = [];
    this.setupScrollListener();
  }

  updateVisibleItems(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = startIndex + this.getVisibleCount();
    this.renderItems(startIndex, endIndex);
  }
}
```

### Message Caching

- LRU cache for message history
- Efficient storage of media content
- Smart preloading of adjacent messages
- Memory management for long conversations

## Testing Scenarios

### Message Flow Tests

1. Send message → Appears in chat immediately
2. Receive message → Updates with proper formatting
3. Network failure → Message queues and retries
4. Multiple users typing → All indicators show correctly

### Bot Interaction Tests

1. Send command to bot → Appropriate response generated
2. Invalid command → Help message displayed
3. Bot offline → Error message shown
4. Multiple bots → Correct bot responds to relevant commands

## Assessment Criteria

- **Real-Time Simulation** (40%): Convincing WebSocket-like behavior
- **User Interface** (30%): Intuitive and responsive chat design
- **Message Management** (20%): Proper queuing, delivery, and error handling
- **Bot Integration** (10%): Functional automated responses

## Extension Ideas

- **Voice Chat Simulation**: Audio waveform visualization
- **Video Chat UI**: Camera feeds and screen sharing mockups
- **Message Translation**: Simulate real-time translation
- **Chat Analytics**: Message statistics and user insights
- **Integration APIs**: Connect with external services
- **Mobile App Wrapper**: Cordova/PhoneGap implementation

Ready to build your chat simulator? Start with basic message sending and receiving, then add real-time features and bot interactions! 🚀
