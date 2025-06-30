# Week 8 Exercises: Async/Await and APIs

## Exercise 1: Converting Promises to Async/Await

### Task

Refactor Promise-based code to use async/await syntax while maintaining the same functionality.

### Requirements

1. Convert the provided Promise chains to async/await
2. Implement proper error handling with try/catch
3. Maintain the same functionality and error messages
4. Add progress tracking for multi-step operations

### Starter Code

```javascript
// 1. Convert this Promise chain to async/await
function fetchUserProfile(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((user) => {
      return fetch(`/api/users/${userId}/profile`);
    })
    .then((response) => response.json())
    .then((profile) => {
      return fetch(`/api/users/${userId}/preferences`);
    })
    .then((response) => response.json())
    .then((preferences) => {
      return {
        user,
        profile,
        preferences
      };
    })
    .catch((error) => {
      console.error("Failed to fetch user data:", error);
      throw new Error("User data unavailable");
    });
}

// 2. Convert this complex Promise composition
function processOrderWorkflow(orderId) {
  return validateOrder(orderId)
    .then((order) => {
      return Promise.all([
        checkInventory(order.items),
        validatePayment(order.paymentId),
        calculateShipping(order.shippingAddress)
      ]).then(([inventory, payment, shipping]) => {
        return { order, inventory, payment, shipping };
      });
    })
    .then((data) => {
      if (!data.inventory.available) {
        throw new Error("Items not available");
      }
      if (!data.payment.valid) {
        throw new Error("Payment failed");
      }

      return createShipment(data.order, data.shipping);
    })
    .then((shipment) => {
      return Promise.all([
        updateInventory(shipment.items),
        sendConfirmationEmail(shipment.customerId),
        logTransaction(shipment.id)
      ]).then(() => shipment);
    })
    .catch((error) => {
      return cancelOrder(orderId)
        .then(() => {
          throw error;
        })
        .catch((cancelError) => {
          console.error("Failed to cancel order:", cancelError);
          throw error;
        });
    });
}

// TODO: Convert both functions to async/await
// Add progress tracking for processOrderWorkflow
// Implement proper error handling and cleanup
```

### Expected Behavior

- Async/await versions should behave identically to Promise versions
- Error handling should be comprehensive
- Progress tracking should show completion percentage
- Failed operations should clean up properly

---

## Exercise 2: Building a Robust API Client

### Task

Create a comprehensive API client that handles authentication, retries, caching, and offline scenarios.

### Requirements

1. Support multiple authentication methods (API key, Bearer token, OAuth)
2. Implement automatic retries with exponential backoff
3. Add request/response caching with TTL
4. Handle offline scenarios with queued requests
5. Provide detailed error information and recovery suggestions

### Starter Code

```javascript
class RobustApiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || "";
    this.timeout = config.timeout || 10000;
    this.maxRetries = config.maxRetries || 3;
    this.authType = config.authType || "none"; // 'none', 'apikey', 'bearer', 'oauth'
    this.credentials = config.credentials || {};

    // TODO: Initialize other components
    // - Cache system
    // - Request queue for offline scenarios
    // - Rate limiter
    // - Circuit breaker
    // - Retry manager
  }

  // TODO: Implement authentication methods
  async authenticate() {
    // Handle different auth types
  }

  async refreshToken() {
    // Handle token refresh for OAuth/Bearer
  }

  // TODO: Core request method with all features
  async request(endpoint, options = {}) {
    // Should handle:
    // - Authentication
    // - Caching (check cache first)
    // - Retries with backoff
    // - Timeout
    // - Offline queueing
    // - Circuit breaker
    // - Response validation
    // - Error handling
  }

  // TODO: Convenience methods
  async get(endpoint, params = {}) {
    // Convert params to query string
    // Call request method
  }

  async post(endpoint, data, options = {}) {
    // Handle JSON serialization
    // Set appropriate headers
    // Call request method
  }

  async put(endpoint, data, options = {}) {
    // Similar to post
  }

  async patch(endpoint, data, options = {}) {
    // Similar to post
  }

  async delete(endpoint, options = {}) {
    // Call request method with DELETE
  }

  // TODO: Upload with progress
  async upload(endpoint, file, options = {}) {
    // Handle multipart/form-data
    // Track upload progress
    // Support chunked uploads for large files
  }

  // TODO: Download with progress
  async download(endpoint, options = {}) {
    // Handle binary responses
    // Track download progress
    // Support resume for large files
  }

  // TODO: Batch requests
  async batch(requests, options = {}) {
    // Execute multiple requests
    // Handle partial failures
    // Respect rate limits
  }

  // TODO: Management methods
  clearCache() {
    // Clear cached responses
  }

  getStats() {
    // Return client statistics
    // - Cache hit rate
    // - Request count by status
    // - Average response time
    // - Retry statistics
  }

  setOfflineMode(enabled) {
    // Enable/disable offline mode
  }

  processOfflineQueue() {
    // Process queued requests when back online
  }
}

// TODO: Create specific API client implementations
class UserApiClient extends RobustApiClient {
  constructor(config) {
    super({
      baseUrl: "/api/users",
      authType: "bearer",
      ...config
    });
  }

  async getCurrentUser() {
    // Get current authenticated user
  }

  async updateProfile(userId, profileData) {
    // Update user profile with optimistic updates
  }

  async uploadAvatar(userId, file) {
    // Upload user avatar with progress
  }

  async searchUsers(query, options = {}) {
    // Search users with debouncing and caching
  }
}

// TODO: Testing scenarios
async function testApiClient() {
  const client = new UserApiClient({
    credentials: { token: "test-token" }
  });

  try {
    // Test successful requests
    const user = await client.getCurrentUser();
    console.log("Current user:", user);

    // Test retry scenarios
    const profile = await client.updateProfile(user.id, { name: "New Name" });
    console.log("Updated profile:", profile);

    // Test offline scenarios
    client.setOfflineMode(true);
    await client.updateProfile(user.id, { status: "offline" });
    client.setOfflineMode(false);

    // Test batch operations
    const results = await client.batch([
      { method: "GET", endpoint: "/users/1" },
      { method: "GET", endpoint: "/users/2" },
      { method: "GET", endpoint: "/users/3" }
    ]);

    console.log("Batch results:", results);
  } catch (error) {
    console.error("API client test failed:", error);
  }
}

testApiClient();
```

