import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import MyLikes from '../components/userInfo/MyLikes';
import MyDream from '../components/userInfo/MyDream';
import MyAccount from '../components/userInfo/MyAccount';

function MyPage(){
  return (
    <Container>
        <Route path='/mypage/mylikes' component={MyLikes} />
        <Route path='/mypage/mydream' component={MyDream} />
        <Route path='/mypage/myaccount' component={MyAccount} />
    </Container>
  );
}

export default MyPage;

const Container = styled.div`            
  overflow: hidden;
  display: flex;
  width: 100%;
  height: calc(100vh - 4.375rem);
`;