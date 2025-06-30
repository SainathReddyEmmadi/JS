# Real-world Async Patterns

## Learning Objectives

By the end of this lesson, you should be able to:

- Implement complex async workflows for real applications
- Build data synchronization and caching systems
- Create polling and real-time update mechanisms
- Handle file uploads and downloads with progress tracking
- Implement search with debouncing and cancellation
- Build robust queue systems for background tasks

## Data Synchronization Patterns

### 1. Optimistic Updates with Rollback

```javascript
class OptimisticUpdateManager {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.pendingUpdates = new Map();
    this.rollbackStack = [];
  }

  async updateWithOptimism(
    entityId,
    updates,
    updateLocalState,
    rollbackLocalState
  ) {
    const updateId = `${entityId}_${Date.now()}`;

    try {
      // 1. Apply optimistic update to UI immediately
      updateLocalState(updates);

      // 2. Store rollback information
      this.rollbackStack.push({
        updateId,
        rollback: rollbackLocalState,
        timestamp: Date.now()
      });

      // 3. Track pending update
      this.pendingUpdates.set(updateId, {
        entityId,
        updates,
        startTime: Date.now()
      });

      // 4. Send to server
      const serverResponse = await this.apiClient.patch(
        `/entities/${entityId}`,
        updates
      );

      // 5. Update with server response (may differ from optimistic update)
      if (serverResponse.data !== updates) {
        updateLocalState(serverResponse.data);
      }

      // 6. Mark as successful
      this.pendingUpdates.delete(updateId);
      this.removeFromRollbackStack(updateId);

      return serverResponse;
    } catch (error) {
      // 7. Rollback on failure
      console.warn("Optimistic update failed, rolling back:", error.message);

      const rollbackInfo = this.rollbackStack.find(
        (r) => r.updateId === updateId
      );
      if (rollbackInfo) {
        rollbackInfo.rollback();
        this.removeFromRollbackStack(updateId);
      }

      this.pendingUpdates.delete(updateId);
      throw error;
    }
  }

  removeFromRollbackStack(updateId) {
    this.rollbackStack = this.rollbackStack.filter(
      (r) => r.updateId !== updateId
    );
  }

  getPendingUpdates() {
    return Array.from(this.pendingUpdates.values());
  }

  hasPendingUpdates() {
    return this.pendingUpdates.size > 0;
  }
}

// Usage example: Todo list with optimistic updates
class TodoManager {
  constructor(apiClient) {
    this.todos = new Map();
    this.optimisticUpdater = new OptimisticUpdateManager(apiClient);
    this.listeners = new Set();
  }

  async toggleTodo(todoId) {
    const todo = this.todos.get(todoId);
    if (!todo) return;

    const originalCompleted = todo.completed;
    const newCompleted = !originalCompleted;

    try {
      await this.optimisticUpdater.updateWithOptimism(
        todoId,
        { completed: newCompleted },
        // Optimistic update
        (updates) => {
          todo.completed = updates.completed;
          this.notifyListeners();
        },
        // Rollback function
        () => {
          todo.completed = originalCompleted;
          this.notifyListeners();
        }
      );
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      // UI already rolled back by optimistic updater
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback([...this.todos.values()]));
  }
}
```

### 2. Conflict Resolution

```javascript
class ConflictResolver {
  constructor() {
    this.strategies = new Map();
    this.setupDefaultStrategies();
  }

  setupDefaultStrategies() {
    // Server wins strategy
    this.strategies.set("server-wins", (local, server) => server);

    // Client wins strategy
    this.strategies.set("client-wins", (local, server) => local);

    // Last modified wins
    this.strategies.set("last-modified-wins", (local, server) => {
      return new Date(local.lastModified) > new Date(server.lastModified)
        ? local
        : server;
    });

    // Merge strategy for objects
    this.strategies.set("merge", (local, server) => {
      return { ...server, ...local };
    });

    // Custom field-level resolution
    this.strategies.set("field-level", (local, server, fieldRules = {}) => {
      const result = { ...server };

      for (const [field, rule] of Object.entries(fieldRules)) {
        if (field in local) {
          switch (rule) {
            case "prefer-local":
              result[field] = local[field];
              break;
            case "prefer-server":
              result[field] = server[field];
              break;
            case "merge-arrays":
              if (Array.isArray(local[field]) && Array.isArray(server[field])) {
                result[field] = [
                  ...new Set([...server[field], ...local[field]])
                ];
              }
              break;
          }
        }
      }

      return result;
    });
  }

  async resolveConflict(
    localData,
    serverData,
    strategy = "server-wins",
    options = {}
  ) {
    const resolver = this.strategies.get(strategy);

    if (!resolver) {
      throw new Error(`Unknown conflict resolution strategy: ${strategy}`);
    }

    try {
      return resolver(localData, serverData, options);
    } catch (error) {
      console.error("Conflict resolution failed:", error);
      // Fallback to server data
      return serverData;
    }
  }

  addStrategy(name, resolverFunction) {
    this.strategies.set(name, resolverFunction);
  }
}

// Usage in a document sync system
class DocumentSyncer {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.conflictResolver = new ConflictResolver();
    this.localDocuments = new Map();
    this.lastSyncTimestamp = 0;
  }

  async syncDocument(documentId) {
    try {
      // Get local version
      const localDoc = this.localDocuments.get(documentId);

      // Get server version
      const serverResponse = await this.apiClient.get(
        `/documents/${documentId}`
      );
      const serverDoc = serverResponse.data;

      // Check for conflicts
      if (localDoc && localDoc.lastModified !== serverDoc.lastModified) {
        console.log("Conflict detected, resolving...");

        const resolvedDoc = await this.conflictResolver.resolveConflict(
          localDoc,
          serverDoc,
          "field-level",
          {
            title: "prefer-local", // User's title edits take priority
            content: "prefer-local", // User's content edits take priority
            tags: "merge-arrays", // Merge tag arrays
            collaborators: "prefer-server" // Server manages collaborators
          }
        );

        // Update server with resolved version
        const updateResponse = await this.apiClient.put(
          `/documents/${documentId}`,
          resolvedDoc
        );

        this.localDocuments.set(documentId, updateResponse.data);
      } else {
        // No conflict, use server version
        this.localDocuments.set(documentId, serverDoc);
      }
    } catch (error) {
      console.error("Document sync failed:", error);
      throw error;
    }
  }
}
```

