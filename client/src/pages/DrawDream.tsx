import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router'
import styled, { css } from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { getTokenAct } from '../actions'
import { RootState } from '../reducers'
import { colors, cursors } from '../config/dummyDatas'
import { Buffer } from 'buffer'
import axios from 'axios'
import Modal from '../components/reusable/Modal'
import { emotionList } from '../config/dummyDatas'
import { ReactComponent as Arrow } from '../assets/arrow.svg'
import { ReactComponent as Soso } from '../assets/face-soso.svg'
import { ReactComponent as Wink } from '../assets/face-wink.svg'
import { ReactComponent as Happy } from '../assets/face-happy.svg'
import { ReactComponent as Bad } from '../assets/face-bad.svg'
import { ReactComponent as What } from '../assets/face-what.svg'

interface CanvasProps {
  width: number
  height: number
}

interface Coordinate {
  x: number
  y: number
}

function DrawDream({ width = 601, height = 447 }: CanvasProps): JSX.Element {
  const { accessToken } = useSelector(
    (state: RootState) => state.usersReducer.user,
  )
  const history = useHistory()
  const dispatch = useDispatch()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState<Coordinate>()
  const [isPainting, setIsPainting] = useState(false)
  const [lineWeight, setLineWeight] = useState<number>(2.5)
  const [selectColor, setSelectColor] = useState('#000000')
  const [cursor, setCursor] = useState(cursors[0])
  const [eraser, setEraser] = useState(false)
  const [brush, setBrush] = useState(true)
  const [fill, setFill] = useState(false)
  const [title, setTitle] = useState('')
  const [emotion, setEmotion] = useState(emotionList[2].name)
  const [open, setOpen] = useState(false)
  const [errOpen, setErrOpen] = useState(false)
  const [textSlider, setTextSlider] = useState(false)
  const [paletteSlider, setPaletteSlider] = useState(false)
  const context = useRef<CanvasRenderingContext2D | null>()

  // 시작시 하얀색으로 채우기
  useEffect(() => {
    clearCanvas()
  }, [])

  // 색 선택
  const handleColor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    const newColor = (e.target as HTMLDivElement).style.backgroundColor
    setSelectColor(newColor)
    setEraser(false)
    if (!fill) {
      setBrush(true)
    }
  }

  // 굵기 조절
  const handleLineWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLineWeight(e.target.valueAsNumber)
  }

  // 브러쉬 선택
  const handleBrush = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault()
    setEraser(false)
    setFill(false)
    setBrush(true)
    setCursor(cursors[0])
  }

  // 지우기
  const handleErase = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault()
    setEraser(true)
    setBrush(false)
    setFill(false)
    setCursor(cursors[1])
  }

  // 채우기
  const handleFill = () => {
    setFill(true)
    setBrush(false)
    setEraser(false)
    setCursor(cursors[2])
  }

  // 그림 서버에 저장 (post 요청)
  const handleSave = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!canvasRef.current) {
      return
    }
    if (!title || !emotion) {
      handleErr()
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    let image = canvas.toDataURL('image/png')
    if (!accessToken) {
      handleSaveFile(image)
      return
    }
    image = image.split(',')[1]
    const blobBin = Buffer.from(image, 'base64').toString('binary')
    const array = []
    for (let i = 0; i < blobBin.length; i += 1) {
      array.push(blobBin.charCodeAt(i)) //인코드된 문자들을 0번째부터 끝까지 해독하여 유니코드 값을 array 에 저장
    }
    const u8arr = new Uint8Array(array) //8비트의 형식화 배열을 생성
    const file = new Blob([u8arr], { type: 'image/png' }) // Blob 객체 생성
    const formdata = new FormData() // formData 생성
    formdata.append('picture', file) // formdata에 file data 추가
    formdata.append('title', title)
    formdata.append('emotion', emotion)

    await axios
      .post(process.env.REACT_APP_URL + '/picture/save-pic', formdata, {
        headers: {
          'content-Type': 'multipart/form-data',
          authorization: `Bearer ` + accessToken,
        },
      })
      .then((res) => {
        if (res.headers.accessToken) {
          dispatch(getTokenAct(res.headers.accessToken))
        }
        if (res.status === 200) {
          confirmModal()
        } else {
          console.log(res.data.message)
        }
      })
      .catch((err) => {
        history.push('/notfound')
        console.log(err)
      })
  }

  // 파일 다운로드
  const handleSaveFile = (image: string) => {
    const link = document.createElement('a')
    link.href = image
    link.download = title
    link.click()
  }

  // 파일 요청 후 확인 모달
  const confirmModal = () => {
    setOpen(!open)
    clearCanvas()
    setTitle('')
    setEmotion(emotionList[2].name)
  }

  // 에러 발생 시 모달
  const handleErr = () => {
    setErrOpen(!errOpen)
  }

  // 가입 유저일 때, 파일 다운받기 선택 시
  const handleOkDown = (arg: boolean) => {
    if (arg === true) {
      if (!canvasRef.current) {
        return
      }
      const canvas: HTMLCanvasElement = canvasRef.current
      const image = canvas.toDataURL('image/png')
      handleSaveFile(image)
    }
    setOpen(false)
  }

  // 모바일, 데스크탑에서의 좌표 일치시키기 위함
  const getInteractionLocation = (e: MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY }

    if (!e.target) return
    const eventTarget = e.target as HTMLCanvasElement
    const rect = eventTarget.getBoundingClientRect()
    const x_rel = pos.x - rect.left
    const y_rel = pos.y - rect.top
    const x = Math.round((x_rel * eventTarget.width) / rect.width)
    const y = Math.round((y_rel * eventTarget.height) / rect.height)
    return [x, y]
  }

  // 좌표 얻는 함수
  const getCoordinates = (e: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return
    }
    const recievedLocation = getInteractionLocation(e)
    if (!recievedLocation) return
    return {
      x: recievedLocation[0],
      y: recievedLocation[1],
    }
  }

  // 좌표 얻어서 그리기 시작
  const startPaint = useCallback((e: MouseEvent) => {
    const coordinates = getCoordinates(e)
    if (coordinates) {
      setIsPainting(true)
      setMousePosition(coordinates)
    }
  }, [])

  // canvas에 선을 긋는 함수
  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate,
  ) => {
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    context.current = canvas.getContext('2d')
    if (context.current) {
      //선 스타일지정
      context.current.lineJoin = 'round'
      context.current.lineWidth = lineWeight
      if (eraser) {
        canvas.style.cursor = cursors[1]
        context.current.strokeStyle = 'white'
      } else if (brush) {
        canvas.style.cursor = cursors[0]
        context.current.strokeStyle = selectColor
      }
      context.current.beginPath() // 선 그리기 시작
      context.current.moveTo(originalMousePosition.x, originalMousePosition.y) // 라인 시작 좌표
      context.current.lineTo(newMousePosition.x, newMousePosition.y) // 라인 끝 좌표
      context.current.closePath() // 그은 라인들을 이어줌(ex: 삼각형)

      context.current.stroke() // 선 긋는 메소드 이것 불러줘야 선 그어짐
    }
  }

  // 페인팅
  const paint = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isPainting) {
        const newMousePosition = getCoordinates(e)
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition)
          setMousePosition(newMousePosition)
        }
      }
    },
    [isPainting, mousePosition],
  )

  // 그리기 종료
  const exitPaint = useCallback(() => {
    setIsPainting(false)
  }, [])

  // 캔버스 색 채우기
  const fillCanvas = () => {
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    context.current = canvas.getContext('2d')
    if (context.current) {
      context.current.fillStyle = selectColor
      if (fill) {
        canvas.style.cursor = cursors[2]
        context.current.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  // 캔버스 지우기
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    context.current = canvas.getContext('2d')

    if (context.current) {
      context.current.fillStyle = 'white'
      context.current.fillRect(0, 0, canvas.width, canvas.height)
      context.current.fillStyle = selectColor
    }
  }, [])

  // #################################### 모바일 터치 이벤트용 함수들 #################################
  const startTouch = (event: TouchEvent) => {
    event.preventDefault()
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    const touch = event.touches[0]
    if (fill) {
      const mouseEvent = new MouseEvent('click', {})
      return canvas.dispatchEvent(mouseEvent)
    } else {
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
      })
      return canvas.dispatchEvent(mouseEvent)
    }
  }

  const touch = useCallback((event: TouchEvent) => {
    event.preventDefault()
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    const touch = event.touches[0]
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
    })
    canvas.dispatchEvent(mouseEvent)
  }, [])

  const exitTouch = useCallback((event: TouchEvent) => {
    event.preventDefault()

    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current
    const mouseEvent = new MouseEvent('mouseup', {})
    canvas.dispatchEvent(mouseEvent)
  }, [])
  // ###################################### 여기까지 모바일 터치 이벤트용 함수들 ###################################

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }
    const canvas: HTMLCanvasElement = canvasRef.current

    canvas.addEventListener('mousedown', startPaint)
    canvas.addEventListener('mousemove', paint)
    canvas.addEventListener('mouseup', exitPaint)
    canvas.addEventListener('mouseleave', exitPaint)
    canvas.addEventListener('click', fillCanvas)

    canvas.addEventListener('touchstart', startTouch)
    canvas.addEventListener('touchmove', touch)
    canvas.addEventListener('touchend', exitTouch)

    return () => {
      canvas.removeEventListener('mousedown', startPaint)
      canvas.removeEventListener('mousemove', paint)
      canvas.removeEventListener('mouseup', exitPaint)
      canvas.removeEventListener('mouseleave', exitPaint)
      canvas.removeEventListener('click', fillCanvas)

      canvas.removeEventListener('touchstart', startTouch)
      canvas.removeEventListener('touchmove', touch)
      canvas.removeEventListener('touchend', exitTouch)
    }
  }, [startPaint, paint, exitPaint, fillCanvas])

  const getDaytoYear = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const week = ['일', '월', '화', '수', '목', '금', '토']
    const day = week[now.getDay()]

    return year + '년 ' + month + '월 ' + date + '일 ' + day
  }

  const handleEmotion = (idx: number) => {
    setEmotion(emotionList[idx].name)
  }

  return (
    <Container>
      {errOpen && (
        <Modal handleClick={handleErr}>
          그림, 제목, 오늘의 꿈 타입 선택을 모두 완료해주세요.
        </Modal>
      )}
      {open && (
        <Modal
          handleClick={confirmModal}
          handleSignOut={handleOkDown}
          header="파일을 다운로드하시겠어요?"
        >
          그림이 저장되었습니다.
        </Modal>
      )}
      <Title>
        <h1>당신의 꿈을 그림으로 남겨보세요.</h1>
      </Title>
      <Dream>
        <DreamInner>
          <UpperBox slider={textSlider}>
            <InputBox>
              <h5>제목 : </h5>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </InputBox>
            <TextBox>
              <Emotions>
                <StyledSoso onClick={() => handleEmotion(0)} fill={emotion} />
                <StyledWink onClick={() => handleEmotion(1)} fill={emotion} />
                <StyledHappy onClick={() => handleEmotion(2)} fill={emotion} />
                <StyledBad onClick={() => handleEmotion(3)} fill={emotion} />
                <StyledWhat onClick={() => handleEmotion(4)} fill={emotion} />
              </Emotions>
              <h5>{getDaytoYear()}</h5>
            </TextBox>
            <Arrow onClick={() => setTextSlider(!textSlider)} />
          </UpperBox>
          <Canvas
            ref={canvasRef}
            height={height}
            width={width}
            style={{ cursor: `${cursor}` }}
          />
          <ToolBox
            onClick={() => setPaletteSlider(!paletteSlider)}
            slider={paletteSlider}
          >
            <Palette>
              {colors.map((color, idx) => {
                return (
                  <Color
                    key={idx}
                    style={{ backgroundColor: `${color}` }}
                    onClick={(e) => handleColor(e)}
                  />
                )
              })}
            </Palette>
            <ButtonBox>
              <UpperBtn>
                <LineWeight
                  type="range"
                  min="1.0"
                  max="40.0"
                  value={lineWeight}
                  step="1.0"
                  onChange={(e) => handleLineWeight(e)}
                />
                <Icon
                  type="image"
                  src="/images/new-icon.svg"
                  alt="new"
                  onClick={clearCanvas}
                />
                <Icon
                  type="image"
                  src="/images/save-icon.svg"
                  alt="save"
                  onClick={handleSave}
                />
              </UpperBtn>
              <LowerBtn>
                <Icon
                  type="image"
                  src="/images/eraser-icon.svg"
                  alt="eraser"
                  onClick={(e) => handleErase(e)}
                />
                <Icon
                  type="image"
                  src="/images/paint-icon.svg"
                  alt="paint"
                  onClick={handleFill}
                />
                <Icon
                  type="image"
                  src="/images/brush-icon.svg"
                  alt="brush"
                  onClick={(e) => handleBrush(e)}
                />
              </LowerBtn>
            </ButtonBox>
            <Arrow />
          </ToolBox>
        </DreamInner>
      </Dream>
    </Container>
  )
}

