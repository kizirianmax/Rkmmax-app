// src/config/adminCredentials.js
// Credenciais hardcoded do dono (temporárias)
// ATENÇÃO: O dono DEVE trocar a senha no primeiro acesso

export const OWNER_CREDENTIALS = {
  email: "robertokizirianmax@gmail.com",
  tempPassword: "Admin@2026!RKM",
  role: "OWNER"
};

/**
 * Verifica se as credenciais são do owner
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean}
 */
export function isOwnerCredentials(email, password) {
  return email === OWNER_CREDENTIALS.email && 
         password === OWNER_CREDENTIALS.tempPassword;
}

/**
 * Verifica se é o email do owner
 * @param {string} email 
 * @returns {boolean}
 */
export function isOwnerEmail(email) {
  return email === OWNER_CREDENTIALS.email;
}
