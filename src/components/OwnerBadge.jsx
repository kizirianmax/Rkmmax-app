// src/components/OwnerBadge.jsx
import React from "react";
import { useOwnerAccess } from "../hooks/useOwnerAccess.js";

export default function OwnerBadge() {
  const { isOwner, badge, badgeText } = useOwnerAccess();

  if (!isOwner) return null;

  return (
    <div className="owner-badge">
      <span className="crown">{badge}</span>
      <span className="role">{badgeText}</span>
      <span className="unlimited">| ILIMITADO ∞</span>
    </div>
  );
}
