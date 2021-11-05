import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset'; // style-reset 패키지

const GlobalStyles = createGlobalStyle` 
    ${reset}
 
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond&family=Gowun+Batang&family=Noto+Serif+KR:wght@200&display=swap');

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
    }
    ol, ul, li {
    list-style: none;
   }
 
`;

export default GlobalStyles;