export default DrawDream

const Container = styled.div`
  ${(props) => props.theme.flexColumn};
  height: calc(100vh - 4.375rem);
  justify-content: flex-start;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  ${(props) => props.theme.mobile} {
    min-height: calc(100vh - 3.6rem);
  }
`
const Title = styled.div`
  ${(props) => props.theme.midTablet} {
    display: none;
  }
  ${(props) => props.theme.flexRow};
  justify-content: flex-start;
  height: calc((100% - 50.5rem) / 2); // ipad-pro 에서 좀 수정
  min-height: 24px;
  padding-left: 8rem;
  h1 {
    font-size: ${(props) => props.theme.fontL};
  }
`
const Dream = styled.div`
  ${(props) => props.theme.midTablet} {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    border-radius: 10vw;
    box-shadow: none;
  }
  ${(props) => props.theme.tablet} {
    border-radius: 5vw;
  }
  ${(props) => props.theme.mobile} {
    border-radius: 0;
  }
  width: 50.5rem;
  height: 50.5rem; // 뷰포트에서 조정해봐야겠다
  min-width: 50.5rem;
  min-height: 50.5rem;
  border-radius: 100%;
  background: ${(props) => props.theme.dream};
  box-shadow: 0px 0px 30px 4px rgba(255, 207, 242, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 50;
`
const DreamInner = styled.div`
  ${(props) => props.theme.midTablet} {
    width: 100%;
    height: 95%;
  }
  ${(props) => props.theme.mobile} {
    // 위에서 올라오게하려면 여기수정?
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  ${(props) => props.theme.flexColumn};
  width: 37.563rem;
  height: auto;
  gap: 1rem;
`

