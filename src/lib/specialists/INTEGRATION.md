# 🔌 Guia de Integração KIZI Specialists

Este guia explica como integrar a biblioteca de especialistas KIZI em seus projetos.

## 🚀 Sistema KIZI

A biblioteca foi projetada para funcionar com os 3 motores KIZI:

| Motor | Tecnologia | Quando Usar |
|-------|------------|-------------|
| 🧠 **KIZI 2.5 Pro** | Gemini 2.5 Pro | Raciocínio complexo, análises profundas |
| 🚀 **KIZI Speed** | Groq Llama 70B | Velocidade máxima, respostas rápidas |
| ⚡ **KIZI Flash** | Gemini Flash | Respostas simples, conversas leves |

## 📦 Instalação

### Opção 1: Clone direto

```bash
git clone https://github.com/kizirianmax/rkmmax-specialists.git
cp rkmmax-specialists/specialists.js seu-projeto/src/config/
```

### Opção 2: Submódulo Git

```bash
git submodule add https://github.com/kizirianmax/rkmmax-specialists.git lib/specialists
```

### Opção 3: Copiar arquivo

Simplesmente copie `specialists.js` para seu projeto.

## 🚀 Uso Básico

### Importar especialistas

```javascript
import { 
  specialists, 
  categories,
  getSpecialist,
  getSpecialistsByCategory,
  searchSpecialists,
  getStats 
} from './specialists.js';
```

### Acessar um especialista

```javascript
const code = specialists.code;
// ou
const code = getSpecialist('code');

console.log(code.name);        // "Code"
console.log(code.emoji);       // "💻"
console.log(code.description); // "Programação e desenvolvimento de software"
console.log(code.systemPrompt); // Prompt KIZI completo
```

### Listar por categoria

```javascript
const techSpecialists = getSpecialistsByCategory('tech');
// Retorna: [code, nexus, synth, sec, data, ux, mobile]
```

### Buscar especialistas

```javascript
const results = searchSpecialists('marketing');
// Busca em nome, descrição e categoria
```

### Estatísticas

```javascript
const stats = getStats();
console.log(stats.total);      // 49
console.log(stats.categories); // 9
console.log(stats.byCategory); // { tech: 7, creative: 8, ... }
```

## 🤖 Integração com API de IA

### KIZI 2.5 Pro (Gemini 2.5 Pro)

```javascript
import { getSpecialist } from './specialists.js';

async function chatWithKiziPro(specialistId, userMessage) {
  const specialist = getSpecialist(specialistId);
  
  if (!specialist) {
    throw new Error('Especialista não encontrado');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: specialist.systemPrompt }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: userMessage }]
        }],
        generationConfig: {
          temperature: 1.0,
          maxOutputTokens: 16000,
          topP: 0.95,
          topK: 64
        }
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

### KIZI Speed (Groq Llama 70B)

```javascript
import { getSpecialist } from './specialists.js';

async function chatWithKiziSpeed(specialistId, userMessage) {
  const specialist = getSpecialist(specialistId);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: specialist.systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### KIZI Flash (Gemini Flash)

```javascript
import { getSpecialist } from './specialists.js';

async function chatWithKiziFlash(specialistId, userMessage) {
  const specialist = getSpecialist(specialistId);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: specialist.systemPrompt }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: userMessage }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

### Seleção Automática de Motor

```javascript
function analyzeComplexity(message) {
  const complexIndicators = [
    /analis[ae]/i, /compar[ae]/i, /código|code/i, /debug/i,
    /projeto/i, /estratégia/i, /\?.*\?/
  ];
  
  const simpleIndicators = [
    /^(oi|olá|hey|hi)/i, /^(obrigado|valeu|thanks)/i,
    /^.{1,30}$/
  ];
  
  let complexScore = complexIndicators.filter(p => p.test(message)).length;
  let simpleScore = simpleIndicators.filter(p => p.test(message)).length;
  
  if (simpleScore >= 2 && complexScore === 0) return 'flash';
  if (complexScore >= 2) return 'pro';
  return 'speed';
}

async function chatWithKizi(specialistId, message) {
  const complexity = analyzeComplexity(message);
  
  switch (complexity) {
    case 'pro':
      return await chatWithKiziPro(specialistId, message);
    case 'flash':
      return await chatWithKiziFlash(specialistId, message);
    default:
      return await chatWithKiziSpeed(specialistId, message);
  }
}
```

## ⚛️ Integração com React

### Componente de Card

```jsx
import { specialists, categories } from './specialists';

function SpecialistCard({ specialistId, onClick }) {
  const specialist = specialists[specialistId];
  const category = categories[specialist.category];

  return (
    <div 
      className="specialist-card"
      onClick={() => onClick(specialist)}
      style={{ borderColor: category.color }}
    >
      <div className="specialist-avatar">
        <span className="emoji">{specialist.emoji}</span>
      </div>
      <div className="specialist-info">
        <h3>{specialist.name}</h3>
        <p>{specialist.description}</p>
        <span 
          className="category-badge"
          style={{ backgroundColor: category.color }}
        >
          {category.emoji} {category.name}
        </span>
      </div>
    </div>
  );
}
```

### Hook de Chat com Especialista

```jsx
import { useState, useCallback } from 'react';
import { getSpecialist } from './specialists';

function useSpecialistChat(specialistId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const specialist = getSpecialist(specialistId);

  const sendMessage = useCallback(async (content) => {
    setLoading(true);
    
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'specialist',
          specialistId,
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        model: data.model  // kizi-2.5-pro, kizi-speed, ou kizi-flash
      }]);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }, [specialistId, messages]);

  return { specialist, messages, loading, sendMessage };
}
```

## 🎨 Estilos CSS

```css
.specialist-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.specialist-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.specialist-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialist-avatar .emoji {
  font-size: 2rem;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  color: white;
}

/* Badges dos motores KIZI */
.kizi-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  color: white;
}

.kizi-badge.pro {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.kizi-badge.speed {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
}

.kizi-badge.flash {
  background: linear-gradient(135deg, #10b981, #06b6d4);
}
```

## 🔧 Personalização

### Adicionar especialista customizado

```javascript
import { specialists } from './specialists';

specialists.meuEspecialista = {
  id: 'meuEspecialista',
  name: 'Meu Especialista',
  emoji: '🎯',
  avatar: '/avatars/custom.png',
  category: 'tech',
  description: 'Minha descrição',
  systemPrompt: `Você é o KIZI 2.5 Pro operando como Meu Especialista...`,
  visible: true
};
```

## 🔒 Boas Práticas

1. **Não exponha prompts no frontend** - Os system prompts devem ficar apenas no backend
2. **Valide specialistId** - Sempre verifique se o especialista existe antes de usar
3. **Cache de respostas** - Implemente cache para perguntas frequentes
4. **Rate limiting** - Proteja sua API contra abusos
5. **Logs** - Registre qual especialista e motor foi usado para analytics

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/kizirianmax/rkmmax-specialists/issues)
- **Email**: roberto@kizirianmax.site
- **Website**: https://kizirianmax.site

---

<div align="center">

**Parte do ecossistema KIZI/RKMMAX**

🧠 **KIZI 2.5 Pro** | 🚀 **KIZI Speed** | ⚡ **KIZI Flash**

</div>
