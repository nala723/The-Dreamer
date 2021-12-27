import React, { useEffect, useRef, useState } from "react";
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../reusable/SearchBar';
import { GetTokenAct } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers';
import { Buffer } from "buffer";
import axios from "axios";
import gsap from "gsap";
import { ReactComponent as Delete } from '../../assets/delete-icon.svg';
import { ReactComponent as Soso } from '../../assets/face-soso.svg';
import { ReactComponent as Wink } from '../../assets/face-wink.svg';
import { ReactComponent as Happy } from '../../assets/face-happy.svg';
import { ReactComponent as Bad } from '../../assets/face-bad.svg';
import { ReactComponent as What } from '../../assets/face-what.svg';
import PicModal from '../reusable/PicModal';
import Modal from '../reusable/Modal';

interface PicInter {
  id : number;
  title: string;
  picture: string;
  createdAt: string;
  emotion: string;
}

interface EmoInter {
      [index: string] : JSX.Element;
      soso : JSX.Element;
      wink :  JSX.Element;
      happy: JSX.Element;
      bad:  JSX.Element;
      what:  JSX.Element; 

}

function MyDream() {
  const { accessToken } = useSelector((state: RootState)=> state.usersReducer.user);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ picOpenModal, setPicOpenModal ] = useState(false);
  const [ openedPic, setOpenedPic ] = useState<PicInter | null>(null);
  const [ options, setOptions ] = useState<string[]>([]);
  const [ input, setInput ] = useState('');
  const [ selected, setSelected ] = useState(-1);
  const [ hasText, sethasText ] = useState(false);
  const [ myPic, setMyPic ] = useState<PicInter[]>([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const clickRef = useRef<any | null>(null);

  const emotionList: EmoInter = 
    {
        soso : <Soso/>,
        wink :  <Wink/>,
        happy: <Happy />,
        bad:  <Bad />,
        what:  <What /> 
  
    }
  // 나중에 갤러리 애니메이션 이미지 랜덤한 타이밍으로 나오는 것 구현

  useEffect(() => {
    getPictures();
    document.addEventListener('click',handleClickOutside);
    return () => {
      document.removeEventListener('click',handleClickOutside);
    }
  },[])

  const getPictures = () => {
      axios
        .get(process.env.REACT_APP_URL + '/mypage/mypics',{
          headers: {
            authorization : 'Bearer ' + accessToken
          }
        })
        .then((res)=>{
          if(res.headers.accessToken){
            dispatch(GetTokenAct(res.headers.accessToken));
            }
          if(res.status === 200){
              const data = (res.data.arr).map((re: any)=>{
                // console.log(re.picture)
                re.picture ="data:image/png;base64, " + Buffer.from(re.picture, 'binary').toString('base64');
                // console.log(re.picture)
                return re;
              })
              setMyPic(data);
            }    
        })
        .catch((err)=>{
          console.log(err)
          history.push('/notfound');
        })  
  }

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
    } // search, 혹은 option 을 살핀다.
    let regex: RegExp
    if(search.includes(']')){
      search = search.replace(/\[/gi,'') 
      regex =  new RegExp(search,'gi');
    }else{
      regex = new RegExp(search,'gi');
    }
  //  const searched = dream.filter((el)=>{ // 못찾는다.
  //    return el.title.match(regex) || el.description.match(regex)
  //  }) 
  //  setLikes(searched);
   sethasText(false);
  //  console.log(input,search,options,searched)
  }

  // input에 따른 dropbox 검색 위해
  const handleInput = (search: string) => {
    if(search !== ''){
      sethasText(true);
    }else{
      sethasText(false);
    }
    setInput(search);
   
    // let regex: RegExp
    // if(search.includes(']')){
    //   search = search.replace(/\[/gi,'') // 괄호 다제거하게하자..
    //   regex =  new RegExp(search,'gi');
    //   console.log(search,'search?')
    // }else{
    const regex = new RegExp(search,'gi');
    // // }
    // const searched = dream.filter((el)=>{
    //   return el.title.match(regex) || el.description.match(regex)
    // }).map((el)=> {
    //   return el.title.slice(0,30)
    // })
    // setOptions(searched); 
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
    // setLikes(dream);
  }
  const handleDislike = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    axios
      .delete(process.env.REACT_APP_URL + `/mypage/delete-pic/${id}`,
      {
        headers: {
          authorization : 'Bearer ' + accessToken
        }
      })
      .then((res)=>{
        if(res.headers.accessToken){
          dispatch(GetTokenAct(res.headers.accessToken));
          }
        if(res.status === 200){
          getPictures();
          }    
      })
      .catch((err)=>{
        console.log(err)
        history.push('/notfound');
      })  
  }

  const handleClick = () => {
    setIsOpen(false)
  }

  const handlePicOpen = (pic:  PicInter) => {
    setOpenedPic(pic);
    setPicOpenModal(true);
  }
 
  const handlePicClose = () => {
    setPicOpenModal(false);
  }

  return (
    <Container>
      {isOpen && <Modal handleClick={handleClick}>검색하실 꿈을 입력해주세요.</Modal>}
      {openedPic && picOpenModal && <PicModal handleClick={handlePicClose} pic={openedPic}/>}
       <Title><h1>내가 그린 꿈</h1></Title>
       <UpperSection>
          <CareHeader>
            <h5>날짜로 보기</h5>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </CareHeader> 
          <CareHeader>
            <h5>종류별 보기</h5>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </CareHeader>
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
       </ UpperSection> 
       <DreamSection>
         <CardBox>
           {myPic.map((pic)=>{
             return(
               <Card key={pic.id}>
                 <CardDiv onClick={()=> handlePicOpen(pic)}>
                   <div>
                    <Delete onClick={(e)=> handleDislike(e,pic.id)}/>
                     <p>{(pic.createdAt).split('T')[0]}</p>
                   </div>
                  <img src={pic.picture} alt='pic' />
                 </ CardDiv>
                 <Content>
                   <p>{pic.title}</p>
                   {emotionList[pic.emotion]}
                 </Content>
               </Card>
             )
           })}
        </CardBox>
       </DreamSection>   
    </Container>
  );
}

