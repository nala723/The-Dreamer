import React from 'react';
import styled, { css } from 'styled-components';

function Modal(props: { 
  handleClick: (e?: React.MouseEvent )=>void; children: string; handleSignOut?: (arg0 :boolean)=>void;}) {
  // 모달 좀더 제목이랑 내용 구분?
  
    const {  handleClick, children, handleSignOut } = props;
    return (
        <Background className={`${children ? "active" : ""}`}>
          <ModalSection
            className={`${children? "active" : ""}`}
            onClick={handleClick}
          >
            <ModalTitle>
              <Img src='theme' alt='logo'/>
            </ModalTitle>
            <Content>
              <div>{children}</div>
            </Content>
            {handleSignOut ? 
              <OkBtn signout='signout'>
                <button onClick={()=> handleSignOut(true)}>확인</button>
                <button onClick={handleClick}>취소</button>
              </OkBtn>
              : 
              <OkBtn signout=''>
                <button>확인</button>
              </OkBtn>
            }
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
`;
const Img = styled.img.attrs<{src: string;}>(props=>({
  src: props.theme.imgsrc
}))`
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
const OkBtn = styled.div<{signout : string;}>`
  ${props=> props.signout ? props.theme.flexRow : props.theme.flexColumn}
  ${props=> props.signout && css`
  gap: 3rem;
  `}
  > button{
    width: 7.688rem;
    height: 2.5rem;
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
