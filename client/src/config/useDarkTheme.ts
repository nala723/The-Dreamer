import {useState} from 'react';

const THEMES = {
    LIGHT:'light',
    DARK: 'dark'
}

export default function useDarkTheme(){
   const [theme, setTheme] = useState(THEMES.DARK);
   const themeToggler = () => {
       theme === THEMES.LIGHT ? setTheme(THEMES.DARK) :  setTheme(THEMES.LIGHT);
   }
 return {theme, themeToggler};
}