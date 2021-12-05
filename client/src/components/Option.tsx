import React from 'react';
import { Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import MyLikes from './userInfo/MyLikes';
import MyDream from './userInfo/MyDream';
import MyAccount from './userInfo/MyAccount';

function Option (){
  const lists = [ '좋아하는 꿈', '내가 그린 꿈', '나의 계정 보기', '로그아웃']

  return (
    <Container>
        <Route path='/mylikes' component={MyLikes} />
        <Route path='/mydream' component={MyDream} />
        <Route path='/myaccount' component={MyAccount} />
      <PageList>
        <Page to='/mylikes'>좋아하는 꿈</Page>
        <Page to='/mydream'>내가 그린 꿈</Page>
        <Page to='/myaccount'>나의 계정 보기</Page>
        <Logout>로그아웃</Logout >
      </PageList>
    </Container>
  );
}

export default Option;

const Container = styled.div`
    position: absolute;
    /* ${props => props.theme.flexColumn}; */
    width: 9.25rem;
    height: 12rem;
    border-radius: 0.3rem;
    background: ${props=> props.theme.default};
    right: 5rem;
    top: 4.4rem;
    z-index: 100;
    box-shadow: 0 0rem 2.5rem -1rem rgba(39, 0, 51, 0.8);
`;

const PageList = styled.ul`
  height: 100%;
  padding: 0.3rem;
  ${props => props.theme.flexColumn};
  font-size: ${props=> props.theme.fontS};
`;  

const Page = styled(Link)`
  width: 85%;
  color: ${props=> props.theme.text};
  text-align: center;
  cursor: pointer; 
  flex: 1;
  :hover{
    color: ${props=> props.theme.anker};
    text-shadow: 4px 4px 10px ${props=> props.theme.anker};
  }
`;

const Logout = styled.li`
  width: 85%;
  flex: 1.2;
  padding-top:1rem;
  color: ${props=> props.theme.text};
  text-align: center;
  border-top: 1px solid ${props=> props.theme.transp};
  cursor: pointer; 
  :hover{
    color: ${props=> props.theme.anker};
    text-shadow: 4px 4px 10px ${props=> props.theme.anker};
  }
`;