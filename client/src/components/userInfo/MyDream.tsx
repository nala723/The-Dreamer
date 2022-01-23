import React, { useEffect, useRef, useState, useCallback } from "react";
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from '../reusable/SearchBar';
import { getTokenAct } from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../reducers';
import { Buffer } from "buffer";
import axios from "axios";
import { ReactComponent as Delete } from '../../assets/delete-icon.svg';
import PictureModal from '../reusable/PictureModal';
import Modal from '../reusable/Modal';
import Calender from "../reusable/Calender";
import { emotionList } from '../../config/dummyDatas';
import Dream from '../reusable/SingleDream';

export interface PicInterface {
  id : number;
  title: string;
  picture: string;
  createdAt: string;
  emotion: string;
}

function MyDream() {
  const { accessToken } = useSelector((state: RootState)=> state.usersReducer.user);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ picOpenModal, setPicOpenModal ] = useState(false);
  const [ openedPic, setOpenedPic ] = useState<PicInterface | null>(null);
  const [ options, setOptions ] = useState<string[]>([]);
  const [ input, setInput ] = useState('');
  const [ selected, setSelected ] = useState(-1);
  const [ hasText, sethasText ] = useState(false);
  const [ myPic, setMyPic ] = useState<PicInterface[]>([]); 
  const [ sortPic, setSortPic ] = useState<{
    latest: boolean, selectDate: string[], sortEmotion : string
  }>({ 
    latest: false, selectDate: [], sortEmotion : ''
  });
  const [ width, setWidth ] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const clickRef = useRef<any | null>(null);

  // 나중에 갤러리 애니메이션 이미지 랜덤한 타이밍으로 나오는 것 구현
  useEffect(() => {
    // getPictures(); // 임시 주석
    document.addEventListener('click',handleClickOutside);
    window.addEventListener('resize', getWidth);
    getWidth();
    return () => {
      document.removeEventListener('click',handleClickOutside);
      window.removeEventListener('resize', getWidth);
    }
  },[])

  function getWidth(){
    if(window.innerWidth <= 425){
      setWidth('mobile');
    }
    else if(window.innerWidth > 960){
      setWidth('');
    }
  }

  useEffect(()=>{
      getPictures();
  },[sortPic]) 

  const getPictures = () => {
      axios
        .get(process.env.REACT_APP_URL + '/mypage/mypics',{
          headers: {
            authorization : 'Bearer ' + accessToken
          }
        })
        .then((res)=>{
          if(res.headers.accessToken){
            dispatch(getTokenAct(res.headers.accessToken));
            console.log('?', res.headers.accessToken)
            }
          if(res.status === 200){
              const data = (res.data.arr).map((re: any)=>{
                re.createdAt = (re.createdAt).split('T')[0].slice(2).split('-').join('.')
                re.picture = (typeof re.picture !== 'object' && typeof re.picture === 'string') ?
                re.picture : "data:image/png;base64, " + Buffer.from(re.picture, 'binary').toString('base64');
                // 밑에 렌더링할때 날짜 문자열 자름 처리한것 수정 (위에서 이미 처리햇으므로)
                return re;
              })
              if(sortPic.latest || sortPic.selectDate.length > 0 || sortPic.sortEmotion){
                return handleSortPic(data);
              }
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
    }
  // 정규식으로 괄호 제거
   search = search.replace(/[[(){}]/gi,'') 
   const regex =  new RegExp(search,'gi');
   const searched = myPic.filter((el)=>{ 
   return  el.title.replace(/[[(){}]/gi,'').match(regex)
   }) 
   setMyPic(searched)
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
   
  // 정규식으로 괄호 제거
    search = search.replace(/[[(){}]/gi,'') 
    const regex =  new RegExp(search,'gi');
    const searched = myPic.filter((el)=>{
      return el.title.replace(/[[(){}]/gi,'').match(regex)
    }).map((el)=> {
      return el.title
    })
    setOptions(searched); 
  }

  const handleDropDownClick = (clickedOption: string) => {
    setInput(clickedOption);   
    handleSearch(clickedOption);
  };

  const handleKeyUp = useCallback((event : React.KeyboardEvent) => {
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
    console.log('hh', selected)
  },[selected, options]);
  // 전체 목록 조회
  const handleAllsearch = () => {
    setSortPic({...sortPic, latest: false, selectDate: [], sortEmotion: ''});
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
          dispatch(getTokenAct(res.headers.accessToken));
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
      // 최신 순: 전체보기와 같음
    // 마지막 순: 받은 것들 거꾸로
    // 날짜 받은 날짜 보고..일치하는 범위 혹은 날짜.

  const updateMenu = (arg: string | string[] ) => {
    if (typeof arg === 'string'){
      if (arg === 'oldest'){
          // getPictures();
        // setMyPic(dummyPics);
        setSortPic({...sortPic, latest: false, selectDate: [], sortEmotion: ''});
      }
      else if (arg === 'latest'){
        setSortPic({...sortPic, latest: true, selectDate: [], sortEmotion: ''});
      }
      else{
        setSortPic({...sortPic, latest: false, selectDate: [], sortEmotion: arg});
      }
    }
    else if (typeof arg === 'object'){
      setSortPic({...sortPic, latest: false, selectDate: arg, sortEmotion: ''});
    }
    // getPictures();
  }

  let newState: PicInterface[];
  
  const handleSortPic = (data: PicInterface[]) => {
    if(sortPic.latest && sortPic.selectDate.length <= 0 && !sortPic.sortEmotion){
      newState = [...data]
      newState = newState.reverse()
    }else if(sortPic.selectDate.length > 0 && !sortPic.latest && !sortPic.sortEmotion){
      newState = data.filter((el: any)=>{
        return (sortPic.selectDate.includes(el.createdAt))
      })
    }else if(sortPic.sortEmotion && !sortPic.latest && sortPic.selectDate.length <= 0){
      newState = data.filter((el: any)=>{
        return (sortPic.sortEmotion === el.emotion)
      })
    }
    setMyPic(newState)
    // setSorPic({latestPic: false, selectPic: [], sortEmotion: ''});
  }

  const handleClick = () => {
    setIsOpen(false)
  }

  const handlePicOpen = (pic: PicInterface) => {
    setOpenedPic(pic);
    setPicOpenModal(true);
  }
 
  const handlePicClose = () => {
    setPicOpenModal(false);
  }

  return (
    <Container>
      {isOpen && <Modal handleClick={handleClick}>검색하실 꿈을 입력해주세요.</Modal>}
      {openedPic && picOpenModal && <PictureModal handleClick={handlePicClose} picture={openedPic.picture}/>}
       <Title><h1>내가 그린 꿈</h1></Title>
       <UpperSection>
         <ResponsiveLeft>
            <Calender title={width? '날짜별' : '날짜별 보기'} updateMenu={updateMenu}/>
            <Calender title={width? '종류별' : '종류별 보기'} emotion='emotion' updateMenu={updateMenu}/>
            <RspAllsearch onClick={handleAllsearch} >
              <h5>전체보기</h5>
            </RspAllsearch > 
          </ResponsiveLeft>
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
        </ResponsiveRight>   
       </ UpperSection>   
       <DreamSection>
       {!myPic.length ? 
        <Dream header='그린 꿈이 없습니다.' gallery='gallery'>
          꿈 그리기 페이지에서 꿈을 그려주세요.
        </Dream>
        :
         <CardBox>
           { myPic.map((pic)=>{
             return(
               <Card key={pic.id}>
                 <Picture onClick={()=> handlePicOpen(pic)}>
                   <div>
                    <Delete onClick={(e)=> handleDislike(e,pic.id)}/>
                     <p>{pic.createdAt}</p>
                   </div>
                  <img src={pic.picture} alt='pic' />
                 </ Picture>
                 <Content>
                   <p>{pic.title}</p>
                   {emotionList.map((el)=>{
                     if(el.name === pic.emotion){
                       return el.img
                     }
                   })
                  }
                 </Content>
               </Card>
             )
           })}
        </CardBox>
        }
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
  ${props=> props.theme.midTablet}{
    text-align: center;
    padding: 0;
    padding-top: 1.5rem;
  }
  ${props=> props.theme.tablet}{
    padding-top: 1rem;
  }
  ${props=> props.theme.mobile}{
    padding-top: 0.6rem;
    height: 2.2rem;
    /* padding-bottom: 0.6rem;  타이틀 내리고싶으면*/
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
  width: 100%;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  color: #494161;
  top: 71px;
  padding: 0.5rem 0;
  border: none;
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 95;
  > li {
    padding: 0 1rem;
    &:hover {
      background-color: grey;
    }
    &.selected {
      background-color: grey;
    }
  }
  ${props=> props.theme.midTablet}{
    top: 50px;
  } 
  ${props=> props.theme.mobile}{
    top: 59px;
  } 
`;

const Allsearch = styled.div`
  min-width:  3.8rem;
  cursor: pointer;
  text-align: center;
  ${props=> props.theme.laptop}{
    min-width: 3.521rem;
    width: auto;
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
  width: 21rem;
  min-width: 15rem;
  gap: 3rem;
  height: 100%;
  ${props=> props.theme.laptop}{
    min-width: 14rem;
    gap: 2rem;
  }
  ${props=> props.theme.midTablet}{
    width: 16rem;
  }
  ${props=> props.theme.mobile}{
    width: 100%;
    height: 1.5rem;
    align-items: center;
  }
`;

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
    padding: 2rem 5rem;
    ${props=> props.theme.midTablet}{
    padding-top: 2.6rem;
  }  
    ${props=> props.theme.mobile}{
    min-height: 80vh;
    height: auto;
    padding: 2rem;
  }
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
const Picture = styled.div`
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