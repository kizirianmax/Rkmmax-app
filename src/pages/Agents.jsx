// src/pages/Agents.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { PLAN } from "../lib/planCaps";
import { pickModel } from "../lib/modelPicker";
import { needsFullModel } from "../lib/complexity";
import supabase from "../lib/supabaseClient";

// ===== CONFIGURE AQUI SE PRECISAR =====
const CHAT_ENDPOINT =
  "/.netlify/functions/chat"; // troque para "/api/chat" ou o que você já usa
// =====================================

// Util: pega plano do usuário (localStorage -> Supabase -> BASIC)
async function resolveUserPlan(user) {
  // 1) tenta localStorage (rápido)
  const local = localStorage.getItem("userPlan");
  if (local) return local;

  // 2) tenta Supabase (profiles.plan)
  try {
    if (user?.id) {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();
      if (!error && data?.plan) {
        localStorage.setItem("userPlan", data.plan);
        return data.plan;
      }
    }
  } catch (e) {
    // ignora, cai no fallback
  }

  // 3) fallback
  return PLAN.BASIC;
}

export default function Agents() {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(PLAN.BASIC);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Oi! Como posso ajudar hoje?" },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  // Autenticação básica (pega sessão atual)
  useEffect(() => {
    let mounted = true;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);

      const p = await resolveUserPlan(session?.user);
      if (!mounted) return;
      setPlan(p);
    })();

    // atualiza plano quando o usuário logar/deslogar
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, sess) => {
      setUser(sess?.user ?? null);
      const p = await resolveUserPlan(sess?.user);
      setPlan(p);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // rola pra última msg
  useEffect(() => {
    listRef.current?.scrollTo?.(0, 999999);
  }, [messages, loading]);

  const historyForLLM = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    [messages]
  );

  async function sendMessage(e) {
    e?.preventDefault?.();
    const prompt = input.trim();
    if (!prompt || loading) return;

    // pinta no chat
    const newUserMsg = { role: "user", content: prompt };
    setMessages((m) => [...m, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      // (opcional) checagem de complexidade — já é usada dentro do pickModel
      const complex = needsFullModel(prompt, { history: historyForLLM });

      // escolhe o modelo certo conforme o plano + complexidade
      const model = pickModel(plan, prompt, { history: historyForLLM });

      // chama seu endpoint de chat (Netlify Function, API Route, etc.)
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // envie tudo que seu backend espera:
          model,
          plan,
          prompt,
          history: historyForLLM,
          // alguns backends usam "messages" no formato OpenAI:
          messages: [...historyForLLM, newUserMsg],
          // útil para logging:
          meta: { complex },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();
      // espere que o backend retorne { reply: "texto da IA" } ou similar
      const reply =
        data.reply ||
        data.choices?.[0]?.message?.content ||
        data.text ||
        "[sem resposta]";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Desculpe, tive um problema ao responder. " +
            (err?.message ? `\n\nDetalhe: ${err.message}` : ""),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agentes</h1>
          <p className="text-sm text-gray-500">
            Plano atual: <b>{plan}</b>{" "}
            <span className="ml-2 opacity-70">
              (modelos e limites são aplicados automaticamente)
            </span>
          </p>
        </div>
        <div className="text-sm">
          <Link className="underline" to="/plans">
            Ver/alterar plano
          </Link>
        </div>
      </header>

      <div
        ref={listRef}
        className="border rounded-lg p-3 h-96 overflow-y-auto bg-white"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 ${
              m.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 italic">Gerando resposta…</div>
        )}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Escreva sua pergunta…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
          disabled={loading}
        >
          Enviar
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500">
        *No plano Premium, o sistema usa{" "}
        <span className="font-semibold">gpt-4o-mini</span> no dia a dia e sobe
        para <span className="font-semibold">gpt-4o</span> quando a tarefa é
        complexa — automaticamente.
      </p>
    </div>
  );
}
