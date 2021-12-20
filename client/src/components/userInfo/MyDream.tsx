import React, { useEffect, useRef } from "react";
import styled from 'styled-components';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

function MyDream() {
  const liRef = useRef<HTMLLIElement[]>([]);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  liRef.current = [];

useEffect(()=>{

  // 부드러운 loop 만드는 함수
  function buildSeamlessLoop(items: HTMLLIElement[], spacing: number) {
    const overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping
      // 시작-끝쪽에 매끄러운 회전을 위한 여분의 애니메이션들 수 
      startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
      // loop 시작할 가로시퀀스 시간 
      loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime 
      // 끝에서 시작시간으로 다시 loop할 지점(시간?)  
      rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live // 메인 애니메이션 존재하는 곳
      seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop   // 단지 가로시퀀스의 커서를 scrub한다(매끄럽게 loop하는 것처럼 나타나게) 
        paused: true,
        repeat: -1, // to accommodate infinite scrolling/looping 
        onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        }
      }),
      l = items.length + overlap * 2;
   let time = 0,
      i, index, item;
  
    // set initial state of items
    gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});
  
    // now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
    // loop하면서 단계별로 모든 애니메이션 만든다(한 카드당의 애니메이션)
    for (i = 0; i < l; i++) {
      index = i % items.length;
      item = items[index];
      time = i * spacing;
      rawSequence.fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false}, time)
                 .fromTo(item, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, time);
      i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
    }
    
    // here's where we set up the scrubbing of the playhead to make it appear seamless. 
    // 커서 스크럽 세팅(부드럽게 보이기 위해) - 실제 가로스크롤 이벤트가 진행될 동안 걸릴 시간, 끝까지 돌았을 때 여분 애니메이션 등등
    rawSequence.time(startTime);
    seamlessLoop.to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none"
    }).fromTo(rawSequence, {time: overlap * spacing + 1}, {
      time: startTime,
      duration: startTime - (overlap * spacing + 1),
      immediateRender: false,
      ease: "none"
    });
    return seamlessLoop; // 만든 seam~ 애니메이션 리턴
  }

let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around - allows us to smoothly continue the playhead scrubbing in the correct direction.

const spacing = 0.1,    // 카드들 사이의 공간
	snap = gsap.utils.snap(spacing), // seamlessLoop의 커서지점 snap 하기 위함
	cards = liRef.current,
	seamlessLoop = buildSeamlessLoop(cards, spacing), // 위 함수로부터 리턴값 받아옴
	scrub = gsap.to(seamlessLoop, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop 부드럽게 scrub하기 위해 재사용
		totalTime: 0,
		duration: 0.5,
		ease: "power3",
		paused: true
	}),
	trigger = ScrollTrigger.create({
		start: 0,
		onUpdate(self) {
			if (self.progress === 1 && self.direction > 0) { //&& !self.wrapping  
				wrapForward(self);
			} else if (self.progress < 1e-5 && self.direction < 0) { // && !self.wrapping
				wrapBackward(self);
			} else {
        scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
				scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
				// self.wrapping = false;
			}
		},
		end: "+=3000",
		pin: ".gallery" // 안된다면 여기
	});

function wrapForward(trigger: globalThis.ScrollTrigger) { // when the ScrollTrigger reaches the end, loop back to the beginning seamlessly
	iteration++;
	// trigger.wrapping = true;
	trigger.scroll(trigger.start + 1);
}

function wrapBackward(trigger: globalThis.ScrollTrigger) { // when the ScrollTrigger reaches the start again (in reverse), loop back to the end seamlessly
	iteration--;
	if (iteration < 0) { // to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
		iteration = 9;
		seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
    scrub.pause(); // otherwise it may update the totalTime right before the trigger updates, making the starting value different than what we just set above. 
	}
	// trigger.wrapping = true;
	trigger.scroll(trigger.end - 1);
}