## Polling and Real-time Updates

### 1. Smart Polling with Backoff

```javascript
class SmartPoller {
  constructor(options = {}) {
    this.pollFunction = options.pollFunction;
    this.interval = options.interval || 5000;
    this.maxInterval = options.maxInterval || 60000;
    this.backoffMultiplier = options.backoffMultiplier || 1.5;
    this.maxConsecutiveErrors = options.maxConsecutiveErrors || 5;

    this.currentInterval = this.interval;
    this.consecutiveErrors = 0;
    this.isPolling = false;
    this.timeoutId = null;
    this.lastSuccessTime = null;
    this.listeners = new Set();
  }

  start() {
    if (this.isPolling) return;

    this.isPolling = true;
    this.consecutiveErrors = 0;
    this.currentInterval = this.interval;
    this.scheduleNextPoll();

    console.log("Smart polling started");
  }

  stop() {
    if (!this.isPolling) return;

    this.isPolling = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    console.log("Smart polling stopped");
  }

  async poll() {
    if (!this.isPolling) return;

    try {
      console.log(`Polling... (interval: ${this.currentInterval}ms)`);
      const result = await this.pollFunction();

      // Success - reset error count and interval
      this.consecutiveErrors = 0;
      this.currentInterval = this.interval;
      this.lastSuccessTime = Date.now();

      // Notify listeners
      this.notifyListeners("data", result);
    } catch (error) {
      this.handlePollError(error);
    }

    // Schedule next poll
    if (this.isPolling) {
      this.scheduleNextPoll();
    }
  }

  handlePollError(error) {
    this.consecutiveErrors++;
    console.warn(
      `Poll failed (${this.consecutiveErrors}/${this.maxConsecutiveErrors}):`,
      error.message
    );

    if (this.consecutiveErrors >= this.maxConsecutiveErrors) {
      console.error("Max consecutive errors reached, stopping polling");
      this.stop();
      this.notifyListeners("error", error);
      return;
    }

    // Increase interval with backoff
    this.currentInterval = Math.min(
      this.currentInterval * this.backoffMultiplier,
      this.maxInterval
    );

    this.notifyListeners("error", error);
  }

  scheduleNextPoll() {
    this.timeoutId = setTimeout(() => {
      this.poll();
    }, this.currentInterval);
  }

  // Adaptive polling based on data freshness
  adjustIntervalBasedOnActivity(lastDataChange) {
    const timeSinceChange = Date.now() - lastDataChange;

    if (timeSinceChange < 60000) {
      // Recent activity (< 1 min)
      this.currentInterval = Math.max(this.interval, 2000);
    } else if (timeSinceChange < 300000) {
      // Some activity (< 5 min)
      this.currentInterval = this.interval;
    } else {
      // Low activity
      this.currentInterval = Math.min(this.interval * 2, this.maxInterval);
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (error) {
        console.error("Listener error:", error);
      }
    });
  }

  getStatus() {
    return {
      isPolling: this.isPolling,
      currentInterval: this.currentInterval,
      consecutiveErrors: this.consecutiveErrors,
      lastSuccessTime: this.lastSuccessTime
    };
  }
}

// Usage: Real-time notifications
class NotificationPoller {
  constructor(apiClient, userId) {
    this.apiClient = apiClient;
    this.userId = userId;
    this.lastNotificationId = null;
    this.notifications = [];

    this.poller = new SmartPoller({
      pollFunction: () => this.fetchNotifications(),
      interval: 10000, // 10 seconds
      maxInterval: 120000, // 2 minutes max
      maxConsecutiveErrors: 3
    });

    this.poller.addListener((type, data) => {
      if (type === "data") {
        this.handleNewNotifications(data);
      } else if (type === "error") {
        console.error("Notification polling error:", data);
      }
    });
  }

  async fetchNotifications() {
    const params = this.lastNotificationId
      ? { since: this.lastNotificationId }
      : { limit: 20 };

    const response = await this.apiClient.get(
      `/users/${this.userId}/notifications`,
      params
    );
    return response.data;
  }

  handleNewNotifications(newNotifications) {
    if (newNotifications.length > 0) {
      this.notifications = [...newNotifications, ...this.notifications];
      this.lastNotificationId = newNotifications[0].id;

      // Adjust polling frequency based on activity
      this.poller.adjustIntervalBasedOnActivity(Date.now());

      // Show notifications to user
      newNotifications.forEach((notification) => {
        this.showNotification(notification);
      });
    }
  }

  showNotification(notification) {
    console.log("New notification:", notification.message);
    // Implement UI notification display
  }

  start() {
    this.poller.start();
  }

  stop() {
    this.poller.stop();
  }
}
```