const UpperBox = styled.div<{ slider?: boolean }>`
  ${(props) => props.theme.midTablet} {
    gap: 1rem;
  }
  ${(props) => props.theme.tablet} {
    width: 90%;
  }
  ${(props) => props.theme.mobile} {
    width: 100%;
    position: absolute;
    align-items: center;
    padding: 1rem 1rem 0.2rem 1rem;
    top: 0rem;
    background: linear-gradient(#ffb9c5, #ff9fc2);
    border-radius: 0 0 1rem 1rem;
    transform: ${(props) => !props.slider && `translateY(-110px)`};
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }
  display: flex;
  flex-direction: column;
  width: 85%;
  justify-content: center;
  height: auto;
  gap: 1.6rem;
  > svg {
    ${(props) => props.theme.mobile} {
      display: block;
    }
    fill: ${(props) => props.theme.reverse};
    width: 2rem;
    fill: #604472;
    display: none;
  }
`
const Emotions = styled.div`
  ${(props) => props.theme.mobile} {
    margin-top: 0.7rem;
  }
  ${(props) => props.theme.flexRow};
  gap: 0rem;
  width: auto;
  > svg {
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    transform: scale(0.6);
  }
`
const StyledSoso = styled(Soso)<{ fill: string }>`
  ${(props) =>
    props.fill === 'soso'
      ? css`
          fill: #fffa81;
          opacity: 1;
        `
      : css`
          fill: #e1bbc9;
          opacity: 0.5;
        `};
`
const StyledWink = styled(Wink)<{ fill: string }>`
  ${(props) =>
    props.fill === 'wink'
      ? css`
          fill: #fffa81;
          opacity: 1;
        `
      : css`
          fill: #e1bbc9;
          opacity: 0.5;
        `};
`
const StyledHappy = styled(Happy)<{ fill: string }>`
  ${(props) =>
    props.fill === 'happy'
      ? css`
          fill: #fffa81;
          opacity: 1;
        `
      : css`
          fill: #e1bbc9;
          opacity: 0.5;
        `};
`
const StyledBad = styled(Bad)<{ fill: string }>`
  ${(props) =>
    props.fill === 'bad'
      ? css`
          fill: #fffa81;
          opacity: 1;
        `
      : css`
          fill: #e1bbc9;
          opacity: 0.5;
        `};
`
const StyledWhat = styled(What)<{ fill: string }>`
  ${(props) =>
    props.fill === 'what'
      ? css`
          fill: #fffa81;
          opacity: 1;
        `
      : css`
          fill: #e1bbc9;
          opacity: 0.5;
        `};
`
const TextBox = styled.div`
  ${(props) => props.theme.tablet} {
    font-size: 13px;
  }
  width: 100%;
  height: 2rem;
  font-size: 15px;
  color: #494161;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const InputBox = styled.div`
  ${(props) => props.theme.mobile} {
    padding-left: 0;
    max-width: 100%;
  }
  ${(props) => props.theme.flexRow};
  max-width: 95%;
  height: 100%;
  padding-left: 1rem;
  gap: 1rem;
  color: #494161;
