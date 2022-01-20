import React, { useEffect, useState, useRef }  from 'react';
import { useHistory } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { searchDreamAct,  getTokenAct, likeDrmAct, disLikeDrmAct, removeDrmAct } from '../actions';
import { RootState } from '../reducers';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import CateGory from '../components/searchdream/Category';
import Modal from '../components/reusable/Modal';
import { ReactComponent as Heart } from '../assets/heart.svg';
import gsap from 'gsap';
import axios from 'axios';
import { Data } from '../actions/index';
import { useCallback } from 'react';

function SearchDream(): JSX.Element { 
  const { loading, data, error } = useSelector((state: RootState) => state.searchReducer.search);
  const { username, accessToken } = useSelector((state: RootState)=> state.usersReducer.user);
  const dispatch = useDispatch();
  const history = useHistory();
  // const [ dreams, setDreams] = useState(data?.slice(0,9)); // 추후
  const [isOpen, setIsOpen] = useState(false);
  const [banGuest, setBanGuest] = useState(false);
  const [width, setWidth] = useState('');
  // const loadRef = useRef<HTMLHeadingElement | null>(null);
  const dreamRef = useRef<HTMLDivElement[]>([]);
  dreamRef.current = [];
  // useEffect 속에 타임라인 만들어두고, 저 배열을 loop하며 함수에 전달-> 함수에서 타임라인 - 

  // 해결할것 :  드림 애니메이션 자연스럽게 돌아가는것 + /useLayoutEffect-깜박임수정
  let Position = [];
  let quotient: number;
  let Xposition: number;
  let Yposition: number;

  useEffect(()=>{
    // if(data.length > 0 && dreams.length < 9) { 
    //   setDreams(data.slice(0,9));
    // }
    // 처음에 렌더링 + 첫렌더링 이후에 데이터가 없으므로 데이터 받아온 이후에 채워줘야 한다.
    // 데이터를 받아온 이후엔 당연히 기존 스테이트 업데이트하고, 
    let floatTimeline: gsap.core.Timeline;
    // const tl = gsap.timeline({repeat: -1,  ease: 'Power1.easeInOut'});
    function random(min: number, max: number){
      return parseFloat((Math.random() * (max - min) + min).toFixed(2))
    }
    function floatingDream(dream: HTMLDivElement, size: number) {
      floatTimeline = gsap.timeline({repeat: -1,  ease: 'none', delay: 0.3});
      
      floatTimeline.to(
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
    dreamRef.current.forEach((dream)=>{
      floatingDream(dream, 60);
    })
    return ()=> {
      floatTimeline && floatTimeline.kill();
    }

  },[data])

  // 처음 한번 이벤트 걸어볼까? 그러고 이 안에서 함수만들고 그에 따라 상태값변하게
  useEffect(()=>{
    window.addEventListener('resize', getWidth);
    getWidth();
    return (()=>{
      window.removeEventListener('resize', getWidth);
      dispatch(removeDrmAct())
    })
  },[])  
  
  // const handleObserver = useCallback((entries)=>{ // 인피니트 스크롤하려햇는데
  //   if(data.length <= 9) return;
  //   if(data.length === dreams.length) return;
  //   const target = entries[0];
  //   if(target.isIntersecting) {
  //     // 애초에 결과물, data의 길이가 9이하라면 그냥 리턴
  //     // data의 길이 === 현 dreams 길이 라면 리턴
  //      // dreams의 마지막 index + 1에서 마지막 index + 10한 것까지
  //      setDreams([...dreams, ...data.slice(dreams.length, dreams.length + 9)]) 
  //   }
  // },[])
  
  //  useEffect(()=>{
  //   const observer = new IntersectionObserver(handleObserver);
  //   if (loadRef.current) observer.observe(loadRef.current);
  // },[ handleObserver])

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
    dispatch(searchDreamAct(search))
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
    Yposition = quotient + (Math.floor(Math.random() * 10)) + 3
    Position = [Xposition + '%', Yposition + '%'];
    return Position;
  }

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !dreamRef.current.includes(el)) {
      dreamRef.current.push(el);
    }
  };
  // 꿈 모달 닫기
  const handleClick = () => {
    setIsOpen(false);
  }

  // likes
  const handleLike = async (e : React.MouseEvent, idx: number) => {
    e.preventDefault();
    if(!username){
      banGuestLike();
      return
    }
      await axios
      .post(process.env.REACT_APP_URL + '/search/like',{
        url: data[idx].link,
        content: data[idx].description,
        title: data[idx].title
      },{
        headers: {
          authorization: `Bearer ` + accessToken
        }
      })
      .then((res)=> {
        if(res.headers.accessToken){
            dispatch(getTokenAct(res.headers.accessToken));
            }
        if(res.status === 200){
             if(res.data.likeId){

              const likeData = [{
                 ...data[idx],
                 id: res.data.likeId
               }] //수정해봐?
               dispatch(likeDrmAct(likeData))
            }
         }
         else{
             history.push('/notfound');
         }
      })
      .catch(error=>
         console.log(error) 
      )
    }

 console.log('data??', data)
  const handleDislike = async(e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const dreamId = id
    await axios
      .delete(process.env.REACT_APP_URL + `/search/dislike/${dreamId}`,{
        headers: {
          authorization: `Bearer ` + accessToken
        }
      })
      .then((res)=> {
        if(res.headers.accessToken){
            dispatch(getTokenAct(res.headers.accessToken));
          }
        if(res.status === 200){
               dispatch(disLikeDrmAct(dreamId))
          }
        else{
             history.push('/notfound');
        }
      })
      .catch(error=>
         console.log(error) 
      )
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
      <HashTag handleSearch={handleSearch} />
      <DreamSection>
        {data.length === 0
          ?
          <Dream ref={addToRefs} top='20%' left='45%'>
            <DrContent>
              <Title>검색한 꿈 혹은 결과가 없습니다.</Title>
              <Text>상단의 검색바에서 꿈을 검색해 주세요.</Text>
            </DrContent>
          </Dream>
          :
          data.map((res :{title: string; description: string; link: string; id: number;}, idx) => {
            const position = handlePosition(idx);
            const [ x, y ] = position;
            return (
              <Dream ref={addToRefs} key={idx} top={y} left={x}>
                <DrContent onClick={(e)=> handleLink(e,res.link)}>
                  <Title>{res.title}</Title>
                  <Text>{res.description}</Text>{/*ref={data.length - 1 === idx ? loadRef : null} */}
                </DrContent>
                { (!data[idx]['id']) ? 
                  <StyledHeart onClick={(e)=> handleLike(e,idx)} fill='' /> 
                  :
                <StyledHeart onClick={(e)=> handleDislike(e,res.id)} fill='likes' />} 
              </Dream>
            )})
          }
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
  min-height: calc(100vh - 4.375rem);
  height: auto;
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
const DreamSection = styled.div`
  width: 100%;
  min-height: calc(100vh - 4.375rem - 5.688rem - 3.498rem);
  position: relative;
  top: 4rem;
  ${props=> props.theme.laptop}{
    top: 6.5rem;
    min-height: calc(100vh - 4.375rem - 5.688rem - 6.396rem);
  }
  ${props=>props.theme.tablet}{
    min-height: calc(100vh - 4.375rem - 4.125rem - 5.549rem);
  }
  ${props=>props.theme.mobile}{
    top: 4rem;
    min-height: calc(100vh - 3.6rem - 3.399rem - 3.2rem);
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
 