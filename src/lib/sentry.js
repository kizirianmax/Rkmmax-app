// src/lib/sentry.js
import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  
  if (!dsn) {
    console.warn("⚠️ Sentry DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.REACT_APP_VERSION || "1.0.0",
    
    // Ignore common errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      "Network request failed",
    ],
    
    beforeSend(event, _hint) {
      // Add user context if available
      const userEmail = localStorage.getItem("user_email");
      if (userEmail) {
        event.user = {
          email: userEmail,
        };
      }
      
      // Add custom context
      event.contexts = {
        ...event.contexts,
        app: {
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      };
      
      return event;
    },
  });
}

export function captureError(error, context = {}) {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

export function captureMessage(message, level = "info", context = {}) {
  Sentry.captureMessage(message, {
    level,
    contexts: {
      custom: context,
    },
  });
}

export function setUserContext(email, userId = null) {
  Sentry.setUser({
    email,
    id: userId,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}

