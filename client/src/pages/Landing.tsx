import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Footer from '../components/Footer';
import SecondSection from '../components/landing/Second';

function Landing() {
  const txt = '오늘, 어떤 꿈을 꿨나요 ?';
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  //부드러운 스크롤 구현할것

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

  return (
      <Container>
        <MainSection> 
          <ContentsBox >
            <h1>{text}</h1>
            <SearchBox  className={fadeIn? 'fadein': ''}>
              <img src="/images/search-icon.svg" alt="search"/>
              <SearchBar placeholder= 'Search your dream..' type="search">
              </SearchBar>
            </SearchBox>
          </ContentsBox >
        </MainSection>
        <SecondSection /> 
        <Footer />
      </Container>
  );
}


export default Landing;


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
    >img {
      position: absolute;
      cursor: pointer;
      right: 2%;
      bottom: 30%;
    }
`;  
const SearchBar = styled.input`
  background-color: ${props=> props.theme.transp};
  display: flex;
  align-items: center;
  width: 100%;
  height: 4.688rem;
  padding-right: 3.7rem;
  padding-bottom: 0.3rem;
  font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
  font-size: ${props=>props.theme.fontL};
    ::placeholder{
      color: #555562;
    }
    ::-ms-clear,
    ::-ms-reveal{
      display:none;width:0;height:0;
    }
    ::-webkit-search-decoration,
    ::-webkit-search-cancel-button,
    ::-webkit-search-results-button,
    ::-webkit-search-results-decoration{
      display:none;
    }
`;
// const FinalSection = styled(MainSection)`
//   top: 650rem;
//   height: 100vh;
// `;