### 2. WebSocket with Fallback to Polling

```javascript
class RealtimeConnection {
  constructor(options = {}) {
    this.wsUrl = options.wsUrl;
    this.pollUrl = options.pollUrl;
    this.pollFunction = options.pollFunction;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectDelay = options.reconnectDelay || 1000;

    this.ws = null;
    this.poller = null;
    this.mode = "disconnected"; // 'websocket', 'polling', 'disconnected'
    this.reconnectAttempts = 0;
    this.listeners = new Set();
    this.isConnecting = false;
  }

  async connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      await this.tryWebSocket();
    } catch (error) {
      console.warn(
        "WebSocket connection failed, falling back to polling:",
        error.message
      );
      this.fallbackToPolling();
    } finally {
      this.isConnecting = false;
    }
  }

  async tryWebSocket() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);

        const connectTimeout = setTimeout(() => {
          this.ws.close();
          reject(new Error("WebSocket connection timeout"));
        }, 5000);

        this.ws.onopen = () => {
          clearTimeout(connectTimeout);
          this.mode = "websocket";
          this.reconnectAttempts = 0;
          console.log("WebSocket connected");
          this.notifyListeners("connected", { mode: "websocket" });
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.notifyListeners("data", data);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectTimeout);
          this.handleWebSocketClose(event);
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectTimeout);
          console.error("WebSocket error:", error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  handleWebSocketClose(event) {
    console.log("WebSocket closed:", event.code, event.reason);
    this.ws = null;

    if (this.mode === "websocket") {
      this.mode = "disconnected";
      this.notifyListeners("disconnected", { reason: event.reason });

      // Try to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      } else {
        console.log("Max reconnect attempts reached, falling back to polling");
        this.fallbackToPolling();
      }
    }
  }

  scheduleReconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      this.tryWebSocket().catch(() => {
        this.scheduleReconnect();
      });
    }, delay);
  }

  fallbackToPolling() {
    if (this.mode === "polling") return;

    this.mode = "polling";
    this.poller = new SmartPoller({
      pollFunction: this.pollFunction,
      interval: 5000,
      maxInterval: 30000
    });

    this.poller.addListener((type, data) => {
      this.notifyListeners(type, data);
    });

    this.poller.start();
    this.notifyListeners("connected", { mode: "polling" });
    console.log("Fallback to polling mode");
  }

  send(data) {
    if (
      this.mode === "websocket" &&
      this.ws &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  disconnect() {
    this.mode = "disconnected";

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.poller) {
      this.poller.stop();
      this.poller = null;
    }

    this.notifyListeners("disconnected", { intentional: true });
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (error) {
        console.error("Listener error:", error);
      }
    });
  }

  getStatus() {
    return {
      mode: this.mode,
      reconnectAttempts: this.reconnectAttempts,
      isConnecting: this.isConnecting
    };
  }
}

// Usage: Chat application
class ChatConnection {
  constructor(userId, apiClient) {
    this.userId = userId;
    this.apiClient = apiClient;
    this.messages = [];

    this.connection = new RealtimeConnection({
      wsUrl: `wss://api.example.com/chat/${userId}`,
      pollFunction: () => this.pollMessages()
    });

    this.connection.addListener((type, data) => {
      this.handleConnectionEvent(type, data);
    });
  }

  async pollMessages() {
    const lastMessageId = this.messages.length > 0 ? this.messages[0].id : null;
    const params = lastMessageId ? { since: lastMessageId } : { limit: 50 };

    const response = await this.apiClient.get("/chat/messages", params);
    return response.data;
  }

  handleConnectionEvent(type, data) {
    switch (type) {
      case "connected":
        console.log(`Chat connected via ${data.mode}`);
        break;

      case "data":
        if (Array.isArray(data)) {
          // Polling data
          this.handleNewMessages(data);
        } else if (data.type === "message") {
          // WebSocket message
          this.handleNewMessages([data.payload]);
        }
        break;

      case "disconnected":
        console.log("Chat disconnected");
        break;
    }
  }

  handleNewMessages(newMessages) {
    if (newMessages.length > 0) {
      this.messages = [...newMessages, ...this.messages];
      this.onNewMessages(newMessages);
    }
  }

  async sendMessage(text) {
    const message = {
      id: Date.now().toString(),
      text,
      userId: this.userId,
      timestamp: new Date().toISOString()
    };

    // Try WebSocket first
    if (!this.connection.send({ type: "message", payload: message })) {
      // Fall back to HTTP API
      try {
        await this.apiClient.post("/chat/messages", message);
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    }

    // Optimistically add to local messages
    this.messages.unshift(message);
    this.onNewMessages([message]);
  }

  onNewMessages(messages) {
    // Override this method to handle new messages in UI
    console.log("New messages:", messages);
  }

  connect() {
    this.connection.connect();
  }

  disconnect() {
    this.connection.disconnect();
  }
}
```

## File Upload and Download

### 1. Chunked Upload with Progress

```javascript
class ChunkedUploader {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1024 * 1024; // 1MB default
    this.maxConcurrentChunks = options.maxConcurrentChunks || 3;
    this.maxRetries = options.maxRetries || 3;
    this.apiClient = options.apiClient;
  }

  async uploadFile(file, options = {}) {
    const uploadId = options.uploadId || this.generateUploadId();
    const chunks = this.createChunks(file);
    const totalChunks = chunks.length;

    console.log(
      `Starting chunked upload: ${file.name} (${totalChunks} chunks)`
    );

    try {
      // Initialize upload session
      await this.initializeUpload(uploadId, file, totalChunks);

      // Upload chunks with concurrency control
      const results = await this.uploadChunksWithConcurrency(
        uploadId,
        chunks,
        options.onProgress
      );

      // Finalize upload
      const finalResult = await this.finalizeUpload(uploadId, file);

      console.log("Upload completed successfully");
      return finalResult;
    } catch (error) {
      console.error("Upload failed:", error);
      await this.cleanupUpload(uploadId);
      throw error;
    }
  }

  createChunks(file) {
    const chunks = [];
    let offset = 0;
    let chunkIndex = 0;

    while (offset < file.size) {
      const chunkSize = Math.min(this.chunkSize, file.size - offset);
      const chunk = file.slice(offset, offset + chunkSize);

      chunks.push({
        index: chunkIndex,
        data: chunk,
        size: chunkSize,
        offset,
        retries: 0
      });

      offset += chunkSize;
      chunkIndex++;
    }

    return chunks;
  }

  async initializeUpload(uploadId, file, totalChunks) {
    const response = await this.apiClient.post("/uploads/initialize", {
      uploadId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      totalChunks
    });

    return response.data;
  }

  async uploadChunksWithConcurrency(uploadId, chunks, onProgress) {
    const results = new Array(chunks.length);
    const activeUploads = new Set();
    let completedChunks = 0;
    let uploadedBytes = 0;

    const uploadChunk = async (chunk) => {
      try {
        const result = await this.uploadSingleChunk(uploadId, chunk);
        results[chunk.index] = result;
        completedChunks++;
        uploadedBytes += chunk.size;

        if (onProgress) {
          onProgress({
            uploadedBytes,
            totalBytes: chunks.reduce((sum, c) => sum + c.size, 0),
            completedChunks,
            totalChunks: chunks.length,
            percentage: Math.round((completedChunks / chunks.length) * 100)
          });
        }

        return result;
      } catch (error) {
        if (chunk.retries < this.maxRetries) {
          chunk.retries++;
          console.log(
            `Retrying chunk ${chunk.index} (attempt ${chunk.retries})`
          );
          return uploadChunk(chunk);
        }
        throw error;
      }
    };

    // Process chunks with concurrency limit
    let chunkIndex = 0;

    while (chunkIndex < chunks.length || activeUploads.size > 0) {
      // Start new uploads up to concurrency limit
      while (
        activeUploads.size < this.maxConcurrentChunks &&
        chunkIndex < chunks.length
      ) {
        const chunk = chunks[chunkIndex++];
        const uploadPromise = uploadChunk(chunk);

        activeUploads.add(uploadPromise);

        uploadPromise.finally(() => {
          activeUploads.delete(uploadPromise);
        });
      }

      // Wait for at least one upload to complete
      if (activeUploads.size > 0) {
        await Promise.race(activeUploads);
      }
    }

    return results;
  }

  async uploadSingleChunk(uploadId, chunk) {
    const formData = new FormData();
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", chunk.index.toString());
    formData.append("chunkData", chunk.data);

    const response = await fetch("/uploads/chunk", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Chunk upload failed: HTTP ${response.status}`);
    }

    return response.json();
  }

  async finalizeUpload(uploadId, file) {
    const response = await this.apiClient.post("/uploads/finalize", {
      uploadId,
      fileName: file.name
    });

    return response.data;
  }

  async cleanupUpload(uploadId) {
    try {
      await this.apiClient.delete(`/uploads/${uploadId}`);
    } catch (error) {
      console.warn("Failed to cleanup upload:", error);
    }
  }

  generateUploadId() {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage example
const uploader = new ChunkedUploader({
  chunkSize: 2 * 1024 * 1024, // 2MB chunks
  maxConcurrentChunks: 3,
  apiClient: apiClient
});

async function handleFileUpload(file) {
  const progressBar = document.getElementById("progress");
  const statusDiv = document.getElementById("status");

  try {
    const result = await uploader.uploadFile(file, {
      onProgress: (progress) => {
        progressBar.value = progress.percentage;
        statusDiv.textContent = `Uploading... ${progress.percentage}% (${progress.completedChunks}/${progress.totalChunks} chunks)`;
      }
    });

    statusDiv.textContent = "Upload completed successfully!";
    console.log("File uploaded:", result);
  } catch (error) {
    statusDiv.textContent = `Upload failed: ${error.message}`;
    console.error("Upload error:", error);
  }
}
```

### 2. Download with Resume Support

```javascript
class ResumableDownloader {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 1024 * 1024; // 1MB
    this.maxConcurrentChunks = options.maxConcurrentChunks || 4;
    this.maxRetries = options.maxRetries || 3;
  }

  async downloadFile(url, options = {}) {
    try {
      // Get file info
      const fileInfo = await this.getFileInfo(url);
      const supportsRangeRequests = fileInfo.acceptsRanges;

      if (!supportsRangeRequests || fileInfo.size < this.chunkSize) {
        // Download as single file
        return this.downloadSingleFile(url, fileInfo, options.onProgress);
      }

      // Download in chunks
      return this.downloadInChunks(url, fileInfo, options.onProgress);
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  }

  async getFileInfo(url) {
    const response = await fetch(url, { method: "HEAD" });

    if (!response.ok) {
      throw new Error(`Failed to get file info: HTTP ${response.status}`);
    }

    return {
      size: parseInt(response.headers.get("content-length") || "0"),
      acceptsRanges: response.headers.get("accept-ranges") === "bytes",
      mimeType: response.headers.get("content-type"),
      lastModified: response.headers.get("last-modified")
    };
  }

  async downloadSingleFile(url, fileInfo, onProgress) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Download failed: HTTP ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is not available");
    }

    const reader = response.body.getReader();
    const chunks = [];
    let downloadedBytes = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      downloadedBytes += value.length;

      if (onProgress) {
        onProgress({
          downloadedBytes,
          totalBytes: fileInfo.size,
          percentage: Math.round((downloadedBytes / fileInfo.size) * 100)
        });
      }
    }

    // Combine chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  }

  async downloadInChunks(url, fileInfo, onProgress) {
    const chunks = this.createDownloadChunks(fileInfo.size);
    const results = new Array(chunks.length);
    const activeDownloads = new Set();
    let completedChunks = 0;
    let downloadedBytes = 0;

    const downloadChunk = async (chunk) => {
      try {
        const data = await this.downloadSingleChunk(url, chunk);
        results[chunk.index] = data;
        completedChunks++;
        downloadedBytes += data.length;

        if (onProgress) {
          onProgress({
            downloadedBytes,
            totalBytes: fileInfo.size,
            completedChunks,
            totalChunks: chunks.length,
            percentage: Math.round((downloadedBytes / fileInfo.size) * 100)
          });
        }

        return data;
      } catch (error) {
        if (chunk.retries < this.maxRetries) {
          chunk.retries++;
          console.log(
            `Retrying chunk ${chunk.index} (attempt ${chunk.retries})`
          );
          return downloadChunk(chunk);
        }
        throw error;
      }
    };

    // Download chunks with concurrency control
    let chunkIndex = 0;

    while (chunkIndex < chunks.length || activeDownloads.size > 0) {
      // Start new downloads up to concurrency limit
      while (
        activeDownloads.size < this.maxConcurrentChunks &&
        chunkIndex < chunks.length
      ) {
        const chunk = chunks[chunkIndex++];
        const downloadPromise = downloadChunk(chunk);

        activeDownloads.add(downloadPromise);

        downloadPromise.finally(() => {
          activeDownloads.delete(downloadPromise);
        });
      }

      // Wait for at least one download to complete
      if (activeDownloads.size > 0) {
        await Promise.race(activeDownloads);
      }
    }

    // Combine chunks
    const totalLength = results.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of results) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  }

  createDownloadChunks(fileSize) {
    const chunks = [];
    let offset = 0;
    let chunkIndex = 0;

    while (offset < fileSize) {
      const chunkSize = Math.min(this.chunkSize, fileSize - offset);

      chunks.push({
        index: chunkIndex,
        start: offset,
        end: offset + chunkSize - 1,
        size: chunkSize,
        retries: 0
      });

      offset += chunkSize;
      chunkIndex++;
    }

    return chunks;
  }

  async downloadSingleChunk(url, chunk) {
    const response = await fetch(url, {
      headers: {
        Range: `bytes=${chunk.start}-${chunk.end}`
      }
    });

    if (!response.ok) {
      throw new Error(`Chunk download failed: HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }
}

