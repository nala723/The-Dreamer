import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { hashTagList } from '../../config/dummyDatas';
import gsap from 'gsap';
import { darkTheme } from '../../styles/theme';

function HashTag({handleSearch}: { handleSearch:(search: string)=>void; }) {
  const openRef = useRef(null);
  const openRefTl = useRef<gsap.core.Timeline>();
  const menuRef = useRef<(HTMLLIElement | HTMLDivElement)[]>([]);
  menuRef.current = [];

  useEffect(()=>{
    gsap.set(openRef.current, { height: 'auto', opacity: 1}) // 메뉴박스 세팅
    
    openRefTl.current = gsap.timeline() //  타임라인 객체를 open~에 저장
      .to(menuRef.current, { 
         stagger: 0.1,
         opacity: 1,
         display: 'block'
      })
      .reverse();

      return () =>  { 
          openRefTl.current && openRefTl.current.kill();
        } 
  },[]);  

const handleOpen = () => {
    if(openRefTl.current){
        openRefTl.current.reversed(!openRefTl.current.reversed());
      }
}    

const addStagerRef = (el: HTMLLIElement | HTMLDivElement | null) => {
    if (el && !menuRef.current.includes(el)){
      menuRef.current.push(el);
    }
} 

  return(
    <HashSection ref={openRef}>
      <HeadTag onClick={handleOpen}>추천태그</HeadTag>
      {hashTagList.map((tag, idx)=>{
        return( <Tag ref={addStagerRef} key={idx} onClick={()=>handleSearch(tag)}>{tag}</Tag>)
      })}
    </HashSection> 
  );
}

export default HashTag;


const HashSection = styled.div`
  position: absolute;
  max-width: 100%;
  /* height: auto; */
  top: 5.5rem;
  margin-top: 0.3rem;
  display: flex;
  flex-wrap: wrap;
  padding-top: 1.2rem;
  padding-left: 19.438rem;
  gap: 0.6rem;
  z-index: 60;
  ${props=> props.theme.midTablet}{
    padding-left: 13rem;
  }
  ${props=> props.theme.tablet}{
    padding-left: 10.1rem;
    margin: 0;
    top: 4rem;
  }
  ${props=> props.theme.mobile}{
    width: auto;
    flex-direction: column;
    align-items: flex-end;
    padding-left: 0;
    top: 3.3rem;
    right: 5%;
  }
`;

const Tag = styled.div`
  width: auto;
  height: auto;
  background-color: ${props=>props.theme.moretransp};
  color: ${props=>props.theme.tagtext};
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 2rem;
  cursor: pointer;
  overflow: hidden;
  ${props=> props.theme.midTablet}{
    padding: 0.5rem 1.5rem;
    font-size: 14px;
  }
  ${props=> props.theme.mobile}{
    opacity: 0;
    background-color: ${props=>props.theme === darkTheme ? 'rgb(76, 66, 93)' : 'rgb(255, 225, 128)'};
  }
`;
const HeadTag = styled(Tag)`
 display: none;
 ${props=> props.theme.mobile}{
    display: flex;
    opacity: 1;
    margin-bottom: 0.8rem;
    background-color: ${props=>props.theme.moretransp};
  }
`;