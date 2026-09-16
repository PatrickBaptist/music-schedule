import { useState } from 'react';
import {
  getMusicianDisplayName,
  getMusicianPhotoURL,
  MusicoDetalhe,
} from '../../services/ScheduleService';
import type { User } from '../../services/UsersService';
import {
  PersonButton,
  PersonInitials,
  PersonListContainer,
} from './ScheduledPersonStyle';
import UserDetailsModal from './UserDetailsModal';

export type PersonRef = string | MusicoDetalhe | null | undefined;

type ScheduledPersonProps = {
  people: PersonRef[] | PersonRef;
  usersById: Record<string, User>;
};

const findUser = (person: PersonRef, usersById: Record<string, User>) => {
  if (!person) return null;

  const reference = typeof person === 'string' ? person : person.id;
  if (reference && usersById[reference]) return usersById[reference];

  return Object.values(usersById).find((user) =>
    [user.id, user.nickname, user.name].some((value) => value === reference)
  ) || null;
};

const getInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join('');

const ScheduledPerson = ({ people, usersById }: ScheduledPersonProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const list = Array.isArray(people) ? people : [people];
  const validPeople = list.filter(Boolean) as Exclude<PersonRef, null | undefined>[];

  if (validPeople.length === 0) {
    return <span style={{ color: '#9ca3af' }}>Não definido</span>;
  }

  return (
    <>
      <PersonListContainer>
        {validPeople.map((person, index) => {
          const user = findUser(person, usersById);
          const displayName = getMusicianDisplayName(person, usersById);
          const photoURL = getMusicianPhotoURL(person, usersById);
          const initials = getInitials(displayName) || '?';

          return (
            <PersonButton
              key={`${typeof person === 'string' ? person : person.id}-${index}`}
              type="button"
              $clickable={Boolean(user)}
              disabled={!user}
              onClick={() => user && setSelectedUser(user)}
              aria-haspopup={user ? 'dialog' : undefined}
              aria-label={user ? `Ver informações de ${displayName}` : undefined}
              title={user ? `Ver informações de ${displayName}` : undefined}
            >
              <PersonInitials>
                {photoURL ? <img src={photoURL} alt="" /> : initials}
              </PersonInitials>
              <span>{displayName}</span>
            </PersonButton>
          );
        })}
      </PersonListContainer>

      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </>
  );
};

export default ScheduledPerson;