### Expected Features

- Authentication handling with automatic token refresh
- Smart caching with configurable TTL
- Retry logic that respects server responses (don't retry 4xx errors)
- Offline support with request queueing
- Progress tracking for uploads/downloads
- Detailed error reporting with recovery suggestions
- Performance monitoring and statistics

---

## Exercise 3: Real-time Data Synchronization

### Task

Build a real-time data synchronization system that handles conflicts, offline scenarios, and optimistic updates.

### Requirements

1. Implement optimistic updates with rollback capability
2. Handle real-time updates via WebSocket with polling fallback
3. Resolve data conflicts using configurable strategies
4. Support offline mode with local storage
5. Provide live collaboration indicators

### Starter Code

```javascript
// TODO: Implement data synchronization system
class DataSyncManager {
  constructor(options = {}) {
    this.entityType = options.entityType;
    this.apiClient = options.apiClient;
    this.wsUrl = options.wsUrl;
    this.conflictStrategy = options.conflictStrategy || "server-wins";

    // TODO: Initialize components
    // - Local storage manager
    // - WebSocket connection with fallback
    // - Conflict resolver
    // - Optimistic update manager
    // - Live collaboration tracker
  }

  // TODO: Core synchronization methods
  async initialize() {
    // Setup WebSocket connection
    // Load initial data
    // Start sync process
  }

  async create(data) {
    // Optimistically create locally
    // Send to server
    // Handle conflicts
  }

  async update(id, updates) {
    // Optimistic update with rollback
    // Send to server
    // Handle server response
  }

  async delete(id) {
    // Optimistic delete with rollback
    // Send to server
    // Handle server response
  }

  // TODO: Real-time event handling
  handleRealtimeUpdate(event) {
    // Process incoming real-time updates
    // Resolve conflicts
    // Update local state
    // Notify subscribers
  }

  // TODO: Conflict resolution
  resolveConflict(localVersion, serverVersion) {
    // Apply conflict resolution strategy
    // Return resolved version
  }

  // TODO: Offline support
  enableOfflineMode() {
    // Switch to offline mode
    // Queue operations
  }

  async syncOfflineChanges() {
    // Sync queued changes when back online
    // Handle conflicts from offline period
  }

  // TODO: Collaboration features
  trackUserPresence(userId, presence) {
    // Track who's online/editing
  }

  broadcastUserActivity(activity) {
    // Broadcast typing, selecting, etc.
  }
}

// TODO: Document collaboration system
class DocumentCollaborationManager extends DataSyncManager {
  constructor(documentId, userId) {
    super({
      entityType: "document",
      wsUrl: `wss://api.example.com/documents/${documentId}/sync`
    });

    this.documentId = documentId;
    this.userId = userId;
    this.cursors = new Map(); // Track other users' cursors
    this.isTyping = new Map(); // Track who's typing

    // TODO: Initialize document-specific features
  }

  // TODO: Document operations
  async insertText(position, text) {
    // Handle text insertion with conflict resolution
  }

  async deleteText(start, end) {
    // Handle text deletion with conflict resolution
  }

  async formatText(start, end, formatting) {
    // Handle text formatting
  }

  // TODO: Collaboration features
  updateCursor(position) {
    // Update and broadcast cursor position
  }

  startTyping() {
    // Indicate user is typing
  }

  stopTyping() {
    // Indicate user stopped typing
  }

  // TODO: Operational Transform for text
  transformOperation(operation, otherOperation) {
    // Transform operations to handle concurrent edits
  }
}

// TODO: Shopping cart synchronization
class ShoppingCartSync extends DataSyncManager {
  constructor(userId, apiClient) {
    super({
      entityType: "cart",
      apiClient,
      conflictStrategy: "merge-quantities"
    });

    this.userId = userId;
    this.cart = new Map(); // itemId -> { item, quantity, addedAt }
  }

  async addItem(item, quantity = 1) {
    // Optimistically add item
    // Sync with server
    // Handle inventory conflicts
  }

  async updateQuantity(itemId, quantity) {
    // Optimistically update quantity
    // Sync with server
    // Handle availability conflicts
  }

  async removeItem(itemId) {
    // Optimistically remove item
    // Sync with server
  }

  // TODO: Handle cart conflicts
  resolveCartConflict(localCart, serverCart) {
    // Merge cart items
    // Handle quantity conflicts
    // Check item availability
  }

  // TODO: Cross-device synchronization
  async syncAcrossDevices() {
    // Sync cart across user's devices
    // Handle device-specific conflicts
  }
}

// TODO: Testing scenarios
async function testDataSync() {
  // Test document collaboration
  const doc1 = new DocumentCollaborationManager("doc123", "user1");
  const doc2 = new DocumentCollaborationManager("doc123", "user2");

  await doc1.initialize();
  await doc2.initialize();

  // Simulate concurrent edits
  await Promise.all([doc1.insertText(0, "Hello "), doc2.insertText(0, "Hi ")]);

  // Test shopping cart sync
  const cart1 = new ShoppingCartSync("user1", apiClient);
  const cart2 = new ShoppingCartSync("user1", apiClient); // Same user, different device

  await cart1.addItem({ id: "item1", name: "Product 1", price: 10 }, 2);
  await cart2.addItem({ id: "item2", name: "Product 2", price: 15 }, 1);

  // Test offline sync
  cart1.enableOfflineMode();
  await cart1.updateQuantity("item1", 5);
  await cart1.syncOfflineChanges();
}

