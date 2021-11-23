import React, { useEffect, useRef } from "react";
import styled from 'styled-components';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import SearchBar from '../reusable/SearchBar';


gsap.registerPlugin(ScrollTrigger);

function SecondSection() {
  const mainRef = useRef(null);
  const textBoxRef = useRef<HTMLDivElement[]>([]);
  const SecondRef = useRef(null)
  const circleRef = useRef(null);
  // const GifBoxRef = useRef(null); 
  // const gifRef = useRef(null);
  textBoxRef.current = [];

  const writings = [
    '"미래는 꿈의 아름다움을 믿는 사람들에게 주어진다."' + '-엘리노어 루즈벨트-',
    '어젯 밤 꾼 당신의 꿈을 풀이해드립니다.' + '검색 결과로 나오는 여러가지 풀이 중 원하는 풀이를 선택하세요.',
    '또, 소중한 꿈이 날아가지 않도록 꿈을 그려보세요.',
  ]

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });
    gsap.set(mainRef.current, {
      height: `${(textBoxRef.current.length - 1) * 100}vh` //여기 때문에 타임라인 나누기 안됬을수도? 
    });
    gsap.set(SecondRef.current, {
      height: `150rem` //여기 때문에 타임라인 나누기 안됬을수도? 
    });
    const tl = gsap.timeline();
    // 시작과 끝 타임라인을 길게 하고 싶은데 duration이 잘 안된다. 길이를 길게 해봐도.. -> 알고보니 길이는 충분,
    // 두번째 방법으로도 글자 나오게 해보기 시간날때

    //타임라인으로 잇는 방법으로 다시 해보기(코드 줄이기,정리)

    const hide = (index: number) => {
      if (index === 0) {
        tl.fromTo(
          textBoxRef.current[index],
          { opacity: 0 },
          { opacity: 1, duration: 1} 
        );
      }
      tl.fromTo(
        textBoxRef.current[index],
        { opacity: 1, y: 0 },
        { opacity: 0, y: -100, duration: 1, delay: 0.1 },
         ">" // 그냥 이것만 했더니 시작부분 오래떠있게됨!
      );
    };
    const show = (index: number) => {
      tl.fromTo(
        textBoxRef.current[index],
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.1 }, 
         ">"
      );
      if(index === 2){
        hide(index)
      }
    };

    textBoxRef.current.forEach((_, index) => {
      if (index === 0) {
        hide(index);
      } else if (index === 1) {
        show(index);
      }else {
        hide(index - 1);
        show(index);
      }
    });

    textBoxRef.current.forEach((pannel, i) => {
      ScrollTrigger.create({
        trigger: mainRef.current,
        animation: tl,
        start: "top top",
        end: "+=6500", 
        scrub: 1,
        pin: true,
        pinSpacing: false,
        // markers: true
      });
    });
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: SecondRef.current,
        start: "top top",
        end: "+=3300", 
        scrub: 1,
        pin: true,
        pinSpacing: false,
        // markers: true
      }
    })
    tl2.fromTo(circleRef.current,
      { scale: 0.5 , opacity: 0,},
      { scale: 20,  opacity: 1, ease: "circ.inOut"
      ,duration: 3, }
      )
      // .fromTo(circleRef.current,{scale: 20,opacity: 1},
      //   {scale: 20, duration: 3,opacity: 1})
      .to(circleRef.current,{scale: 0, opacity: 0, delay:6, ease: "circ.in"
      ,duration: 3, })  
      // .reversed(!tl2.reversed());

    /*gif 부분 타임라인. 일단은 넘어가고 다시 보자  https://codepen.io/GreenSock/pen/pojzxwZ 스크롤트리거, 함수 이용 투명도 조절 혹은 클래스 갖고 놀기면 가능*/  
    // const tl3 = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: GifBoxRef.current,
    //     start:"top top",
    //     end: "+=4000", //이건 밑에 있는데..
    //     scrub: 1,
    //     pin: true,
    //     pinSpacing: false,
    //     markers: true
    //   }
    // })
    //  tl3.fromTo(gifRef.current,
    //   { x: 0, y: 1000, opacity: 0},
    //   { x: 500, y: 500, opacity: 1,duration: 1}//몬까 됬다안됬다 함 ㅠㅠ
    //   )
    //   .fromTo(gifRef.current,{x: 500, y: 500},
    //   { x: 0,  y: -500, opacity:0,duration: 1, delay: 1})

    return () => {
      tl.kill();
      tl2.kill();
      // tl3.kill();
    };
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !textBoxRef.current.includes(el)) {
      textBoxRef.current.push(el);
    }
  };
  const handleSearch = (search: string) => {
    if(search === ''){
      //something.. 모달?
      return
    } // search를 갖고 그 페이지로 푸쉬..? 리덕스나.. 그걸 써야하낭
    
  }
  
  return (
    <>
       <Section top='calc(100vh - 4.375rem)'>
         <SectionInner>
           <ScrollBox ref={mainRef}>
              {writings.map((el,idx)=>{
                  return(
                    <Pin key={idx}>
                      <Content ref={addToRefs}>
                        <div>
                            {el.includes('-')? 
                              <h1>{el.slice(0,(el.indexOf('-')))}<p></p>{el.slice((el.indexOf('-')))}</h1>
                              :
                              el.includes('.') && el.length > el.indexOf('.') ? 
                                <h1>{el.slice(0,(el.indexOf('.')+1))}<p></p>{el.slice((el.indexOf('.')+1))}</h1>
                                : 
                              <h1>{el}</h1>
                            }
                        </div>
                      </Content>
                    </Pin>
                  )
                })}
            </ScrollBox> 
            <CircScrollBox ref={SecondRef}> 
              <Pin>
              <CircleBox >
                <Circle ref={circleRef}/>
              </CircleBox>
              </Pin>
            </CircScrollBox> 
            <GifBox>{/*ref={GifBoxRef}*/}
                {/* <Pin> */}
                <GifContent>
                  <Gif  data-aos="fade-up-right">{/*ref={gifRef}*/}
                    <p>자료입니당</p>
                  </Gif>
                  <Introdct >
                    <p data-aos="fade-up">‘꿈 알아가기’페이지에서 검색한 꿈에 대한 여러가지 풀이를 볼 수 있습니다. </p>
                    <p data-aos="fade-up" data-aos-delay="150"> 카테고리, 인기 태그로도 검색이 가능합니다.(원하는 풀이를 선택 저장 어쩌고)</p>
                  </Introdct>
                </GifContent>
                {/* </Pin> */}
                {/* <Pin> */}
                <GifContent>
                  <Introdct>
                    <p data-aos="fade-up" >
                      ‘‘꿈 그리기’ 페이지에서는 그림판을 이용해 꿈을 그리고, 저장할 수 있습니다.</p>
                    <p data-aos="fade-up" data-aos-delay="150">
                      또, 여러 색상과 브러쉬 크기 조절이 가능합니다.(다른사람의 꿈../ 날아가지 않도록 어쩌고저쩌고,..)</p>
                  </Introdct>
                  <Gif  data-aos="fade-up-left">{/*ref={gifRef}*/}
                    <p>자료입니당</p>
                  </Gif>
                </GifContent>
                {/* </Pin> */}   
            </GifBox>
            <FinalBox>
              <ContentsBox >
                <h1 data-aos="fade-down" data-aos-delay="200">The-Dreamer 안에서<p></p> 당신의 꿈을 더욱 아름답게 가꿔보세요.</h1>
                <SearchBox data-aos="fade-up">
                   <SearchBar height='4.688rem' width='100%' scale='(1.0)' font='1.5rem' handleSearch={handleSearch}/>
                </SearchBox>
              </ContentsBox >
            </FinalBox> 
         </SectionInner>
       </Section>  
    </>
  );
}

