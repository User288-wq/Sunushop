// ============================================================
// 📝 SYSTÈME DE LOGGING AVANCÉ
// ============================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  component?: string;
}

class LoggerService {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private logs: LogEntry[] = [];

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // ============================================================
  // Logging principal
  // ============================================================

  private log(level: LogLevel, message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      component,
      sessionId: typeof window !== 'undefined' ? this.getSessionId() : undefined,
    };

    // Ajouter aux logs en mémoire
    this.logs.push(entry);

    // En développement, afficher dans la console
    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      if (component) {
        console.log(`${prefix} [${component}] ${message}`, data || '');
      } else {
        console.log(`${prefix} ${message}`, data || '');
      }
    }

    // En production, envoyer au serveur
    if (this.isProduction) {
      this.sendToServer(entry);
    }
  }

  // ============================================================
  // Méthodes publiques
  // ============================================================

  debug(message: string, data?: any, component?: string) {
    if (this.isDevelopment) {
      this.log('debug', message, data, component);
    }
  }

  info(message: string, data?: any, component?: string) {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.log('error', message, data, component);
  }

  // ============================================================
  // Envoi au serveur
  // ============================================================

  private sendToServer(entry: LogEntry) {
    try {
      if (typeof window !== 'undefined') {
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        }).catch(() => {});
      }
    } catch {
      // Silently fail
    }
  }

  // ============================================================
  // Utilitaires
  // ============================================================

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sunushop_session') || 'unknown';
    }
    return 'server';
  }

  // Récupérer les logs (pour debug)
  getLogs(): LogEntry[] {
    return this.logs;
  }

  // Nettoyer les logs
  clearLogs(): void {
    this.logs = [];
  }

  // ============================================================
  // Filtrage des logs
  // ============================================================

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }
}

// Singleton
export const logger = new LoggerService();

// ============================================================
// Hook pour React
// ============================================================

export function useLogger(component: string) {
  return {
    debug: (message: string, data?: any) => logger.debug(message, data, component),
    info: (message: string, data?: any) => logger.info(message, data, component),
    warn: (message: string, data?: any) => logger.warn(message, data, component),
    error: (message: string, data?: any) => logger.error(message, data, component),
  };
}