function scrubTo(totalTime: number) { // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
	const progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
	if (progress > 1) {
		wrapForward(trigger);
	} else if (progress < 0) {
		wrapBackward(trigger);
	} else {
		trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
	}
}
nextRef.current && nextRef.current.addEventListener("click", () => scrubTo(scrub.vars.totalTime + spacing));
prevRef.current && prevRef.current.addEventListener("click", () => scrubTo(scrub.vars.totalTime - spacing));
return (()=>{
  seamlessLoop.kill();
  scrub.kill();
  trigger.kill();
})

},[])




  const addToRefs = (el: HTMLLIElement) => {
    if (el && !liRef.current.includes(el)) {
      liRef.current.push(el);
    }
  };
  return (
    <Body>
      <Gallery className="gallery">
        <Cards className="cards">
          <li ref={addToRefs}>0</li>
          <li ref={addToRefs}>1</li>
          <li ref={addToRefs}>2</li>
          <li ref={addToRefs}>3</li>
          <li ref={addToRefs}>4</li>
          <li ref={addToRefs}>5</li>
          <li ref={addToRefs}>6</li>
          <li ref={addToRefs}>7</li>
          <li ref={addToRefs}>8</li>
          <li ref={addToRefs}>9</li>
          <li ref={addToRefs}>10</li>
        </Cards>
        <Actions className="actions">
          <Button className="prev" ref={prevRef}>Prev</Button>
          <Button className="next" ref={nextRef}>Next</Button>
        </Actions>
      </Gallery>
    </Body>
  );
}

export default MyDream;

const Body = styled.div`
  	min-height: 100vh;
`;

const Gallery = styled.div`
	position: absolute;
	width: 100%;
	height: 100vh;
	overflow: hidden;
`;

const Cards = styled.ul`
	position: absolute;
	width: 14rem;
	height: 18rem;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
  >li{
    list-style: none;
    padding: 0;
    margin: 0;
    width: 14rem;
    height: 18rem;
    text-align: center;
    line-height: 18rem;
    font-size: 2rem;
    font-family: sans-serif;
    background-color: #9d7cce;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.8rem;

  }
`;

const Actions = styled.div`
	position: absolute;
	bottom: 25px;
	left: 50%;
	transform: translateX(-50%);
`;

const Button = styled.button`
  display:inline-block;
  outline: none;
  border: none;
  padding: 8px 14px;
  background: #414141;
  background-image: -webkit-linear-gradient(top, #575757, #414141);
  background-image: -moz-linear-gradient(top, #575757, #414141);
  background-image: -ms-linear-gradient(top, #575757, #414141);
  background-image: -o-linear-gradient(top, #575757, #414141);
  background-image: linear-gradient(to bottom, #575757, #414141);
  text-shadow: 0px 1px 0px #414141;
  -webkit-box-shadow: 0px 1px 0px 414141;
  -moz-box-shadow: 0px 1px 0px 414141;
  box-shadow: 0px 1px 0px 414141;
  color: #ffffff;
  text-decoration: none;
  margin: 0 auto 10px;
  -webkit-border-radius: 4;
  -moz-border-radius: 4;
  border-radius: 4px;
  padding: 12px 25px;
  font-family: "Signika Negative", sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  line-height: 18px;
  :hover {
    background: #57a818;
    background-image: -webkit-linear-gradient(top, #57a818, #4d9916);
    background-image: -moz-linear-gradient(top, #57a818, #4d9916);
    background-image: -ms-linear-gradient(top, #57a818, #4d9916);
    background-image: -o-linear-gradient(top, #57a818, #4d9916);
    background-image: linear-gradient(to bottom, #57a818, #4d9916);
    text-shadow: 0px 1px 0px #32610e;
    -webkit-box-shadow: 0px 1px 0px fefefe;
    -moz-box-shadow: 0px 1px 0px fefefe;
    box-shadow: 0px 1px 0px fefefe;
    color: #ffffff;
    text-decoration: none;
  }
  font-size: 20px;
  font-weight: 400;
  a {
  color: #88ce02;
  text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;


