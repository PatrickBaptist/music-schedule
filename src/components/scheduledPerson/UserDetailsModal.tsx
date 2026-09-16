import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import useBodyScrollLock from '../../context/hooks/useBodyScrollLock';
import type { User } from '../../services/UsersService';
import { roleOptions, UserRole } from '../../types/UserRole';
import {
  Avatar,
  CloseButton,
  ModalCard,
  ModalHeader,
  ModalOverlay,
  RoleChip,
  Roles,
} from './ScheduledPersonStyle';

type UserDetailsModalProps = {
  user: User;
  onClose: () => void;
};

const getInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('');

const getRoleLabel = (role: string) => {
  if (role === UserRole.Admin) return 'Administrador';
  return roleOptions.find((option) => option.value === role)?.label || role;
};

const UserDetailsModal = ({ user, onClose }: UserDetailsModalProps) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const nickname = user.nickname?.trim() || user.name?.trim() || 'Usuário';
  const initials = getInitials(nickname) || '?';

  useBodyScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <ModalOverlay onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <ModalCard role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <ModalHeader>
          <span>Conheça quem está na escala</span>
          <CloseButton ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar informações do usuário">
            <FaTimes aria-hidden="true" />
          </CloseButton>
        </ModalHeader>

        <Avatar aria-label={`Foto de ${nickname}`}>
          {user.photoURL ? <img src={user.photoURL} alt={`Foto de ${nickname}`} /> : <span>{initials}</span>}
        </Avatar>

        <h2 id={titleId}>{nickname}</h2>

        <section aria-label="Funções do usuário">
          <h3>Funções</h3>
          <Roles>
            {user.roles.length > 0
              ? user.roles.map((role) => <RoleChip key={role}>{getRoleLabel(role)}</RoleChip>)
              : <span>Nenhuma função informada</span>}
          </Roles>
        </section>
      </ModalCard>
    </ModalOverlay>,
    document.body
  );
};

export default UserDetailsModal;