testDataSync();
```

### Expected Features

- Real-time synchronization with conflict resolution
- Optimistic updates with automatic rollback on conflicts
- Offline support with queued operations
- Live collaboration indicators (cursors, typing status)
- Cross-device synchronization
- Operational transforms for concurrent text editing
- Configurable conflict resolution strategies

---

## Exercise 4: Advanced File Management System

### Task

Create a comprehensive file management system with chunked uploads, resumable downloads, and background processing.

### Requirements

1. Support chunked uploads with progress tracking and resume capability
2. Implement resumable downloads with parallel chunk downloading
3. Add background image/video processing with progress updates
4. Handle file conflict resolution (duplicate names, version control)
5. Implement file sharing with permission management

### Starter Code

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Advanced File Manager</title>
    <style>
      .file-upload-area {
        border: 2px dashed #ccc;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
      }
      .file-upload-area.dragover {
        border-color: #007bff;
        background-color: #f8f9fa;
      }
      .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        overflow: hidden;
        margin: 10px 0;
      }
      .progress-bar-fill {
        height: 100%;
        background-color: #007bff;
        transition: width 0.3s ease;
      }
      .file-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 1px solid #ddd;
        margin: 5px 0;
        border-radius: 5px;
      }
      .file-actions {
        margin-left: auto;
      }
      .processing-status {
        font-size: 0.9em;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <h1>Advanced File Manager</h1>

      <!-- Upload Area -->
      <div class="file-upload-area" id="uploadArea">
        <p>Drag and drop files here or click to select</p>
        <input type="file" id="fileInput" multiple style="display: none;" />
      </div>

      <!-- Upload Progress -->
      <div id="uploadProgress" style="display: none;">
        <h3>Upload Progress</h3>
        <div id="uploadList"></div>
      </div>

      <!-- File List -->
      <div id="fileList">
        <h3>Files</h3>
        <div id="files"></div>
      </div>

      <!-- Background Tasks -->
      <div id="backgroundTasks">
        <h3>Background Processing</h3>
        <div id="tasks"></div>
      </div>
    </div>

    <script>
      // TODO: Implement FileManager class
      class FileManager {
        constructor(apiClient) {
          this.apiClient = apiClient;
          this.activeUploads = new Map();
          this.activeDownloads = new Map();
          this.backgroundTasks = new Map();
          this.files = new Map();

          this.setupEventListeners();
        }

        setupEventListeners() {
          // TODO: Setup drag and drop
          // TODO: Setup file input change
          // TODO: Setup UI event handlers
        }

        // TODO: Upload methods
        async uploadFile(file, options = {}) {
          // Create chunked uploader
          // Track progress
          // Handle resume if connection fails
          // Update UI
        }

        async uploadChunk(uploadId, chunk, chunkIndex) {
          // Upload individual chunk
          // Retry on failure
          // Update progress
        }

        async resumeUpload(uploadId) {
          // Resume failed upload
          // Check which chunks are already uploaded
          // Continue from where it left off
        }

        // TODO: Download methods
        async downloadFile(fileId, fileName) {
          // Create resumable downloader
          // Support parallel chunk downloading
          // Track progress
          // Handle resume
        }

        async downloadChunk(url, start, end) {
          // Download file chunk
          // Retry on failure
        }

        // TODO: File processing
        async processImage(fileId, operations) {
          // Queue image processing task
          // Operations: resize, crop, filter, format conversion
          // Track progress
          // Notify when complete
        }

        async processVideo(fileId, operations) {
          // Queue video processing task
          // Operations: transcode, trim, add subtitles, thumbnails
          // Track progress with detailed steps
        }

        // TODO: File management
        async createFolder(name, parentId = null) {
          // Create new folder
          // Handle name conflicts
        }

        async moveFile(fileId, newParentId) {
          // Move file to different folder
          // Update local state optimistically
        }

        async copyFile(fileId, newParentId, newName = null) {
          // Copy file to different location
          // Handle name conflicts
        }

        async deleteFile(fileId) {
          // Delete file with confirmation
          // Move to trash first
          // Permanent delete after confirmation
        }

        async renameFile(fileId, newName) {
          // Rename file
          // Handle conflicts
          // Update UI optimistically
        }

        // TODO: Sharing and permissions
        async shareFile(fileId, permissions) {
          // Create sharing link
          // Set permissions (read, write, admin)
          // Generate expirable links
        }

        async updatePermissions(fileId, userId, permissions) {
          // Update user permissions for file
        }

        // TODO: Version control
        async createFileVersion(fileId, file) {
          // Upload new version of existing file
          // Maintain version history
        }

        async getFileVersions(fileId) {
          // Get list of file versions
        }

        async restoreFileVersion(fileId, versionId) {
          // Restore file to specific version
        }

        // TODO: Search and filtering
        async searchFiles(query, filters = {}) {
          // Search files by name, content, tags
          // Apply filters (file type, date, size)
          // Support advanced search syntax
        }

        // TODO: Bulk operations
        async bulkUpload(files, folderId = null) {
          // Upload multiple files
          // Show combined progress
          // Handle individual failures
        }

        async bulkDownload(fileIds) {
          // Download multiple files as ZIP
          // Stream ZIP creation
          // Track progress
        }

        async bulkMove(fileIds, newParentId) {
          // Move multiple files
          // Handle conflicts
          // Show progress for large operations
        }

        // TODO: UI update methods
        updateUploadProgress(uploadId, progress) {
          // Update upload progress bar
          // Show transfer speed
          // Show estimated time remaining
        }

        updateDownloadProgress(downloadId, progress) {
          // Update download progress bar
        }

        updateProcessingProgress(taskId, progress) {
          // Update background task progress
          // Show current processing step
        }

        showFileList(files) {
          // Render file list with actions
          // Show thumbnails for images
          // Show file metadata
        }

        showError(message, details = null) {
          // Show user-friendly error message
          // Provide recovery suggestions
        }
      }

      // TODO: Background task processor
      class BackgroundTaskProcessor {
        constructor(fileManager) {
          this.fileManager = fileManager;
          this.tasks = new Map();
          this.maxConcurrentTasks = 2;
          this.activeTasks = 0;
        }

        async addTask(task) {
          // Add task to queue
          // Start processing if capacity available
        }

        async processTask(task) {
          // Process individual task
          // Update progress
          // Handle failures with retry
        }

        // TODO: Specific processors
        async processImageTask(task) {
          // Image processing: resize, crop, filter
          // Use Canvas API or WebAssembly
          // Track progress through processing steps
        }

        async processVideoTask(task) {
          // Video processing: transcode, trim
          // Use FFmpeg WASM or similar
          // Track progress through encoding
        }
      }

      // TODO: Initialize file manager
      const apiClient = new RobustApiClient({
        baseUrl: "/api/files",
        authType: "bearer",
        credentials: { token: "your-token" }
      });

      const fileManager = new FileManager(apiClient);

      // TODO: Demo scenarios
      async function demonstrateFeatures() {
        // Test large file upload with resume
        const largeFile = new File(
          ["x".repeat(50 * 1024 * 1024)],
          "large-file.txt"
        );
        await fileManager.uploadFile(largeFile);

        // Test image processing
        const imageFile = new File(["fake-image-data"], "image.jpg", {
          type: "image/jpeg"
        });
        const uploadedImage = await fileManager.uploadFile(imageFile);
        await fileManager.processImage(uploadedImage.id, [
          { operation: "resize", width: 800, height: 600 },
          { operation: "filter", type: "blur", strength: 2 }
        ]);

        // Test bulk operations
        const files = [
          new File(["content1"], "file1.txt"),
          new File(["content2"], "file2.txt"),
          new File(["content3"], "file3.txt")
        ];
        await fileManager.bulkUpload(files);

        // Test search
        const searchResults = await fileManager.searchFiles("txt", {
          fileType: "text",
          dateFrom: "2025-01-01"
        });

        console.log("Demo completed");
      }

      // demonstrateFeatures();
    </script>
  </body>
</html>
```

