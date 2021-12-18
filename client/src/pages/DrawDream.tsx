import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { GetTokenAct } from '../actions';
import { RootState } from '../reducers';
import { colors, cursors } from '../config/dummyDatas';
import { Buffer } from 'buffer';
import axios from 'axios';
import Modal from '../components/reusable/Modal';

interface CanvasProps {
  width: number;
  height: number;
}

interface Coordinate {
  x: number;
  y: number;
}

function DrawDream({ width, height }: CanvasProps) {
  const { accessToken } = useSelector((state: RootState)=> state.usersReducer.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(); // 마우스포인터(x,y)
  const [isPainting, setIsPainting] = useState(false); //페인팅상태 선 긋는 상태
  const [lineWeight, setLineWeight] = useState<number>(2.5); // 타입수정
  const [selectColor, setSelectColor] = useState('#000000');
  const [cursor, setCursor] = useState(cursors[0]);
  const [eraser, setEraser] = useState(false); 
  const [brush, setBrush] = useState(true);
  const [fill, setFill] = useState(false);
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  // earasing 모드 - 현재 마우스 버튼을 누르고 있는 상태인지 확인 - 일단 painting으로 다 해보고
  const context = useRef<CanvasRenderingContext2D | null>();

  const handleColor = (e : React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    const newColor = (e.target as HTMLDivElement).style.backgroundColor;
    setSelectColor(newColor);
    setEraser(false);
    if(!fill){
      setBrush(true);
    }
  }
  
  // 굵기 조절
  const handleBrushW = (e: any)  => {
    setLineWeight(e.target.value);
  }

  const handleBrush = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {
    e.preventDefault();
    setEraser(false);
    setFill(false);
    setBrush(true);
    setCursor(cursors[0]);
  }

  // 지우기
  const handleErase = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {
    e.preventDefault();
    setEraser(true);
    setBrush(false);
    setFill(false);
    setCursor(cursors[1]);
  }
 
  // 채우기
  const handleFill = () => {
    setFill(true);
    setBrush(false);
    setEraser(false);
    setCursor(cursors[2]);
  }
 
  // 그림 서버 저장
  const handleSave = async(e: React.MouseEvent<HTMLInputElement>) => {
    if(!canvasRef.current){
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const image = canvas.toDataURL('image/png', 1.0);
    /*#################################### 그림 로컬 저장 ################################### */
    // const link = document.createElement('a');
    // link.href = image;
    // link.download = title; // 여기 제목을 해줄수 있을듯!
    // link.click();
    const blobBin = Buffer.from(image, 'base64').toString('binary');
   
		const array = [];
		for (let i = 0; i < blobBin.length; i += 1) {
			array.push(blobBin.charCodeAt(i));
		}
		const u8arr = new Uint8Array(array);
		const file = new Blob([u8arr], { type: "image/png" }); // Blob 객체 생성
		const formdata = new FormData(); // formData 생성
		formdata.append("picture", file); // formdata에 file data 추가
    formdata.append('title', title);
    formdata.append('emotion', 'happy');

  //   for(const pair of formdata.entries()) {
  //     console.log(pair[0]+ ', '+ pair[1]);
  //  }
    await axios
      .post(process.env.REACT_APP_URL + '/picture/save-pic', formdata, {
            headers: { 
              "content-Type": "multipart/form-data",
              authorization: `Bearer ` + accessToken },
      })
      .then(res=>{
        if(res.headers.accessToken){
            dispatch(GetTokenAct(res.headers.accessToken));
        }
        if(res.status === 200){
          handleClick()
        }else{
          console.log(res.data.message)
        }
      })
      .catch(err=>{
        history.push('/notfound');
        console.log(err)
      })
  }

  const handleClick = ()=> {
    setOpen(!open);
  } 


  // 좌표 얻는 함수
  const getCoordinates = (e: MouseEvent): Coordinate | undefined => {
    if(!canvasRef.current){
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: e.pageX - canvas.offsetLeft, //pageX,~Y : 전체문서를 기준으로 한 마우스 클릭 좌표
      y: e.pageY - canvas.offsetTop  // offsetX,Y : 좌표React.MouseEvent<HTMLDivElement, MouseEvent>를 출력하도록 하는 이벤트가 걸려있는 DOM node 기준으로 좌표표시
    }
  }
  // canvas에 선을 긋는 함수
  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if(!canvasRef.current){
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    context.current = canvas.getContext('2d');

    if(context.current) { //선 스타일지정

      context.current.lineJoin = 'round';
      context.current.lineWidth = lineWeight;
      context.current.fillStyle = selectColor;

      if(fill){
        canvas.style.cursor = cursors[2];
        context.current.fillRect(0, 0, canvas.width, canvas.height); //왜 느릴까..? 두세번 클릭해야함..
      }else{
        if(eraser){
          canvas.style.cursor = cursors[1];
          // context.clearRect(newMousePosition.x-context.lineWidth/2, newMousePosition.y-context.lineWidth/2, context.lineWidth, context.lineWidth)
          context.current.strokeStyle = 'white'; 
        }
        else if(brush){
          canvas.style.cursor = cursors[0];
          context.current.strokeStyle = selectColor; 
        }
          context.current.beginPath();
          context.current.moveTo(originalMousePosition.x, originalMousePosition.y);
          context.current.lineTo(newMousePosition.x, newMousePosition.y);
          context.current.closePath();
    
          context.current.stroke();
      }
    }
  }

  const startPaint = useCallback((e:MouseEvent) => {
    const coordinates = getCoordinates(e);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  },[]);
  
  // 페인팅
  const paint = useCallback((e:MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (isPainting) {
      const newMousePosition = getCoordinates(e);
      if (mousePosition && newMousePosition) {
        drawLine(mousePosition, newMousePosition);
        setMousePosition(newMousePosition);
      }
    }
  },[isPainting, mousePosition]);

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  },[]);

  const clearCanvas = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;

    if(context.current){
      context.current.fillStyle = 'white';
      context.current.fillRect(0,0,canvas.width,canvas.height);
      context.current.fillStyle = selectColor;
    }
    // canvas.getContext('2d')!!.clearRect(0, 0, canvas.width, canvas.height);
  }

  // const undo1 = () => {  // 뒤로가기 만들수 있다!
	// 	firstCanvas.current.undo();
	// };
  
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;

    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);

    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    }
  },[startPaint, paint, exitPaint])

  /*모바일에서 선 그릴때, https://basketdeveloper.tistory.com/79 참고 */
  // const startTouch = useCallback((event: TouchEvent) => { // MouseEvent인터페이스를 TouchEvent로
  //   event.preventDefault();
  //   if (!canvasRef.current) {
  //     return;
  //   }
  //   const canvas: HTMLCanvasElement = canvasRef.current;
  //   var touch = event.touches[0];    // event로 부터 touch 좌표를 얻어낼수 있습니다.
  //   var mouseEvent = new MouseEvent("mousedown", {	
  //     clientX: touch.clientX,
  //     clientY: touch.clientY
  //   });
  //   canvas.dispatchEvent(mouseEvent); // 앞서 만든 마우스 이벤트를 디스패치해줍니다
  // }, []);  
  const getDaytoYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const week = ['일','월','화','수','목','금','토'];
    const day = week[now.getDay()];

    return year + '년 ' + month + '월 ' + date + '일 ' + day
  }

  return (
    <Container>
      {open && <Modal handleClick={handleClick}>그림이 저장되었습니다.</Modal>}
      <Title>
        <h1>당신의 꿈을 그림으로 남겨보세요.</h1>
      </Title>
      <Dream>
        <DrInner>
          <TextBox>
            <InputBox>
              <h5>제목 : </h5>
              <input value={title} onChange={(e) => setTitle(e.target.value)}/>
            </InputBox>
            <h5>{getDaytoYear()}</h5>
          </TextBox>
          <Canvas ref={canvasRef} height={height} width={width} style={{cursor : `${cursor}`}}/> 
          <ToolBox>
            <Palette>
              {colors.map((color, idx)=>{
                return(
                  <Color key={idx} style={{ backgroundColor: `${color}`}} onClick={(e) => handleColor(e)}/>
                )
              })}
            </Palette>
            <ButtonBox>
              <UpperBtn>
                <LineWeight type='range' min='1.0' max='20.0' value={lineWeight} step='1.0' onChange={(e) => handleBrushW(e)}/>
                <Icon type='image' src='/images/new-icon.svg' alt='new' onClick={clearCanvas}/>
                <Icon type='image' src='/images/save-icon.svg' alt='save' onClick={handleSave}/>
              </UpperBtn>
              <LowerBtn>
                <Icon type='image' src='/images/eraser-icon.svg' alt='eraser' onClick={(e) => handleErase(e)}/>
                <Icon type='image' src='/images/paint-icon.svg' alt='paint' onClick={handleFill}/>
                <Icon type='image' src='/images/brush-icon.svg' alt='brush' onClick={(e) => handleBrush(e)}/>
              </LowerBtn>
            </ButtonBox>  
          </ToolBox>
        </DrInner>
      </Dream>
    </Container>  
  );
}


