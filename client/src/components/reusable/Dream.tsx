import React, { useEffect, useState, useRef }  from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ReactComponent as Heart } from '../../assets/heart.svg';
import gsap from 'gsap';
import { Data } from '../../actions/index';
import { ReactComponent as Delete } from '../../assets/delete-icon.svg';

interface DreamProps {
  header?: string;
  children?: string;
  data?: Data[];
  handleLike?: (e : React.MouseEvent, idx: number) => void;
  handleDislike?: (e: React.MouseEvent, id?: number) => void;
  handleWidth?: (arg: string) => void;
}

function SingleDream(props: DreamProps) {
  const [width, setWidth] = useState('');
  // const loadRef = useRef<HTMLHeadingElement | null>(null);
  const dreamRef = useRef<HTMLDivElement[]>([]);
  dreamRef.current = [];
  const { header, children, data, handleLike, handleDislike, handleWidth } = props;
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
      if(window.innerWidth > 960){
        setWidth('');
        return handleWidth && handleWidth('');
      }
      handleWidth && handleWidth('mobile');
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

  return (
    <>
    {header
      ?
      <EmptyData ref={addToRefs}>
        <Content>
          <Title>{header}</Title>
          <Text>{children}</Text>
        </Content>
      </EmptyData>
      :
      data && data.map((res, idx) => {
        const position = handlePosition(idx);
        const [ x, y ] = position;
        if(handleWidth){
          return (
            <Dream ref={addToRefs} key={res.dream_id} top={y} left={x} delete='delete'>
              {handleDislike && <Delete onClick={(e)=> handleDislike(e,res.dream_id)}/>}
              <Content onClick={(e)=> handleLink(e,res.url)}>
                <Title>{res.title}</Title>
                <Text>{res.content}</Text>
              </Content>
              <Date>{res.createdAt.split('T')[0].slice(2)}</Date>
          </Dream>
          )
        }
        return (
          <Dream ref={addToRefs} key={idx} top={y} left={x}>
            <Content onClick={(e)=> handleLink(e,res.link)}>
              <Title>{res.title}</Title>
              <Text>{res.description}</Text>
            </Content>
            { (!data[idx]['id']) ? 
              handleLike && <StyledHeart onClick={(e)=> handleLike(e,idx)} fill='' /> 
              :
              handleDislike && <StyledHeart onClick={(e)=> handleDislike(e,res.id)} fill='likes' />} 
          </Dream>
        )})
      }
    </>
  );
}

export default SingleDream;

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

const Dream = styled.div<{top?: string; left?: string; delete?: string;}>`
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
  ${props=>props.delete && css`
  >svg{
    display: none;
    margin: 0;
    }
    :hover{
      >svg {
      display: block;
      cursor: pointer;
      fill: #DF899D;
      }
    }
  `}
  @media only screen and (max-width: 1024px) and (min-width: 769px){ // ipad Pro 사이즈
    top: ${props=> `calc(${props.top} / 2 )`}; 
    left: ${props=> `calc(${props.left} - 3rem )`}; 
  }
  @media only screen and (max-width: 768px) and (min-width: 600px){ // ipad Pro 사이즈
    top: ${props=> `calc(${props.top} / 1.3 )`}; 
  }
`;
const EmptyData = styled(Dream)`
  top: 20%;
  left: 45%;
  ${props=> props.theme.laptop} {
    left: 40%;
  }
  ${props=> props.theme.tablet} {
    top: 15%;
    left: 35%;
  }
  ${props=> props.theme.mobile} {
    left: 20%;
  }
`;
const Content = styled.div`
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
const Date = styled.p`
  color: #a38a8a;
  font-size: ${props=> props.theme.fontS};
`;
 