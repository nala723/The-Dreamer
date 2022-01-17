import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset'; // style-reset 패키지

const GlobalStyles = createGlobalStyle` 
    ${reset}
 
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500&family=Gowun+Batang&family=Noto+Serif+KR:wght@200&display=swap');

    a{
        text-decoration: none;
        color: inherit;
    }
    *, :after, :before{
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    body {
        max-width: 100vw;
        min-height: 100vh;
        height: auto;
        font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Batang, Georgia, serif;
        background: ${props=>props.theme.default};
        -ms-overflow-style: none; /* IE, Edge */
        scrollbar-width: none; /* Firefox */
        ::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
         }
    }
    ol, ul, li {
        list-style: none;
   }
    input {
        font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
        text-indent: 1.5rem;
        outline: none;
        border: transparent;
        border-radius: 0.4rem;
        padding: 0;
        margin: 0;        
    }
    h1 {
        ${props=>props.theme.textBlur};
        letter-spacing: 0.3rem;
        ${props=> props.theme.laptop}{
         font-size: 30px;
        }
        ${props=> props.theme.mobile}{
         font-size: 22px;
         letter-spacing: 0.1rem;
        }
    }
 
`;

export default GlobalStyles;
