import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { SignInAct } from '../actions';
import { RootState } from '../reducers';
import { Buffer } from 'buffer';
import Option from './Option';
import Modal from './reusable/Modal';
import Toggle from './Toogle';
import axios from 'axios';
import { ReactComponent as Hamburger } from '../assets/hamburger.svg';

function Header (props: { themeToggler: () => void; t: any; }){
  const { accessToken, email, username, profile } = useSelector((state: RootState)=> state.usersReducer.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [ isOpen, setIsOpen ] = useState(false);
  const { themeToggler,t } = props;
  const [ dropdown, setDropdown ] = useState(false);
  const [ button, setButton ] = useState(false); // 미디어 쿼리로만 해도 될지 보기
  const menulist = [ 
    { menu: '꿈 알아보기', url: '/searchdream'},
    { menu: '꿈 그리기', url: '/drawdream'},
    { menu: '로그인', url: '/login'}
  ];
  const profileImg = 
    typeof(profile) === 'string' ?
     profile : "data:image/png;base64, " + Buffer.from(profile, 'binary').toString('base64');

  const showButton = () => {
  if (window.innerWidth <= 960) {
    setButton(true);
   } else {
    setButton(false);
   }
 };
  useEffect(() => {
    window.addEventListener("resize", showButton);
    return (()=>{
      window.removeEventListener("resize", showButton);
    })
  }, []); 


  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  const handleSignOut = async(choice: boolean) => {
    if(choice){
      setIsOpen(false);// 모달 닫고
      await axios
        .get(`${process.env.REACT_APP_URL}` + '/sign/signout', { // 요청하기
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ` + accessToken,
          }
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              SignInAct({
                email: '',
                username: '',
                accessToken: "",
                profile: "",
              })
            );
            // dispatch(getgoogleToken({ googleToken: "" }));
             history.push("/");
          } else {
            history.push("/notfound");
          }
        })
        .catch((err) => 
        history.push("/notfound"));
    } else{
      return;
    }
  }  
  
  return (
    <>
      <Container>
      {isOpen && <Modal handleClick={handleClick} handleSignOut={handleSignOut}>로그아웃 하시겠습니까?</Modal>}
          <LogoBox to='/'>
            <Logo />
          </LogoBox>
          <RightBox resize={button ? 'resize' : ''}>
            {button ? 
              (username ?    
                <UserPic onClick={()=>setDropdown(!dropdown)}>
                  <img src={profileImg} alt='img'/>
                  {dropdown && <Option handleClick={handleClick} resize={button} user={username}/>}
                </UserPic>
                :
                <Menu>
                  <Hamburger onClick={()=>setDropdown(!dropdown)}/> 
                  {dropdown && <Option handleClick={handleClick} resize={button}/>}
                </Menu>
                )
              :
          
            <Menu>
               {menulist.map((menu,idx)=>{
                 return (username && idx === 2) ? 
                    <UserPic key={idx} onClick={()=>setDropdown(!dropdown)}>
                      <img src={profileImg} alt='img'/>
                      {dropdown && <Option handleClick={handleClick} user={username}/>}
                    </UserPic>
                     :
                    <LinkMenu to={menu.url} key={idx}>{menu.menu}</LinkMenu>
               })}
            </Menu> 
            }
            <Toggle themeToggler={themeToggler} t={t}/>
          </RightBox>
      </Container>
    </>
  );
}

export default Header;

const Container = styled.div`
${props=> props.theme.tablet}{
  padding: 0 1rem 0 0;
}
  display: flex;
  width: inherit;
  height: 4.375rem;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 10;
`;
const LogoBox = styled(Link)`
${props=> props.theme.tablet}{
  transform: scale(0.8);
}
 
`;
const Logo = styled.img.attrs((props) => {
 return {src: props.theme.imgsrc}
})`
`;

const RightBox = styled.div<{resize: string;}>`
 display: flex;
 width: ${props => (props.resize !== '') ? 'auto' : '23rem'};
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
  :nth-child(3) {
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
  :hover{
    color: ${props=> props.theme.anker};
    text-shadow: 4px 4px 10px ${props=> props.theme.anker};
  }
  :hover:after{
    width: 120%;
    opacity: 1;
  }
`;

