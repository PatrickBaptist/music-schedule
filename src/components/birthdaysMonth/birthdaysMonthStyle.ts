import styled from "styled-components";
import { motion } from "framer-motion";

export const BirthdayCelebration = styled(motion.section)`
  position: relative;
  width: min(calc(100% - 32px), 1320px);
  margin: 34px auto 12px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, #ec4899 26%, var(--color-border));
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: 0 18px 48px color-mix(in srgb, #7c3aed 12%, transparent);

  @media (max-width: 600px) {
    width: calc(100% - 16px);
    margin-top: 24px;
    border-radius: 18px;
  }
`;

export const CelebrationHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 28px 20px;

  > div > span { color: #ec4899; font-size: 0.75rem; font-weight: 850; letter-spacing: 0.1em; text-transform: uppercase; }
  h2 { margin: 5px 0 4px; color: var(--color-text-strong); font-size: clamp(1.35rem, 3vw, 1.9rem); }
  p { margin: 0; color: var(--color-text-muted); line-height: 1.5; }
  > svg { flex-shrink: 0; color: #ec4899; font-size: 2.5rem; filter: drop-shadow(0 8px 12px rgba(236, 72, 153, 0.22)); }

  @media (max-width: 600px) { padding: 20px 18px 16px; > svg { font-size: 2rem; } }
`;

export const PartyStage = styled.div`
  position: relative;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  overflow: hidden;
  background: radial-gradient(circle at 50% 105%, rgba(255, 255, 255, 0.34) 0 26%, transparent 27%), linear-gradient(135deg, #7c3aed 0%, #db2777 52%, #f97316 100%);

  &::after { content: ""; position: absolute; left: 18%; right: 18%; bottom: 18px; height: 28px; border-radius: 50%; background: rgba(43, 18, 74, 0.25); filter: blur(14px); }
  .balloon { position: absolute; width: 52px; height: 66px; border-radius: 52% 48% 48% 52%; box-shadow: inset -8px -10px 0 rgba(0, 0, 0, 0.08); }
  .balloon::after { content: ""; position: absolute; top: 64px; left: 50%; width: 1px; height: 90px; background: rgba(255, 255, 255, 0.5); }
  .balloon-one { top: 30px; left: 8%; background: #38bdf8; transform: rotate(-8deg); }
  .balloon-two { top: 42px; right: 9%; background: #facc15; transform: rotate(9deg); }
  .confetti { position: absolute; width: 9px; height: 20px; border-radius: 3px; }
  .confetti-one { top: 24px; left: 29%; background: #facc15; transform: rotate(24deg); }
  .confetti-two { top: 48px; right: 29%; background: #67e8f9; transform: rotate(-32deg); }
  .confetti-three { bottom: 38px; right: 18%; background: #f9a8d4; transform: rotate(52deg); }

  @media (max-width: 600px) {
    min-height: 300px; padding: 24px 18px;
    .balloon { width: 38px; height: 50px; }
    .balloon::after { top: 48px; height: 64px; }
  }
`;

export const FeaturedBirthday = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 24px;
  width: min(100%, 560px);
  padding: 22px 28px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 22px;
  background: rgba(28, 15, 55, 0.34);
  color: #fff;
  box-shadow: 0 22px 50px rgba(43, 18, 74, 0.28);
  backdrop-filter: blur(12px);

  @media (max-width: 600px) { align-items: center; flex-direction: column; gap: 14px; padding: 20px; text-align: center; }
`;

export const FeaturedBirthdayAvatar = styled.div`
  position: relative;
  width: 112px;
  height: 112px;
  flex: 0 0 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  border: 5px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: linear-gradient(135deg, #fde68a, #f9a8d4);
  color: #831843;
  box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.12), 0 16px 32px rgba(43, 18, 74, 0.3);
  font-size: 2rem;
  font-weight: 900;

  img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
  .birthday-star { position: absolute; top: -9px; right: -7px; padding: 7px; border-radius: 50%; background: #facc15; color: #7c2d12; box-shadow: 0 5px 14px rgba(67, 20, 7, 0.28); font-size: 0.85rem; }
`;

export const FeaturedBirthdayContent = styled.div`
  min-width: 0;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  .featured-label { color: #fde68a; font-size: 0.72rem; font-weight: 850; letter-spacing: 0.08em; text-transform: uppercase; }
  h3 { margin: 5px 0 2px; font-size: clamp(1.5rem, 4vw, 2.2rem); line-height: 1.15; overflow-wrap: anywhere; }
  > strong { color: rgba(255, 255, 255, 0.88); font-size: 1rem; font-weight: 650; text-transform: capitalize; }
  small { display: inline-flex; margin-top: 12px; padding: 6px 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.16); color: #fff; font-size: 0.78rem; font-weight: 800; }

  @media (max-width: 600px) { align-items: center; }
`;

export const BirthdayList = styled.div`
  padding: 20px 24px 24px;
  .birthday-list-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .birthday-list-heading > div { display: flex; align-items: center; gap: 8px; color: var(--color-text-strong); }
  .birthday-list-heading svg { color: #ec4899; }
  .birthday-list-heading > span { color: var(--color-text-muted); font-size: 0.8rem; }
  .birthday-list-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
  @media (max-width: 600px) { padding: 18px; }
`;

export const BirthdayCard = styled(motion.div)`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
  background: var(--color-surface-muted);
  > div:last-child { min-width: 0; display: flex; align-items: flex-start; flex-direction: column; gap: 3px; }
`;

export const BirthdayAvatar = styled.div`
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, #ec4899 32%, var(--color-border));
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(253, 230, 138, 0.55), rgba(249, 168, 212, 0.48));
  color: #be185d;
  font-size: 0.95rem;
  font-weight: 850;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const BirthdayName = styled.strong`
  max-width: 100%;
  overflow: hidden;
  color: var(--color-text-strong);
  font-size: 0.94rem;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BirthdayDate = styled.span`
  color: var(--color-text-muted);
  font-size: 0.82rem;
  text-transform: capitalize;
`;

export const BirthdayEmptyState = styled.section`
  width: min(calc(100% - 32px), 760px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 32px auto 12px;
  padding: 22px;
  box-sizing: border-box;
  border: 1px dashed color-mix(in srgb, #ec4899 36%, var(--color-border));
  border-radius: 18px;
  background: var(--color-surface);
  > svg { flex-shrink: 0; color: #ec4899; font-size: 2rem; }
  > div { display: flex; flex-direction: column; gap: 4px; }
  strong { color: var(--color-text-strong); }
  span { color: var(--color-text-muted); font-size: 0.9rem; }
`;