// Usage
const downloader = new ResumableDownloader({
  chunkSize: 1024 * 1024, // 1MB chunks
  maxConcurrentChunks: 4
});

async function downloadLargeFile(url, filename) {
  const progressBar = document.getElementById("downloadProgress");
  const statusDiv = document.getElementById("downloadStatus");

  try {
    const data = await downloader.downloadFile(url, {
      onProgress: (progress) => {
        progressBar.value = progress.percentage;
        statusDiv.textContent = `Downloading... ${progress.percentage}%`;
      }
    });

    // Create download link
    const blob = new Blob([data]);
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(downloadUrl);
    statusDiv.textContent = "Download completed!";
  } catch (error) {
    statusDiv.textContent = `Download failed: ${error.message}`;
    console.error("Download error:", error);
  }
}
```

## Search with Debouncing and Cancellation

### 1. Smart Search Manager

```javascript
class SmartSearchManager {
  constructor(options = {}) {
    this.searchFunction = options.searchFunction;
    this.debounceDelay = options.debounceDelay || 300;
    this.minQueryLength = options.minQueryLength || 2;
    this.maxResults = options.maxResults || 50;
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes

    this.cache = new Map();
    this.activeSearches = new Map();
    this.debounceTimer = null;
    this.searchHistory = [];
    this.listeners = new Set();
  }

