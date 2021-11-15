import React, { useEffect, useRef, useState }  from 'react';
import styled from 'styled-components';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import { dummyDatas } from '../config/dummyDatas';
import { gsap } from 'gsap';

function SearchDream(): JSX.Element {
  const openRef = useRef(null);
  const openRefTween = useRef<gsap.core.Timeline>();
  const cateGoryRef = useRef<HTMLDivElement[]>([]);
  const DeepAnim = useRef<gsap.core.Tween[]>([]);
  const lineRef = useRef(null);
  const SclineRef = useRef<HTMLDivElement>(null);
  const cateHeadRef = useRef<HTMLDivElement[]>([]);
  cateGoryRef.current = [];
  DeepAnim.current = [];
  cateHeadRef.current = [];

  useEffect(()=>{
    gsap.set(openRef.current, { height: 'auto', opacity: 1})
    const headani = gsap.timeline({ ease: 'expo.inOut' })
    openRefTween.current = headani 
      .to(lineRef.current,{ 
          width: '100%',
          opacity: 0.7
      })
      .to(cateHeadRef.current, { 
         stagger: 0.1,
         opacity: 1
      })
      .to(SclineRef.current,{ 
          width: '100%',
          opacity: 0.7,
          delay: -0.2
      })
      .reverse();

    cateGoryRef.current.forEach((el: HTMLDivElement | any) => { 
      const arr = gsap
        .to(el, {
           height: 'auto', 
           duration: 1.2,
           opacity: 0.7, 
           ease: 'expo.inOut'
         }).reverse(); 
      DeepAnim.current.push(arr);
      el.animation = arr  
      })

      return () =>  { 
        cateGoryRef.current.forEach((el: HTMLDivElement | any)=>{
          el.animation.kill();
        })
        DeepAnim.current.forEach((el: gsap.core.Tween)=>{
           el.kill();
        })
        openRefTween.current && openRefTween.current.kill();
        } 
  },[]);

  const addStagerRef = (el: HTMLDivElement) => {
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
    handleCatg(-1); //걍없어지는게 나을지두
    if(openRefTween.current){
      openRefTween.current.reversed(!openRefTween.current.reversed());
    }
  }

  const handleCatg = (index: number) => { // useEffect보다 순서대로 실행됨
    let selected : boolean;
    cateGoryRef.current.forEach((el: HTMLDivElement | any, idx: number)=>{
      if(index === idx){
        selected = el.animation.reversed();
        return selected;
      }
    })
    DeepAnim.current.forEach((ani: gsap.core.Tween)=>{
      ani.reverse();
    })
    cateGoryRef.current.forEach((el: HTMLDivElement | any, idx: number)=>{
      if(index === idx ){
        el.animation.reversed(!selected)
        }
    })
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
          <CateLine ref={lineRef}/>
          {dummyDatas.map((dum, idx)=>{
            for(const props in dum){
              return(
                <CateGroup> {/*일단 그룹만들었음 */}
                  <Category ref={addStagerRef} onClick={()=> handleCatg(idx)} key={idx}>{props}
                  </Category>
                  <DeepTitle ref={addFinalRefs}>
                    <DeepLine/>
                      {dum[props].map((el,idx)=>{
                        return(
                          <DeepGory key={idx}>{el}
                          </DeepGory>
                        )
                      })}
                    <DpEndLine/>
                  </DeepTitle>
                </CateGroup>
              )
            }
          })}
           <CtEndLine ref={SclineRef}/>
        </CateTitle>
      </CategoryBox>    
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
  height: 1.7rem;
  color: ${props=> props.theme.text};
  display: flex;
  justify-content: space-between;
  padding: 0 1rem; // 임시 ***
  /* justify-content: space-evenly; //일단. 주석- */
  >svg {
    fill: ${props=> props.theme.transp};
    width: 1.125rem;
    height: 1rem;
    transform: scale(1.5);
  }
`;
const CateTitle = styled.div`
  position: relative;
  ${props=>props.theme.flexColumn}
  height: 0;
  opacity: 0;
  gap: 1.5rem;
  >div:nth-child(2){
    margin-top: 1rem;
  }
  >div:nth-child(10){
    margin-bottom: 1rem;
  }
`;
const CateLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 1.4px;
  background-color: ${props=> props.theme.transp};
`;
const CateGroup = styled.div`
  ${props=>props.theme.flexColumn}
  height: 100%;
`;
const Category = styled.div`
  ${props=>props.theme.flexColumn}
  align-items: flex-start;
  padding-left: 2.3rem; // 임시!***
  color: ${props=> props.theme.text}; // 왜 justify-content: center가 안되지
  overflow: hidden;
  height: auto;
  opacity: 0;
`;
const DeepTitle = styled(CateTitle)`
  gap: 1rem;
  height: 0;
  opacity: 0;
  top: 0.7rem;
  >div:nth-child(10){
    margin: 0;
  }
  >div:nth-last-child(2){
    margin-bottom: 0.7rem;
  }
`;
const DeepLine = styled(CateLine)`
  width: 100%;
  height: 1px;
`;
const DeepGory = styled(Category)`
  /* padding-left: 5rem;  */ // ******둘, 임시로 지움
  /* align-items: flex-start; */ 
  height: 100%;
  opacity: 1;
  align-items: center;
  padding-left: 0;
`;
const CtEndLine = styled(CateLine)`
  bottom: 0;
  top: 100%;
  width: 0;
  opacity: 0;
`;
const DpEndLine = styled(CtEndLine)`
  width: 100%;
  opacity: 1;
`;