import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    const { error } = this.state;
    if (error) {
      const isDebug =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).has('debug');

      if (isDebug) {
        return (
          <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
            <h2>Algo deu errado</h2>
            <pre>{String(error?.message || error)}</pre>
          </div>
        );
      }
      return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
          <h2>Algo deu errado</h2>
          <p>Tente atualizar a página ou voltar mais tarde.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