  async search(query, options = {}) {
    // Normalize query
    const normalizedQuery = query.trim().toLowerCase();

    // Check minimum length
    if (normalizedQuery.length < this.minQueryLength) {
      this.notifyListeners("queryTooShort", { query: normalizedQuery });
      return [];
    }

    // Clear previous debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Cancel previous searches for this query
    this.cancelSearch(normalizedQuery);

    // Check cache first
    const cached = this.getCachedResults(normalizedQuery);
    if (cached && !options.skipCache) {
      this.notifyListeners("cacheHit", {
        query: normalizedQuery,
        results: cached
      });
      return cached;
    }

    // Debounce the search
    return new Promise((resolve, reject) => {
      this.debounceTimer = setTimeout(async () => {
        try {
          const results = await this.executeSearch(normalizedQuery, options);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      }, this.debounceDelay);
    });
  }

  async executeSearch(query, options = {}) {
    const searchId = `${query}_${Date.now()}`;

    try {
      // Create cancellable search
      const controller = new AbortController();
      this.activeSearches.set(query, { searchId, controller });

      this.notifyListeners("searchStart", { query, searchId });

      // Execute search with timeout
      const searchPromise = this.searchFunction(query, {
        ...options,
        signal: controller.signal,
        maxResults: this.maxResults
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          controller.abort();
          reject(new Error("Search timeout"));
        }, 10000); // 10 second timeout
      });

      const results = await Promise.race([searchPromise, timeoutPromise]);

      // Cache results
      this.cacheResults(query, results);

      // Add to search history
      this.addToHistory(query, results.length);

      // Clean up
      this.activeSearches.delete(query);

      this.notifyListeners("searchComplete", {
        query,
        searchId,
        results,
        fromCache: false
      });

      return results;
    } catch (error) {
      this.activeSearches.delete(query);

      if (error.name === "AbortError") {
        this.notifyListeners("searchCancelled", { query, searchId });
        return [];
      }

      this.notifyListeners("searchError", { query, searchId, error });
      throw error;
    }
  }

  cancelSearch(query) {
    const activeSearch = this.activeSearches.get(query);
    if (activeSearch) {
      activeSearch.controller.abort();
      this.activeSearches.delete(query);
    }
  }

  cancelAllSearches() {
    for (const [query] of this.activeSearches) {
      this.cancelSearch(query);
    }
  }

  getCachedResults(query) {
    const cached = this.cache.get(query);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;
    if (isExpired) {
      this.cache.delete(query);
      return null;
    }

    return cached.results;
  }

  cacheResults(query, results) {
    this.cache.set(query, {
      results,
      timestamp: Date.now()
    });

    // Limit cache size
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  addToHistory(query, resultCount) {
    this.searchHistory.unshift({
      query,
      resultCount,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.searchHistory.length > 50) {
      this.searchHistory.pop();
    }
  }

  getSearchSuggestions(currentQuery) {
    // Get suggestions from search history
    const suggestions = this.searchHistory
      .filter(
        (entry) =>
          entry.query.includes(currentQuery.toLowerCase()) &&
          entry.query !== currentQuery.toLowerCase()
      )
      .slice(0, 5)
      .map((entry) => entry.query);

    return [...new Set(suggestions)]; // Remove duplicates
  }

  clearCache() {
    this.cache.clear();
  }

  clearHistory() {
    this.searchHistory = [];
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (error) {
        console.error("Search listener error:", error);
      }
    });
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      historySize: this.searchHistory.length,
      activeSearches: this.activeSearches.size
    };
  }
}

