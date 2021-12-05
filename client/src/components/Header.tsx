import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { Buffer } from 'buffer';
import Option from './Option';

function Header (props: { themeToggler: () => void; t: any; }){
  const { username, profile } = useSelector((state: RootState) => state.usersReducer.user);
  const { themeToggler,t } = props;
  const [ dropdown, setDropdown ] = useState(false);
  const menulist = [ 
    { menu: '꿈 알아보기', url: '/searchdream'},
    { menu: '꿈 그리기', url: '/drawdream'},
    { menu: '별자리운세', url: '/horoscope'}, 
    { menu: '로그인', url: '/login'}
  ];
  const toggleicon = ['🌞', '🌙'];
  const profileImg = 
    typeof(profile) === 'string' ?
     profile : "data:image/png;base64, " + Buffer.from(profile, 'binary').toString('base64');
  
  return (
    <>
      <Container>
          <LogoBox to='/'>
            <Logo />
          </LogoBox>
          <RightBox>
            <Menu>
               {menulist.map((menu,idx)=>{
                 return (username && idx === 3) ? 
                    <UserPic key={idx} onClick={()=>setDropdown(!dropdown)}>
                      <img src={profileImg} alt='img'/>
                      {dropdown && <Option />}
                    </UserPic>
                     :
                    <LinkMenu to={menu.url} key={idx}>{menu.menu}</LinkMenu>
               })}
            </Menu> 
            <Toggle onClick={themeToggler} t={t}>
              <Circle t={t}/>
              <p>{t === 'light' ? toggleicon[1] : toggleicon[0]}</p>
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
  z-index: 10;
`;
const LogoBox = styled(Link)`
`;
const Logo = styled.img.attrs((props) => {
 return {src: props.theme.imgsrc}
})``;

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
`;
const UserPic = styled.li`
  width: 1.813rem;
  height: 1.813rem;
  border-radius: 100%;
  overflow: hidden; 
  >img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        cursor: pointer; 
        background: ${props=> props.theme.dream};
      }
`;

const LinkMenu = styled(Link)`
  color: ${props=> props.theme.text};
  font-size: ${props=> props.theme.fontS};
  position: relative;
  cursor: pointer;
  :nth-child(4) {
    color: ${props=> props.theme.point};
      >img {
      }
    :hover:after{
      background-color: ${props=> props.theme.point};
    }
    :hover{
      color: ${props=> props.theme.point};
      text-shadow: 4px -4px 10px ${props=> props.theme.point};
    }
  }
  :after {
    content: "";
    position: absolute;
    left: -4px;
    bottom: -10px;
    width: 0px;
    height: 1.5px;
    margin: 5px 0 0;
    transition: all 0.5s ease-in-out;
    transition-duration: 0.3s;
    opacity: 0;
    background-color: ${props=> props.theme.anker};
  }
  /* :hover{
    background-color: ${props=> props.theme.moretransp};
    transition: all 0.2s ease-in-out;
    box-shadow: 0 0 30px 2px  ${props=> props.theme.anker};
  }  요 효과는 나중 생각.. 배경칼라를 박스 쉐도우와 비슷하게 맞추면 될것 같기두*/
  :hover{
    color: ${props=> props.theme.anker};
    text-shadow: 4px 4px 10px ${props=> props.theme.anker};
  }
  :hover:after{
    width: 120%;
    opacity: 1;
  }
`;
const Toggle = styled.div<{t: string}>`
  position:relative;
  display: flex;
  align-items: center;
  min-width: 3.25rem;
  height: 1.375rem;
  border: 1px solid #898989;
  border-radius: 2rem;
  background-color: ${props=> props.theme.toggle};
   >p  {
    position: absolute;
    font-size: 14px;
    ${props=> props.t === 'dark' ? (css`
      right: 3px;
      `) : (css`
      left: 3px;`)};
    }
`;
const Circle = styled.div<{t : string}>`
  position:absolute;
  width: 1.275rem;
  height: 1.275rem;
  border-radius: 100%;
  background-color: white;
  transition: all .3s ease-in-out;
  cursor: pointer;
  ${props=> props.t === 'light' ? (css`
    left: 1.8rem;
    right:1px;`) : (css`
    left:1px;`)
    };
`; 

