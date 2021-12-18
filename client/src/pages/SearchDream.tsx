import React, { useEffect, useState, useRef }  from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { SearchDreamAct, LikeDrmAct, DisLikeDrmAct } from '../actions';
import { RootState } from '../reducers';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import CateGory from '../components/searchdream/Category';
import Modal from '../components/reusable/Modal';
import { ReactComponent as Heart } from '../assets/heart.svg';
import gsap from 'gsap';
import axios from 'axios';

function SearchDream(): JSX.Element { 
  const { loading, data, error } = useSelector((state: RootState) => state.searchReducer.search);
  const { username } = useSelector((state: RootState)=> state.usersReducer.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [like, setLike] = useState(false);
  const [banGuest, setBanGuest] = useState(false);
  const DreamRef = useRef<HTMLDivElement[]>([]);
  // const DreamGsap = useRef<gsap.core.Timeline>(); 함수가 안된다그래서 일단은..
  DreamRef.current = [];
  // useEffect 속에 타임라인 만들어두고,? 저 배열을 loop하며 함수에 전달-> 함수에서 타임라인 - 
  // 만들고 저 랜덤함수 인용?(해보고 안되면 add)

  // 해결할것 : 카테고리 문제와 드림 애니메이션 자연스럽게 돌아가는것 + /useLayoutEffect-깜박임수정
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

  },[data])
 
  const handleSearch = (search: string) => {
    if(search === ''){
      setIsOpen(true);
      return;
    } 
    dispatch(SearchDreamAct(search))
  }
  const handleLink = (e: React.MouseEvent ,link : string) => {
    e.preventDefault();
    return window.open(link);
  }
  const handlePosition = (index: number) => {
    const quotient = (Math.floor(index / 3)) * 60;
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
  // 꿈 모달 닫기
  const handleClick = () => {
    setIsOpen(false);
  }

  // likes
  const handleLike = (e : React.MouseEvent, idx: number) => {
    e.preventDefault();
    if(!username){
      banGuestLike();
      return
    }
    data[idx]['islike'] = true;
    setLike(!like);
    const date = new Date();
    const day = date.getFullYear() +'.'+ `${date.getMonth()+1}` + '.' + date.getDate()  
    const obj = {
      ...data[idx],
      likedate : day.slice(2)
    }
    const dataarr = [obj]
    dispatch(LikeDrmAct(dataarr));
  }

  const handleDislike = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    data[idx]['islike'] = false;
    setLike(!like);
    let splitarr: string[] | string = data[idx]['link'].split('=');
    splitarr = splitarr[splitarr.length-1]
    dispatch(DisLikeDrmAct(splitarr));
  }
 
  const banGuestLike = () => {
    setBanGuest(!banGuest);
  } 


  return (
    <Container>
      {isOpen && <Modal handleClick={handleClick}>검색하실 꿈을 입력해주세요.</Modal>}
      {banGuest && <Modal handleClick={banGuestLike}>로그인 후 이용가능한 서비스입니다.</Modal>}
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
        {data && data.map((res :{title: string; description: string; link: string;}, idx) => {
          const position = handlePosition(idx);
          const [ x, y ] = position;
          return (
            <Dream ref={addToRefs} key={idx} top={y} left={x}>
              <DrContent onClick={(e)=> handleLink(e,res.link)}>
                <Title>{res.title}</Title>
                <Text>{res.description.slice(0,66)+ '...'}</Text>
              </DrContent>
              {!data[idx]['islike']? 
                <StyledHeart onClick={(e)=> handleLike(e,idx)} fill='' /> 
                :
              <StyledHeart onClick={(e)=> handleDislike(e,idx)} fill='likes' />} 
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


const bounceHeart = keyframes`
  0% {
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1.0);
  }
`;

const cancleHeart = keyframes`
  0% {
    transform: scale(1.0);
  }
  70% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0.8);
  }
`;

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
  ${props=> props.theme.flexColumn};
  width: 17.063rem;
  height: 17.063rem;
  border-radius: 100%;
  background: ${props=> props.theme.dream};
  opacity: 0.9;
  box-shadow: 0px 0px 30px 4px rgba(255, 207, 242, 0.5);
  top: ${props=>props.top};
  left: ${props=>props.left};
  z-index: 50;
`;
const DrContent = styled.div`
 ${props=> props.theme.flexColumn};
  width: calc(100% - 2rem);
  height: calc(100% - 6rem);
  border-radius: 100%;
  gap: 1.5rem;
  text-align: center;
  cursor: pointer;
`;
const Title = styled.h5`
  color: ${props=> props.theme.reverse};
  padding-top: 1rem;
  line-height: 1.1rem;
  width: 90%;
  font-weight: bold;
`;
const Text = styled.p`
  color: ${props=> props.theme.reverse};
  width: 100%;
`;
const StyledHeart = styled(Heart)<{fill: string}>`
  ${props=> props.fill ? css`
  fill: #E57E8B;
  animation: ${bounceHeart} 0.4s ease-in-out;`
  : css`
  fill: #E0ACAC;
  animation: ${cancleHeart} 0.4s ease-in-out;
  transform: scale(0.8);
  `}
  cursor: pointer;
  :hover {
    transform: scale(1.0);
    fill: #E57E8B;
  }
`;
 