export default MyDream;

const Container = styled.div`            
  width: 100%;
  ${props=> props.theme.flexColumn};
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
`;
const UpperSection = styled.div`
  width: 100%;
  height: 5.688rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3rem; 
  padding-left: 5rem;
  color: ${props=> props.theme.text};
`;

const SearchSection = styled.div`
  width: auto;
  height: 5.688rem;
  display: flex;
  position: relative;
`;

const CareHeader = styled.div`
  width: 9.5rem;
  height: 1.7rem;
  color: ${props=> props.theme.text};
  display: flex;
  justify-content: space-between;
  padding: 0 1rem; // 임시 ***
  cursor: pointer;
  /* justify-content: space-evenly; //일단. 주석- */
  >svg {
    fill: ${props=> props.theme.transp};
    width: 1.125rem;
    height: 1rem;
    transform: scale(1.5);
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
  width:  3.8rem;
  margin-left: -0.7rem;
  cursor: pointer;
  text-align: center;
`;

const DreamSection = styled.div`
    width: 100%;
    height: calc(100vh - 4.375rem - 5.5rem - 5.688rem);
    padding: 2rem 5rem;
`;

const CardBox = styled.div`
  display: grid;
  width: 100%;
  min-height: 40rem;
  height: auto;
  grid-template-columns: repeat(auto-fill, minmax(16.188rem, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(17rem, 1fr));
  grid-auto-columns: minmax(16.188rem, 16.188rem);
  grid-auto-rows: minmax(17rem, 17rem);
  gap: 1.688rem 2rem;
  color: ${props=> props.theme.text};
`;

const Card = styled.div`
  display: flex;
  border-radius: 0.5rem;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  :hover{
    > div:nth-child(2) {
      >svg{
        fill: #FFFA81;
        transition: all 0.3s ease-in-out; //안됨
      }
    }
  }
  

`;
const CardDiv = styled.div`
    width: 100%;
    height: 80%;
    background-color: white;
    border-radius: 0.3rem;
    position: relative;
    overflow: hidden;
    >div,p,svg,img{
      transition: all 0.3s ease-in-out;
    }
    >div {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(73, 52, 52, 0.6);
      opacity: 0;
      /* display: none;
       */
      >p {
      position: absolute;
      color:  ${props => props.theme.reverse};
      font-size:  ${props => props.theme.fontS};
      right: 5px;
      bottom:  5px;
      color: white;
      }
    } 
  >img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.3rem;
  }
  :hover {
    >div,p,svg,img{
      transition: all 0.3s ease-in-out;
    }
      >div {
        ${props=> props.theme.flexColumn};
        justify-content: flex-start;
        opacity: 1;
        z-index: 10;
      >svg {
       fill: #f5b2c1;
       margin-top: 10px;
      }  
    }
    >img {
      transform: scale(1.3);
    }
  } 
`;
const Content = styled.div`
  ${props => props.theme.flexRow};
  height: 20%;
  justify-content: space-between;
  >p {
    width: 100%;
    text-indent: 0.6rem;
  }
  >svg {
    transition: all 0.3s ease-in-out;
    transform: scale(0.6);
  }
`;