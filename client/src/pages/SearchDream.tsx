import React, { useEffect, useState, useRef }  from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { SearchDreamAct, LikeDrmAct, DisLikeDrmAct } from '../actions';
import { RootState } from '../reducers';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import CateGory from '../components/searchdream/Category';
import Modal from '../components/reusable/Modal';
import { hashTagList } from '../config/dummyDatas';
import { ReactComponent as Heart } from '../assets/heart.svg';
import gsap from 'gsap';

function SearchDream(): JSX.Element { 
  const { loading, data, error } = useSelector((state: RootState) => state.searchReducer.search);
  const { username } = useSelector((state: RootState)=> state.usersReducer.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [like, setLike] = useState(false);
  const [banGuest, setBanGuest] = useState(false);
  const [width, setWidth] = useState('');
  const DreamRef = useRef<HTMLDivElement[]>([]);
  DreamRef.current = [];
  // useEffect 속에 타임라인 만들어두고,? 저 배열을 loop하며 함수에 전달-> 함수에서 타임라인 - 
  // 만들고 저 랜덤함수 인용?(해보고 안되면 add)

  // 해결할것 : 카테고리 문제와 드림 애니메이션 자연스럽게 돌아가는것 + /useLayoutEffect-깜박임수정
  let Position = [];
  let quotient: number;
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


  // 처음 한번 이벤트 걸어볼까? 그러고 이 안에서 함수만들고 그에 따라 상태값변하게
  useEffect(()=>{
    window.addEventListener('resize', getWidth);
    getWidth();
    return (()=>{
      window.removeEventListener('resize', getWidth);
    })
  },[])
  

  function getWidth(){
    if(window.innerWidth <= 960 && window.innerWidth > 425){
      setWidth('midTablet');
    }
    if(window.innerWidth <= 425){
      setWidth('mobile');
    }
    else if(window.innerWidth > 960){
      setWidth('');
    }
  }

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
   
    if(width === 'midTablet'){
      quotient = (Math.floor(index / 2)) * 60;
      if(index % 2 === 0){  
        Xposition = 15;
      
      }else if(index % 2 === 1){
        Xposition = 60;
      }
    }
    else if(width === 'mobile'){
      quotient = index * 60;
      Xposition = 20;
    }
    else if(width === ''){
      quotient = (Math.floor(index / 3)) * 60;
      if(index % 3 === 0){  
        Xposition = 15;
      }else if(index % 3 === 1){
        Xposition = 45;
      }else if(index % 3 === 2){
        Xposition = 75;
      }
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
      <HashSection mobile={width === 'mobile'}>
        {width === 'mobile' ? 
          <HashTag text='추천태그'/>
          :
          hashTagList.map((tag, idx)=>{
            return( <HashTag text={tag} key={idx} handleSearch={()=>handleSearch(tag)}/>)
          })
        }
      </HashSection> 
      <DreamSection>
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
  ${props=> props.theme.mobile}{
   align-items: center;
   min-height: calc(100vh - 3.6rem);
   height: auto;
  }
`;
const SearchSection = styled.div`
  width: 100%;
  height: 5.688rem;
  display: flex;
  align-items: flex-end;
  padding-left: 19.438rem;
  ${props=> props.theme.midTablet}{
    padding-left: 13rem;
  }
  ${props=> props.theme.tablet}{
    padding-left: 10.1rem;
    padding-top: 1rem;
    align-items: flex-start;
    height: auto;
    max-width: 97%;
  }
  ${props=> props.theme.mobile}{
   width: 91vw;
   padding-left: 0; 
   padding-top: 0.5rem;
  }
`;
const HashSection = styled.div<{mobile: boolean;}>`
  max-width: 100%;
  /* min-height: 3.5rem; */
  height: auto;
  margin-top: 0.3rem;
  display: flex;
  flex-wrap: wrap;
  padding-top: 1.2rem;
  padding-left: 19.438rem;
  gap: 0.6rem;
  ${props=> props.theme.midTablet}{
    padding-left: 13rem;
  }
  ${props=> props.theme.tablet}{
    padding-left: 10.1rem;
    margin: 0;
  }
  ${props=> props.theme.mobile}{
    width: 100%;
    justify-content: flex-end;
    padding-right: 1.2rem;
    padding-left: 0;
  }
`;
const DreamSection = styled.div`
  width: 100%;
  height: calc(100vh - 4.375rem - 9.487rem);
  position: relative;
  ${props=> props.theme.tablet}{
    height: calc(100vh - 4.375rem - 9.187rem);
  }
`;
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
  @media only screen and (max-width: 1024px) and (min-width: 769px){ // ipad Pro 사이즈
    top: ${props=> `calc(${props.top} / 2 )`}; 
    left: ${props=> `calc(${props.left} - 3rem )`}; 
  }
  @media only screen and (max-width: 768px) and (min-width: 600px){ // ipad Pro 사이즈
    top: ${props=> `calc(${props.top} / 1.3 )`}; 
  }
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
  color: #494161;
  padding-top: 1rem;
  line-height: 1.1rem;
  width: 90%;
  font-weight: bold;
`;
const Text = styled.p`
  color: #494161;
  width: 100%;
  ${props=> props.theme.mobile}{
    font-size: 15px;
    line-height: 1.1rem;
  }
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
 