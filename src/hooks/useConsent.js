// src/hooks/useConsent.js
import { useState } from "react";

const KEY = "consent.v1";

export function getConsent() {
  return typeof window !== "undefined" && localStorage.getItem(KEY) === "yes";
}

export function acceptConsent() {
  if (typeof window !== "undefined") localStorage.setItem(KEY, "yes");
}

export function revokeConsent() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export default function useConsent() {
  const [accepted, setAccepted] = useState(getConsent());
  const accept = () => {
    acceptConsent();
    setAccepted(true);
  };
  const revoke = () => {
    revokeConsent();
    setAccepted(false);
  };
  return { accepted, accept, revoke };
}