DrawDream.defaultProps = { // 안되다가 인라인으로 props로 받아서 스타일 해주니까 된다??
  width: 601,
  height: 447
}

export default DrawDream;

// const Container = styled.div`
//   display: flex;
//   position: relative;
//   width: 100%;
//   height: calc(100vh - 4.375rem);
// `;
// const Title = styled.div`
//   position: absolute;
//   width: auto;
//   height: auto;
//   left: 4%;
//   top: 5.5%;
//   h1{
//     font-size: ${props=>props.theme.fontL};
//   }
// `;
// const Dream = styled.div`
//   position: absolute;
//   left: 50%;
//   top: 45%;
//   margin-top: -24.25rem;
//   margin-left: -25.25rem;
//   width: 50.5rem;
//   height: 50.5rem; // 뷰포트에서 조정해봐야겠다
//   border-radius: 100%;
//   background: ${props=>props.theme.dream};
//   box-shadow: 0px 0px 30px 4px rgba(255, 207, 242, 0.5);
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   z-index: 50;
// `;
// const Container = styled.div`
//   ${props=>props.theme.flexRow};
//   height: calc(100vh - 4.375rem);
//   overflow: auto;
// `;
// const Title = styled.span`
//   position: relative;
//   width: auto;
//   height: auto;
//   display: flex;
//   top: -45%;
//   margin-right: -20%;
//   left: -23%;
//   h1{
//     font-size: ${props=>props.theme.fontL};
//   }
// `;
const Container = styled.div`
  ${props=>props.theme.flexColumn};
  height: calc(100vh - 4.375rem);
  justify-content: flex-start; // 다른 디바이스에선 지우기
  overflow: auto;
  gap: 1rem;
  /* -ms-overflow-style: none; 
  scrollbar-width: none;
    ::-webkit-scrollbar {
    display: none;
  } */
`;
const Title = styled.div`
  width: auto;
  height: auto;
  h1{
    font-size: ${props=>props.theme.fontL};
  }
`;
const Dream = styled.div`
  width: 50.5rem;
  height: 50.5rem; // 뷰포트에서 조정해봐야겠다
  min-width: 50.5rem;
  min-height: 50.5rem;
  border-radius: 100%;
  background: ${props=>props.theme.dream};
  box-shadow: 0px 0px 30px 4px rgba(255, 207, 242, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;
const DrInner = styled.div`
  width: 37.563rem;
  padding-top: 3rem;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
