import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import styled from 'styled-components';
import SearchBar from '../components/reusable/SearchBar';
import HashTag from '../components/reusable/HashTag';
import CateGory from '../components/searchdream/Category';
import dotenv from 'dotenv';
dotenv.config();

function SearchDream(): JSX.Element {
  //필요한 것
  //인풋발류 - 그것 핸들러
  //submit버튼 - 정보 호출할
  const handleSearch = async(search: string) => {
    if(search === ''){
      //something.. 모달? 
      return;
    } // 서버 만들어서 하자.
    await axios
    .get(process.env.REACT_APP_URL + `/search/search`,{
      params:{
        query: search,
      },
    })
    .then((re)=>console.log(re))
    .catch(err => console.log(err,"error"))
  }

  return (
    <Container>
      <SearchSection>
          <SearchBar height='3.125rem' width='34.438rem' scale='(0.7)' font='1.125rem' handleSearch={handleSearch}/>
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
      <CateGory/>
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