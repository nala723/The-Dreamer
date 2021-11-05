import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Header(){
  const menulist = [ '꿈 알아보기', '꿈 그리기', '별자리운세', '로그인'];
  return (
    <>
      <Container>
          <LogoBox to='/'>
            <img src="/images/darklogo.png" alt="darklogo"/>
          </LogoBox>
          <RightBox>
            <Menu>
               {menulist.map((menu,idx)=>{
                 return <li key={idx}>{menu}</li>
               })}
            </Menu> 
            <Toggle>
              <Circle/>
            </Toggle>   
          </RightBox>
      </Container>
    </>
  );
}

export default Header;

const Container = styled.div`
  display: flex;
  width: inherit;
  height: 4.375rem;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.5rem;
`;
const LogoBox = styled(Link)`
`;
const RightBox = styled.div`
 display: flex;
 width: 30.5rem;
 height: inherit;
 align-items: center;
 gap:1.5rem;
`;
const Menu = styled.ul`
  display: flex;
  align-items: center;
  width: 100%;
  height: inherit;
  justify-content: space-around;
    > li{
      color: ${props=> props.theme.text};
      font-size: ${props=> props.theme.fontS};
      cursor: pointer;
    }
    > li:nth-child(4) {
      color: ${props=> props.theme.point};
    }
`;
const Toggle = styled.div`
  position:relative;
  display: flex;
  align-items: center;
  min-width: 3.25rem;
  height: 1.375rem;
  border: 1px solid #898989;
  border-radius: 2rem;
  background-color: ${props=> props.theme.toggle};
`;
const Circle = styled.div`
  position:absolute;
  width: 1.275rem;
  height: 1.275rem;
  border-radius: 100%;
  background-color: white;
  transition: all .3s ease-in-out;
  cursor: pointer;
  left:1px;
`; 
// 토글에 달,해 넣는 법 theme으로 안되면 다르게 가능-https://react.vlpt.us/styling/03-styled-components.html