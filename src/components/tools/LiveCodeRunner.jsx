/**
 * LiveCodeRunner - Live Code Sandbox Component
 * Uses Sandpack to create an isolated execution environment
 * Part of Layer 2: Execution and Automation Layer
 */

import React from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { dracula } from '@codesandbox/sandpack-themes';

/**
 * LiveCodeRunner Component
 * Accepts code as a prop and renders it in a live React environment
 * 
 * @param {Object} props - Component props
 * @param {string} props.code - The React/JavaScript code to execute
 * @param {string} props.title - Optional title for the sandbox
 * @param {Object} props.files - Optional additional files for the sandbox
 * @param {Object} props.options - Optional Sandpack options
 * @returns {JSX.Element} - Rendered Sandpack component
 */
const LiveCodeRunner = ({ 
  code = '', 
  title = 'Live Code Execution',
  files = {},
  options = {}
}) => {
  // Default App.js code if none provided
  const defaultCode = code || `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🚀 RKMMAX Action Engine</h1>
      <p>This is a live code execution environment!</p>
      <p>Edit the code to see changes in real-time.</p>
    </div>
  );
}`;

  // Prepare files object for Sandpack
  const sandpackFiles = {
    '/App.js': {
      code: defaultCode,
      active: true,
    },
    ...files,
  };

  // Default Sandpack options
  const sandpackOptions = {
    showNavigator: false,
    showTabs: true,
    showLineNumbers: true,
    showInlineErrors: true,
    wrapContent: true,
    editorHeight: 400,
    ...options,
  };

  return (
    <div className="live-code-runner">
      {title && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(68, 71, 90, 0.3)',
          borderRadius: '8px 8px 0 0',
          fontSize: '14px',
          fontWeight: '500',
          color: '#e6e6e6',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {title}
        </div>
      )}
      <Sandpack
        template="react"
        theme={dracula}
        files={sandpackFiles}
        options={sandpackOptions}
        customSetup={{
          dependencies: {
            'react': '^18.3.1',
            'react-dom': '^18.3.1',
          },
        }}
      />
    </div>
  );
};

export default LiveCodeRunner;
