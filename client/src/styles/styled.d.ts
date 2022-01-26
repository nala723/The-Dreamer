// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  // 1. 인터페이스 지정
  export interface DefaultTheme {
    imgsrc: string
    textBlur: string
    searchBlur: string
    fontS: string
    fontM: string
    fontL: string
    fontXL: string
    fontXXL: string
    fontNormal: number
    fontBold: number
    toggle: string
    dream: string
    circle: string
    landing: string
    default: string
    reverse: string
    text: string
    transp: string
    moretransp: string
    anker: string
    tagtext: string
    point: string
    flexRow: string
    flexColumn: string
    mobileS: string
    mobileM: string
    mobile: string
    tablet: string
    midTablet: string
    laptop: string
    desktop: string
  }
}
