import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-page-bg: #0D1117;
    --color-surface: #161b22;
    --color-surface-muted: #080D13;
    --color-text: #e0e0e0;
    --color-text-strong: #fff;
    --color-text-strong2: #fff;
    --color-text-muted: #8b949e;
    --color-border: #2D3748;
    --color-border-soft: #1E2A3A;
    --color-primary: #2EBEF2;
    --color-scroll-track: #0e1e30ff;
    --color-shadow: rgba(0, 0, 0, 0.6);
    --color-modal-bg: #0D1117;
    --color-input-bg: #1c2230;
    --color-input-text: #e0e0e0;
  }

  :root[data-theme='light'] {
    --color-page-bg: #F5F0E8;
    --color-surface: #ffffff;
    --color-surface-muted: #EDE8DF;
    --color-text: #2d3748;
    --color-text-strong: #172033;
    --color-text-strong2: #fff;
    --color-text-muted: #64748b;
    --color-border: #d9e2ec;
    --color-border-soft: #e8eef5;
    --color-primary: #1a6fa8;
    --color-scroll-track: #EDE8DF;
    --color-shadow: rgba(45, 55, 72, 0.12);
    --color-modal-bg: #f6f8fb;
    --color-input-bg: #ffffff;
    --color-input-text: #172033;
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
    color: var(--color-text);
    background-color: var(--color-page-bg);
    transition: background-color 0.5s ease, color 0.2s ease;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text-strong)
  }

  input, select, textarea {
    background-color: var(--color-input-bg);
    color: var(--color-input-text);
  }

  ::placeholder {
    color: var(--color-text-muted);
  }
`;

export default GlobalStyle;
