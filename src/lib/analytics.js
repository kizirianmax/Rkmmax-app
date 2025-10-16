// src/lib/analytics.js
import posthog from "posthog-js";

export function initAnalytics() {
  const apiKey = process.env.REACT_APP_POSTHOG_KEY;
  const host = process.env.REACT_APP_POSTHOG_HOST || "https://app.posthog.com";
  
  if (!apiKey) {
    console.warn("⚠️ PostHog API key not configured. Analytics disabled.");
    return;
  }

  posthog.init(apiKey, {
    api_host: host,
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    
    // Privacy settings
    mask_all_text: false,
    mask_all_element_attributes: false,
    
    // Performance
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    
    // Disable in development
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.opt_out_capturing();
      }
    },
  });
}

export function trackEvent(eventName, properties = {}) {
  if (typeof posthog !== "undefined" && posthog.capture) {
    posthog.capture(eventName, properties);
  }
}

export function identifyUser(email, properties = {}) {
  if (typeof posthog !== "undefined" && posthog.identify) {
    posthog.identify(email, properties);
  }
}

export function resetUser() {
  if (typeof posthog !== "undefined" && posthog.reset) {
    posthog.reset();
  }
}

// Common events
export const Events = {
  PAGE_VIEW: "page_view",
  BUTTON_CLICK: "button_click",
  FORM_SUBMIT: "form_submit",
  ERROR_OCCURRED: "error_occurred",
  FEATURE_USED: "feature_used",
  SUBSCRIPTION_STARTED: "subscription_started",
  AGENT_SELECTED: "agent_selected",
  CHAT_SENT: "chat_sent",
  FEEDBACK_SUBMITTED: "feedback_submitted",
};

