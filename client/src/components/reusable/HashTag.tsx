import React from 'react';
import styled from 'styled-components';
import { hashTagList } from '../../config/dummyDatas';

function HashTag({handleSearch}: { handleSearch:(search: string)=>void; }) {
  
  return(
    <HashSection>
      <HeadTag>추천태그</HeadTag>
      {hashTagList.map((tag, idx)=>{
        return( <Tag key={idx} onClick={()=>handleSearch(tag)}>{tag}</Tag>)
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
    display: none;
  }
`;
const HeadTag = styled(Tag)`
 display: none;
 ${props=> props.theme.mobile}{
    display: flex;
  }
`;