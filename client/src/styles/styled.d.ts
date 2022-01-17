// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  // 우리가 아는 타입지정을 여기서 다해주고 불러서 쓰기
  // 1. 인터페이스 지정
  export interface DefaultTheme {
    imgsrc: string;
    textBlur: string;
    searchBlur: string;
     fontS: string;
     fontM: string;
    fontL: string;
    fontXL: string;
    fontXXL: string;
    fontNormal: number;
    fontBold: number;
    toggle: string;
       dream: string;
       circle: string;
       landing:  string;
       default: string;
       reverse: string;
       text: string;
       transp: string;
       moretransp: string;
       anker: string;
       tagtext: string;
       point: string;
       flexRow: string;
       flexColumn: string;
        mobileS: string;
        mobileM: string;
        mobile: string;
        tablet: string;
        midTablet: string;
        laptop: string;
        desktop: string;
  }
};
  // 2. 타입속성지정
//   export type // 타입~~~지정지정해~

  // ThemeProvider theme에 적용할 타입으로, theme의 속성과 동일하게 작성
  // export interface DefaultTheme {
  //   dark: {
  //     mainBackground: string;
  //     // neutral color
  //     title: string;
  //     primaryText: string;
  //     secondaryText: string;
  //     disable: string;
  //     border: string;
  //     divider: string;
  //     background: string;
  //     tableHeader: string;
  //   };
  //   light: {
  //     mainBackground: string;
  //     // neutral color
  //     title: string;
  //     primaryText: string;
  //     secondaryText: string;
  //     disable: string;
  //     border: string;
  //     divider: string;
  //     background: string;
  //     tableHeader: string;
  //     // point-color
  //     // point-color
  //   };
  //   response: {};
  // }