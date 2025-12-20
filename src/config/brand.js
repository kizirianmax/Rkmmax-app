// src/config/brand.js
export const BRAND = {
  // Marca principal
  master: "RKMMAX INFINITY MATRIX/STUDY",
  engine: "Matrix",
  vertical: "Study",
  lockup: "RKMMAX INFINITY MATRIX/STUDY",
  claim: "Qualquer projeto, qualquer área — excelência suprema em estudo.",
  seal: "Source-Proof",
  // fallback curto para telas pequenas
  shortLockup: "RKMMAX INFINITY | MATRIX/STUDY",
  
  // KIZI AI - Identidade da IA
  ai: {
    name: "KIZI 2.5 Pro",
    shortName: "KIZI",
    description: "Inteligência Artificial Avançada",
    // Motores disponíveis
    engines: {
      pro: {
        name: "KIZI 2.5 Pro",
        description: "Raciocínio complexo e análises profundas",
        model: "gemini-2.5-pro"
      },
      speed: {
        name: "KIZI Speed",
        description: "Velocidade máxima para respostas rápidas",
        model: "llama-3.3-70b-versatile"
      },
      flash: {
        name: "KIZI Flash",
        description: "Respostas simples e conversas leves",
        model: "gemini-2.0-flash"
      }
    }
  }
};

export default BRAND;