// Usage: Product search
class ProductSearchUI {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.searchManager = new SmartSearchManager({
      searchFunction: (query, options) => this.searchProducts(query, options),
      debounceDelay: 300,
      minQueryLength: 2
    });

    this.setupEventListeners();
  }

  async searchProducts(query, options = {}) {
    const response = await this.apiClient.get("/products/search", {
      q: query,
      limit: options.maxResults || 20,
      signal: options.signal
    });

    return response.data;
  }

  setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const loadingIndicator = document.getElementById("loading");

    // Search manager events
    this.searchManager.addListener((type, data) => {
      switch (type) {
        case "searchStart":
          loadingIndicator.style.display = "block";
          break;

        case "searchComplete":
          loadingIndicator.style.display = "none";
          this.displayResults(data.results, data.fromCache);
          break;

        case "searchError":
          loadingIndicator.style.display = "none";
          this.displayError(data.error);
          break;

        case "searchCancelled":
          loadingIndicator.style.display = "none";
          break;

        case "cacheHit":
          this.displayResults(data.results, true);
          break;

        case "queryTooShort":
          searchResults.innerHTML = "<p>Please enter at least 2 characters</p>";
          break;
      }
    });

    // Input events
    searchInput.addEventListener("input", async (event) => {
      const query = event.target.value;

      if (query.trim() === "") {
        searchResults.innerHTML = "";
        return;
      }

      try {
        await this.searchManager.search(query);
      } catch (error) {
        console.error("Search failed:", error);
      }
    });

    // Show suggestions on focus
    searchInput.addEventListener("focus", () => {
      const suggestions = this.searchManager.getSearchSuggestions(
        searchInput.value
      );
      this.displaySuggestions(suggestions);
    });
  }

  displayResults(results, fromCache = false) {
    const searchResults = document.getElementById("searchResults");

    if (results.length === 0) {
      searchResults.innerHTML = "<p>No products found</p>";
      return;
    }

    const html = results
      .map(
        (product) => `
            <div class="search-result">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="price">$${product.price}</span>
                ${
                  fromCache ? '<span class="cache-indicator">cached</span>' : ""
                }
            </div>
        `
      )
      .join("");

    searchResults.innerHTML = html;
  }

  displaySuggestions(suggestions) {
    if (suggestions.length === 0) return;

    const suggestionHtml = suggestions
      .map(
        (suggestion) => `
            <div class="suggestion" onclick="this.selectSuggestion('${suggestion}')">
                ${suggestion}
            </div>
        `
      )
      .join("");

    // Show suggestions dropdown
    console.log("Suggestions:", suggestions);
  }

  displayError(error) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = `<p class="error">Search failed: ${error.message}</p>`;
  }

  selectSuggestion(suggestion) {
    const searchInput = document.getElementById("searchInput");
    searchInput.value = suggestion;
    this.searchManager.search(suggestion);
  }
}
```

## Background Task Queue

### 1. Task Queue with Priorities

```javascript
class TaskQueue {
  constructor(options = {}) {
    this.maxConcurrency = options.maxConcurrency || 3;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;

    this.queues = {
      high: [],
      medium: [],
      low: []
    };

    this.activeTasks = new Set();
    this.completedTasks = new Map();
    this.failedTasks = new Map();
    this.isProcessing = false;
    this.listeners = new Set();
  }

