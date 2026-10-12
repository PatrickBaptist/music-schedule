import { useContext } from "react";
import { OrganizationContext } from "../organizationContext";

const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error("useOrganizationContext precisa estar dentro de OrganizationProvider");
  }

  return context;
};

export default useOrganizationContext;
