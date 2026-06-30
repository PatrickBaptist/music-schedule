import React, { useMemo, useState } from "react";
import { ContainerEscala } from "./specialScheduleStyle";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import { toast } from "sonner";
import Delete from '../../assets/imgs/delete.png'
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { motion } from "framer-motion";
import LoadingScreen from "../loading/LoadingScreen";
import { FaPlus } from "react-icons/fa";
import EspecialScheduleInput from "../especialScheduleInput/EspecialScheduleInput";
import { UserRole } from "../../types/UserRole";
import useUsersContext from "../../context/hooks/useUsersContext";
import type { User } from "../../services/UsersService";
import {
  getMusicianDisplayName,
  getMusicianPhotoURL,
  MusicoDetalhe,
  SpecialSchedule,
} from "../../services/ScheduleService";

interface SpecialSchedulesProps {
  usersRoles: string[];
  schedules: SpecialSchedule[];
  loading?: boolean;
}

type PersonRef = string | MusicoDetalhe | null | undefined;

const PersonBadge = ({
  person,
  usersById,
}: {
  person: PersonRef;
  usersById: Record<string, User>;
}) => {
  const displayName = getMusicianDisplayName(person, usersById);
  const photoURL = getMusicianPhotoURL(person, usersById);

  if (!person) {
    return <span style={{ color: '#9ca3af' }}>Não definido</span>;
  }

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'flex-end',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          overflow: 'hidden',
          background: '#1f2937',
          color: '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '0.72rem',
          fontWeight: 700,
        }}
      >
        {photoURL ? <img src={photoURL} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials || '?'}
      </span>
      <span style={{ textAlign: 'right' }}>{displayName}</span>
    </span>
  );
};

const PersonList = ({
  people,
  usersById,
}: {
  people: PersonRef[] | PersonRef;
  usersById: Record<string, User>;
}) => {
  const list = Array.isArray(people) ? people : [people];
  const validPeople = list.filter(Boolean);

  if (validPeople.length === 0) {
    return <span style={{ color: '#9ca3af' }}>Não definido</span>;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        justifyContent: 'flex-end',
        maxWidth: 'calc(100% - 90px)',
      }}
    >
      {validPeople.map((person, index) => (
        <PersonBadge key={`${typeof person === 'string' ? person : person?.id}-${index}`} person={person} usersById={usersById} />
      ))}
    </span>
  );
};

const SpecialSchedules: React.FC<SpecialSchedulesProps> = ({ usersRoles, schedules, loading }) => {
  const { deleteSpecialSchedules } = useSchedulesContext();
  const { users } = useUsersContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersById = useMemo(
    () => users.reduce<Record<string, User>>((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {}),
    [users]
  );
  
  const allowedRoles = [UserRole.Leader, UserRole.Admin];
  const canAddSchedule = usersRoles.some(role => allowedRoles.includes(role as UserRole));

  const handleDelete = async (id: string, evento: string) => {
    toast(
      `Deseja realmente deletar o evento "${evento}"?`,
      {
        action: {
          label: "Deletar",
          onClick: async () => {
            try {
              await deleteSpecialSchedules(id);
              toast.success("Evento deletado!");
            } catch (err: unknown) {
              toast.error(err instanceof Error || "Erro ao deletar evento");
            }
          },
        },
      }
    );
  };

  return (
    <ContainerEscala>
      <div className='add-schedule'>
        <h4>Escalas Especiais</h4>
        {canAddSchedule && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="add-btn"
            onClick={() => setIsModalOpen(true)}
            >
            <FaPlus size={12} />
          </motion.button>
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <EspecialScheduleInput setIsModalOpen={setIsModalOpen}/>
          </div>
        </div>
      )}
      
      <div className="escala-content">
        {loading ? (
          <LoadingScreen />
        ) : schedules.length > 0 ? (
          schedules.map((escala, index) => (
            <div key={escala.id || index} className="escala-content-escala">
              <p><strong>Evento:</strong> {escala.evento}</p>
              <p><strong>Data:</strong> {formatDateDDMMYYYY(escala.data)}</p>
              <p style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                <strong>Ministro:</strong>
                <PersonBadge person={escala.músicosIds?.minister || escala.músicos?.minister || escala.minister} usersById={usersById} />
              </p>
              <p>
                <strong>Vocal:</strong>
                <PersonList
                  people={
                    escala.músicosIds?.vocal?.length
                      ? escala.músicosIds.vocal
                      : escala.músicos?.vocal?.length
                        ? escala.músicos.vocal
                        : [escala.vocal1, escala.vocal2]
                  }
                  usersById={usersById}
                />
              </p>
              <p><strong>Teclas:</strong> <PersonBadge person={escala.músicosIds?.teclas || escala.músicos?.teclas || escala.teclas} usersById={usersById} /></p>
              <p><strong>Violão:</strong> <PersonBadge person={escala.músicosIds?.violao || escala.músicos?.violao || escala.violao} usersById={usersById} /></p>
              <p><strong>Batera:</strong> <PersonBadge person={escala.músicosIds?.batera || escala.músicos?.batera || escala.batera} usersById={usersById} /></p>
              <p><strong>Bass:</strong> <PersonBadge person={escala.músicosIds?.bass || escala.músicos?.bass || escala.bass} usersById={usersById} /></p>
              <p><strong>Guita:</strong> <PersonBadge person={escala.músicosIds?.guita || escala.músicos?.guita || escala.guita} usersById={usersById} /></p>
              <p><strong>Op. som: </strong><PersonBadge person={escala.músicosIds?.sound || escala.músicos?.sound || escala.sound} usersById={usersById} /></p>
              <p><strong>Paleta de cores:</strong> <span style={{ fontStyle: 'italic' }}>{escala.outfitColor || escala.músicosIds?.outfitColor || escala.músicos?.outfitColor || "Não definido"}</span></p>
              {canAddSchedule && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className='btns'
                  onClick={() => handleDelete(escala.id, escala.evento)}
                  style={{ backgroundColor: '#C0392B', width: '10px', height: '40px', border: 'none' }}
                >
                  <img style={{ width: '20px', height: '20px' }} src={Delete} alt="delete"/>
                </motion.button>
              )}
            </div>
          ))
        ) : (
          <p>Não há escalas especiais</p>
        )}
      </div>
    </ContainerEscala>
  );
};

export default SpecialSchedules;
