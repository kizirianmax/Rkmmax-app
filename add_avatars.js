const fs = require('fs');

// Ler arquivo specialists.js
let content = fs.readFileSync('src/config/specialists.js', 'utf8');

// Lista de IDs de especialistas
const specialistIds = [
  'didak', 'edu', 'code', 'nexus', 'synth', 'sec', 'data', 'orac', 'zen', 'vox',
  'art', 'write', 'emo', 'design', 'video', 'music', 'photo', 'game', 'biz',
  'legal', 'market', 'sales', 'cook', 'health', 'fit', 'money', 'travel', 'social',
  'poly', 'eng', 'span', 'bio', 'chem', 'phys', 'math', 'astro', 'mech', 'elec',
  'civil', 'ux', 'pm', 'hr', 'coach', 'beat', 'chef', 'eco', 'film', 'lens',
  'mark', 'med', 'style', 'trip', 'cash', 'focus'
];

// Para cada ID, adicionar linha avatar após emoji
specialistIds.forEach(id => {
  const emojiPattern = new RegExp(`(${id}:\\s*{[^}]*emoji:\\s*'[^']*',)`, 'g');
  content = content.replace(emojiPattern, `$1\n    avatar: '/avatars/${id}.png',`);
});

// Escrever arquivo atualizado
fs.writeFileSync('src/config/specialists.js', content);
console.log('✅ Avatares adicionados com sucesso!');
