const res = await fetch("/.netlify/functions/prices?region=BR");
const data = await res.json();
// data.planos -> [{ nome: "Básico", valor_formatado: "R$ 29,90", id: "price_..." }, ...]
