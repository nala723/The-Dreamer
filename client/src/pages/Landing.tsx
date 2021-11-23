import React, {useEffect, useState} from 'react';
import styled, { css } from 'styled-components';
import Footer from '../components/Footer';
import SecondSection from '../components/landing/Second';
import { keyframes } from 'styled-components';
import SearchBar from '../components/reusable/SearchBar';

function Landing() {
  const txt = '오늘, 어떤 꿈을 꿨나요 ?';
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const [scrollY, setScrollY] = useState(0)

//부드러운 스크롤 구현할것 + 페이지 넘어갈때 부드러운 화면 전환

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
  },);  // 느낌 보고 나중에 다른 효과로 바꾸던지 하자 ex)https://www.moooi.com/eu/ 부드럽게 한그자씩

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
    watch(); // addEventListener 함수를 실행
    return () => {
      window.removeEventListener("scroll", handleScrollBtn);
    }; // addEventListener 함수를 삭제! 꼭 필요하다!
  });

  const handleSearch = (search: string) => {
    if(search === ''){
      return
    } // search를 갖고 그 페이지로 푸쉬..? 리덕스나.. 그걸 써야하낭
    
  }

  return (
      <Container>
        <MainSection>
          <ContentsBox >
            <h1>{text}</h1>
            <SearchBox  className={fadeIn? 'fadein': ''}>
              <SearchBar height='4.688rem' width='100%' scale='(1.0)' font='1.5rem' handleSearch={handleSearch}/>
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

const Container = styled.div`                /* 메인 컬러 그냥 white로 할까 */
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 376.75rem; */
  height: 728.24rem;
  background: ${props=> props.theme.landing};
`;
const MainSection = styled.section`
  position: absolute; 
  ${props=>props.theme.flexRow};
  height: calc(100vh - 4.375rem);
`;
const ContentsBox = styled.div`
   ${props=>props.theme.flexColumn};
    height:auto;
    gap:2.8rem;
    > h1 {
      letter-spacing: 0.4rem;
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
    /* -webkit-animation: sdb 1.5s infinite;
    animation: sdb 1.5s infinite; */
    :nth-child(1){
      animation-delay: 0s;
    }
    :nth-child(2){
      animation-delay: 0.15s;
    }
    :nth-child(3){
      animation-delay: 0.3s;
    }
  }
  > P{
    margin-top: 2rem;
    margin-left: -12px;
    color: ${props=> props.theme.anker};
    font-size: 20px;
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
  }
  ${(props)=> props.active && css`
      z-index: 100;
      opacity: 0.6;
    `}
  > p{
    font-size:14px;
  }  
`;