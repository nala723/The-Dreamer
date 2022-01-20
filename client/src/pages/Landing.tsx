import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {  useDispatch } from 'react-redux';
import { searchDreamAct } from '../actions';
import Modal from '../components/reusable/Modal';
import Footer from '../components/Footer';
import SecondSection from '../components/landing/SecondSection';
import { keyframes } from 'styled-components';
import SearchBar from '../components/reusable/SearchBar';

function Landing() {
  const dispatch = useDispatch();
  const history = useHistory();
  const txt = '오늘, 어떤 꿈을 꿨나요 ?';
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const [scrollY, setScrollY] = useState(0)
  const [isOpen, setIsOpen] = useState(false);

  //타이핑 효과 function
  useEffect(() => {
    const interval = setInterval(() => {
      setText(text + txt[count]); 
      setCount(count + 1); 
    }, 145);
    if(count === txt.length-2){
      setFadeIn(true); 
    }
    if(count === txt.length){  
      clearInterval(interval);
    } 
    return () => clearInterval(interval); 
  }); 

  const handleScrollBtn = () => {
    setScrollY(window.pageYOffset); // window 스크롤 값을 ScrollY에 저장
    if (scrollY > 1200) {
      setScrollTop(true);
    }else {
      setScrollTop(false);
    }
  }

  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setScrollY(0);
    setScrollTop(false);
  }

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", handleScrollBtn);
    };
    watch();
    return () => {
      window.removeEventListener("scroll", handleScrollBtn);
    }; 
  });

  const handleSearch = (search: string) => {
    if(!search){
      setIsOpen(true); 
      return;
    } 
    dispatch(searchDreamAct(search))
    history.push('/searchdream');
  }

  const handleClick = () => {
    setIsOpen(false)
  }

  return (
      <Container>
        <MainSection>
        {isOpen && <Modal handleClick={handleClick}>검색하실 꿈을 입력해주세요.</Modal>}
          <ContentsBox >
            <h1>{text}</h1>
            <SearchBox  className={fadeIn? 'fadein': ''}>
              <SearchBar height='4.688rem' width='100%' scale='(1.0)' font='1.5rem' handleSearch={handleSearch} landing='true'/>
            </SearchBox>
          </ContentsBox >
          <ScrollDown>
            <span></span><span></span><span></span>
            <p>Scroll</p>
          </ScrollDown> 
        </MainSection>
        <SecondSection />
        <Footer />
        <ScrollTop active={scrollTop} onClick={handleScroll}>
          <span></span><span></span><span></span>
          <p>맨 위로</p>
        </ScrollTop> 
      </Container>
  );
}


export default Landing;


const ScrollAni = (start: string, end: string) => keyframes`
  0% {
    transform: rotate(-45deg) translate(${start});
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(-45deg) translate(${end});
    opacity: 0;
  }
`;

const Container = styled.div`            
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 728.24rem;
  background: ${props=> props.theme.landing};
  ${props=> props.theme.laptop}{
    min-height: 1100vh; 
  }
  ${props=> props.theme.mobile}{
    height: 660rem;
  }  
`;

const MainSection = styled.section`
  position: absolute; 
  ${props=>props.theme.flexRow};
  height: calc(100vh - 4.375rem);
  ${props=> props.theme.mobile}{
   min-height: calc(100vh - 3.6rem);
  }
`;
const ContentsBox = styled.div`
   ${props=>props.theme.flexColumn};
    height:auto;
    gap:2.8rem;
  ${props=> props.theme.mobile}{
    gap: 1.6rem;
  }
    > h1 {
      letter-spacing: 0.4rem;
      ${props=> props.theme.mobile}{ // 가운데 보고 수정...정규식이나..
        letter-spacing: 0.2rem;
        text-align: center;
        line-height: 2rem; 
      }
    }
`;

const SearchBox = styled.div`
  position: relative;
  width:40%;
  min-width: 40.25rem; 
  height:auto;
  ${props=>props.theme.searchBlur};
  opacity: 0;
  top: 20px;
      &.fadein{
        opacity: 1;
        top: 0px;
        transition: all 1.5s ease-in-out;
      }
  ${props=> props.theme.laptop}{
     height: 12rem; //가운데를 위해
    }        
  ${props=> props.theme.tablet}{
      min-width: 80vw;
      width: 80vw;
    }
  ${props=> props.theme.mobile}{
     min-width: 90vw;
    }    
`;  

const ScrollDown = styled.span`
  position: absolute;
  bottom: 5%;
  width: 40px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity:0.6;
  > span{
    width: 24px; 
    height: 22px;
    margin-left: -12px;
    border-left: 1px solid ${props=> props.theme.anker};
    border-bottom: 1px solid ${props=> props.theme.anker};
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    animation: ${ScrollAni((`0,0`),(`-10px, 10px`))} 1.5s infinite;
    -webkit-animation: ${ScrollAni((`0,0`),(`-10px, 10px`))} 1.5s infinite;
    :nth-child(1){
      animation-delay: 0s;
    }
    :nth-child(2){
      animation-delay: 0.15s;
    }
    :nth-child(3){
      animation-delay: 0.3s;
    }
    ${props=> props.theme.mobile}{
      width: 19px; 
      height: 17px;
    }  
  }
  > P{
    margin-top: 2rem;
    margin-left: -12px;
    color: ${props=> props.theme.anker};
    font-size: 20px;
    ${props=> props.theme.laptop}{
      font-size: 18px;
      }
    ${props=> props.theme.tablet}{
      font-size: 16px;
      }  
    ${props=> props.theme.mobile}{
      font-size: 14px;
      }      
    }
`;

const ScrollTop = styled(ScrollDown)<{active: boolean}>`
  position: fixed;
  right: 40px;
  cursor: pointer;
  z-index: -10;
  opacity: 0;
  font-weight: bold;
  > span {
    width: 20px; 
    height: 18px;
    border-right: 1px solid ${props=> props.theme.anker};
    border-top: 1px solid ${props=> props.theme.anker};  
    border-left: none;
    border-bottom: none;
    animation: ${ScrollAni((`-10px, 10px`),(`0px, 0px`))} 1.5s infinite;  
    ${props=> props.theme.mobile}{
      width: 17px; 
      height: 15px;
    }  
  }
  ${(props)=> props.active && css`
      z-index: 100;
      opacity: 0.6;
    `}
  > p{
    font-size:14px;
    ${props=> props.theme.mobile}{
      font-size: 11px;
      }  
  }  
`;