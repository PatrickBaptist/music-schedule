import styled from 'styled-components'

const ContainerFooter = styled.div`
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    h5 {
        color: black;
    }
`

const Footer: React.FC = () => {

  return (
    <ContainerFooter>
        <h5>© direitos reservados</h5>
    </ContainerFooter>
  );
};

export default Footer;