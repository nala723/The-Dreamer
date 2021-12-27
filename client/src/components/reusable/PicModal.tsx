import { prependListener } from 'process';
import React from 'react';
import styled from 'styled-components';

interface PicInter {
    id : number;
    title: string;
    picture: string;
    createdAt: string;
    emotion: string;
  }

function PicModal(props:{ handleClick : ()=> void; pic : PicInter;}) {
  const { handleClick, pic } = props;  
  const { picture, title, emotion, createdAt} = props.pic
  return (
    <Background className={`${pic ? "active" : ""}`}>
    <ModalSection
      className={`${pic ? "active" : ""}`}
      onClick={handleClick}
    >
      <ModalTitle>
        <Img src='theme' alt='logo'/>
      </ModalTitle>
      <Content>
          <img src={picture} alt='title'/>
      </Content>    
    </ModalSection>
  </Background>
  );
}

export default PicModal;

/* 모달 */
const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  &.active {
    background-color: rgba(247,241,255,0.8);
    visibility: visible;
    opacity: 1;
    z-index:500;
  }
`;

const ModalSection = styled.div`
  position: relative;
  background: ${props=>props.theme.default};
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 0 2.5rem rgba(58, 53, 54, 0.3);
  &.active {
    z-index:999;
  }
`;
const ModalTitle = styled.div`
  width:100%;
`;
const Img = styled.img.attrs<{src: string;}>(props=>({
  src: props.theme.imgsrc
}))`
`;
const Content = styled.div`
margin: 3rem;
margin-top: 3rem;
background-color: white;

`;

