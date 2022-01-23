import React, { useEffect, useRef } from "react";
import styled from 'styled-components';
import gsap from "gsap";
import { useHistory } from 'react-router-dom';
import {  useDispatch } from 'react-redux';
import { searchDreamAct } from '../../actions';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import SearchBar from '../reusable/SearchBar';

gsap.registerPlugin(ScrollTrigger);

function SecondSection() {
  const dispatch = useDispatch();
  const history = useHistory();
  const mainRef = useRef(null);
  const textBoxRef = useRef<HTMLDivElement[]>([]);
  const secondRef = useRef(null)
  const circleRef = useRef(null);
  textBoxRef.current = [];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });

    gsap.set(mainRef.current, {
      height: `${(textBoxRef.current.length - 1) * 100}vh`
    });

    gsap.set(secondRef.current, {
      height: `150rem`
    });

    const wordTimeline = gsap.timeline();

    const hide = (index: number) => {
      if (index === 0) { // 인덱스 0 일때는 나타났다가 사라지게
        wordTimeline.fromTo(
          textBoxRef.current[index],
          { opacity: 0 },
          { opacity: 1, duration: 1} 
        );
      }
      wordTimeline.fromTo(
        textBoxRef.current[index],
        { opacity: 1, y: 0 },
        { opacity: 0, y: -100, duration: 1, delay: 0.1 },
         ">" //- The end of the previous animation**. Think of > as a pointer to the end of the previous animation.
      );
    };

    const show = (index: number) => {
      wordTimeline.fromTo(
        textBoxRef.current[index],
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.1 }, 
         ">"
      );
      if(index === 2){
        hide(index)
      }
    };

    textBoxRef.current.forEach((_, index) => { // 첫번째 섹션은 그냥 hide하고
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
        animation: wordTimeline,
        start: "top top",
        end: "+=6500", 
        scrub: 1,
        pin: true,
        pinSpacing: false,
      });
    });

    const circleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: secondRef.current,
        start: "top top",
        end: "+=3300", 
        scrub: 1,
        pin: true,
        pinSpacing: false,
      }
    })
    circleTimeline.fromTo(circleRef.current,
      { scale: 0.5 , opacity: 0,},
      { scale: 20,  opacity: 1, ease: "circ.inOut"
      ,duration: 3, }
      )
      .to(circleRef.current,{scale: 0, opacity: 0, delay:6, ease: "circ.in"
      ,duration: 3, })

    return () => {
      wordTimeline.kill();
      circleTimeline.kill();
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
      return;
    } 
    dispatch(searchDreamAct(search))
    history.push('/searchdream');
  }
  
  return (
    <>
       <Container>
         <ContainerInner>
           <ScrollBox ref={mainRef}>
              <Pin>
                  <Content ref={addToRefs}>
                      <div>
                         <h1>{`"미래는 꿈의 아름다움을 믿는 사람들에게 주어진다."`}<p></p> -엘리노어 루즈벨트-</h1>
                      </div>
                  </Content>
              </Pin>
              <Pin>
                  <Content ref={addToRefs}>
                      <div>
                         <h1>어젯 밤 꾼 당신의 꿈을 <Blank/> 풀이해드립니다.<p></p>검색 결과로 나오는 여러가지 풀이 중 원하는 풀이를 선택하세요.</h1>
                      </div>
                  </Content>
              </Pin>
              <Pin>
                  <Content ref={addToRefs}>
                      <div>
                         <h1>또, 소중한 꿈이 날아가지 않도록 꿈을 그려보세요.</h1>
                      </div>
                  </Content>
              </Pin>
            </ScrollBox> 
            <CircleScrollBox ref={secondRef}> 
              <Pin>
              <CircleBox >
                <Circle ref={circleRef}/>
              </CircleBox>
              </Pin>
            </CircleScrollBox> 
            <GifBox>{/*ref={GifBoxRef}*/}
                {/* <Pin> */}
                <GifContent>
                  <Gif src='/images/search-ani.gif' data-aos="fade-up-right" alt='gif'/>
                  <Introdct >
                    <p data-aos="fade-up">‘꿈 알아보기’ 페이지에서 검색한 꿈에 대한 다양한 풀이들을 볼 수 있습니다.</p>
                    <p data-aos="fade-up" data-aos-delay="150"> 카테고리, 해쉬 태그로도 검색이 가능합니다. </p>
                    <p data-aos="fade-up" data-aos-delay="300">  또, 마음에 드는 풀이는 하트 버튼으로 저장할 수 있습니다. (유저전용)</p>
                  </Introdct>
                </GifContent>
                {/* </Pin> */}
                {/* <Pin> */}
                <GifContent>
                  <Introdct>
                    <p data-aos="fade-up" >
                      ‘꿈 그리기’ 페이지에서는 그림판을 이용해 꿈을 그리고, 그린 그림을 저장할 수 있습니다.
                    </p>
                    <p data-aos="fade-up" data-aos-delay="150">
                      얼굴 아이콘을 클릭해 기분을 선택해주세요.</p>
                    <p data-aos="fade-up" data-aos-delay="300">  
                      툴 박스에서 브러쉬 색상, 두께, 페인트 등을 조절할 수 있습니다.</p>
                  </Introdct>
                  <Gif src='/images/paint-ani.gif' data-aos="fade-up-left" alt='gif'/>
                </GifContent>
                {/* </Pin> */}   
            </GifBox>
            <FinalBox>
              <ContentsBox >
                <h1 data-aos="fade-down" data-aos-delay="200">The-Dreamer 안에서<p></p> 당신의 꿈을 더욱 아름답게 가꿔보세요.</h1>
                <SearchBox data-aos="fade-up">
                   <SearchBar height='4.688rem' width='100%' scale='(1.0)' font='1.5rem' handleSearch={handleSearch}  landing='true'/>
                </SearchBox>
              </ContentsBox >
            </FinalBox> 
         </ContainerInner>
       </Container >  
    </>
  );
}

