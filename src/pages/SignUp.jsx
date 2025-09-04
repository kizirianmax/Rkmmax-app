// src/pages/SignUp.jsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

export default function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  // Função de cadastro
  async function handleSignUp(e) {
    e.preventDefault()
    setMsg("")
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setMsg(`Erro: ${error.message}`)
    } else {
      setMsg("Cadastro realizado! Verifique seu e-mail para confirmar a conta.")
      // Redireciona para login depois do cadastro
      navigate("/login")
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      {msg && <p style={{ marginTop: "1rem" }}>{msg}</p>}
    </div>
  )
}