### Expected Features

- Chunked uploads with resume capability and progress tracking
- Parallel chunk downloads with resume support
- Background image/video processing with progress updates
- File versioning and conflict resolution
- Drag and drop interface with upload progress
- Bulk operations with combined progress tracking
- Advanced search with filters
- File sharing with permission management
- Error handling with recovery suggestions

---

## Exercise 5: Real-time Notification System

### Task

Build a comprehensive notification system that handles real-time delivery, offline queueing, and smart batching.

### Requirements

1. Support multiple delivery channels (WebSocket, Push API, Email, SMS)
2. Implement notification batching and deduplication
3. Handle offline scenarios with local storage
4. Add notification persistence and history
5. Provide notification preferences and filtering

### Starter Code

```javascript
// TODO: Notification system with multiple channels
class NotificationSystem {
  constructor(options = {}) {
    this.userId = options.userId;
    this.channels = new Map(); // channel type -> channel instance
    this.preferences = options.preferences || {};
    this.storage = options.storage || new LocalNotificationStorage();
    this.batcher = new NotificationBatcher();
    this.deduplicator = new NotificationDeduplicator();

    this.setupChannels(options.channels || []);
  }

  setupChannels(channelConfigs) {
    // TODO: Initialize notification channels
    // WebSocket, Push API, Email, SMS, In-app
  }

  // TODO: Core notification methods
  async send(notification, options = {}) {
    // Process notification through pipeline:
    // 1. Validate notification
    // 2. Apply user preferences/filters
    // 3. Deduplicate
    // 4. Route to appropriate channels
    // 5. Handle delivery confirmation
    // 6. Store for history
  }

  async sendBatch(notifications, options = {}) {
    // Send multiple notifications efficiently
    // Apply batching rules
    // Handle partial failures
  }

  // TODO: Channel management
  async enableChannel(channelType, config = {}) {
    // Enable notification channel
    // Request permissions if needed
  }

  async disableChannel(channelType) {
    // Disable notification channel
  }

  // TODO: Preference management
  async updatePreferences(preferences) {
    // Update notification preferences
    // Apply filters
    // Save to server and local storage
  }

  getPreferences() {
    // Get current notification preferences
  }

  // TODO: History and persistence
  async getNotificationHistory(options = {}) {
    // Get notification history with pagination
    // Support filtering by type, date, status
  }

  async markAsRead(notificationId) {
    // Mark notification as read
    // Sync across devices
  }

  async markAllAsRead() {
    // Mark all notifications as read
  }

  // TODO: Offline handling
  async queueForOffline(notification) {
    // Queue notification for when online
  }

  async processOfflineQueue() {
    // Process queued notifications when back online
  }
}

// TODO: WebSocket notification channel
class WebSocketNotificationChannel {
  constructor(config) {
    this.wsUrl = config.wsUrl;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.ws = null;
    this.messageQueue = [];
    this.isConnected = false;
  }

  async initialize() {
    // Setup WebSocket connection
    // Handle reconnection
  }

  async send(notification) {
    // Send notification via WebSocket
    // Queue if not connected
  }

  handleMessage(message) {
    // Handle incoming notification
    // Parse and validate message
  }

  // TODO: Connection management
  connect() {
    // Establish WebSocket connection
  }

  disconnect() {
    // Close WebSocket connection
  }

  reconnect() {
    // Reconnect with exponential backoff
  }
}

// TODO: Push API notification channel
class PushNotificationChannel {
  constructor(config) {
    this.vapidKey = config.vapidKey;
    this.serviceWorkerUrl = config.serviceWorkerUrl;
    this.subscription = null;
  }

  async initialize() {
    // Register service worker
    // Request notification permission
    // Subscribe to push service
  }

  async send(notification) {
    // Send push notification via server
  }

  async requestPermission() {
    // Request notification permission
    // Handle permission states
  }

  async subscribe() {
    // Subscribe to push service
    // Send subscription to server
  }

  async unsubscribe() {
    // Unsubscribe from push service
  }
}

// TODO: In-app notification channel
class InAppNotificationChannel {
  constructor(config) {
    this.container = config.container;
    this.maxVisible = config.maxVisible || 5;
    this.autoHideDelay = config.autoHideDelay || 5000;
    this.activeNotifications = new Map();
  }

  async send(notification) {
    // Show in-app notification
    // Handle positioning and stacking
    // Auto-hide after delay
  }

  show(notification) {
    // Create and show notification element
  }

  hide(notificationId) {
    // Hide specific notification
  }

  hideAll() {
    // Hide all notifications
  }

  // TODO: Notification types
  showToast(message, type = "info") {
    // Show toast notification
  }

  showModal(notification) {
    // Show modal notification for important alerts
  }

  showBanner(notification) {
    // Show banner notification at top of page
  }
}

// TODO: Notification batcher
class NotificationBatcher {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 10;
    this.batchDelay = options.batchDelay || 5000;
    this.batches = new Map(); // batch key -> notifications
    this.timers = new Map(); // batch key -> timer
  }

  add(notification, batchKey = "default") {
    // Add notification to batch
    // Schedule batch processing
  }

  processBatch(batchKey) {
    // Process batch of notifications
    // Apply batching rules (e.g., combine similar notifications)
  }

  // TODO: Smart batching rules
  canBatch(notification1, notification2) {
    // Determine if notifications can be batched
    // Based on type, sender, content similarity
  }

  combineNotifications(notifications) {
    // Combine similar notifications
    // E.g., "3 new messages from John" instead of 3 separate notifications
  }
}

// TODO: Notification deduplicator
class NotificationDeduplicator {
  constructor(options = {}) {
    this.timeWindow = options.timeWindow || 60000; // 1 minute
    this.recentNotifications = new Map();
  }

  isDuplicate(notification) {
    // Check if notification is duplicate within time window
  }

  add(notification) {
    // Add notification to recent list
    // Clean up old entries
  }

  generateKey(notification) {
    // Generate deduplication key based on content
  }
}

// TODO: Local notification storage
class LocalNotificationStorage {
  constructor() {
    this.storageKey = "notifications";
    this.maxStoredNotifications = 1000;
  }

  async store(notification) {
    // Store notification in local storage/IndexedDB
  }

  async getAll(options = {}) {
    // Get all stored notifications with filtering
  }

  async markAsRead(notificationId) {
    // Mark notification as read in local storage
  }

  async delete(notificationId) {
    // Delete notification from local storage
  }

  async clear() {
    // Clear all stored notifications
  }
}

// TODO: Notification preferences manager
class NotificationPreferences {
  constructor(defaultPreferences = {}) {
    this.preferences = {
      enabled: true,
      channels: {
        inApp: true,
        push: false,
        email: true,
        sms: false
      },
      types: {
        messages: true,
        updates: true,
        alerts: true,
        marketing: false
      },
      schedule: {
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00"
        },
        workingHours: {
          enabled: false,
          start: "09:00",
          end: "17:00",
          workDays: [1, 2, 3, 4, 5] // Monday to Friday
        }
      },
      ...defaultPreferences
    };
  }

  shouldSendNotification(notification, channel) {
    // Check if notification should be sent
    // Based on preferences, time, type, etc.
  }

  isInQuietHours() {
    // Check if current time is in quiet hours
  }

  isWorkingHours() {
    // Check if current time is in working hours
  }

  update(newPreferences) {
    // Update preferences
    // Validate and merge with current preferences
  }
}

// TODO: Usage example - Chat application notifications
class ChatNotificationManager extends NotificationSystem {
  constructor(userId, apiClient) {
    super({
      userId,
      channels: [
        {
          type: "websocket",
          config: { wsUrl: `wss://api.example.com/chat/${userId}` }
        },
        { type: "push", config: { vapidKey: "your-vapid-key" } },
        {
          type: "inApp",
          config: { container: document.getElementById("notifications") }
        }
      ],
      preferences: {
        types: {
          newMessage: true,
          mention: true,
          groupInvite: true
        },
        schedule: {
          quietHours: { enabled: true, start: "23:00", end: "07:00" }
        }
      }
    });

    this.apiClient = apiClient;
  }

  async sendMessageNotification(message, recipientId) {
    const notification = {
      id: `message_${message.id}`,
      type: "newMessage",
      title: `New message from ${message.senderName}`,
      body: message.content,
      data: {
        messageId: message.id,
        chatId: message.chatId,
        senderId: message.senderId
      },
      actions: [
        { action: "reply", title: "Reply" },
        { action: "view", title: "View Chat" }
      ],
      recipientId
    };

    await this.send(notification, {
      channels: ["websocket", "push", "inApp"],
      priority: "normal"
    });
  }

  async sendMentionNotification(message, mentionedUserId) {
    const notification = {
      id: `mention_${message.id}`,
      type: "mention",
      title: `You were mentioned by ${message.senderName}`,
      body: message.content,
      data: {
        messageId: message.id,
        chatId: message.chatId,
        senderId: message.senderId
      },
      recipientId: mentionedUserId
    };

    await this.send(notification, {
      channels: ["websocket", "push", "inApp"],
      priority: "high"
    });
  }
}

