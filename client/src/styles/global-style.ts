import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset'; // style-reset 패키지

const GlobalStyles = createGlobalStyle` 
    ${reset}
 
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond&family=Gowun+Batang&display=swap');

    a{
        text-decoration: none;
        color: inherit;
    }
    *, :after, :before{
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    body {
        /* padding: 0;
        margin: 0; */
        width: 100vw;
        min-height: 100vh;
        height: auto;
        font-family: "EB Garamond","Gowun Batang", Batang, Georgia, serif;
    }
    ol, ul, li {
    list-style: none;
   }
 
`;

export default GlobalStyles;
