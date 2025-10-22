// api/save-email.js
/**
 * Endpoint para salvar e-mails de usuários que optam por receber atualizações
 * 
 * Opções de armazenamento:
 * 1. Supabase (recomendado)
 * 2. Arquivo JSON local (temporário)
 * 3. Google Sheets (simples)
 * 4. Mailchimp/SendGrid (direto na lista)
 */

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validação básica
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    // Timestamp
    const timestamp = new Date().toISOString();

    // TODO: Escolher método de armazenamento
    
    // OPÇÃO 1: Supabase (recomendado)
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(
    //   process.env.SUPABASE_URL,
    //   process.env.SUPABASE_SERVICE_ROLE
    // );
    // 
    // const { data, error } = await supabase
    //   .from('beta_users')
    //   .insert([{ email, created_at: timestamp }]);
    //
    // if (error) throw error;

    // OPÇÃO 2: Google Sheets (simples)
    // const { GoogleSpreadsheet } = require('google-spreadsheet');
    // const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    // await doc.useServiceAccountAuth({
    //   client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //   private_key: process.env.GOOGLE_PRIVATE_KEY,
    // });
    // await doc.loadInfo();
    // const sheet = doc.sheetsByIndex[0];
    // await sheet.addRow({ email, timestamp });

    // OPÇÃO 3: SendGrid (adicionar à lista de contatos)
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.request({
    //   method: 'PUT',
    //   url: '/v3/marketing/contacts',
    //   body: {
    //     contacts: [{ email }]
    //   }
    // });

    // Por enquanto, apenas log
    console.log(`📧 Novo e-mail cadastrado: ${email} em ${timestamp}`);

    return res.status(200).json({ 
      success: true, 
      message: 'E-mail salvo com sucesso!',
      email,
      timestamp
    });

  } catch (error) {
    console.error('Erro ao salvar e-mail:', error);
    return res.status(500).json({ 
      error: 'Erro ao salvar e-mail',
      details: error.message 
    });
  }
}