`
const Input = styled.input.attrs({
  placeholder: '제목을 입력해 주세요.',
})`
  ${(props) => props.theme.mobile} {
    text-align: start;
    text-indent: 0;
  }
  ${(props) => props.theme.mobileM} {
    max-width: 80%;
  }
  height: 100%;
  width: 85%;
  text-indent: -2rem;
  display: flex;
  text-align: center;
  align-items: center;
  background-color: transparent;
  color: ${(props) => props.theme.reverse};
  font-size: 18px;
  font-family: 'EB Garamond', 'Gowun Batang', 'Noto Serif KR', Batang, Georgia,
    serif;
  ::placeholder {
    color: #9e7d8a;
  }
`
const Canvas = styled.canvas`
  ${(props) => props.theme.midTablet} {
    width: 95vw;
    height: 70vh;
  }
  ${(props) => props.theme.tablet} {
    height: 75vh;
  }
  ${(props) => props.theme.mobile} {
    width: 100%;
    height: 90vh;
  }
  background-color: white;
`
const ToolBox = styled.div<{ slider?: boolean }>`
  ${(props) => props.theme.midTablet} {
    padding-top: 0.4rem;
    gap: 1rem;
    align-items: center;
  }
  ${(props) => props.theme.mobile} {
    position: absolute;
    width: 100%;
    height: auto;
    flex-direction: column-reverse;
    -webkit-flex-direction: column-reverse;
    -moz-flex-direction: column-reverse;
    justify-content: center;
    padding: 0.2rem 1rem 1rem 1rem;
    bottom: 0;
    background: linear-gradient(#ffbfba, #fffcac);
    border-radius: 1rem 1rem 0 0;
    transform: ${(props) => !props.slider && `translateY(70px)`};
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }
  width: 90%;
  display: flex;
  gap: 1.2rem;
  padding-left: 0.5rem;
  justify-content: center;
  > svg {
    ${(props) => props.theme.mobile} {
      display: block;
      transform: rotateX(3.142rad);
      margin-bottom: -0.6rem;
    }
    fill: #735885;
    width: 2rem;
    display: none;
  }
`
const Palette = styled.div`
  ${(props) => props.theme.midTablet} {
    width: auto;
    max-width: 50%;
    height: 3.5rem;
    margin-top: 0;
    align-items: center;
  }
  ${(props) => props.theme.tablet} {
    height: 3em;
  }
  ${(props) => props.theme.mobile} {
    max-width: 96%;
    gap: 0.4rem;
    justify-content: center;
  }
  ${(props) => props.theme.mobileM} {
    max-width: 98%;
  }
  width: 19.5rem;
  height: 4.3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  margin-top: 0.5rem;
`
const Color = styled.div`
  ${(props) => props.theme.midTablet} {
    width: 1.5rem;
    height: 1.5rem;
  }
  ${(props) => props.theme.mobileM} {
    width: 1.3rem;
    height: 1.3rem;
  }
  border-radius: 100%;
  width: 1.741rem;
  height: 1.741rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`
const ButtonBox = styled.div`
  ${(props) => props.theme.midTablet} {
    width: auto;
    flex-direction: row-reverse;
    -webkit-flex-direction: row-reverse;
    -moz-flex-direction: row-reverse;
    gap: 0.6rem;
    height: 2rem;
  }
  ${(props) => props.theme.mobile} {
    height: auto;
  }

  width: 10.875rem;
  height: 5.313rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
  padding-left: 1rem;
`
const LineWeight = styled.input`
  ${(props) => props.theme.midTablet} {
    margin-left: 0.3rem;
    width: 3.6rem;
  }
  -webkit-appearance: none;
  width: 4.333rem;
  height: 0.389rem;
  border-radius: 5px;
  background: #dcd4d4;
  border: 1px solid #b894d5;
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
`
const UpperBtn = styled.span`
  ${(props) => props.theme.midTablet} {
    flex-direction: row-reverse;
    -webkit-flex-direction: row-reverse;
    -moz-flex-direction: row-reverse;
    gap: 0.6rem;
  }
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.3em;
`
const LowerBtn = styled(UpperBtn)`
  margin-left: 0;
`
const Icon = styled.input`
  ${(props) => props.theme.midTablet} {
    transform: scale(0.9);
  }
  ${(props) => props.theme.midTablet} {
    transform: scale(0.8);
  }
  cursor: pointer;
  border-radius: 100%;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`