// TODO: Testing scenarios
async function testNotificationSystem() {
  const chatNotifications = new ChatNotificationManager("user123", apiClient);

  // Test message notification
  await chatNotifications.sendMessageNotification(
    {
      id: "msg1",
      content: "Hello there!",
      senderName: "Alice",
      senderId: "user456",
      chatId: "chat789"
    },
    "user123"
  );

  // Test mention notification
  await chatNotifications.sendMentionNotification(
    {
      id: "msg2",
      content: "@user123 can you review this?",
      senderName: "Bob",
      senderId: "user789",
      chatId: "chat789"
    },
    "user123"
  );

  // Test batch notifications
  const messages = [
    { id: "msg3", content: "Message 1", senderName: "Charlie" },
    { id: "msg4", content: "Message 2", senderName: "Charlie" },
    { id: "msg5", content: "Message 3", senderName: "Charlie" }
  ];

  for (const message of messages) {
    await chatNotifications.sendMessageNotification(message, "user123");
  }

  // Test preference updates
  await chatNotifications.updatePreferences({
    schedule: {
      quietHours: { enabled: true, start: "22:00", end: "08:00" }
    }
  });

  console.log("Notification system test completed");
}

testNotificationSystem();
```

### Expected Features

- Multi-channel notification delivery (WebSocket, Push, In-app)
- Smart batching and deduplication of similar notifications
- Offline support with queued delivery
- Comprehensive preference management with scheduling
- Notification history and persistence
- Permission handling for Push API
- Real-time delivery with fallback mechanisms
- Action buttons and interactive notifications

---

## Exercise 6: Advanced Search and Autocomplete

### Task

Build a sophisticated search system with real-time suggestions, advanced filtering, and performance optimization.

### Requirements

1. Implement debounced search with cancellation
2. Add real-time autocomplete with highlighting
3. Support advanced search syntax and filters
4. Implement search result caching and analytics
5. Add search history and saved searches

### Starter Code

```javascript
// TODO: Advanced search engine
class AdvancedSearchEngine {
  constructor(options = {}) {
    this.apiClient = options.apiClient;
    this.debounceDelay = options.debounceDelay || 300;
    this.minQueryLength = options.minQueryLength || 2;
    this.maxSuggestions = options.maxSuggestions || 10;
    this.maxResults = options.maxResults || 50;

    // TODO: Initialize components
    // - Search cache
    // - Query parser
    // - Analytics tracker
    // - History manager
    // - Active search tracker
  }

