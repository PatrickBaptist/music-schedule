import { ContainerFooter } from "./FooterStyle";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
      const navigate = useNavigate();

  return (
    <ContainerFooter>
        <h5 onClick={() => {
                            navigate("/alter")
                        }}>© direitos reservados</h5>
    </ContainerFooter>
  );
};

export default Footer;