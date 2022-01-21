 import React, { useEffect, useState, useRef }  from 'react';
import styled from 'styled-components';
import SearchBar from '../reusable/SearchBar';
import Modal from '../reusable/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers';
import { getTokenAct } from '../../actions';
import { ReactComponent as Delete } from '../../assets/delete-icon.svg';
import gsap from 'gsap';
import Calender from '../reusable/Calender';
import { Data } from '../../actions'; 
import axios from 'axios';

 function MyLikes() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState)=> state.usersReducer.user);
  const [ dream, setDream ] = useState<Data[]>([]);
  const [ options, setOptions ] = useState<string[]>([]);
  const [ input, setInput ] = useState('');
  const [selected, setSelected] = useState(-1);
  const [hasText, sethasText] = useState(false);
  const [width, setWidth] = useState('');
  const [ sortLike, setSorLike ] = useState<{
    latestLike: boolean, selectLike: string[]
  }>({ 
    latestLike: false, selectLike: []
  });
  const clickRef = useRef<any | null>(null);
  const dreamRef = useRef<HTMLDivElement[]>([]);

  dreamRef.current = [];
  let Position = [];
  let quotient: number;
  let Xposition: number;
  let Yposition: number;

  useEffect(() => {
    getLikes();
    window.addEventListener('resize', getWidth);
    getWidth();
    document.addEventListener('click',handleClickOutside);
    return () => {
      window.removeEventListener('resize', getWidth);
      document.removeEventListener('click',handleClickOutside);
    }
  },[])

  useEffect(()=>{
    if(sortLike.latestLike || sortLike.selectLike.length > 0){
      return handleSortLike(dream);
    }
  },[sortLike])

  useEffect(()=>{
    let timeline: gsap.core.Timeline;
    function random(min: number, max: number){
      return parseFloat((Math.random() * (max - min) + min).toFixed(2))
    }
    function floatingDream(dream: HTMLDivElement, size: number) {
      timeline = gsap.timeline({repeat: -1,  ease: 'none', delay: 0.3});
      
      timeline.to(
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
          x: random(-size,size), 
          y: random(size,size),
          duration: random(5, 10)
        }
      )
    }
    dreamRef.current.forEach((dream)=>{
      floatingDream(dream, 60);
    })
    return ()=> {
      timeline && timeline.kill();
      // DreamGsap.current &&  DreamGsap.current.kill();
    }

  },[dream])


  const getLikes = () => {
          axios
            .get(process.env.REACT_APP_URL + '/mypage/like',{
              headers: {
                  authorization: `Bearer ` + accessToken
                  }
            })
            .then(res=>{    
              console.log(res.data);
              if(res.headers.accessToken){
                dispatch(getTokenAct(res.headers.accessToken));
              }
              setDream(res.data.dream);
            })
            .catch(err=>{
              console.log(err);
            })
  }

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
    if (el && !dreamRef.current.includes(el)) {
      dreamRef.current.push(el);
    }
  };

  // 바깥 클릭시 드롭박스 없어지게
  const handleClickOutside = (e: MouseEvent) => {
    if(clickRef.current && !clickRef.current.contains(e.target)){
      sethasText(false);
    }
  }


  // 서치하기 위함
  const handleSearch = (search: string) => {
    if(search === ''){
      setIsOpen(true);
      return;
    } 
    // 정규식으로 괄호 제거
   search = search.replace(/[[(){}]/gi,'') 
   const regex =  new RegExp(search,'gi');
   const searched = dream.filter((el)=>{ 
   return  el.title.replace(/[[(){}]/gi,'').match(regex) || el.content.replace(/[[(){}]/gi,'').match(regex)
   }) 
   setDream(searched);
   sethasText(false);
  }

  // input에 따른 dropbox 검색 위해
  const handleInput = (search: string) => {
    if(search !== ''){
      sethasText(true);
    }else{
      sethasText(false);
    }
    setInput(search);
   
    search = search.replace(/[[(){}]/gi,'') 
    const regex =  new RegExp(search,'gi');
    const searched = dream.filter((el)=>{
      return  el.title.replace(/[[(){}]/gi,'').match(regex) || el.content.replace(/[[(){}]/gi,'').match(regex)
    }).map((el)=> {
      return el.title.slice(0,30)
    })
    setOptions(searched); 
  }

  const handleDropDownClick = (clickedOption: string) => {
    setInput(clickedOption);   
    handleSearch(clickedOption);
  };
  const handleKeyUp = (event : React.KeyboardEvent) => {
    event.preventDefault();
    if (
      event.getModifierState("Fn") ||
      event.getModifierState("Hyper") ||
      event.getModifierState("OS") ||
      event.getModifierState("Super") ||
      event.getModifierState("Win")
    )
      return;
    // if (
    //   event.getModifierState("Control") +
    //     event.getModifierState("Alt") +
    //     event.getModifierState("Meta") >
    //   1
    // )
    //   return;
    if (hasText) {
      if (event.code === "ArrowDown" && options.length - 1 > selected) {
        setSelected(selected + 1);
      }
      if (event.code === "ArrowUp" && selected >= 0) {
        setSelected(selected - 1);
      }
      if (event.code === "Enter" && selected >= 0) {
        handleDropDownClick(options[selected]);
        setSelected(-1);
      }
    }
  };


  // 전체 목록 조회
  const handleAllsearch = () => {
    getLikes();
  }

  const updateMenu = (arg: number | string[] ) => {
    if(typeof arg === 'string'){
      if (arg === 'latest'){
        // getPictures();
       getLikes();
       setSorLike({latestLike: false, selectLike: []});
      }
      else if (arg === 'oldest'){
        // if(dream[0].likedate >= dream[dream.length-1].likedate){
        //   return;
        // }
        setSorLike({latestLike: true, selectLike: []});
      }
    }
    else if (typeof arg === 'object'){
      setSorLike({latestLike: false, selectLike: arg});
    }

  }

  let newState : Data[]

  const handleSortLike = (data: Data[]) => {
 
    if(sortLike.latestLike && sortLike.selectLike.length <= 0){
      newState = [...data]
      newState = newState.reverse()
    }
    if(sortLike.selectLike.length > 0 && !sortLike.latestLike){
      newState = data.filter((el: any)=>{
        return (sortLike.selectLike.includes(el.createdAt))
      })
    }
    setDream(newState)
  }

  // 꿈 모달 닫기
  const handleClick = () => {
    setIsOpen(false);
  }
 // 꿈 삭제
  const handleDislike = (e: React.MouseEvent, id?: number) => {
    e.preventDefault();
    const dreamId = id
    axios
      .delete(process.env.REACT_APP_URL + `/search/dislike/${dreamId}`,{
        headers: {
          authorization : 'Bearer ' + accessToken
        }
      })
      .then(res=>{
        console.log(res.data);
        if(res.headers.accessToken){
          dispatch(getTokenAct(res.headers.accessToken));
        }
        const deleted = dream.filter(el=>{
          return el.dream_id !== id
        })
        setDream(deleted);
      })
      .catch(err=>{
        console.log(err);
      })
  }


   return (
    <>
     <Container>
      {isOpen && <Modal handleClick={handleClick}>검색하실 꿈을 입력해주세요.</Modal>}
        <Title><h1>좋아하는 꿈</h1></Title>
        <UpperSection >
          <ResponsiveLeft>
            <Calender title={width? '날짜별' : '날짜별 보기'} updateMenu={updateMenu}/> 
            <RspAllsearch onClick={handleAllsearch} >
              <h5>전체보기</h5>
            </RspAllsearch > 
          </ ResponsiveLeft>
          <ResponsiveRight >      
          <SearchSection onKeyUp={handleKeyUp} ref={clickRef}>
            <SearchBar height='3.125rem' width='34.438rem' scale='(0.7)' font='1.125rem' handleSearch={handleSearch} handleInput={handleInput} input={input}/>
            {hasText ? (
            <DropDownContainer>
                {options.map((option, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleDropDownClick(option)}
                    className={selected === idx ? "selected" : ""}
                    role="presentation" 
                  >
                    {option}
                  </li>
                ))}
              </DropDownContainer>
            ) : null}
            </SearchSection>
            <Allsearch onClick={handleAllsearch}>
            <h5>전체보기</h5>
            </Allsearch>
          </ ResponsiveRight >
        </ UpperSection>
        <DreamSection>
        {dream.length === 0
          ?
          <Dream ref={addToRefs} top='20%' left='45%'>
            <DreamContent>
              <DreamTitle>좋아하는 꿈이 없습니다.</DreamTitle>
              <Text>꿈 알아보기 페이지에서 하트 아이콘을 눌러 꿈을 저장할 수 있습니다.</Text>
            </DreamContent>
          </Dream>
          :
         dream.map((res, idx) => {
          const position = handlePosition(idx);
          const [ x, y ] = position;
          return (
            <Dream ref={addToRefs} key={res.dream_id} top={y} left={x}>
              <Delete onClick={(e)=> handleDislike(e,res.dream_id)}/>
              <DreamContent onClick={(e)=> handleLink(e,res.url)}>
                <DreamTitle>{res.title}</DreamTitle>
                <Text>{res.content}</Text>
              </DreamContent>
              <Date>{res.createdAt.split('T')[0].slice(2)}</Date>
            </Dream>
          )
        })}
        </DreamSection>
      </Container>
    </>
   );
 }

 export default MyLikes;

const Container = styled.div`            
  ${props=> props.theme.flexColumn};
  height: 100%;
  justify-content: flex-start;
  overflow: auto;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
    ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const Title = styled.div`
  width: 100%;
  height: 5.5rem;
  padding-top: 2.313rem;
  padding-left: 7.313rem;
  h1{
    font-size: ${props=>props.theme.fontL};
  }
  ${props=> props.theme.midTablet}{
    text-align: center;
    padding: 0;
    padding-top: 1.5rem;
  }
  ${props=> props.theme.tablet}{
    padding-top: 1rem;
    height: 3.5rem;
  }
  ${props=> props.theme.mobile}{
    padding-top: 0.6rem;
    height: 2.2rem;
  }
`;

const UpperSection = styled.div`
  width: 100%;
  height: 5.688rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem; 
  padding: 0 2rem 0 5rem;
  color: ${props=> props.theme.text};
  ${props=> props.theme.laptop}{
    padding:0 3.5rem;
    font-size: 15px;
  } 
  ${props=> props.theme.midTablet}{
    flex-direction: column-reverse;
    padding-left: 3rem;
  } 
  ${props=> props.theme.midTablet}{
    flex-direction: column-reverse;
    align-items: flex-start;
    padding:0 4.9rem;
    gap: 1rem;
  } 
  ${props=> props.theme.mobile}{
    padding: 0 1rem;
    justify-content: center;
    gap: 0;
    height: auto;
  }
`;

const ResponsiveRight = styled.div`
    ${props=> props.theme.flexRow};
    height: 5.688rem;
    justify-content: flex-start;
    gap: 3rem;
  ${props=> props.theme.laptop}{
    gap: 2rem;
  }   
  ${props=> props.theme.tablet}{
    gap: 1rem;
  }
  ${props=> props.theme.mobile}{
    justify-content: center;
    max-width: 91vw;
    height: 4.5rem;
  }
`;

const SearchSection = styled.div`
  max-width: 100%;
  width: auto;
  height: 100%;
  display: flex;
  position: relative;
  ${props=> props.theme.tablet}{
    max-width: 85%;
  }
  ${props=> props.theme.mobile}{
    max-width: 91vw;
    height: 4.5rem;
  }
`;

const DropDownContainer = styled.ul`
  background-color: ${props=> props.theme.transp};
  display: block;
  width: 34.438rem;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  color: ${props=> props.theme.reverse};
  top: 71px;
  padding: 0.5rem 0;
  border: none;
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 3;
  > li {
    padding: 0 1rem;
    &:hover {
      background-color: grey;
    }
    &.selected {
      background-color: grey;
    }
  }
`;

const Allsearch = styled.div`
  min-width: 3.521rem;
  text-align: center;
  cursor: pointer;
  ${props=> props.theme.laptop}{
    min-width: 3.521rem;
    width: auto;
    /* margin-left:1rem; */
  } 
  ${props=> props.theme.tablet}{
    min-width: 15%;
    margin: 0;
  }
  ${props=> props.theme.mobile}{
    display: none;
  }
`;

const ResponsiveLeft = styled.div`
  display: flex;
  position: relative;
  width: 9rem;
  min-width: 7rem;
  gap: 3rem;
  height: 100%;
  ${props=> props.theme.laptop}{
    gap: 2rem;
  }
  ${props=> props.theme.midTablet}{
    /* width: 16rem; */
  }
  ${props=> props.theme.mobile}{
    width: 100%;
    height: 1.5rem;
    align-items: center;
  }
`;

{/* const RspCareHeader = styled(CareHeader)`
  ${props=> props.theme.midTablet}{
    width: 6.5rem;
    display: flex;
    padding: 0;
  }
`; */}
const RspAllsearch = styled(Allsearch)`
  display: none;
  ${props=> props.theme.mobile}{
    color: ${props=> props.theme.text};
    display: flex;
    align-items: center;
    width:100%;
    justify-content: flex-end;
  }
`;

const DreamSection = styled.div`
    width: 100%;
    height: calc(100vh - 4.375rem - 5.5rem - 5.688rem);
    position: relative;
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
  >svg {
   display: none;
   margin: 0;
  }
  :hover{
    >svg {
   display: block;
   cursor: pointer;
   fill: #DF899D;
   /* margin-bottom: -1rem; //위치 나중 수정 */
    }
  }
  @media only screen and (max-width: 1024px) and (min-width: 769px){ 
    top: ${props=> `calc(${props.top} / 2 )`}; 
    left: ${props=> `calc(${props.left} - 3rem )`}; 
  }
  @media only screen and (max-width: 768px) and (min-width: 600px){ 
    top: ${props=> `calc(${props.top} / 1.3 )`}; 
  }
`;
const DreamContent = styled.div`
 ${props=> props.theme.flexColumn};
  width: calc(100% - 2rem);
  height: calc(100% - 6rem);
  border-radius: 100%;
  gap: 1.5rem;
  text-align: center;
  cursor: pointer;
`;
const DreamTitle = styled.h5`
  color: #494161;
  padding-top: 1rem;
  line-height: 1.1rem;
  width: 90%;
  font-weight: bold;
`;
const Text = styled.p`
  color: #494161;
  width: 100%;
`;
const Date = styled.p`
  color: #a38a8a;
  font-size: ${props=> props.theme.fontS};
`;
