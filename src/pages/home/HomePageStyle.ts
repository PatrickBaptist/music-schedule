import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  overflow-x: hidden;
`

export const ContainerHome = styled.div`
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 16px 40px;
    overflow: visible;
    box-sizing: border-box;

    .home-summary-card {
      width: 100%;
      max-width: 1320px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 18px;
      margin: 0 auto 24px;
      padding: 18px 20px;
      border: 1px solid var(--color-border-soft);
      border-left: 4px solid var(--color-primary);
      border-radius: 12px;
      background: var(--color-surface);
      box-shadow: 0 4px 14px var(--color-shadow);
    }

    .home-summary-date {
      width: 60px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      background: var(--color-surface-muted);
      color: var(--color-primary);
      line-height: 1;

      strong {
        color: var(--color-text-strong);
        font-size: 1.65rem;
      }

      span {
        margin-top: 5px;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
      }

      svg {
        font-size: 1.35rem;
      }
    }

    .home-summary-main {
      min-width: 0;

      h1 {
        margin: 5px 0 7px;
        font-size: clamp(1.15rem, 2vw, 1.45rem);
        line-height: 1.2;
      }

      > p {
        margin: 6px 0 0;
        color: var(--color-text-muted);
        font-size: 0.84rem;
        line-height: 1.45;
      }
    }

    .home-summary-eyebrow {
      color: var(--color-primary);
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;

      em {
        margin-left: 8px;
        color: var(--color-text-muted);
        font-style: normal;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: none;
      }
    }

    .home-summary-schedule,
    .home-summary-details {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px 16px;
      color: var(--color-text-muted);
      font-size: 0.82rem;

      > span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      svg { color: var(--color-primary); }
    }

    .home-summary-details {
      margin-top: 9px;
      color: var(--color-text-strong);
      font-weight: 700;
    }

    .home-summary-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-direction: column;
    }

    .home-summary-link {
      width: 152px;
      min-height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      padding: 0 12px;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      color: var(--color-text-strong);
      font: inherit;
      font-size: 0.8rem;
      font-weight: 750;
      text-decoration: none;
      cursor: pointer;
      transition: border-color 0.15s ease, background-color 0.15s ease;

      &.primary {
        border-color: var(--color-primary);
        background: var(--color-primary);
        color: var(--color-on-primary);
      }

      &.secondary { background: transparent; }

      &:hover { border-color: var(--color-primary); }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 3px;
      }

      .home-summary-arrow { margin-left: auto; }
    }

    .home-music-list-anchor {
      width: 100%;
      scroll-margin-top: 16px;
    }

    @media (max-width: 820px) {
      .home-summary-card {
        grid-template-columns: auto minmax(0, 1fr);
      }

      .home-summary-actions {
        grid-column: 1 / -1;
        flex-direction: row;
      }

      .home-summary-link {
        width: 100%;
      }
    }

    @media (max-width: 720px) {
      .home-summary-card {
        align-items: start;
        gap: 14px;
        padding: 16px;
      }

      .home-summary-date {
        width: 52px;
        height: 58px;
      }
    }

    @media (max-width: 440px) {
      .home-summary-card {
        grid-template-columns: 1fr;
      }

      .home-summary-date {
        display: none;
      }

      .home-summary-actions {
        grid-column: auto;
        flex-direction: column;
      }
    }

    /* Layout para desktop */
    .desktop-layout {
      width: 100%;
      max-width: 1320px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin: 0 auto;
    }

    .desktop-layout-row-2 {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 30px;
    }

    /* Media query para desktop */
    @media (min-width: 768px) {
      .desktop-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.8fr);
        align-items: start;
      }

      .desktop-layout-row-2 {
        flex-direction: row;
        justify-content: space-between;
      }

      .coluna-1, .coluna-2 {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
    }

    .container-escala {
      width: 100%;
      margin-top: 20px;
      padding: 18px;
      box-sizing: border-box;
      border: 1px solid var(--color-border-soft);
      border-radius: 16px;
      background: var(--color-surface-muted);

      @media (max-width: 768px) {
        border-top: 1px solid var(--color-border);
      }

      .content {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 16px 0 0;
      }

      .content-escala {
        width: 100%;
        background-color: var(--color-surface);
        border-radius: 10px;
        padding: 20px 30px;
        box-shadow: 0 0 10px var(--color-shadow);
        width: 100%;
        max-width: 400px;
        color: var(--color-text);

        @media (max-width: 478px) {
          max-width: 300px;
        }

        @media (max-height: 700px) and (max-width: 768px) {
          max-height: calc(100dvh - 190px);
          overflow-y: auto;
          padding: 14px 18px;
        }

        @media (max-height: 560px) and (max-width: 768px) {
          max-height: calc(100dvh - 150px);
        }
      }

      .content-escala2 {
        width: 100%;
        border-radius: 10px;
        padding: 20px 30px;
        width: 90%;
        max-width: 400px;
        color: var(--color-text);

        @media (max-width: 478px) {
          max-width: 300px;
        }

        @media (max-height: 700px) and (max-width: 768px) {
          max-height: calc(100dvh - 190px);
          overflow-y: auto;
          padding: 14px 18px;
        }
      }

      .content-escala p {
        font-size: 16px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid var(--color-border-soft);
        padding-bottom: 6px;

        @media (max-height: 700px) and (max-width: 768px) {
          font-size: 14px;
          margin: 7px 0;
          padding-bottom: 5px;
        }
      }

      .content-escala p:last-child {
        border-bottom: none;
      }

      .content-escala strong {
        color: var(--color-text-strong);
        min-width: 90px;
      }
    }

    .schedule-heading {
      display: flex;
      flex-direction: column;
      gap: 14px;

      h4 {
        margin: 2px 0 0;
        font-size: 22px;
      }
    }

    .section-kicker {
      color: var(--color-primary);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .repertoire-date-bar {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin: 8px 0 16px;
      padding: 14px 16px;
      box-sizing: border-box;
      border: 1px solid var(--color-border-soft);
      border-radius: 12px;
      background: var(--color-surface-muted);

      @media (max-width: 560px) {
        align-items: stretch;
        flex-direction: column;
      }
    }

    .repertoire-date-copy {
      min-width: 0;

      span {
        color: var(--color-text-muted);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      h3 {
        margin: 3px 0 0;
        color: var(--color-text-strong);
        font-size: clamp(17px, 2.4vw, 22px);
        line-height: 1.25;
        text-transform: capitalize;
      }
    }

    .date-picker-trigger {
      position: relative;
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      flex-shrink: 0;
      padding: 8px 12px;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid var(--color-border);
      border-radius: 9px;
      background: var(--color-surface);
      color: var(--color-text-strong);
      cursor: pointer;
      font-size: 14px;
      font-weight: 700;
      transition: border-color 0.2s ease, background-color 0.2s ease;

      &:hover,
      &:focus-within {
        border-color: var(--color-primary);
        background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
      }

      input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }

    }

    .repertoire-date-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;

      @media (max-width: 1135px) {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));

        > * {
          width: 100%;
        }
      }
    }

    .add-music-button {
      min-width: 0;
      flex-shrink: 0;
      line-height: 1.2;
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .available-repertoires {
      width: 100%;
      margin: 0 0 16px;
      padding: 14px 16px;
      box-sizing: border-box;
      border: 1px solid var(--color-border-soft);
      border-radius: 12px;
      background: var(--color-surface);

      > p {
        margin: 12px 0 0;
        color: var(--color-text-muted);
        font-size: 13px;
      }
    }

    .available-repertoires-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;

      > div {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--color-text-strong);
      }

      svg {
        color: var(--color-primary);
      }

      > span {
        color: var(--color-text-muted);
        font-size: 12px;
      }

      @media (max-width: 520px) {
        align-items: flex-start;
        flex-direction: column;
        gap: 4px;
      }
    }

    .repertoire-date-options {
      display: flex;
      gap: 8px;
      padding-bottom: 3px;
      overflow-x: auto;
      scrollbar-width: thin;

      button {
        min-width: 104px;
        min-height: 54px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 9px;
        padding: 8px 10px;
        border: 1px solid var(--color-border);
        border-radius: 10px;
        background: var(--color-surface-muted);
        color: var(--color-text-strong);
        cursor: pointer;
        transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

        &:hover {
          border-color: var(--color-primary);
        }

        &:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        &.active {
          border-color: var(--color-primary);
          background: color-mix(in srgb, var(--color-primary) 14%, var(--color-surface));
          box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 14%, transparent);
        }
      }
    }

    .repertoire-option-date {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      line-height: 1.15;
      text-transform: capitalize;

      strong {
        font-size: 14px;
      }

      small {
        margin-top: 3px;
        color: var(--color-text-muted);
        font-size: 12px;
      }
    }

    .repertoire-option-count {
      min-width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--color-primary);
      color: var(--color-on-primary);
      font-size: 12px;
      font-weight: 800;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .schedule-tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 4px;
      padding: 4px;
      border-radius: 10px;
      background: var(--color-surface);

      button {
        min-height: 38px;
        padding: 8px 10px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--color-text-muted);
        cursor: pointer;
        font-weight: 700;
        font-size: 13px;
        transition: background-color 0.2s ease, color 0.2s ease;

        &:hover:not(.active) {
          color: var(--color-primary);
        }

        &:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      }

      button.active {
        background: var(--color-primary);
        color: var(--color-on-primary);
        box-shadow: 0 3px 10px color-mix(in srgb, var(--color-primary) 28%, transparent);
      }
    }

    .thursday-tab-panel {
      width: 100%;

      > div > .content {
        margin: 0;
      }
    }

    .special-tab-panel {
      width: 100%;

      @media (min-width: 769px) {
        max-height: calc(100dvh - 235px);
        min-height: 280px;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        scrollbar-gutter: stable;
        padding-right: 8px;

        &::-webkit-scrollbar {
          width: 7px;
        }

        &::-webkit-scrollbar-track {
          border-radius: 999px;
          background: var(--color-scroll-track);
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: var(--color-primary);
        }

        &:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 4px;
          border-radius: 10px;
        }
      }

      > div {
        margin-top: 0;
        padding-top: 0;
        border-top: 0;
      }

      h4 {
        margin-left: 0;
      }
    }

    h4 {
      margin-left: 16px;
      font-size: 18px;
      font-weight: 600;
    }

    .modal {
      width: 100vw;
      height: 100dvh;
      position: fixed;
      inset: 0;
      z-index: calc(var(--z-modal) + 10);
      background-color: rgba(8, 15, 24, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      overflow-y: auto;
      overscroll-behavior: contain;

      @media (max-width: 720px) {
        align-items: flex-start;
        padding: 82px 12px 106px;
      }
    }

    .modal-content {
      width: min(100%, 620px);
      max-height: calc(100dvh - 32px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      @media (max-width: 720px) {
        width: 100%;
        max-height: calc(100dvh - 188px);
      }

      .btn-close {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: end;
        margin-bottom: 10px;

        button {
          background-color: #ffc107;
        }

        .close-modal {
          cursor: pointer;
        }
      }
    }

`

export const AddFormOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: calc(var(--z-modal) + 20);
  background: rgba(8, 15, 24, 0.68);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 720px) {
    align-items: flex-start;
    padding: 82px 12px 106px;
  }
`
