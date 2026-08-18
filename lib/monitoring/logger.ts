// ============================================================
// 📊 SYSTÈME DE MONITORING
// ============================================================

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private service: string;
  private sessionId: string;

  constructor(service: string) {
    this.service = service;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private log(level: LogLevel, message: string, data?: any, userId?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      data,
      userId,
      sessionId: this.sessionId,
    };

    // Console (développement)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, data || '');
    }

    // Envoyer vers Vercel Analytics (production)
    if (process.env.NODE_ENV === 'production') {
      try {
        // Log via fetch vers Vercel
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        }).catch(() => {});
      } catch {
        // Silently fail
      }
    }

    // Notification pour les erreurs critiques
    if (level === 'error') {
      this.notifyError(entry);
    }
  }

  private notifyError(entry: LogEntry) {
    // Envoyer une notification Slack ou email
    console.error('🚨 ERREUR CRITIQUE:', entry.message);
  }

  info(message: string, data?: any, userId?: string) {
    this.log('info', message, data, userId);
  }

  warn(message: string, data?: any, userId?: string) {
    this.log('warn', message, data, userId);
  }

  error(message: string, data?: any, userId?: string) {
    this.log('error', message, data, userId);
  }

  debug(message: string, data?: any, userId?: string) {
    if (process.env.DEBUG === 'true') {
      this.log('debug', message, data, userId);
    }
  }
}

export function createLogger(service: string) {
  return new Logger(service);
}
