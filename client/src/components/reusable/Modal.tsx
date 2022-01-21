import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import gsap from 'gsap';

interface ModalProps {
  handleClick: (e?: React.MouseEvent)=>void; 
  children: any; 
  handleSignOut?: (arg0 :boolean)=>void; 
  header?: string;
}

function Modal(props: ModalProps) {
 
  const backRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timeLineRef = useRef<gsap.core.Timeline>();

  useEffect(()=>{
     timeLineRef.current = gsap.timeline()
      .to(backRef.current, {
        opacity: 1, 
        duration: 0.5
      })
      .fromTo(modalRef.current,{ opacity: 0, y: -90,}, {
        opacity: 1,
        duration: 1.2,
        y: 0,
        ease: "power3.inOut",
      }, '-=0.4')

    return (()=>{
      timeLineRef.current && timeLineRef.current.kill();
    })
  },[])

  const {  handleClick, children, handleSignOut, header } = props;

    return (
        <Background ref={backRef}> 
          <ModalSection
            onClick={handleClick}
            size={header? '21.25rem' : ''}
            ref={modalRef} 
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
export default React.memo(Modal);


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
  opacity: 0;
  background-color: rgba(247,241,255,0.8);
  z-index:500;
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
  z-index:999;
  ${props=> props.theme.mobile}{
    width: 85vw;
    height: calc(${props=> props.size ? '18.5rem' : '17rem'} / 1.15 );
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
    height: 100%;
    font-size: 21px;
    padding-bottom: 0.5rem;
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
  ${props=> props.theme.mobile}{
    padding-bottom: 2rem;
    >button{
      width: 6.6rem;
      height: 2.2rem;
    }
    }
`;