  // TODO: Core search methods
  async search(query, options = {}) {
    // Main search method with:
    // - Query parsing and validation
    // - Cache checking
    // - Debouncing
    // - Request cancellation
    // - Result processing
    // - Analytics tracking
  }

  async getSuggestions(query, options = {}) {
    // Get search suggestions with:
    // - Real-time autocomplete
    // - Query completion
    // - Recent searches
    // - Popular searches
    // - Contextual suggestions
  }

  // TODO: Advanced search features
  parseQuery(query) {
    // Parse advanced search syntax:
    // - Quoted phrases: "exact phrase"
    // - Field search: title:keyword
    // - Boolean operators: AND, OR, NOT
    // - Wildcards: partial*
    // - Date ranges: date:2025-01-01..2025-12-31
    // - Numeric ranges: price:10..100
  }

  applyFilters(results, filters) {
    // Apply search filters:
    // - Category, price range, date range
    // - Location-based filtering
    // - Custom field filters
  }

  // TODO: Performance optimization
  cacheResults(query, results) {
    // Cache search results with:
    // - TTL-based expiration
    // - LRU eviction
    // - Size limits
    // - Invalidation strategies
  }

  getCachedResults(query) {
    // Retrieve cached results
  }

  // TODO: Search analytics
  trackSearch(query, resultCount, responseTime) {
    // Track search analytics:
    // - Popular queries
    // - Zero-result queries
    // - Search performance
    // - User behavior
  }

  getSearchAnalytics(timeRange) {
    // Get search analytics data
  }

  // TODO: Search history
  addToHistory(query, results) {
    // Add search to user history
  }

  getSearchHistory(options = {}) {
    // Get user search history
  }

  // TODO: Saved searches
  saveSearch(query, filters, name) {
    // Save search with custom name
  }

  getSavedSearches() {
    // Get user's saved searches
  }

  executeSearch(searchId) {
    // Execute saved search
  }
}

// TODO: Search UI component
class SearchUI {
  constructor(searchEngine, container) {
    this.searchEngine = searchEngine;
    this.container = container;
    this.currentQuery = "";
    this.selectedSuggestionIndex = -1;
    this.isSearching = false;

    this.setupUI();
    this.setupEventListeners();
  }

