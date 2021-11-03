import { DefaultTheme } from 'styled-components';

const calcRem = (size: number): string => `${size / 16}rem`;

export const darkTheme: DefaultTheme = {
  flexRow: `
    display: flex;
    justify-contents: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  flexColumn: `
    display: flex;
    flex-direction: column;
    justify-contents: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  fontS: calcRem(14),
  fontM: calcRem(18),
  fontL: calcRem(24),
  fontXL: calcRem(36),
  fontXXL: calcRem(55),
  fontLight: 100,
  fontNormal: 400,
  fontBold: 700,
  darktext: '#494161',
  dream: `linear-gradient(#ffb9c5 10%, #ff9fc2 30%, #ffbfba 80%, #fffcac)`,
  back: '#000729',
  landing: `linear-gradient(
      #000729 0%,
      rgb(255, 188, 188, 0.6) 15%,
      #000729 30%,
      #000729 80%,
      rgb(255, 188, 188, 0.6) 90%,
      #000729 100%
    )`,
  defalut: `linear-gradient(
      #000729 0%,
      rgb(255, 188, 188, 0.6) 50%,
      #000729 100%
    )`,
  text: 'white',
  transp: 'rgba(255, 255, 255, 0.6)',
  moretransp: 'rgba(255, 255, 255, 0.2)',
  tagtext: '#DDC9FF',
  point: '#FFFA81',
  mobileS: `@media only screen and (max-width: 320px)`,
  mobileM: `@media only screen and (max-width: 375px)`,
  // middle: `@media only screen and (max-width: ${size.middle})`,
  mobile: `@media only screen and (max-width: 425px)`,
  // change: `@media only screen and (max-width: ${size.change})`,
  tablet: `@media only screen and (max-width: 768px)`,
  laptop: `@media only screen and (max-width: 1024px)`,
  desktop: `@media only screen and (max-width: 1440px)`,
};

export const lightTheme: DefaultTheme = {
  flexRow: `
    display: flex;
    justify-contents: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  flexColumn: `
    display: flex;
    flex-direction: column;
    justify-contents: center;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  fontS: calcRem(14),
  fontM: calcRem(18),
  fontL: calcRem(24),
  fontXL: calcRem(36),
  fontXXL: calcRem(55),
  fontLight: 100,
  fontNormal: 400,
  fontBold: 700,
  darktext: '#494161',
  dream: `linear-gradient(#ffb9c5 10%, #ff9fc2 30%, #ffbfba 80%, #fffcac)`,
  back: 'white',
  landing: 'white',
  defalut: 'white',
  text: '#494161',
  transp: 'rgba(211, 204, 221, 0.6)',
  moretransp: 'rgba(255, 206, 79, 0.2)',
  tagtext: '#674043',
  point: '#3C95FF',
  mobileS: `@media only screen and (max-width: 320px)`,
  mobileM: `@media only screen and (max-width: 375px)`,
  mobile: `@media only screen and (max-width: 425px)`,
  tablet: `@media only screen and (max-width: 768px)`,
  laptop: `@media only screen and (max-width: 1024px)`,
  desktop: `@media only screen and (max-width: 1440px)`,
};

// 테마와 관련없이 공통으로 사용되는 변수들입니다
//   const defalutTheme  = {
//         ...fonts.size,
//         ...fonts.weight,
//         ...device,
//         ...display
//     };

// export const darkTheme : DefaultTheme = {
//   ...defalutTheme,
//   colors: darkThemeColors,
// };

// export const lightTheme : DefaultTheme= {
//   ...defalutTheme,
//   colors: lightThemeColors,
// };
// export const darkTheme: FollowDefault = {
//   darkThemeColors,
// };

// export const lightTheme: SecondDefault = {
//   lightThemeColors,
// };

// 이렇게 했을 시 에러 안남 -> 스프레드 오퍼레이터의 문제인듯,
