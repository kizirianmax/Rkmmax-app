# 🤖 RKMMAX Specialists - Biblioteca KIZI

Biblioteca modular com **50+ especialistas de IA** para o ecossistema KIZI/RKMMAX.

Cada especialista é uma instância do **KIZI 2.5 Pro** operando em modo especializado, com prompts otimizados para máxima qualidade e consistência.

## 🚀 Sistema KIZI

Este repositório faz parte do ecossistema KIZI, que utiliza 3 motores de IA:

| Motor | Tecnologia | Uso |
|-------|------------|-----|
| 🧠 **KIZI 2.5 Pro** | Gemini 2.5 Pro | Raciocínio complexo, análises profundas |
| 🚀 **KIZI Speed** | Groq Llama 70B | Velocidade máxima, respostas rápidas |
| ⚡ **KIZI Flash** | Gemini Flash | Respostas simples, conversas leves |

Os especialistas são projetados para funcionar com qualquer um dos motores, mantendo qualidade consistente.

## 📋 Sobre

Este repositório contém a configuração de todos os agentes especializados usados na plataforma RKMMAX. Cada especialista tem:

- **ID único**: Identificador do agente
- **Nome e emoji**: Identidade visual
- **Categoria**: Organização por área
- **Descrição**: Resumo das capacidades
- **System Prompt KIZI**: Instruções otimizadas para o modelo de IA
- **Visibilidade**: Controle de exibição na interface

## 🎯 Especialistas por Categoria

### 📚 Educação (3)
- **Didak**: Didática e métodos de ensino
- **Edu**: Tutor acadêmico multidisciplinar
- **Mentor**: Orientação de carreira

### 💻 Tecnologia (7)
- **Code**: Programação e desenvolvimento
- **Nexus**: Redes, cloud e infraestrutura
- **Synth**: IA e Machine Learning
- **Sec**: Segurança cibernética
- **Data**: Ciência de dados e análise
- **UX**: UX/UI Design
- **Mobile**: Desenvolvimento mobile

### 🎨 Criatividade (8)
- **Orac**: Storytelling e narrativa
- **Art**: Arte visual e design gráfico
- **Beat**: Música e produção musical
- **Film**: Cinema e produção audiovisual
- **Lens**: Fotografia profissional
- **Write**: Escrita criativa e copywriting
- **Game**: Game design
- **Vox**: Comunicação e oratória

### 💙 Bem-estar (7)
- **Emo**: Inteligência emocional
- **Focus**: Produtividade e foco
- **Fit**: Fitness e exercícios
- **Chef**: Culinária e gastronomia
- **Nutri**: Nutrição e alimentação
- **Coach**: Life coaching
- **Zen**: Meditação e mindfulness

### 💼 Negócios (7)
- **Biz**: Estratégia empresarial
- **Cash**: Finanças e investimentos
- **Sales**: Vendas e negociação
- **Mark**: Marketing digital
- **PM**: Product Management
- **HR**: Recursos Humanos
- **Law**: Orientação jurídica

### ✨ Lifestyle (6)
- **Trip**: Viagens e turismo
- **Home**: Decoração e organização
- **Style**: Moda e estilo pessoal
- **Eco**: Sustentabilidade
- **Pet**: Cuidados com animais
- **Med**: Informações de saúde

### 🌍 Idiomas (3)
- **Poly**: Poliglota - múltiplos idiomas
- **Eng**: Professor de inglês
- **Span**: Professor de espanhol

### 🔬 Ciências (5)
- **Bio**: Biologia e ciências da vida
- **Chem**: Química
- **Phys**: Física
- **Math**: Matemática
- **Astro**: Astronomia e astrofísica

### 🔧 Engenharia (3)
- **Mech**: Engenharia mecânica
- **Elec**: Engenharia elétrica
- **Civil**: Engenharia civil

## 📦 Instalação

### Uso direto

```javascript
import { specialists, categories, getSpecialistsByCategory } from './specialists.js';

// Total de especialistas
console.log(Object.keys(specialists).length); // 49

// Acessar especialista específico
const code = specialists.code;
console.log(code.name); // "Code"
console.log(code.description); // "Programação e desenvolvimento de software"

// Filtrar por categoria
const techSpecialists = getSpecialistsByCategory('tech');
console.log(techSpecialists.length); // 7

// Buscar especialistas
import { searchSpecialists } from './specialists.js';
const results = searchSpecialists('marketing');

// Estatísticas
import { getStats } from './specialists.js';
const stats = getStats();
console.log(stats.total); // 49
console.log(stats.categories); // 9
```

## 🔧 Estrutura de um Especialista

