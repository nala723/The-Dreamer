import React from 'react';
import styled, { css } from 'styled-components';

function Modal(props: { 
  handleClick: (e?: React.MouseEvent )=>void; children: any; handleSignOut?: (arg0 :boolean)=>void; header?: string;}) {
  // 모달 좀더 제목이랑 내용 구분?
  
    const {  handleClick, children, handleSignOut, header } = props;
    return (
        <Background className={`${children ? "active" : ""}`}>
          <ModalSection
            className={`${children? "active" : ""}`}
            onClick={handleClick}
            size={header? '21.25rem' : ''}
          >
            <ModalTitle>
              <Img src='theme' alt='logo'/>
            </ModalTitle>
            {header?  
              <Content size='11.438rem'>
              <div>{children}</div>
              <p>{header}</p>
              </Content>
              :
              <Content size=''>
              <div>{children}</div>
              </Content>
            }
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

const ModalSection = styled.div<{size: string;}>`
  position: relative;
  background: ${props=>props.theme.default};
  width: 27.563rem;
  height: ${props=> props.size ? props.size : '19.625rem'};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 0 2.5rem rgba(58, 53, 54, 0.3);
  &.active {
    z-index:999;
  }
  ${props=> props.theme.mobile}{
    width: 90vw;
    height: calc(${props=> props.size ? props.size : '19.625rem'} / 1.15 );
  }
`;
const ModalTitle = styled.div`
  width:100%;
  padding: 1rem 0 0 1rem;
  ${props=> props.theme.mobile}{
    padding-left: 0;
  }
`;
const Img = styled.img.attrs<{src: string;}>(props=>({
  src: props.theme.imgsrc
}))`
  ${props=> props.theme.mobile}{
    transform: scale(0.7);
  }
`;
const Content = styled.div<{size: string;}>`
  ${props=> props.theme.flexColumn};
  justify-content: ${props=> props.size && 'flex-start'};
  padding-top: ${props=> props.size && '2.333rem'};
  height: ${props=> props.size ? props.size : '9.688rem'};
  font-size: ${props=> props.theme.fontL};
  color: ${props=> props.theme.text};
  >div {
    height: ${props=> props.size ? '26%' : '36%'};
    width: 75%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid ${props=> props.theme.transp};
  }
  >p {
    margin-top: 1.5rem;
    color: ${props=> props.theme.point};
    font-size: ${props=> props.theme.fontS};
    width: 20.125rem;
    line-height: 1rem;
    height: 2rem;
    text-align: center;
  }
  ${props=> props.theme.mobile}{
    padding-top: 0;
    justify-content: center;
    height:  ${props=> props.size ? '54%' : '47%'};
    >p{
      width: 90%;
      margin-top: 0.7rem;
      display: ${props=> props.size ? 'block' : 'none'};
    }
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
    color: #494161;
    :hover{
      background: transparent; 
      border: 1px solid ${props=> props.theme.transp}; 
      color: ${props=> props.theme.text}; 
      transition: all 0.3s ease-in-out;
    }
  }
  
`;
