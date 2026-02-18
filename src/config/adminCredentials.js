// src/config/adminCredentials.js
// Credenciais do dono (primeiro acesso)
// ⚠️ ATENÇÃO: O dono DEVE trocar a senha no primeiro login

export const OWNER_CREDENTIALS = {
  email: "robertokizirian@hotmail.com",
  tempPassword: "RKMuk$LVBzKGXSB!",
  role: "OWNER",
  requirePasswordChange: true
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
