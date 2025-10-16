// src/App.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App.jsx";

// Mock Sentry and Analytics
jest.mock("./lib/sentry.js", () => ({
  initSentry: jest.fn(),
  captureError: jest.fn(),
}));

jest.mock("./lib/analytics.js", () => ({
  initAnalytics: jest.fn(),
  trackEvent: jest.fn(),
  Events: {},
}));

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  test("renders feedback button", () => {
    render(<App />);
    const feedbackButton = screen.getByRole("button", { name: /feedback/i });
    expect(feedbackButton).toBeInTheDocument();
  });
});

