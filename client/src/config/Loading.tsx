import React from 'react'
import styled, { keyframes } from 'styled-components'

function Loading(): JSX.Element {
  return (
    <>
      <Container>
        <SvgBox>
          <img src="/images/star.svg" alt="loading" />
          <img src="/images/star.svg" alt="loading" />
          <img src="/images/star.svg" alt="loading" />
          <img src="/images/star.svg" alt="loading" />
        </SvgBox>
      </Container>
    </>
  )
}

export default Loading

const RotateAni = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`
const StarAni = (sc: number, tsc: number, opacity: number) => keyframes`
  0% {
    transform : ${`scale(${sc})`};
    opacity : 1;
  }
  60%{
    transform : ${`scale(${tsc})`};
    opacity : ${opacity};
  }
`
const Container = styled.div`
  ${(props) => props.theme.flexColumn};
  justify-content: flex-start;
`
const SvgBox = styled.div`
  ${(props) => props.theme.flexRow};
  height: 100vh;
  position: relative;
  animation: 2.5s infinite ${RotateAni};
  > img {
    position: absolute;
    animation: 2.5s ease-in-out infinite;
  }
  > img:nth-child(1) {
    animation-name: ${StarAni(1, 1.5, 1)};
  }
  > img:nth-child(2) {
    animation-name: ${StarAni(0, 3, 0)};
  }
`
