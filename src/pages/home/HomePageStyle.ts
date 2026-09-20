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

      @media (max-width: 560px) {
        width: 100%;
      }
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

    .content-louvores {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: left;
      box-sizing: border-box;
      padding-left: 12px;
      margin-top: 8px;

      h4 {
        margin-right: 10px;
      }

      .btn-write{
        width: 10px;
        border: none;
        background-color: none;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: rotate(10deg);
        }
      }

      img {
        width: 15px;
      }
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

  .btns {
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    font-weight: 500;
    justify-content: center;
    padding: 10px;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    width: 40px;
    height: 10px;
    transition: all 0.3s ease;
  }

  .add-btn {
    background-color: #1db954;
    color: white;
  }

  .add-btn:hover {
    background-color: #1aa34a;
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
