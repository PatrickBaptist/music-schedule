import { useContext, useMemo } from "react";
import { AuthContextProps, AuthService } from "../../services/AuthService";

import { OrganizationContext } from "../organizationContext";

const useAuthContext = (): AuthContextProps => {
  const context = useContext(AuthService);
  const organization = useContext(OrganizationContext)?.activeOrganization;
  const user = useMemo(() => {
    if (!context?.user || !organization) return context?.user ?? null;
    const membership = organization.membership;
    const roles = [...(membership?.musicalRoles || [])];
    if (["owner", "organization_admin"].includes(membership?.managementRole || "")) roles.push("admin");
    if (membership?.managementRole === "leader") roles.push("leader");
    if (membership?.managementRole === "guest") roles.push("guest");
    return { ...context.user, roles };
  }, [context?.user, organization]);
  if (!context) {
    throw new Error("useLoginContext precisa estar dentro de LoginProvider");
  }

  return { ...context, user };
};

export default useAuthContext;
