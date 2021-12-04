import React from 'react';
import styled from 'styled-components';

function Modal(props: { handleClick: ()=>void; children: string;}) {
  // 모달 좀더 제목이랑 내용 구분?
  
    const {  handleClick, children } = props;
    return (
        <Background className={`${children ? "active" : ""}`}>
          <ModalSection
            className={`${children? "active" : ""}`}
            onClick={handleClick}
          >
            <ModalTitle>
              <img src="/images/darklogo.svg" alt='logo'/>
            </ModalTitle>
            <Content>
              <div>{children}</div>
            </Content>
            <OkBtn>
              <button>확인</button>
            </OkBtn>
          </ModalSection>
        </Background>
  );
}
export default Modal;


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
  width: 27.563rem;
  height: 19.625rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 0 2.5rem rgba(58, 53, 54, 0.3);
  &.active {
    z-index:999;
  }
`;
const ModalTitle = styled.div`
  width:100%;
  padding: 1rem 0 0 1rem;
  >img{
  }
`;
const Content = styled.div`
  ${props=> props.theme.flexColumn};
  height: 9.688rem;
  font-size: ${props=> props.theme.fontL};
  color: ${props=> props.theme.text};
  >div {
    height: 36%;
    width: 75%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid ${props=> props.theme.transp};
  }
`;
const OkBtn = styled.div`
  ${props=> props.theme.flexColumn};
  > button{
    width: 7.688rem;
    height: 2.188rem;
    border-radius: 5px;
    font-size: 15px;
    font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background: ${props=> props.theme.dream};  
    border: transparent; 
    color: ${props=> props.theme.reverse};
    :hover{
      background: transparent; 
      border: 1px solid ${props=> props.theme.transp}; 
      color: ${props=> props.theme.text}; 
      transition: all 0.3s ease-in-out;
    }
  }
`;
