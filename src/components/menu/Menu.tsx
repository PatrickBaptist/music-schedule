import React from "react";
import { useNavigate } from "react-router-dom";
import { ContainerMenu, ContentMenu, NavMenu } from "./MenuStyle";
import useUserContext from "../../context/hooks/useUserContext";

const Menu: React.FC = () => {
    const { openMenu, setOpenMenu } = useUserContext();
    const navigate = useNavigate();

    const handleMenuClick = () => {
        setOpenMenu(!openMenu);
    };

    return (
        <ContainerMenu $openMenu={openMenu}>
            <ContentMenu>
                <NavMenu>
                    <ul>
                        <li onClick={() => {
                            navigate("/"); 
                            handleMenuClick()
                        }}>INÍCIO</li>
                        <li onClick={() => {
                            navigate("/schedule")
                            handleMenuClick()
                        }}>ESCALA</li>
                        <li onClick={() => {
                            navigate("/listMusic")
                            handleMenuClick()
                        }}>CANÇÕES</li>
                        <li onClick={() => {
                            navigate("/alter")
                            handleMenuClick()
                        }}>GEREN. ESCALA</li>
                    </ul>
                </NavMenu>
            </ContentMenu>
        </ContainerMenu>
    );
};

export default Menu;
