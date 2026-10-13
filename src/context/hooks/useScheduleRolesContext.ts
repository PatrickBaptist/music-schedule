import { useContext } from "react";
import { ScheduleRolesContext } from "../../services/ScheduleRolesService";

export default function useScheduleRolesContext() {
  const context = useContext(ScheduleRolesContext);
  if (!context) throw new Error("useScheduleRolesContext deve estar dentro de ScheduleRolesProvider");
  return context;
}
