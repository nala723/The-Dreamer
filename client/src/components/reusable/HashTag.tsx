import React from 'react';
import styled from 'styled-components';

function HashTag({height, width, text, handleSearch}: {height?: string; width?: string; text: string; handleSearch?:(search: string)=>void; }) {
  
  if(handleSearch){
    return(
      <Tag onClick={()=>handleSearch(text)}>{text}</Tag>
    )
  }else{
      return (
      <Tag>{text}</Tag>
  );
 }
}

export default HashTag;

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
 
  

`;