  addTask(taskFunction, options = {}) {
    const task = {
      id: options.id || this.generateTaskId(),
      function: taskFunction,
      priority: options.priority || "medium",
      retries: 0,
      maxRetries: options.maxRetries || this.maxRetries,
      retryDelay: options.retryDelay || this.retryDelay,
      timeout: options.timeout || 30000,
      metadata: options.metadata || {},
      createdAt: Date.now()
    };

    this.queues[task.priority].push(task);
    this.notifyListeners("taskAdded", task);

    if (!this.isProcessing) {
      this.startProcessing();
    }

    return task.id;
  }

  async startProcessing() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.notifyListeners("processingStarted", {});

    while (this.hasTasksToProcess() || this.activeTasks.size > 0) {
      // Start new tasks up to concurrency limit
      while (
        this.activeTasks.size < this.maxConcurrency &&
        this.hasTasksToProcess()
      ) {
        const task = this.getNextTask();
        if (task) {
          this.executeTask(task);
        }
      }

      // Wait for at least one task to complete
      if (this.activeTasks.size > 0) {
        await Promise.race(this.activeTasks);
      }
    }

    this.isProcessing = false;
    this.notifyListeners("processingCompleted", {});
  }

  hasTasksToProcess() {
    return (
      this.queues.high.length > 0 ||
      this.queues.medium.length > 0 ||
      this.queues.low.length > 0
    );
  }

  getNextTask() {
    // Process by priority: high -> medium -> low
    if (this.queues.high.length > 0) {
      return this.queues.high.shift();
    }
    if (this.queues.medium.length > 0) {
      return this.queues.medium.shift();
    }
    if (this.queues.low.length > 0) {
      return this.queues.low.shift();
    }
    return null;
  }

  async executeTask(task) {
    const taskPromise = this.runTaskWithTimeout(task);
    this.activeTasks.add(taskPromise);

    taskPromise.finally(() => {
      this.activeTasks.delete(taskPromise);
    });

    try {
      this.notifyListeners("taskStarted", task);

      const result = await taskPromise;

      this.completedTasks.set(task.id, {
        task,
        result,
        completedAt: Date.now()
      });

      this.notifyListeners("taskCompleted", { task, result });
    } catch (error) {
      await this.handleTaskFailure(task, error);
    }
  }

  async runTaskWithTimeout(task) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), task.timeout);

    try {
      const result = await task.function({
        signal: controller.signal,
        taskId: task.id,
        metadata: task.metadata
      });

      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async handleTaskFailure(task, error) {
    task.retries++;

    this.notifyListeners("taskFailed", {
      task,
      error,
      willRetry: task.retries < task.maxRetries
    });

    if (task.retries < task.maxRetries) {
      // Retry with delay
      setTimeout(() => {
        this.queues[task.priority].unshift(task); // Add back to front of queue
      }, task.retryDelay * Math.pow(2, task.retries - 1)); // Exponential backoff
    } else {
      // Max retries reached
      this.failedTasks.set(task.id, {
        task,
        error,
        failedAt: Date.now()
      });

      this.notifyListeners("taskMaxRetriesReached", { task, error });
    }
  }

  pauseProcessing() {
    this.isProcessing = false;
    this.notifyListeners("processingPaused", {});
  }

  resumeProcessing() {
    if (!this.isProcessing && this.hasTasksToProcess()) {
      this.startProcessing();
    }
  }

  cancelTask(taskId) {
    // Remove from queues
    for (const priority of ["high", "medium", "low"]) {
      this.queues[priority] = this.queues[priority].filter(
        (task) => task.id !== taskId
      );
    }

    // Cancel if currently running (would need to implement cancellation in task functions)
    this.notifyListeners("taskCancelled", { taskId });

    return true;
  }

  getStatus() {
    return {
      queued: {
        high: this.queues.high.length,
        medium: this.queues.medium.length,
        low: this.queues.low.length,
        total:
          this.queues.high.length +
          this.queues.medium.length +
          this.queues.low.length
      },
      active: this.activeTasks.size,
      completed: this.completedTasks.size,
      failed: this.failedTasks.size,
      isProcessing: this.isProcessing
    };
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(type, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(type, data);
      } catch (error) {
        console.error("Task queue listener error:", error);
      }
    });
  }
}

