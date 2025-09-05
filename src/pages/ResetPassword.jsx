// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  // modo 1: pedir link por e-mail
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  // modo 2: redefinir senha após clicar no link de recuperação
  const [isRecovery, setIsRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updating, setUpdating] = useState(false);

  // Detecta se chegamos aqui via link de recuperação
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Checa sessão atual — alguns provedores já deixam a sessão pronta ao chegar
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        // Se a sessão já existir, provavelmente é o fluxo de recovery
        // Mantemos a tela de "definir nova senha"
        setIsRecovery(true);
      }
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const redirectTo =
        (typeof window !== "undefined" &&
          `${window.location.origin}/reset-password`) ||
        undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      alert("Se o e-mail existir, enviaremos um link para redefinição.");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar o link: " + (err?.message || err));
    } finally {
      setSending(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      alert("As senhas não coincidem.");
      return;
    }
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert("Senha atualizada com sucesso! Você será redirecionado.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar senha: " + (err?.message || err));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        {!isRecovery ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Recuperar senha</h1>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="seu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar link de recuperação"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Voltar ao login
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Definir nova senha</h1>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nova senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="******"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder="******"
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {updating ? "Atualizando..." : "Atualizar senha"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
