import React from 'react';
import styled from 'styled-components';

function Footer() {
  const menus = ['Wiki','Github','Blog','Contact'];
  return (
    <Container>
      <MidBox>
        <MenuList>
            {menus.map((menu,idx)=>{
              return <li key={idx}>{menu}</li>
            })}
        </MenuList>
        <LogoBox>
          <Logo />
          <p>@ Copyright 2021 Bitnara Lee.
              All right reserved.</p>
        </LogoBox>    
      </MidBox>  
    </Container>
  );
}

export default Footer;

const Container = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  ${props=> props.theme.flexRow};
  height: 25.25rem;
`;

const MidBox = styled.div`
  ${props=> props.theme.flexRow};
  height: auto; 
  padding: 0 7rem;
  justify-content: space-between;
  gap:5rem;
  ${props=> props.theme.laptop}{
    padding: 0 2rem;
  }
  ${props=> props.theme.tablet}{
    padding: 0 1rem;
    gap: 3rem;
  }
  ${props=> props.theme.mobile}{
    ${props=> props.theme.flexColumn};
    height: 100%;
    flex-direction: column-reverse;
    -webkit-flex-direction: column-reverse;
    -moz-flex-direction: column-reverse;
    align-items: flex-start;
    justify-content: flex-end;
  }
`;
const MenuList = styled.ul`
  ${props=> props.theme.flexRow};
  color: ${props=> props.theme.text};
  width:70%;
  font-size: 20px;
  justify-content: space-evenly;
   > li{
     cursor: pointer;
   }
   ${props=> props.theme.laptop}{
    width: 60%;
    font-size: 18px;
    }
    ${props=> props.theme.tablet}{
    font-size: 16px;
    }
    ${props=> props.theme.mobile}{
      width: 80%;
    }
`;
const LogoBox = styled.div`
 ${props=> props.theme.flexColumn};
  gap:1rem;
  width:30%;
  align-items: flex-end;
    >p {
      color: ${props=> props.theme.text};
      text-align: start;
      width: 12rem;
      ${props=> props.theme.tablet}{
        font-size: 14px;
        width: 10.5rem;
      } 
      ${props=> props.theme.mobile}{
        padding-left: 1rem;
      }
    }
  ${props=> props.theme.tablet}{
    gap: 0.6rem;
  } 
  ${props=> props.theme.mobile}{
    width: 100%;
    align-items: flex-start;
  }
`;
const Logo = styled.img.attrs((props) => {
  return {src: props.theme.imgsrc}
 })`
  transform: scale(1.2);
  padding-right: 1rem;
  ${props=> props.theme.tablet}{
  transform: scale(0.9);
  }   
`;