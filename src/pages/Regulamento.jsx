import React from 'react';
import { Link } from 'react-router-dom';

export default function Regulamento() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/" style={styles.backButton}>
          ← Voltar
        </Link>
        <h1 style={styles.title}>📜 Regulamento do Projeto</h1>
        <p style={styles.subtitle}>RKMMAX INFINITY MATRIX/STUDY</p>
      </div>

      <div style={styles.content}>
        {/* Conformidades */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>✅ CONFORMIDADE</h2>
          <p style={styles.sectionDesc}>
            O RKMMAX está em total conformidade com as principais regulamentações de proteção de dados e políticas de plataformas:
          </p>
          
          <div style={styles.complianceGrid}>
            <div style={styles.complianceCard}>
              <span style={styles.complianceIcon}>🇪🇺</span>
              <h3 style={styles.complianceTitle}>GDPR</h3>
              <p style={styles.complianceDesc}>
                Regulamento Geral de Proteção de Dados da União Europeia. 
                Garantimos transparência no tratamento de dados pessoais.
              </p>
            </div>

            <div style={styles.complianceCard}>
              <span style={styles.complianceIcon}>🇧🇷</span>
              <h3 style={styles.complianceTitle}>LGPD</h3>
              <p style={styles.complianceDesc}>
                Lei Geral de Proteção de Dados do Brasil (Lei nº 13.709/2018).
                Seus dados são tratados com segurança e responsabilidade.
              </p>
            </div>

            <div style={styles.complianceCard}>
              <span style={styles.complianceIcon}>📱</span>
              <h3 style={styles.complianceTitle}>Google Play Store</h3>
              <p style={styles.complianceDesc}>
                Em conformidade com as políticas do Google Play para aplicativos.
                PWA disponível para instalação em dispositivos Android/iOS.
              </p>
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🔒 SEGURANÇA</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✅</span>
              <strong>SSL/TLS Automático</strong> - Todas as conexões são criptografadas
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✅</span>
              <strong>Checkout Stripe Seguro</strong> - Pagamentos processados pela Stripe (PCI DSS Level 1)
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✅</span>
              <strong>Autenticação Segura</strong> - Login via GitHub OAuth
            </li>
            <li style={styles.listItem}>
              <span style={styles.checkIcon}>✅</span>
              <strong>Dados Protegidos</strong> - Armazenamento seguro em servidores certificados
            </li>
          </ul>
        </section>

        {/* Termos de Uso */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📋 TERMOS DE USO</h2>
          <div style={styles.termsBox}>
            <p>Ao utilizar o RKMMAX, você concorda com:</p>
            <ul style={styles.termsList}>
              <li>Uso responsável dos especialistas de IA</li>
              <li>Não utilizar para fins ilegais ou prejudiciais</li>
              <li>Respeitar os limites de uso do seu plano</li>
              <li>Não compartilhar credenciais de acesso</li>
              <li>Aceitar que as respostas da IA são assistivas e não substituem profissionais</li>
            </ul>
            <Link to="/terms" style={styles.link}>Ver Termos Completos →</Link>
          </div>
        </section>

        {/* Política de Privacidade */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🔐 PRIVACIDADE</h2>
          <div style={styles.termsBox}>
            <p>Coletamos apenas dados necessários para o funcionamento do serviço:</p>
            <ul style={styles.termsList}>
              <li>Informações de perfil (nome, email via GitHub)</li>
              <li>Histórico de conversas (para continuidade do serviço)</li>
              <li>Dados de pagamento (processados pela Stripe)</li>
            </ul>
            <p><strong>Não vendemos seus dados para terceiros.</strong></p>
            <Link to="/privacy" style={styles.link}>Ver Política de Privacidade →</Link>
          </div>
        </section>

        {/* Reembolso */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>💰 POLÍTICA DE REEMBOLSO</h2>
          <div style={styles.termsBox}>
            <p>Oferecemos reembolso integral em até 7 dias após a compra, sem questionamentos.</p>
            <p>Para solicitar, entre em contato pelo email: <strong>suporte@kizirianmax.site</strong></p>
            <Link to="/refund" style={styles.link}>Ver Política de Reembolso →</Link>
          </div>
        </section>

        {/* Informações da Empresa */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🏢 INFORMAÇÕES DA EMPRESA</h2>
          <div style={styles.companyInfo}>
            <p><strong>RKMMAX INFINITY MATRIX/STUDY</strong></p>
            <p>CNPJ: 63.492.481/0001-10</p>
            <p>Email: suporte@kizirianmax.site</p>
            <p>GitHub: github.com/kizirianmax</p>
          </div>
        </section>
      </div>

      <div style={styles.footer}>
        <p>© 2025 RKMMAX. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
    color: 'white',
    padding: '24px 20px',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: '16px',
    top: '24px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    opacity: 0.9,
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    opacity: 0.8,
    margin: 0,
  },
  content: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: '16px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '8px',
  },
  sectionDesc: {
    color: '#64748b',
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  complianceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  complianceCard: {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #bae6fd',
  },
  complianceIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '8px',
  },
  complianceTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0369a1',
    margin: '0 0 8px 0',
  },
  complianceDesc: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
    lineHeight: 1.5,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  checkIcon: {
    fontSize: '18px',
    flexShrink: 0,
  },
  termsBox: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
  },
  termsList: {
    paddingLeft: '20px',
    margin: '12px 0',
    lineHeight: 1.8,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block',
    marginTop: '12px',
  },
  companyInfo: {
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    lineHeight: 1.8,
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: '#64748b',
    fontSize: '14px',
  },
};
