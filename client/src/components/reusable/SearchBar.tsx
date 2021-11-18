import React,{ useState } from 'react';
import styled from 'styled-components';

function SearchBar({height, width, scale, font, handleSearch}: 
  {height: string; width: string; scale: string; font: string; handleSearch: (search: string)=>void;}) {
  
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }  
  const handleSumbit = () => {
    if(search === ''){
      return; //경고 모달
    }else{
      handleSearch(search);
    }
    setSearch('')
  }

  return (
    <SearchBox width={width} onKeyUp={(e)=> {e.preventDefault(); e.key==='Enter'&& handleSumbit()}}>
      <Icon type='image' src="/images/search-icon.svg" alt="search"  scale={scale} onClick={(e) => {e.preventDefault(); handleSumbit()}}/>
      <Bar font={font} height={height} placeholder= 'Search your dream..' type="search" onChange={(e) => handleChange(e)} value={search}>
      </Bar>
    </SearchBox>
  );
}

export default SearchBar;

const SearchBox = styled.div<{width: string;}>`
  position: relative;
  width: ${props=> props.width};
  height: auto;
  display: flex;
  align-items: center;
`;
const Icon = styled.input<{scale: string;}>`
  position: absolute;
  cursor: pointer;
  right: 2%;
  transform: scale${props=>props.scale};
`;
const Bar = styled.input<{font: string;}>`
  background-color: ${props=> props.theme.transp};
  display: flex;
  align-items: center;
  width: 100%;
  height: ${props=> props.height};
  padding-right: 3.7rem;
  padding-bottom: 0.3rem;
  font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
  font-size: ${props=> props.font};
  color: #494161;
    ::placeholder{
      color: #555562;
    }
    ::-ms-clear,
    ::-ms-reveal{
      display:none;width:0;height:0;
    }
    ::-webkit-search-decoration,
    ::-webkit-search-cancel-button,
    ::-webkit-search-results-button,
    ::-webkit-search-results-decoration{
      display:none;
    }
`;