export default SecondSection;

const Container = styled.section`
  position: absolute;
  top: calc(100vh - 4.375rem);
  height: 350rem; 
  width: 100%;
  padding: 0 1rem;
`;
const ContainerInner = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
`;
const ScrollBox = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
`;
const Pin = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`;
const Content = styled.div`
  ${props=>props.theme.flexRow}
  height: 100vh;
  > div {
    ${props=>props.theme.flexColumn};
    padding: 4rem 7rem;
    ${props=> props.theme.midTablet}{
      padding: 4rem 5rem;
    }
    ${props=> props.theme.mobile}{
      padding: 4rem 2rem;
    }
    ${props=> props.theme.mobileM}{
      padding: 4rem 1rem;
    }
    > h1 {
      transform-origin: 0 0 -500px;
      line-height: 5rem;
      text-align: center;
      ${props=> props.theme.laptop}{
        line-height: 4rem;
      }
      ${props=> props.theme.midTablet}{
        line-height: 3.3rem;
      }
      ${props=> props.theme.mobile}{
        line-height: 2.6rem;
      }
      ${props=> props.theme.mobileM}{
        line-height: 2.1rem;
      }
    }
  }
`;
const Blank = styled.p`
  display: none;
  ${props=> props.theme.midTablet}{
    display: block;
   }
`;

const CircleScrollBox = styled(ScrollBox)`
  top: 210rem;
`;
const CircleBox = styled.div`
   ${props=>props.theme.flexRow};
   height: 100%;
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
  ${props=>props.theme.flexColumn}
  justify-content: space-between;
`;
const GifContent = styled.div`
  ${props=>props.theme.flexRow}
  height: 100vh;
  justify-content: space-around;
  gap: 2rem;
  ${props=> props.theme.midTablet}{
  flex-direction: column;
  justify-content: center;
  gap: 0rem;
};
`;
const Gif = styled.img`
  width: auto;
  height: auto;
  min-width: 30rem;
  display: flex;
  ${props=> props.theme.midTablet}{
    width: 80%
  };
  ${props=> props.theme.tablet}{
    min-width: 25rem;
  };
  ${props=> props.theme.mobile}{
    min-width: 20rem;
  };
  ${props=> props.theme.mobileM}{
    min-width: 18rem;
  };
`;
const Introdct = styled.div`
  ${props=>props.theme.flexColumn}
  width: 33.313rem;
  height: 21.625rem;
  font-size: 22px;
  line-height: 1.8rem;
  align-items: flex-start;
  >p {
  color: ${props=> props.theme.reverse};
  }
  ${props=> props.theme.midTablet}{
       align-items: center;
       text-align: center;
       font-size: 20px;
       max-height: 30vh;
  }
  ${props=> props.theme.tablet}{
      max-width: 90vw;
      font-size: 18px;
  }
  ${props=> props.theme.mobile}{
      max-width: 80vw;
      font-size: 15px;
  }              
`;
const FinalBox = styled(GifBox)`
 justify-content: center;
 height: 150vh;
`;
const ContentsBox = styled.div`
   ${props=>props.theme.flexColumn};
    height: auto;
    gap: 3rem;
    ${props=> props.theme.mobile}{
        gap: 1.6rem;
     }
    > h1 {
      letter-spacing: 0.4rem;
      text-align: center;
      line-height: 4rem;
      ${props=> props.theme.laptop}{
        line-height: 4rem;
      }
      ${props=> props.theme.midTablet}{
        line-height: 3.3rem;
      }
      ${props=> props.theme.mobile}{
        line-height: 2.6rem;
      }
      ${props=> props.theme.mobileM}{
        line-height: 2.1rem;
      }
    }
`;
const SearchBox = styled.div`
  position: relative;
  width:40%;
  min-width: 40.25rem;
  height:auto;
  ${props=>props.theme.searchBlur};
  ${props=> props.theme.tablet}{
      min-width: 80vw;
      width: 80vw;
    }
  ${props=> props.theme.mobile}{
     min-width: 90vw;
    }    
    
`;  