// Usage: Background email sending
class EmailQueue {
  constructor(emailService) {
    this.emailService = emailService;
    this.taskQueue = new TaskQueue({
      maxConcurrency: 2, // Send 2 emails at a time
      maxRetries: 3
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.taskQueue.addListener((type, data) => {
      switch (type) {
        case "taskCompleted":
          console.log(`Email sent successfully: ${data.task.metadata.to}`);
          break;

        case "taskMaxRetriesReached":
          console.error(
            `Failed to send email after retries: ${data.task.metadata.to}`
          );
          this.handleEmailFailure(data.task, data.error);
          break;

        case "processingCompleted":
          console.log("All emails processed");
          break;
      }
    });
  }

  sendEmail(to, subject, body, options = {}) {
    const taskId = this.taskQueue.addTask(
      async (taskContext) => {
        return this.emailService.send({
          to,
          subject,
          body,
          signal: taskContext.signal
        });
      },
      {
        priority: options.priority || "medium",
        timeout: 30000,
        metadata: { to, subject, type: "email" }
      }
    );

    return taskId;
  }

  sendBulkEmails(emails, priority = "low") {
    const taskIds = emails.map((email) =>
      this.sendEmail(email.to, email.subject, email.body, { priority })
    );

    return taskIds;
  }

  handleEmailFailure(task, error) {
    // Log to error tracking service
    console.error("Email delivery failed permanently:", {
      to: task.metadata.to,
      subject: task.metadata.subject,
      error: error.message
    });

    // Could implement dead letter queue, notification to admin, etc.
  }

  getQueueStatus() {
    return this.taskQueue.getStatus();
  }
}
```

## Summary

Real-world async patterns provide the foundation for building robust, scalable applications. Key takeaways:

1. **Data Synchronization**: Implement optimistic updates with rollback and conflict resolution
2. **Real-time Updates**: Use smart polling with WebSocket fallbacks
3. **File Operations**: Handle large files with chunking, progress tracking, and resume capability
4. **Search**: Implement debouncing, caching, and cancellation for responsive UIs
5. **Background Tasks**: Use priority queues with concurrency control and retry logic

These patterns address common challenges in modern web applications and provide excellent user experiences even under difficult conditions.

## Next Steps

With a solid understanding of async patterns, you're ready to tackle complex real-world scenarios and build production-ready applications. Consider exploring:

- State management patterns for complex UIs
- Testing strategies for async code
- Performance optimization for async operations
- Advanced error monitoring and observability