const TextBox = styled.div`
  width: 85%;
  height: auto;
  font-size: 15px;
  color: ${props=>props.theme.reverse};
  display: flex;
  align-items: center;
  justify-content: space-between;
  :nth-child(2){
  }
`;
const InputBox = styled.div`
  display: flex;
  width: auto; 
  align-items: center;
  height: 100%;
  >h5 {

  }
  >input {
    height: 100%;
    width: auto;
    text-indent: 1rem;
    display: flex; 
    align-items: center;
    background-color: transparent;
    color: ${props=>props.theme.reverse};
    font-size: 18px;
    font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Batang, Georgia, serif;
  }
`;

const Canvas = styled.canvas`
  background-color: white;
`;
const ToolBox = styled.div`
  width: 90%;
  /* height: 5.313rem; */
  display: flex;
  gap: 1.2rem;
  padding-left: 0.5rem;
  justify-content: center;
`;
const Palette = styled.div`
  width: 19.5rem; // 일단 이렇게 하고 볼깡
  height: 4.3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-top: 0.5rem; //임시 해봄
`;
const Color = styled.div`
  border-radius: 100%;
  width: 1.741rem;
  height: 1.741rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;
const ButtonBox = styled.div`
  width: 10.875rem;
  height: 5.313rem; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  padding-left: 1rem;
`;
const LineWeight = styled.input`
  -webkit-appearance: none;
  width: 4.333rem;
  height: 0.389rem;
  border-radius: 5px;
  background: #DCD4D4;
  border: 1px solid #B894D5;
  box-sizing: border-box;
  margin-right: 0.5rem;
  ::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #716496;
  cursor: pointer;
  }
  ::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #716496;
  cursor: pointer;
  }
`;
const UpperBtn = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.3em;
`;
const LowerBtn = styled(UpperBtn)`
  margin-left: 0;
`;
const Icon =styled.input`
   cursor: pointer;
   border-radius: 100%;
   box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;