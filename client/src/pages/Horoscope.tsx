import React from 'react';
import styled from 'styled-components';
import Loading from '../config/Loading';

function Horoscope() {
  return (
    <Container>
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
