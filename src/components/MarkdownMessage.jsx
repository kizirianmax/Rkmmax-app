import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MarkdownMessage.css';

const MarkdownMessage = ({ content, isUser = false }) => {
  const [copied, setCopied] = useState(false);

  // Só mostrar botão copiar se a mensagem for longa (mais de 100 caracteres)
  const showCopyButton = content && content.length > 100;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  if (isUser) {
    return (
      <div className="markdown-message user-message">
        <p>{content}</p>
      </div>
    );
  }

  return (
    <div className="markdown-message ai-message">
      {showCopyButton && (
      <div className="message-actions">
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copiar mensagem"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>
      )}
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Títulos
          h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
          h4: ({ children }) => <h4 className="md-h4">{children}</h4>,
          
          // Parágrafos
          p: ({ children }) => <p className="md-p">{children}</p>,
          
          // Listas
          ul: ({ children }) => <ul className="md-ul">{children}</ul>,
          ol: ({ children }) => <ol className="md-ol">{children}</ol>,
          li: ({ children }) => <li className="md-li">{children}</li>,
          
          // Links
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">
              {children}
            </a>
          ),
          
          // Código inline
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (!inline && language) {
              return (
                <div className="code-block-wrapper">
                  <div className="code-block-header">
                    <span className="code-language">{language}</span>
                    <button 
                      className="code-copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                      }}
                    >
                      Copiar código
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            if (!inline) {
              return (
                <pre className="md-pre">
                  <code className="md-code-block">{children}</code>
                </pre>
              );
            }
            
            return <code className="md-code-inline" {...props}>{children}</code>;
          },
          
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="md-blockquote">{children}</blockquote>
          ),
          
          // Tabelas
          table: ({ children }) => (
            <div className="table-wrapper">
              <table className="md-table">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="md-thead">{children}</thead>,
          tbody: ({ children }) => <tbody className="md-tbody">{children}</tbody>,
          tr: ({ children }) => <tr className="md-tr">{children}</tr>,
          th: ({ children }) => <th className="md-th">{children}</th>,
          td: ({ children }) => <td className="md-td">{children}</td>,
          
          // Horizontal rule
          hr: () => <hr className="md-hr" />,
          
          // Strong e Em
          strong: ({ children }) => <strong className="md-strong">{children}</strong>,
          em: ({ children }) => <em className="md-em">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
