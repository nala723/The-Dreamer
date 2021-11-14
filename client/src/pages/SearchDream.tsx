import React, { useEffect, useRef, useState }  from 'react';
import styled from 'styled-components';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import { dummyDatas } from '../config/dummyDatas';
import { gsap } from 'gsap';

function SearchDream(){
  const openRef = useRef(null);//이어도되나
  const openRefTween = useRef<undefined | any>();
  const categroupRef = useRef<HTMLDivElement[]>([]);
  const cateHeadRef = useRef<HTMLDivElement[]>([]);
  const cateGoryRef = useRef<HTMLDivElement[]>([]);
  const [samp,setSamp] = useState(-1);
  const [open,setOpen] = useState(false);
  // const test = useRef(null);
  // const testTween = useRef<undefined | any>();
  categroupRef.current = [];
  cateHeadRef.current = [];
  cateGoryRef.current = [];
 // play로 원할때 play가능
  useEffect(()=>{

    openRefTween.current = gsap // 일단 이렇게 하고 보고 stegger 할거 timeline으로 이어보자
      .to(openRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 1,
          stagger: 0.5,
          // ease: 'expo.inOut',
      })
      .reverse();
      //어떠한 조건하에..lv2 실행 / kill하는건 lv2의 tween만이여야함
      // if(openRefTween.current){ // 이렇게 해보고 .reverese()로 접근
        // testTween.current = gsap
        //   .to(test.current, {
        //     height: 'auto',
        //     opacity: 1,
        //     duration: 1,
        //     ease: 'expo.inOut',
        //   })
        //   .reverse();
        // return () => testTween.current.kill();  
      // }

      return () => openRefTween.current.kill();
  },[]);
  useEffect(()=> {
    if(openRefTween.current){ // 이렇게 해보고 .reverese()로 접근
       const ani = gsap.timeline();
      cateGoryRef.current.forEach((el,idx) => {
        if(idx === samp){
            if(!open){
              ani
              .to(el,{
                height: 0,
                duration: 0.5,
                ease: 'expo.inOut',
              });
            }else{ 
            ani
            .to(el,{
              height: 'auto',
              duration: 0.5,
              ease: 'expo.inOut',
            })  
          } 
        } 
          // return () => ani.kill();  // 다른것 클리갛면 저절로 닫히고 열리는데 너무 느림
        // }else{
        //   if(open){
        //     ani
        //     .to(el,{
        //       height: 0,
        //       duration: 0.5,
        //       ease: 'expo.inOut',
        //     });
        //   } 
        // }
        return () => ani.kill();  
     }) 
    }

  },[samp, open])
  
  // const LvOneRef = useRef<HTMLDivElement[]>([]);
  // LvOneRef.current = [];

  // const addToRefs = (el: HTMLDivElement) => {
  //   if (el && !LvOneRef.current.includes(el)){
  //     LvOneRef.current.push(el)
  //   }
  // }
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !categroupRef.current.includes(el)){
      categroupRef.current.push(el);
    }
  }
  const addAnotherRefs = (el: HTMLDivElement) => {
    if (el && !cateHeadRef.current.includes(el)){
      cateHeadRef.current.push(el);
    }
  }
  const addFinalRefs = (el: HTMLDivElement) => {
    if (el && !cateGoryRef.current.includes(el)){
      cateGoryRef.current.push(el);
    }
  }
  const handleOpen = () => {
    openRefTween.current.reversed(!openRefTween.current.reversed());
  }
  const handleCatg = (index: number) => {
      // reverse 시키는것
    // testTween.current.reversed(!testTween.current.reversed());
    // setSamp(!samp);
    setSamp(index);
    setOpen(!open);

  }
  return (
    <Container>
      <SearchSection>
          <SearchBar height='3.125rem' width='34.438rem' scale='(0.7)' font='1.125rem'/>
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
      </DreamSection> 
      <CategoryBox>
        <CareHeader onClick={handleOpen}>
        <h5>카테고리</h5>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        </CareHeader>
        <CateTitle ref={openRef}>
          <CateLine/>
          {dummyDatas.map((dum, idx)=>{
            for(const props in dum){
              return(
                <CateGroup ref={addToRefs}> {/*일단 그룹만들었음 */}
                  <Category ref={addAnotherRefs} onClick={()=> handleCatg(idx)} key={idx}>{props}
                  </Category>
                  <DeepTitle ref={addFinalRefs}>
                    {dum[props].map((el,idx)=>{
                      return(
                        <DeepGory key={idx}>{el}
                        </DeepGory>
                      )
                    })}
                  </DeepTitle>
                </CateGroup>
              )
            }
          })}
           <CateLine/>
        </CateTitle>
      </CategoryBox>    
    </Container>
  );
}
//클릭 활성화시 밑줄생기고, 열림
export default SearchDream;

const Container = styled.div`
  position: relative;             
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
//일단 다div로 감싸보고 안되면 뭐 absolute등

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
`;
const CategoryBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 9.375rem;
  top: 3.875rem;
  left: 4.4%;
  cursor: pointer;
`;
const CareHeader = styled.div`
  width: 100%;
  height: 1.781rem;
  color: ${props=> props.theme.text};
  display: flex;
  justify-content: space-evenly; //일단.
  >svg {
    fill: ${props=> props.theme.transp};
    width: 1.125rem;
    height: 1rem;
    transform: scale(1.5);
  }
`;
const CateTitle = styled.div`
  ${props=>props.theme.flexColumn}
  height: 0;
  opacity: 0;
`;
const CateLine = styled.div` // 메뉴 라인일단 이렇게 해보고 아니면 헤더 밑어쩌고..
  width: 0;
  height: 1px;
  background-color: ${props=> props.theme.moretransp};
`;
const CateGroup = styled.div`
  height: 100%;
`;
const Category = styled.div`
   ${props=>props.theme.flexColumn}
   color: ${props=> props.theme.text}; //height: 지워봄
   /* height: 100%; */
   overflow: hidden;
`;
const DeepTitle = styled(CateTitle)`
  height: 0;
  opacity: 1;
`;
const DeepGory = styled(Category)`
  padding-left: 2.5rem; //밑줄이 길게 하려면 p를 만들어서 패딩더 채우거나 하면됨
  height: 100%;
  align-items: flex-start;
`;
//뭔가 안되면 category여기를 따로 해보자
//리스트 레이아웃 이상하면 텍스트들 왼쪽부터 쭉 나가는거로 가자 걍