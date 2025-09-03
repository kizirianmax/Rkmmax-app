// src/pages/Subscribe.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Subscribe() {
  const { planId } = useParams(); // simple | medium | top

  useEffect(() => {
    const go = async () => {
      const res = await fetch(`/.netlify/functions/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { url } = await res.json();
      window.location.href = url;
    };
    go();
  }, [planId]);

  return <p style={{color:"#e5ecff"}}>Redirecionando para o pagamento…</p>;
}
