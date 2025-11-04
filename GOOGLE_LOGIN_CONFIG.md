# Configuração Google Login - RKMMAX

## 📋 IDs do Cliente Google (Gerados em 04/11/2025)

| Plataforma | ID do Cliente |
|------------|---------------|
| **Android** | `107808997311-gc6gtif8dcefgu74rd2oiqrdv8mh4ji0.apps.googleusercontent.com` |
| **iOS** | `107808997311-v35sp8dnrjidbe6pe9e5hgvl4or4avs7.apps.googleusercontent.com` |
| **Projeto Google Cloud** | `RKMMax-PRODU` |
| **Project Number** | `107808997311` |

---

## ✅ Próximos Passos

### 1️⃣ Configurar Google Login no Supabase

1. Acesse: https://app.supabase.com
2. Selecione o projeto RKMMAX
3. Vá em **Authentication → Providers → Google**
4. Ative o provider Google
5. Preencha:
   - **Client ID:** `107808997311-gc6gtif8dcefgu74rd2oiqrdv8mh4ji0.apps.googleusercontent.com`
   - **Client Secret:** (obtenha no Google Cloud Console)
6. Clique **Save**

### 2️⃣ Configurar Redirect URLs no Google Cloud

No Google Cloud Console, adicione as URLs de redirecionamento:

**Web (Vercel):**
```
https://kizirianmax.site/auth/callback
https://rkmmax-app.vercel.app/auth/callback
```

**Android:**
```
com.rkmmax.infinity://oauth/google/callback
```

**iOS:**
```
com.rkmmax.infinity://oauth/google/callback
```

### 3️⃣ Atualizar Login.jsx para Google Sign-In

```jsx
import { useAuth } from "../auth/AuthProvider";
import supabase from "../lib/supabaseClient";

export default function Login() {
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error('Google login error:', error);
  };

  return (
    <>
      <h1 className="title-hero">Entrar</h1>
      <button 
        onClick={handleGoogleLogin}
        className="btn-chat"
        style={{ marginBottom: 16 }}
      >
        🔐 Entrar com Google
      </button>
    </>
  );
}
```

### 4️⃣ Criar Página de Callback

Criar arquivo: `src/pages/AuthCallback.jsx`

```jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    };
    handleCallback();
  }, [navigate]);

  return <div>Autenticando...</div>;
}
```

### 5️⃣ Adicionar Rota no App.jsx

```jsx
import AuthCallback from './pages/AuthCallback';

// Dentro do Router:
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 🔐 Variáveis de Ambiente Necessárias

Adicione no Vercel (Settings → Environment Variables):

```
REACT_APP_SUPABASE_URL=https://[seu-projeto].supabase.co
REACT_APP_SUPABASE_ANON_KEY=[sua-chave-anon]
REACT_APP_GOOGLE_CLIENT_ID_ANDROID=107808997311-gc6gtif8dcefgu74rd2oiqrdv8mh4ji0.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_ID_IOS=107808997311-v35sp8dnrjidbe6pe9e5hgvl4or4avs7.apps.googleusercontent.com
```

---

## 🧪 Teste de Login

### Web (Vercel)
1. Acesse: https://kizirianmax.site/login
2. Clique em "Entrar com Google"
3. Faça login com conta Google
4. Verifique se é redirecionado para o dashboard

### Android
1. Abra o APK no emulador/dispositivo
2. Toque em "Entrar com Google"
3. Selecione conta Google
4. Verifique autenticação

### iOS
1. Abra o app no simulador/dispositivo
2. Toque em "Entrar com Google"
3. Selecione conta Google
4. Verifique autenticação

---

## 📝 Notas Importantes

- ✅ IDs do Cliente foram gerados com sucesso
- ✅ SHA-1 Android: `80:AD:BD:CF:66:D4:74:BF:82:5B:68:96:F1:78:89:75:79:A3:04:DE`
- ✅ Package Name: `com.rkmmax.infinity`
- ⚠️ Aguardando Client Secret do Google Cloud Console
- ⚠️ Redirect URLs precisam ser configuradas no Google Cloud

---

**Data:** 04/11/2025  
**Status:** Aguardando implementação no código