export default SecondSection;

const Section = styled.section<{ top: string }>`
  position: absolute;
  top: ${props=> props.top};
  height: 350rem; // 안되면 다시 개별루..118.625
  width: 100%;
`;
const SectionInner = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
`;
const ScrollBox = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
  /* border: 1px solid red; */
`;
const Pin = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  /* border: 1px solid aquamarine; */
`;
const Content = styled.div`
  /* position: absolute; //안해도상관없네 */
  ${props=>props.theme.flexRow}
  height: 100vh;
  /* border: 1px solid yellow; */
  > div {
    ${props=>props.theme.flexColumn};
    padding: 4rem 0;
    > h1 {
      transform-origin: 0 0 -500px;
      line-height: 5rem;
      text-align: center;
    }
  }
`;
const CircScrollBox = styled(ScrollBox)`
  top: 210rem; // 400vh 였음, 이 문제는 아닌듯...
`;
const CircleBox = styled.div`
   ${props=>props.theme.flexRow};
   height: 100%;
   /* border: 1px solid yellow; */
`;
const Circle = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 100%;
  background: ${props=> props.theme.circle};
`;
// const GifBox = styled.div`      //######################### 타임라인 3 위한
//   position: relative; //pin 고정시키기 위해
//   width: 100vw;
//   height: 200vh;
//   top: 120rem;
//   z-index:5;
//   border: 1px solid black;
// `;
// const Gif = styled.div`
//   /* position: absolute; */
//   width: 200px;
//   height: 200px;
//   background-color: yellow;
// `;

const GifBox = styled.div`
  position: relative; //pin 고정시키기 위해
  height: 220vh;
  top: 160rem;
  z-index:5;
  /* border: 1px solid black; */
  ${props=>props.theme.flexColumn}
  justify-content: space-between;
`;
const GifContent = styled.div`
  ${props=>props.theme.flexRow}
  height: 100vh;
  justify-content: space-around;
`;
const Gif = styled.div`
  /* position: absolute; */
  width: 50rem;
  height: 40rem;
  background-color: grey;
  >p {
  color: ${props=> props.theme.reverse};
  }
  
`;
const Introdct = styled.div`
  ${props=>props.theme.flexColumn}
  width: 33.313rem;
  height: 21.625rem;
  border: 1px solid ${props=>props.theme.moretransp};
  font-size: ${props=>props.theme.fontL};
  >p {
  color: ${props=> props.theme.reverse};
  }  
`;
const FinalBox = styled(GifBox)`
 justify-content: center;
 height: 150vh;
  /* border: 1px solid yellow; */
`;
const ContentsBox = styled.div`
   ${props=>props.theme.flexColumn};
    height: auto;
    gap: 3rem;
    > h1 {
      letter-spacing: 0.4rem;
      text-align: center;
      line-height: 4rem;
    }
`;
const SearchBox = styled.div`
  position: relative;
  width:40%;
  min-width: 40.25rem;
  height:auto;
  ${props=>props.theme.searchBlur};
`;  
