import React, { useEffect, useRef } from "react";
import styled from 'styled-components';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SecondSection() {
  const mainRef = useRef(null);
  const textBoxRef = useRef<HTMLDivElement[]>([]);// DOM을 다룰 때 반드시 초깃값은 null로 설정한다.안되면 여기두확인
  textBoxRef.current = [];

  const writings = [
    '"미래는 꿈의 아름다움을 믿는 사람들에게 주어진다."' + '-엘리노어 루즈벨트-',
    '어젯 밤 꾼 당신의 꿈을 풀이해드립니다.' + '검색 결과로 나오는 여러가지 풀이 중 원하는 풀이를 선택하세요.',
    '또, 소중한 꿈이 날아가지 않도록 꿈을 그려보세요.',
  ]

  useEffect(() => {
    gsap.set(mainRef.current, {
      height: `${(textBoxRef.current.length - 1) * 100}vh` 
    });
    const tl = gsap.timeline();
    // 시작과 끝 타임라인을 길게 하고 싶은데 duration이 잘 안된다. 길이를 길게 해봐도.. -> 알고보니 길이는 충분,
    // 두번째 방법으로도 글자 나오게 해보기 시간날때

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
        { opacity: 0, y: -100, duration: 1.5, delay: 0.5 },
         ">" // 그냥 이것만 했더니 시작부분 오래떠있게됨!
      );
    };
    const show = (index: number) => {
      tl.fromTo(
        textBoxRef.current[index],
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: 0.5 }, 
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
        end: "+=7000", //스크롤 종료 길이 길어짐 ->마지막에 더 길게 할 수 있는지 함수 알아보자
        scrub: 1,
        pin: true,
        pinSpacing: false,
        markers: true
      });
    });

    return () => {
      tl.kill();
    };
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !textBoxRef.current.includes(el)) {
      textBoxRef.current.push(el);
    }
  };
  // 섹션 반씩 나눠서..타임라인 적용
  // 만약 + 포함한다면 그 전까지의 문자열, 다음 문자열 나눠서 배치. <br>혹은 그런거.
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
         </SectionInner>
       </Section>  
    </>
  );
}

export default SecondSection;

const Section = styled.section<{ top: string }>`
  position: absolute;
  top: ${props=> props.top};
  height: 118.625rem; // 안되면 다시 개별루..
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
    /* margin-bottom: 100vh; //아마 밑에 여백 주려고..? */
  overflow: visible;
  /* border: 1px solid red; */
`;
const Pin = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  /* border: 1px solid greenyellow; */
`;
const Content = styled.div`
  position: absolute;
  ${props=>props.theme.flexRow};
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
