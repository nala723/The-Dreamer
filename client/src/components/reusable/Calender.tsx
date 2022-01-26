import React, { useState, forwardRef, useRef, useEffect } from 'react'
import styled from 'styled-components'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { gsap } from 'gsap'
import { ReactComponent as Arrow } from '../../assets/arrow.svg'
import { darkTheme } from '../../styles/theme'
import { emotionList } from '../../config/dummyDatas'

type PropsType = {
  value?: React.ReactNode | string
  onClick?: () => void
}

type RefType = HTMLButtonElement

interface CalenderProps {
  title: string
  updateMenu: (arg: string | string[] | number) => void
  emotion?: string
}

function Calender(props: CalenderProps): JSX.Element {
  /* 달력 위한 useState */
  const [dateRange, setDateRange] = useState<any>([null, null])
  const [startDate, endDate] = dateRange
  /* 클릭한 감정 구분 useState */
  const [selectIdx, setSelectIdx] = useState(-1)
  /* 애니메이션 위한 useRef */
  const openRef = useRef(null)
  const openRefTimeline = useRef<gsap.core.Timeline>()
  const startlineRef = useRef(null)
  const endlineRef = useRef(null)
  const menuRef = useRef<(HTMLLIElement | HTMLDivElement)[]>([])
  menuRef.current = []

  const { title, updateMenu, emotion } = props

  useEffect(() => {
    gsap.set(openRef.current, { height: 'auto', opacity: 1 }) // 메뉴박스 세팅

    openRefTimeline.current = gsap
      .timeline() //  타임라인 객체를 open~에 저장
      .to(startlineRef.current, {
        width: '100%',
        opacity: 0.7,
        display: 'block',
      })
      .to(menuRef.current, {
        stagger: 0.1,
        opacity: 1,
        display: 'block',
      })
      .to(endlineRef.current, {
        width: '100%',
        opacity: 0.7,
        delay: -0.2,
        display: 'block',
      })
      .reverse()

    return () => {
      openRefTimeline.current && openRefTimeline.current.kill()
    }
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      getSelectDate(dateRange)
    }
  }, [startDate, endDate])

  const handleOpen = () => {
    if (openRefTimeline.current) {
      openRefTimeline.current.reversed(!openRefTimeline.current.reversed())
    }
  }

  const addStagerRef = (el: HTMLLIElement | HTMLDivElement | null) => {
    if (el && !menuRef.current.includes(el)) {
      menuRef.current.push(el)
    }
  }

  // forward.Ref 로 달력버튼을 커스텀
  const CustomInput = forwardRef<RefType, PropsType>(
    ({ value, onClick }, ref) => {
      return (
        <CustomBtn onClick={onClick} ref={ref}>
          <p>{startDate ? value : '직접 선택'}</p>
        </CustomBtn>
      )
    },
  )
  CustomInput.displayName = 'CustomInput'
  // 함수 컴포넌트의 ref는 애초에 존재하지 않기 때문입니다.-> forward.Ref로 모 컴포넌트로부터 하위 컴포넌트로 ref를 전달
  //https://merrily-code.tistory.com/121

  //  캘린더의 날짜범위 배열로 담는 함수
  const getSelectDate = (arg: Date[]) => {
    if (Array.isArray(arg)) {
      const start = new Date(startDate)
      start.setDate(start.getDate() + 1)
      const end = new Date(endDate)
      end.setDate(end.getDate() + 1)
      const dateArr: string[] = []
      while (start <= end) {
        dateArr.push(
          start.toISOString().split('T')[0].split('-').join('.').slice(2),
        )
        start.setDate(start.getDate() + 1)
      }
      updateMenu(dateArr)
    }
  }

  return (
    <DateBox emotion={emotion}>
      <DateHeader onClick={handleOpen}>
        <h5>{title}</h5>
        <Arrow />
      </DateHeader>
      <DateMenu ref={openRef}>
        <StartLine ref={startlineRef} />
        {emotion ? (
          emotionList.map((el, idx) => {
            return (
              <MenuList
                key={idx}
                ref={addStagerRef}
                role="presentation"
                onClick={() => {
                  updateMenu(el.name)
                  setSelectIdx(idx)
                }}
                selected={selectIdx === idx && true}
              >
                {el.img}
              </MenuList>
            )
          })
        ) : (
          <>
            <MenuList
              ref={addStagerRef}
              role="presentation"
              onClick={() => updateMenu('latest')}
            >
              최신 순
            </MenuList>
            <MenuList
              ref={addStagerRef}
              role="presentation"
              onClick={() => updateMenu('oldest')}
            >
              오래된 순
            </MenuList>
            <div ref={addStagerRef}>
              <StyledDate
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update)
                }}
                customInput={<CustomInput />}
                withPortal
              />
            </div>
          </>
        )}
        <EndLine ref={endlineRef} />
      </DateMenu>
    </DateBox>
  )
}

export default Calender

const DateBox = styled.div<{ emotion?: string | boolean }>`
  position: absolute;
  width: 7.5rem;
  top: 35%;
  left: ${(props) => (props.emotion ? '53%' : '0')};
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  ${(props) => props.theme.laptop} {
    width: 7rem;
  }
  ${(props) => props.theme.mobile} {
    width: 4.5rem;
    left: ${(props) => (props.emotion ? '25%' : '0')};
    top: 0%;
  }
`
const DateHeader = styled.div`
  max-width: 100%;
  height: 1.7rem;
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
  > svg {
    fill: ${(props) => props.theme.transp};
    width: 1.125rem;
    height: 1rem;
    transform: scale(1.5);
  }
  ${(props) => props.theme.mobile} {
    gap: 0.6rem;
  }
`
const DateMenu = styled.ul`
  ${(props) => props.theme.flexColumn};
  align-items: flex-start;
  gap: 0.8rem;
  text-align: center;
  display: relative;
  height: 0;
  opacity: 0;
  > div {
    display: absolute;
    opacity: 0;
    display: none;
  }
  > :nth-child(4) {
    width: 100%;
    background-color: ${(props) =>
      props.theme === darkTheme ? '#030231' : 'white'};
    border-radius: 5px;
  }
`

const MenuList = styled.li<{ selected?: boolean }>`
  display: absolute;
  width: 100%;
  cursor: pointer;
  padding-top: 0.3rem;
  opacity: 0;
  background-color: ${(props) =>
    props.theme === darkTheme ? '#030231' : 'white'};
  border-radius: 5px;
  display: none;
  > svg {
    transform: scale(0.9);
    fill: ${(props) => props.selected && '#FFFA81'};
    :hover {
      fill: #fffa81;
    }
    ${(props) => props.theme.mobile} {
      width: 2rem;
      height: 2rem;
    }
  }
`

const StyledDate = styled(DatePicker)`
  width: 100%;
`

const CustomBtn = styled.button`
  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.text};
  font-size: 16px;
  padding: 0;
  cursor: pointer;
  > p {
    font-family: 'EB Garamond', 'Gowun Batang', 'Noto Serif KR', Georgia, serif;
    margin: 0;
  }
  ${(props) => props.theme.mobile} {
    font-size: 15px;
  }
`

const StartLine = styled.div`
  left: 0;
  width: 0;
  height: 1.4px;
  background-color: ${(props) => props.theme.transp};
`

const EndLine = styled(StartLine)``
