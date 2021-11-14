import React from 'react';
import styled from 'styled-components';

function SearchBar({height, width, scale, font}: 
  {height: string; width: string; scale: string; font: string;}) {
  return (
    <SearchBox width={width} scale={scale}>
      <img src="/images/search-icon.svg" alt="search"/>
      <Bar font={font} height={height} placeholder= 'Search your dream..' type="search">
      </Bar>
    </SearchBox>
  );
}

export default SearchBar;

const SearchBox = styled.div<{width: string; scale: string;}>`
  position: relative;
  width: ${props=> props.width};
  height: auto;
  display: flex;
  align-items: center;
  >img {
      position: absolute;
      cursor: pointer;
      right: 2%;
      transform: scale${props=>props.scale};
    }
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