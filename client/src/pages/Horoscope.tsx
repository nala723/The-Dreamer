import React from 'react';
import styled from 'styled-components';

function Horoscope() {
  return (
    <Container>
      <h1>오늘의 별자리 운세입니다.</h1>
      <Dream></Dream>
    </Container>  
  );
}

export default Horoscope;

const Container = styled.div`
  ${props=>props.theme.flexColumn};
  height: inherit;
  h1{
    font-size: ${props=>props.theme.fontL};
  }
`;
const Dream = styled.div`
  width: 50.5rem;
  height: 50.5rem; // 뷰포트에서 조정해봐야겠다
  border-radius: 100%;
  background: ${props=>props.theme.dream};
  box-shadow: 0px 0px 30px 4px rgba(255, 207, 242, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 50;
  
`;