```javascript
{
  id: 'code',                    // Identificador único
  name: 'Code',                  // Nome do especialista
  emoji: '💻',                   // Emoji representativo
  avatar: '/avatars/code.png',   // Caminho do avatar
  category: 'tech',              // Categoria
  description: 'Programação e desenvolvimento de software',
  systemPrompt: '...',           // Prompt KIZI otimizado
  visible: true                  // Visibilidade na interface
}
```

## 🎯 Template de Prompt KIZI

Todos os especialistas usam um template padronizado que garante:

- ✅ Identificação como KIZI 2.5 Pro
- ✅ Expertise de nível mundial
- ✅ Metodologia de resposta consistente
- ✅ Formatação profissional em Markdown
- ✅ Restrições éticas e de escopo
- ✅ Avisos legais quando necessário

## 🎯 Categorias Disponíveis

| ID | Nome | Emoji | Cor |
|----|------|-------|-----|
| `education` | Educação | 📚 | #4CAF50 |
| `tech` | Tecnologia | 💻 | #2196F3 |
| `creative` | Criatividade | 🎨 | #9C27B0 |
| `wellness` | Bem-estar | 💙 | #00BCD4 |
| `business` | Negócios | 💼 | #FF9800 |
| `lifestyle` | Estilo de Vida | ✨ | #E91E63 |
| `languages` | Idiomas | 🌍 | #3F51B5 |
| `science` | Ciências | 🔬 | #009688 |
| `engineering` | Engenharia | 🔧 | #795548 |

## 🚀 Integração com RKMMAX

Este repositório é usado pelos projetos:
- [RKMMAX App](https://github.com/kizirianmax/Rkmmax-app)
- [RKMMAX Híbrido](https://github.com/kizirianmax/rkmmax-hibrido)
- [Kizirian Max Site](https://github.com/kizirianmax/kizirian-max-site)

### Exemplo de integração:

```javascript
import { specialists, getSpecialist } from '@rkmmax/specialists';

// Em componentes React
function SpecialistCard({ specialistId }) {
  const specialist = getSpecialist(specialistId);
  
  return (
    <div className="card">
      <span className="emoji">{specialist.emoji}</span>
      <h3>{specialist.name}</h3>
      <p>{specialist.description}</p>
      <span className="badge">{specialist.category}</span>
    </div>
  );
}

// Na API
async function chat(specialistId, messages) {
  const specialist = getSpecialist(specialistId);
  
  return await callKizi({
    systemPrompt: specialist.systemPrompt,
    messages,
    model: 'kizi-2.5-pro'
  });
}
```

## 📝 Adicionando Novos Especialistas

1. Edite `specialists.js`
2. Use o template `KIZI_SPECIALIST_TEMPLATE`
3. Escolha categoria apropriada
4. Defina expertise e diretrizes específicas
5. Teste com diferentes perguntas

```javascript
novoEspecialista: {
  id: 'novoEspecialista',
  name: 'Nome',
  emoji: '🎯',
  avatar: '/avatars/novoEspecialista.png',
  category: 'categoria',
  description: 'Descrição curta',
  systemPrompt: KIZI_SPECIALIST_TEMPLATE(
    'Nome',
    'área de expertise',
    `- Habilidade 1
- Habilidade 2
- Habilidade 3`,
    `- Diretriz 1
- Diretriz 2`
  ),
  visible: true,
}
```

## 📊 Estatísticas

- **Total de especialistas**: 49
- **Categorias**: 9
- **Idiomas suportados**: Português (primário), Inglês, Espanhol
- **Motores compatíveis**: KIZI 2.5 Pro, KIZI Speed, KIZI Flash

## 🔄 Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis na estrutura
- **MINOR**: Novos especialistas ou funcionalidades
- **PATCH**: Correções e melhorias em especialistas existentes

## 🤝 Contribuindo

Contribuições são bem-vindas! Para adicionar ou melhorar especialistas:

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/novo-especialista`)
3. Faça suas mudanças
4. Commit (`git commit -m 'feat: adiciona especialista X'`)
5. Push (`git push origin feature/novo-especialista`)
6. Abra um Pull Request

## 📄 Licença

Proprietary - © 2025 RKMMAX. Todos os direitos reservados.

## 📞 Contato

**Autor**: Roberto Kiziriam Max  
**Email**: roberto@kizirianmax.site  
**Website**: https://kizirianmax.site

---

<div align="center">

**Parte do ecossistema KIZI/RKMMAX**

[RKMMAX App](https://github.com/kizirianmax/Rkmmax-app) • [RKMMAX Híbrido](https://github.com/kizirianmax/rkmmax-hibrido) • [Website](https://kizirianmax.site)

🧠 **KIZI 2.5 Pro** | 🚀 **KIZI Speed** | ⚡ **KIZI Flash**

</div>
