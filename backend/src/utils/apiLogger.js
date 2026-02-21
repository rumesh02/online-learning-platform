const fs = require('fs');
const path = require('path');

class APILogger {
  constructor() {
    this.logFile = path.join(__dirname, '../../logs/api-requests.json');
    this.ensureLogFile();
  }

  ensureLogFile() {
    const logDir = path.dirname(this.logFile);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Create log file if it doesn't exist
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, JSON.stringify({ requests: [], totalCount: 0 }, null, 2));
    }
  }

  logRequest(endpoint, userId, prompt, success = true, error = null) {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        endpoint,
        userId,
        prompt: prompt ? prompt.substring(0, 100) : null, // Store first 100 chars
        success,
        error: error ? error.message : null
      };

      data.requests.push(logEntry);
      data.totalCount = data.requests.length;

      fs.writeFileSync(this.logFile, JSON.stringify(data, null, 2));
      
      return data.totalCount;
    } catch (err) {
      console.error('Error logging API request:', err);
      return null;
    }
  }

  getRequestCount() {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      return data.totalCount || 0;
    } catch (err) {
      console.error('Error reading request count:', err);
      return 0;
    }
  }

  getRequestLogs() {
    try {
      const data = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
      return data;
    } catch (err) {
      console.error('Error reading request logs:', err);
      return { requests: [], totalCount: 0 };
    }
  }
}

module.exports = new APILogger();
