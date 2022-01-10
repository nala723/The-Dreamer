import React, { useState, forwardRef, useRef, useEffect } from 'react';
import styled from 'styled-components';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { gsap } from 'gsap';
import {ReactComponent as Arrow} from '../../assets/arrow.svg';

type Props = { 
    value?: React.ReactNode | string; onClick?: ()=>void; };
type Ref = HTMLButtonElement;

function Calender() {
    const [dateRange, setDateRange] = useState<any>([null, null]);
    const [startDate, endDate] = dateRange;
    const openRef = useRef(null);
    const openRefTl = useRef<gsap.core.Timeline>();
    const startlineRef = useRef(null);
    const endlineRef = useRef(null);
    const menuRef = useRef<(HTMLLIElement | HTMLDivElement)[]>([]);
    menuRef.current = [];

    useEffect(()=>{
        gsap.set(openRef.current, { height: 'auto', opacity: 1}) // 메뉴박스 세팅
        
        openRefTl.current = gsap.timeline() //  타임라인 객체를 open~에 저장
          .to(startlineRef.current,{ 
              width: '100%',
              opacity: 0.7
          })
          .to(menuRef.current, { 
             stagger: 0.1,
             opacity: 1
          })
          .to(endlineRef.current,{ 
              width: '100%',
              opacity: 0.7,
              delay: -0.2
          })
          .reverse();

          return () =>  { 
              openRefTl.current && openRefTl.current.kill();
            } 
      },[]);

    const handleOpen = () => {
        if(openRefTl.current){
            openRefTl.current.reversed(!openRefTl.current.reversed());
          }
    }    

    const addStagerRef = (el: HTMLLIElement | HTMLDivElement | null) => {
        if (el && !menuRef.current.includes(el)){
          menuRef.current.push(el);
        }
    }

    const CustomInput = forwardRef<Ref, Props>(({value, onClick}, ref) => (
        <CustomBtn  onClick={onClick} ref={ref}>
          <p>{startDate? value : '직접 선택'}</p>
        </CustomBtn>
      ));
      CustomInput.displayName = "CustomInput";
      // 함수 컴포넌트의 ref는 애초에 존재하지 않기 때문입니다.-> forward.Ref로 모 컴포넌트로부터 하위 컴포넌트로 ref를 전달
      //https://merrily-code.tistory.com/121

    return (
        <DateBox>
            <DateHeader onClick={handleOpen}>
            <h5>날짜별 보기</h5>
            <Arrow />
            </ DateHeader>
            <DateMenu ref={openRef}>
                <StartLine ref={startlineRef}/>
                <li ref={addStagerRef}>
                  최신 순   
                </li> 
                <li ref={addStagerRef}>
                  오래된 순    
                </li>  
                <div ref={addStagerRef}>     
            <StyledDate
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
            setDateRange(update);
            }}
            customInput={<CustomInput />}
            withPortal
        />
        </div>
        <EndLine ref={endlineRef}/>
         </ DateMenu>   
      </ DateBox>
  );
}

export default Calender;

const DateBox = styled.div`
  position: absolute;
  width: 7rem;
  top: 20%;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const DateHeader = styled.div`
  width: 7rem;
  height: 1.7rem;
  color: ${props=> props.theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  >svg {
    fill: ${props=> props.theme.transp};
    width: 1.125rem;
    height: 1rem;
    transform: scale(1.5);
  }
  ${props=> props.theme.midTablet}{
   display: none;
  }
`;
const DateMenu = styled.ul`
    ${props=>props.theme.flexColumn}; 
    align-items: flex-start;
    gap: 0.8rem;
    text-align: center;
    display: relative;
    height: 0;
    opacity: 0;
    >li{
        display: absolute;
        width: 100%; 
        cursor: pointer;
        padding-top: 0.3rem;
        opacity: 0;
    }
    >div{
        display: absolute;
        opacity: 0;
    }
    >:nth-child(4){
        width:100%;
    }
`;

const StyledDate = styled(DatePicker)`
    width: 100%;
`;

const CustomBtn = styled.button`
    border: none;
    background-color: transparent;
    color: ${props=>props.theme.text};
    font-size: 16px;
    padding: 0;
    cursor: pointer;
    >p{
        font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
        margin: 0;
    }
`;

const StartLine = styled.div`
  left: 0;
  width: 0;
  height: 1.4px;
  background-color: ${props=> props.theme.transp};
`;

const EndLine = styled(StartLine)`
`;