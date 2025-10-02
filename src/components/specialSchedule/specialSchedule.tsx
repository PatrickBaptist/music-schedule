import React from "react";
import { ContainerEscala } from "./specialScheduleStyle";
import { formatDateDDMMYYYY } from "../../helpers/helpers";
import { toast } from "sonner";
import Delete from '../../assets/imgs/delete.png'
import useSchedulesContext from "../../context/hooks/useScheduleContext";
import { motion } from "framer-motion";
import LoadingScreen from "../loading/LoadingScreen";

interface SpecialSchedulesProps {
  schedules: {
    id: string;
    evento: string; 
    data: string; 
    vocal1: string;
    vocal2: string;
    teclas: string;
    violao: string;
    batera: string;
    bass: string;
    guita: string;
  }[];
  loading?: boolean;
}

const SpecialSchedules: React.FC<SpecialSchedulesProps> = ({ schedules, loading }) => {
  const { deleteSpecialSchedules } = useSchedulesContext();

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
      <h4>Escalas Especiais</h4>
      <div className="escala-content">
        {loading ? (
          <LoadingScreen />
        ) : schedules.length > 0 ? (
          schedules.map((escala, index) => (
            <div key={index} className="escala-content-escala">
              <p><strong>Evento:</strong> {escala.evento}</p>
              <p><strong>Data:</strong> {formatDateDDMMYYYY(escala.data)}</p>
              <p><strong>Vocal:</strong> {escala.vocal1 || "Não definido"}</p>
              <p><strong>Vocal:</strong> {escala.vocal2 || "Não definido"}</p>
              <p><strong>Teclas:</strong> {escala.teclas || "Não definido"}</p>
              <p><strong>Violão:</strong> {escala.violao || "Não definido"}</p>
              <p><strong>Batera:</strong> {escala.batera || "Não definido"}</p>
              <p><strong>Bass:</strong> {escala.bass || "Não definido"}</p>
              <p><strong>Guita:</strong> {escala.guita || "Não definido"}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className='btns'
                onClick={() => handleDelete(escala.id, escala.evento)}
                style={{ backgroundColor: '#C0392B', width: '10px', height: '40px', border: 'none' }}
              >
                <img style={{ width: '20px', height: '20px' }} src={Delete} alt="delete"/>
              </motion.button>
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
