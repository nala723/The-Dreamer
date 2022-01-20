import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface DropboxProp {
  handleClick ?: ()=> void;
  resize ?: boolean;
  user ?: string;
  handleDropbox : ()=>void;
}

function Option (props: DropboxProp){
  
  const { handleClick, resize, user, handleDropbox} = props;
  
  return (
    <Container>
      <PageList onClick={() => handleDropbox}>
        {resize &&
          <>
           <Page to='/SearchDream'>꿈 알아보기</Page>
           <Page to='/DrawDream'>꿈 그리기</Page>
           <Line />
          </>
        } 
      {!user ? 
        <Login to='/login' >로그인</Login >
      :
        <>
        <Page to='/mypage/mylikes'>좋아하는 꿈</Page>
        <Page to='/mypage/mydream'>내가 그린 꿈</Page>
        <Page to='/mypage/myaccount'>나의 계정 보기</Page>
        <Line />
        <Logout onClick={handleClick}>로그아웃</Logout >
        </>
      }
      </PageList>
    </Container>
  );
}

export default Option;

const Container = styled.div`
    position: absolute;
    width: 9.25rem;
    height: auto;
    right: 5rem;
    top: 4.0rem;
    border-radius: 0.3rem;
    background: ${props=> props.theme.default};
    padding: 1rem 0;
    z-index: 100;
    box-shadow: 0 0rem 2.5rem -1rem rgba(39, 0, 51, 0.8);
    ${props=> props.theme.midTablet}{
      width: 16rem;
      right: 1rem;
    }
    ${props=> props.theme.mobile}{
      top: 3.0rem;
    }
`;

const PageList = styled.ul`
  height: 100%;
  padding: 0.3rem;
  ${props => props.theme.flexColumn};
  color: ${props=> props.theme.text};
  gap: 1.5rem;
  text-align: center;
  font-size: ${props=> props.theme.fontS};
  /* font-size: 18px; */
`;  

const Page = styled(Link)`
  width: 85%;
  cursor: pointer; 
  :hover{
    color: ${props=> props.theme.anker};
    text-shadow: 4px 4px 10px ${props=> props.theme.anker};
  }
`;
const Line = styled.div`
 width: 85%;
 height: 1px;
 background-color:${props=> props.theme.transp};
`;

const Login = styled(Link)`
  width: 85%;
  cursor: pointer; 
  color: ${props=> props.theme.point};
  :hover{
    text-shadow: 4px 4px 10px ${props=> props.theme.point};
  }
`;

const Logout = styled.li`
  width: 85%;
  color: ${props=> props.theme.point};
  cursor: pointer; 
  :hover{
    text-shadow: 4px 4px 10px ${props=> props.theme.point};
  }
`;