import React,{ useState } from 'react';
import styled from 'styled-components';

interface SearchProps {
  height: string; 
  width: string;
  scale: string; 
  font: string; 
  handleSearch: (search: string)=>void; 
  handleInput?: (search: string)=> void; 
  input?: string; 
  landing?: string;
}

function SearchBar(props: SearchProps) {
  const { height, width, scale, font, handleSearch, handleInput, input, landing } = props;
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    handleInput && handleInput(e.target.value)
  }  
  const handleSumbit = () => {
    // if(search === ''){
    //   return; //경고 모달
    // }else{
      if(input){
        handleSearch(input);
      }else{
        handleSearch(search);
        //  setSearch('')
      }
    // }
  }

  return (
    <SearchBox width={width} onKeyUp={(e)=> {e.preventDefault(); e.key==='Enter'&& handleSumbit()}}>
      <Icon type='image' src="/images/search-icon.svg" alt="search" 
        scale={scale} onClick={(e) => {e.preventDefault(); handleSumbit()}} landing={landing}/>
      <Bar font={font} height={height} landing={landing}
        placeholder= 'Search your dream..' type="search" 
        onChange={(e) => handleChange(e)} value={input? input : search}>
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
const Icon = styled.input<{scale: string; landing?: string;}>`
  position: absolute;
  cursor: pointer;
  right: 2%;
  transform: scale${props=>props.scale};
  ${props=> props.theme.laptop}{
    transform: ${props=> props.landing && `scale(0.8)`};
  }
  ${props=> props.theme.mobile}{
    transform: ${props=> props.landing && `scale(0.6)`};
  }    
`;
const Bar = styled.input<{font: string; landing?: string;}>`
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
      ${props=> props.theme.midTablet}{
        font-size: ${props=> props.landing && `22px`};
      }  
      ${props=> props.theme.mobile}{
        font-size:  ${props=> props.landing && `18px`};
      }  
      ${props=> props.theme.mobileM}{
        font-size:  ${props=> props.landing && `16px`};
      } 
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
  ${props=> props.theme.tablet}{
      height:  ${props=> props.landing && `4.3rem`};
     
    }  
  ${props=> props.theme.mobile}{
      height:  ${props=> props.landing && `3.7rem`};
      font-size:  ${props=> props.landing && `16px`};
    } 
  ${props=> props.theme.mobileM}{
      height:  ${props=> props.landing && `3.4rem`};
   }          
    
`;