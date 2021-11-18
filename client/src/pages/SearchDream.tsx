import React, { useEffect, useState, useRef }  from 'react';
import axios from 'axios';
import styled from 'styled-components';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import CateGory from '../components/searchdream/Category';
import gsap from 'gsap';
import dotenv from 'dotenv';
dotenv.config();

function SearchDream(): JSX.Element { 
  const DreamRef = useRef<HTMLDivElement[]>([]);
  // const DreamGsap = useRef<gsap.core.Timeline>(); 함수가 안된다그래서 일단은..
  DreamRef.current = [];
  const [ result, setResult ] = useState([]);
  // useEffect 속에 타임라인 만들어두고,? 저 배열을 loop하며 함수에 전달-> 함수에서 타임라인 - 
  // 만들고 저 랜덤함수 인용?(해보고 안되면 add)

  // 해결할것 : 카테고리 문제와 드림 애니메이션 자연스럽게 돌아가는것
  let Position = [];
  let Xposition: number;
  let Yposition: number;

  useEffect(()=>{
    let tl: gsap.core.Timeline;
    // const tl = gsap.timeline({repeat: -1,  ease: 'Power1.easeInOut'});
    function random(min: number, max: number){
      return parseFloat((Math.random() * (max - min) + min).toFixed(2))
    }
    function floatingDream(dream: HTMLDivElement, size: number) {
      tl = gsap.timeline({repeat: -1,  ease: 'none', delay: 0.3});
       tl.to(
        dream,
        {
          x: random(-size,size),
          y: random(-size/2,size),
          duration: random(5, 10)
        }
      ).to(
        dream,
        {
          x: random(-size*2,size),
          y: random(size/2,size),
          duration: random(5, 10)
        }
      ).to(
        dream,
        {
          x: random(-size,size), // 원래 위치를 변수에 담아놨다 다시 오게하던지
          y: random(size,size),
          duration: random(5, 10)
        }
      )
    }
    DreamRef.current.forEach((dream)=>{
      floatingDream(dream, 60);
    })
    return ()=> {
      tl && tl.kill();
      // DreamGsap.current &&  DreamGsap.current.kill();
    }

  },[result])

  // useEffect(()=>{
  //   DreamGsap.current && DreamGsap.current.forEach((dream: gsap.core.Timeline)=>{
  //     dream.current.reversed(!dream.current.reversed());
  //   })
  // },[]);
  const handleSearch = async(search: string) => {
    if(search === ''){
      //something.. 모달? 
      return;
    } // 서버 만들어서 하자.
    await axios
    .get(process.env.REACT_APP_URL + `/search/search`,{
      params:{
        query: search + ' 꿈풀이',
      },
    })
    .then((re)=> setResult(re.data.items))
    .catch(err => console.log(err,"error"))
  }

  const handlePosition = (index: number) => {
    const quotient = (Math.floor(index / 3)) * 60;
    // let remainder = index % 3
    // if(remainder === 0 || remainder === 2){  // 어떠한 범위 내에서 랜덤하게 배치할수 있을듯 처음배치만 그렇게 하구
    //   remainder += 10
    // }else if(remainder === 1){
    //   remainder += 15
    // }

    if(index % 3 === 0){  
      Xposition = 15;
    }else if(index % 3 === 1){
      Xposition = 45;
    }else if(index % 3 === 2){
      Xposition = 75;
    }
    Yposition = quotient + (Math.floor(Math.random() * 10)) + 5
    Position = [Xposition + '%', Yposition + '%'];
    return Position;
  }


  const addToRefs = (el: HTMLDivElement) => {
    if (el && !DreamRef.current.includes(el)) {
      DreamRef.current.push(el);
    }
  };

  return (
    <Container>
      <SearchSection>
          <SearchBar height='3.125rem' width='34.438rem' scale='(0.7)' font='1.125rem' handleSearch={handleSearch}/>
      </SearchSection>
      <HashSection>
        <HashTag text='ddd'/>
        <HashTag text='로또 당첨되서 어쩌고 저쩌고 하는'/>
        <HashTag text='돼지 꿈'/>
        <HashTag text='잘되게 해주세요..'/>
        <HashTag text='제발'/>
        <HashTag text='취업하고 싶어요'/>
        <HashTag text='플리즈으으'/>
      </HashSection> 
      <DreamSection>
        {/* <DreamWrapper> */}
        {result && result.map((res :{title: string; description: string;}, idx) => {
          const position = handlePosition(idx);
          const [ x, y ] = position;
          return (
            <Dream ref={addToRefs} key={idx} top={y} left={x}>
              <DrContent>
                <Title>{res.title.replace(/[<][^>]*[>]/gi,'')}</Title>
                <Text>{res.description.replace(/[<][^>]*[>]/gi,'').slice(0,66)+ '...'}</Text>
              </DrContent>
            </Dream>
          )
        })}
        {/* </DreamWrapper>   */}
      </DreamSection> 
      <CateGory/>
    </Container>
  );
}

export default SearchDream;

const Container = styled.div`
  position: relative;             
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const SearchSection = styled.div`
  width: 100%;
  height: 5.688rem;
  display: flex;
  align-items: flex-end;
  padding-left: 19.438rem;
`;
const HashSection = styled.div`
  width: 100%;
  height: 3.5rem;
  margin-top: 0.3rem;
  display: flex;
  padding-top: 1.2rem;
  padding-left: 19.438rem;
  gap: 0.6rem;
`;
const DreamSection = styled.div`
  width: 100%;
  height: calc(100vh - 4.375rem - 9.487rem);
  position: relative;
`;
// const DreamWrapper = styled.div`
//   width: 100%;
//   height: inherit;
//   position: absolute;
// `;
const Dream = styled.div<{top: string; left: string;}>`
  position: absolute;
  width: 17.063rem;
  height: 17.063rem;
  border-radius: 100%;
  background: ${props=> props.theme.dream};
  opacity: 0.9;
  box-shadow: 0px 0px 30px 4px rgba(255, 207, 242, 0.5);
  top: ${props=>props.top};
  left: ${props=>props.left};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index:100;
`;
const DrContent = styled.div`
  width: calc(100% - 2rem);
  height: calc(100% - 1rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
`;
const Title = styled.h5`
  color: ${props=> props.theme.reverse};
  width: 100%;
  font-weight: bold;
`;
const Text = styled.p`
  color: ${props=> props.theme.reverse};
  width: 100%;
`;