  setupUI() {
    // TODO: Create search UI elements
    this.container.innerHTML = `
            <div class="search-container">
                <div class="search-input-container">
                    <input type="text" id="searchInput" placeholder="Search..." autocomplete="off">
                    <button id="searchButton">Search</button>
                    <button id="advancedSearchToggle">Advanced</button>
                </div>

                <div id="suggestions" class="suggestions-dropdown" style="display: none;">
                    <!-- Autocomplete suggestions -->
                </div>

                <div id="advancedSearch" class="advanced-search" style="display: none;">
                    <!-- Advanced search filters -->
                    <div class="filter-group">
                        <label>Category:</label>
                        <select id="categoryFilter">
                            <option value="">All Categories</option>
                            <!-- Category options -->
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Date Range:</label>
                        <input type="date" id="dateFrom">
                        <input type="date" id="dateTo">
                    </div>

                    <div class="filter-group">
                        <label>Price Range:</label>
                        <input type="number" id="priceMin" placeholder="Min">
                        <input type="number" id="priceMax" placeholder="Max">
                    </div>
                </div>

                <div id="searchResults" class="search-results">
                    <!-- Search results -->
                </div>

                <div id="searchHistory" class="search-history" style="display: none;">
                    <!-- Search history -->
                </div>

                <div id="savedSearches" class="saved-searches" style="display: none;">
                    <!-- Saved searches -->
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const suggestionsContainer = document.getElementById("suggestions");

    // TODO: Input event for autocomplete
    searchInput.addEventListener("input", (e) => {
      this.handleInput(e.target.value);
    });

    // TODO: Keyboard navigation
    searchInput.addEventListener("keydown", (e) => {
      this.handleKeyDown(e);
    });

    // TODO: Search button click
    searchButton.addEventListener("click", () => {
      this.performSearch();
    });

    // TODO: Focus/blur events
    searchInput.addEventListener("focus", () => {
      this.showSuggestions();
    });

    searchInput.addEventListener("blur", () => {
      // Delay hiding to allow suggestion clicks
      setTimeout(() => this.hideSuggestions(), 200);
    });

    // TODO: Advanced search toggle
    document
      .getElementById("advancedSearchToggle")
      .addEventListener("click", () => {
        this.toggleAdvancedSearch();
      });
  }

  async handleInput(query) {
    this.currentQuery = query;

    if (query.length >= this.searchEngine.minQueryLength) {
      // TODO: Get suggestions
      try {
        const suggestions = await this.searchEngine.getSuggestions(query);
        this.displaySuggestions(suggestions);
      } catch (error) {
        console.error("Failed to get suggestions:", error);
      }
    } else {
      this.hideSuggestions();
    }
  }

  handleKeyDown(e) {
    const suggestions = document.querySelectorAll(".suggestion-item");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          suggestions.length - 1
        );
        this.updateSuggestionSelection();
        break;

      case "ArrowUp":
        e.preventDefault();
        this.selectedSuggestionIndex = Math.max(
          this.selectedSuggestionIndex - 1,
          -1
        );
        this.updateSuggestionSelection();
        break;

      case "Enter":
        e.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.selectedSuggestionIndex);
        } else {
          this.performSearch();
        }
        break;

      case "Escape":
        this.hideSuggestions();
        break;
    }
  }

  displaySuggestions(suggestions) {
    const container = document.getElementById("suggestions");

    if (suggestions.length === 0) {
      container.style.display = "none";
      return;
    }

    const html = suggestions
      .map(
        (suggestion, index) => `
            <div class="suggestion-item" data-index="${index}" onclick="this.selectSuggestion(${index})">
                <div class="suggestion-text">${this.highlightQuery(
                  suggestion.text,
                  this.currentQuery
                )}</div>
                <div class="suggestion-type">${suggestion.type}</div>
                ${
                  suggestion.count
                    ? `<div class="suggestion-count">${suggestion.count} results</div>`
                    : ""
                }
            </div>
        `
      )
      .join("");

    container.innerHTML = html;
    container.style.display = "block";
    this.selectedSuggestionIndex = -1;
  }

  highlightQuery(text, query) {
    // TODO: Highlight matching parts of suggestion
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  updateSuggestionSelection() {
    const suggestions = document.querySelectorAll(".suggestion-item");

    suggestions.forEach((item, index) => {
      if (index === this.selectedSuggestionIndex) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  }

  selectSuggestion(index) {
    const suggestions = document.querySelectorAll(".suggestion-item");
    const selectedSuggestion = suggestions[index];

    if (selectedSuggestion) {
      const suggestionText =
        selectedSuggestion.querySelector(".suggestion-text").textContent;
      document.getElementById("searchInput").value = suggestionText;
      this.currentQuery = suggestionText;
      this.hideSuggestions();
      this.performSearch();
    }
  }

  showSuggestions() {
    if (this.currentQuery.length >= this.searchEngine.minQueryLength) {
      document.getElementById("suggestions").style.display = "block";
    }
  }

  hideSuggestions() {
    document.getElementById("suggestions").style.display = "none";
    this.selectedSuggestionIndex = -1;
  }

  async performSearch() {
    if (this.isSearching) return;

    this.isSearching = true;
    this.showLoadingState();

    try {
      const filters = this.getFilters();
      const results = await this.searchEngine.search(this.currentQuery, {
        filters,
        maxResults: this.searchEngine.maxResults
      });

      this.displayResults(results);
      this.addToHistory(this.currentQuery, results);
    } catch (error) {
      this.displayError(error);
    } finally {
      this.isSearching = false;
      this.hideLoadingState();
    }
  }

  getFilters() {
    // TODO: Collect filter values from advanced search form
    return {
      category: document.getElementById("categoryFilter").value,
      dateFrom: document.getElementById("dateFrom").value,
      dateTo: document.getElementById("dateTo").value,
      priceMin: parseFloat(document.getElementById("priceMin").value) || null,
      priceMax: parseFloat(document.getElementById("priceMax").value) || null
    };
  }

  displayResults(results) {
    const container = document.getElementById("searchResults");

    if (results.length === 0) {
      container.innerHTML = `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>Try adjusting your search terms or filters.</p>
                    <div class="search-suggestions">
                        <h4>Suggestions:</h4>
                        <ul>
                            <li>Check your spelling</li>
                            <li>Use fewer or different keywords</li>
                            <li>Remove filters to broaden your search</li>
                        </ul>
                    </div>
                </div>
            `;
      return;
    }

    const html = `
            <div class="results-header">
                <h3>${results.length} results found</h3>
                <div class="result-actions">
                    <button onclick="this.saveCurrentSearch()">Save Search</button>
                    <button onclick="this.exportResults()">Export</button>
                </div>
            </div>
            <div class="results-list">
                ${results.map((result) => this.renderResult(result)).join("")}
            </div>
        `;

    container.innerHTML = html;
  }

  renderResult(result) {
    // TODO: Render individual search result
    return `
            <div class="search-result-item">
                <div class="result-header">
                    <h4 class="result-title">${this.highlightQuery(
                      result.title,
                      this.currentQuery
                    )}</h4>
                    <div class="result-meta">
                        <span class="result-category">${result.category}</span>
                        <span class="result-date">${new Date(
                          result.date
                        ).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="result-content">
                    <p class="result-description">${this.highlightQuery(
                      result.description,
                      this.currentQuery
                    )}</p>
                    ${
                      result.price
                        ? `<div class="result-price">$${result.price}</div>`
                        : ""
                    }
                </div>
                <div class="result-actions">
                    <button onclick="this.viewResult('${
                      result.id
                    }')">View</button>
                    <button onclick="this.shareResult('${
                      result.id
                    }')">Share</button>
                </div>
            </div>
        `;
  }

  showLoadingState() {
    document.getElementById("searchResults").innerHTML = `
            <div class="search-loading">
                <div class="loading-spinner"></div>
                <p>Searching...</p>
            </div>
        `;
  }

  hideLoadingState() {
    // Loading state will be replaced by results or error
  }

  displayError(error) {
    document.getElementById("searchResults").innerHTML = `
            <div class="search-error">
                <h3>Search failed</h3>
                <p>${error.message}</p>
                <button onclick="this.performSearch()">Try Again</button>
            </div>
        `;
  }

  toggleAdvancedSearch() {
    const advancedSearch = document.getElementById("advancedSearch");
    const isVisible = advancedSearch.style.display !== "none";
    advancedSearch.style.display = isVisible ? "none" : "block";
  }

  async saveCurrentSearch() {
    const name = prompt("Enter a name for this search:");
    if (name) {
      try {
        await this.searchEngine.saveSearch(
          this.currentQuery,
          this.getFilters(),
          name
        );
        alert("Search saved successfully!");
      } catch (error) {
        alert("Failed to save search: " + error.message);
      }
    }
  }

  addToHistory(query, results) {
    this.searchEngine.addToHistory(query, results);
  }
}

// TODO: Testing and demo
async function createSearchDemo() {
  // Create search engine with mock API
  const searchEngine = new AdvancedSearchEngine({
    apiClient: apiClient,
    debounceDelay: 300,
    minQueryLength: 2
  });

  // Create search UI
  const container = document.getElementById("searchContainer");
  const searchUI = new SearchUI(searchEngine, container);

  // Demo searches
  const demoQueries = [
    "javascript tutorials",
    "async programming",
    "web development",
    "category:programming date:2025-01-01..2025-12-31",
    '"exact phrase search"',
    "title:async OR title:promises"
  ];

  console.log("Search demo ready. Try these queries:", demoQueries);
}

// createSearchDemo();
```

### Expected Features

- Real-time autocomplete with keyboard navigation
- Advanced search syntax parsing (quotes, operators, field search)
- Debounced search with request cancellation
- Result highlighting and relevance scoring
- Search history and saved searches
- Performance optimization with caching
- Search analytics and insights
- Error handling with user-friendly messages
- Responsive UI with loading states

---

## Testing Your Solutions

For each exercise, ensure you test:

### 1. **Happy Path Testing**

- All features work as expected under normal conditions
- User interactions produce correct results
- Data flows through the system properly

### 2. **Error Scenarios**

- Network failures and timeouts
- Server errors (4xx, 5xx responses)
- Invalid user input
- Authentication failures
- Rate limiting

### 3. **Edge Cases**

- Empty datasets
- Very large files/datasets
- Concurrent operations
- Rapid user interactions
- Browser compatibility

### 4. **Performance Testing**

- Large file uploads/downloads
- Many concurrent requests
- Memory usage under load
- UI responsiveness during operations

### 5. **Offline Scenarios**

- Network disconnection
- Intermittent connectivity
- Data synchronization when back online

## Final Project Integration

Choose one exercise and extend it into a complete application:

### Option 1: File Management App

- Combine exercises 2 (API client) and 4 (file management)
- Add user authentication and permissions
- Implement file sharing and collaboration features
- Add real-time updates for shared files

### Option 2: Collaborative Document Editor

- Combine exercises 2 (API client) and 3 (data sync)
- Add exercise 5 (notifications) for collaboration alerts
- Implement real-time editing with conflict resolution
- Add document history and version control

### Option 3: Advanced Search Platform

- Combine exercises 2 (API client) and 6 (search)
- Add exercise 5 (notifications) for saved search alerts
- Implement advanced analytics and insights
- Add machine learning-powered recommendations

## Submission Requirements

1. **Complete Implementation**: All required features working
2. **Error Handling**: Comprehensive error handling and user feedback
3. **Documentation**: Clear code comments and usage examples
4. **Testing**: Demonstrate testing of various scenarios
5. **Performance**: Optimized for real-world usage
6. **UI/UX**: Polished user interface with good experience

## Resources for Implementation

### APIs for Testing

- JSONPlaceholder (https://jsonplaceholder.typicode.com/)
- HTTPBin (https://httpbin.org/)
- Mock Service Worker for offline testing

### Libraries You Might Find Useful

- For large file handling: File API, ReadableStream
- For background processing: Web Workers
- For offline support: Service Workers, IndexedDB
- For UI components: Native JavaScript or your preferred framework

Good luck building these advanced async applications! 🚀
