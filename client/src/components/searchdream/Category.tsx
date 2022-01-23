import React, { useEffect, useRef }  from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { searchDreamAct } from '../../actions';
import { dummyDatas } from '../../config/dummyDatas';
import { gsap } from 'gsap';
import {ReactComponent as Arrow} from '../../assets/arrow.svg';

function CateGory(): JSX.Element {
    const openRef = useRef(null);
    const cateHeadRef = useRef<HTMLDivElement[]>([]);
    const cateGoryRef = useRef<HTMLDivElement[]>([]);
    const startlineRef = useRef(null);
    const endlineRef = useRef<HTMLDivElement>(null);
    const openAni = useRef<gsap.core.Timeline>();
    const secondAni = useRef<gsap.core.Tween[]>([]);
    cateHeadRef.current = [];
    cateGoryRef.current = [];
    const dispatch = useDispatch();
  
    useEffect(()=>{
      gsap.set(openRef.current, { height: 'auto', opacity: 1})
      openAni.current = gsap.timeline()
        .to(startlineRef.current,{ 
            width: '100%',
            opacity: 0.7
        })
        .to(cateHeadRef.current, { 
           stagger: 0.1,
           opacity: 1
        })
        .to(endlineRef.current, { 
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
        secondAni.current.push(arr);
        el.animation = arr  
        })
  
        return () =>  { 
            openAni.current && openAni.current.kill();
            cateGoryRef.current.forEach((el: HTMLDivElement | any)=>{
              el.animation.kill();
            })
            secondAni.current.forEach((el: gsap.core.Tween)=>{
              el.kill();
            })
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
      handleCategory(-1); //걍없어지는게 나을지두
      if(openAni.current){
        openAni.current.reversed(!openAni.current.reversed());
      }
    }
  
    const handleCategory = (index: number) => { // useEffect보다 순서대로 실행됨
      let selected : boolean;

      cateGoryRef.current.forEach((el: HTMLDivElement | any, idx: number)=>{
        if(index === idx){
          selected = el.animation.reversed(); 
          return selected;
        }
      })

      secondAni.current.forEach((ani: gsap.core.Tween)=>{
        ani.reverse(); 
      })

      cateGoryRef.current.forEach((el: HTMLDivElement | any, idx: number)=>{
        if(index === idx ){
          el.animation.reversed(!selected)
          }
      })
    }

    const handleSearch = (e : React.MouseEvent<HTMLDivElement, MouseEvent>, el : string): void => {
      e.preventDefault();
      dispatch(searchDreamAct(el))
    }

  return (
 
      <CategoryBox>
        <CateHeader onClick={handleOpen}>
        <h5>카테고리</h5>
        <Arrow />
        </CateHeader>
        <CateBody ref={openRef}>
          <StartLine ref={startlineRef}/>
          {dummyDatas.map((dum, idx)=>{
            for(const props in dum){
              return(
                <CateGroup key={idx}> {/*일단 그룹만들었음 */}
                  <Category ref={addStagerRef} onClick={()=> handleCategory(idx)} key={idx}>
                    {props}
                  </Category>
                  <DeepBody ref={addFinalRefs}>
                    <DeepStartLine/>
                      {dum[props].map((el,idx)=>{
                        return(
                          <DeepCateGory key={idx} onClick={(e) => handleSearch(e, el)}>
                            {el}
                          </DeepCateGory>
                        )
                      })}
                    <DeepEndLine/>
                  </DeepBody>
                </CateGroup>
              )
            }
          })}
           <EndLine ref={endlineRef}/>
        </CateBody>
      </CategoryBox>  
 
  );
}

export default React.memo(CateGory);

const CategoryBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 9.375rem;
  top: 3.875rem;
  left: 4.4%;
  cursor: pointer;
  z-index: 60;
  ${props=> props.theme.midTablet}{
    width: 8.5rem;
  }
  ${props=> props.theme.tablet}{
    top: 2rem;
    left: 2.5%;
    width: 7rem;
    /* font-size: 15px; */
  }
  ${props=> props.theme.mobile}{
    top: 4.9rem;
  }
  
`;
const CateHeader = styled.div`
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
  ${props=> props.theme.tablet}{
    padding: 0;
    padding-left: 1rem;
  }
`;
const CateBody = styled.div`
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
const StartLine = styled.div`
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
  ${props=> props.theme.mobile}{
    background-color: ${props=>props.theme.reverse};
    border-radius: 5px;
    height: 1.3rem;
  }
`;
const DeepBody = styled(CateBody)`
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
const DeepStartLine = styled(StartLine)`
  width: 100%;
  height: 1px;
`;
const DeepCateGory = styled(Category)`
  height: 100%;
  opacity: 1;
  align-items: center;
  padding-left: 0;
  ${props=> props.theme.mobile}{
    background-color: #8370bb;
    height: 1.3rem;
    color: white;
  }
`;
const EndLine = styled(StartLine)`
  bottom: 0;
  top: 100%;
  width: 0;
  opacity: 0;
`;
const DeepEndLine = styled(EndLine)`
  width: 100%;
  opacity: 1;
`;