import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import SearchBar from '../reusable/SearchBar'
import Modal from '../reusable/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../reducers'
import { getTokenAct } from '../../actions'
import Calender from '../reusable/Calender'
import { Data } from '../../actions'
import axios from 'axios'
import SingleDream from '../reusable/SingleDream'
import Loading from '../../config/Loading'

function MyLikes(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const { accessToken } = useSelector(
    (state: RootState) => state.usersReducer.user,
  )
  const [originalDream, setOriginalDream] = useState<Data[]>([])
  const [tempDream, setTempDream] = useState<Data[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [selected, setSelected] = useState(-1)
  const [hasText, sethasText] = useState(false)
  const [width, setWidth] = useState('')
  const [sortLike, setSorLike] = useState<{
    latestLike: boolean
    selectLike: string[]
  }>({
    latestLike: false,
    selectLike: [],
  })
  const clickRef = useRef<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLikes()
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (sortLike.latestLike || sortLike.selectLike.length > 0) {
      return handleSortLike(originalDream)
    } else {
      setTempDream([...originalDream])
    }
  }, [sortLike])

  const getLikes = () => {
    axios
      .get(process.env.REACT_APP_URL + '/mypage/like', {
        headers: {
          authorization: `Bearer ` + accessToken,
        },
      })
      .then((res) => {
        if (res.headers.accessToken) {
          dispatch(getTokenAct(res.headers.accessToken))
        }
        setLoading(false)
        res.data.dream = res.data.dream
          .map((dream: any) => {
            dream.createdAt = dream.createdAt.split('T')[0].slice(2)
            return dream
          })
          .reverse()
        setOriginalDream(res.data.dream)
        setTempDream(res.data.dream)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  // ?????? ????????? ???????????? ????????????
  const handleClickOutside = (e: MouseEvent) => {
    if (clickRef.current && !clickRef.current.contains(e.target)) {
      sethasText(false)
    }
  }

  // ???????????? ??????
  const handleSearch = (search: string) => {
    if (search === '') {
      setIsOpen(true)
      return
    }
    // ??????????????? ?????? ??????
    search = search.replace(/[[(){}]/gi, '')
    const regex = new RegExp(search, 'gi')
    const searched = originalDream.filter((el) => {
      return (
        el.title.replace(/[[(){}]/gi, '').match(regex) ||
        el.content.replace(/[[(){}]/gi, '').match(regex)
      )
    })
    setTempDream(searched)
    sethasText(false)
  }

  // input??? ?????? dropbox ?????? ??????
  const handleInput = (search: string) => {
    if (search !== '') {
      sethasText(true)
    } else {
      sethasText(false)
    }
    setInput(search)

    search = search.replace(/[[(){}]/gi, '')
    const regex = new RegExp(search, 'gi')
    const searched = originalDream
      .filter((el) => {
        return (
          el.title.replace(/[[(){}]/gi, '').match(regex) ||
          el.content.replace(/[[(){}]/gi, '').match(regex)
        )
      })
      .map((el) => {
        return el.title.slice(0, 30)
      })
    setOptions(searched)
  }

  const handleDropDownClick = (clickedOption: string) => {
    setInput(clickedOption)
    handleSearch(clickedOption)
  }

  const handleKeyUp = (event: React.KeyboardEvent) => {
    event.preventDefault()
    if (
      event.getModifierState('Fn') ||
      event.getModifierState('Hyper') ||
      event.getModifierState('OS') ||
      event.getModifierState('Super') ||
      event.getModifierState('Win')
    )
      return

    if (hasText) {
      if (event.code === 'ArrowDown' && options.length - 1 > selected) {
        setSelected(selected + 1)
      }
      if (event.code === 'ArrowUp' && selected >= 0) {
        setSelected(selected - 1)
      }
      if (event.code === 'Enter' && selected >= 0) {
        handleDropDownClick(options[selected])
        setSelected(-1)
      }
    }
  }

  // ?????? ?????? ??????
  const handleAllsearch = () => {
    getLikes()
  }

  const updateMenu = (arg: number | string[]) => {
    if (typeof arg === 'string') {
      if (arg === 'latest') {
        setSorLike({ latestLike: false, selectLike: [] })
      } else if (arg === 'oldest') {
        setSorLike({ latestLike: true, selectLike: [] })
      }
    } else if (typeof arg === 'object') {
      setSorLike({ latestLike: false, selectLike: arg })
    }
  }

  let newState: Data[]

  const handleSortLike = (data: Data[]) => {
    if (sortLike.latestLike && sortLike.selectLike.length <= 0) {
      newState = [...data]
      newState = newState.reverse()
    }
    if (sortLike.selectLike.length > 0 && !sortLike.latestLike) {
      newState = data.filter((el: any) => {
        return sortLike.selectLike.includes(el.createdAt)
      })
    }
    setTempDream(newState)
  }

  // ??? ?????? ??????
  const handleClick = () => {
    setIsOpen(false)
  }
  
  // ??? ??????
  const handleDislike = (e: React.MouseEvent, id?: number) => {
    e.preventDefault()
    const dreamId = id
    axios
      .delete(process.env.REACT_APP_URL + `/search/dislike/${dreamId}`, {
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      })
      .then((res) => {
        console.log(res.data)
        if (res.headers.accessToken) {
          dispatch(getTokenAct(res.headers.accessToken))
        }
        getLikes()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleWidth = (arg: string) => {
    if (arg) {
      setWidth(arg)
    }
  }

  return (
    <>
      <Container>
        {loading && <Loading />}
        {isOpen && (
          <Modal handleClick={handleClick}>???????????? ?????? ??????????????????.</Modal>
        )}
        <Title>
          <h1>???????????? ???</h1>
        </Title>
        <UpperSection>
          <ResponsiveLeft>
            <Calender
              title={width ? '?????????' : '????????? ??????'}
              updateMenu={updateMenu}
            />
            <RspAllsearch onClick={handleAllsearch}>
              <h5>????????????</h5>
            </RspAllsearch>
          </ResponsiveLeft>
          <ResponsiveRight>
            <SearchSection onKeyUp={handleKeyUp} ref={clickRef}>
              <SearchBar
                height="3.125rem"
                width="34.438rem"
                scale="(0.7)"
                font="1.125rem"
                handleSearch={handleSearch}
                handleInput={handleInput}
                input={input}
              />
              {hasText ? (
                <DropDownContainer>
                  {options.map((option, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleDropDownClick(option)}
                      className={selected === idx ? 'selected' : ''}
                      role="presentation"
                    >
                      {option}
                    </li>
                  ))}
                </DropDownContainer>
              ) : null}
            </SearchSection>
            <Allsearch onClick={handleAllsearch}>
              <h5>????????????</h5>
            </Allsearch>
          </ResponsiveRight>
        </UpperSection>
        <DreamSection>
          {!loading && tempDream.length === 0 ? (
            <SingleDream header="???????????? ?????? ????????????.">
              ??? ???????????? ??????????????? ?????? ???????????? ?????? ?????? ????????? ??? ????????????.
            </SingleDream>
          ) : (
            <SingleDream
              data={tempDream}
              handleDislike={handleDislike}
              handleWidth={handleWidth}
            />
          )}
        </DreamSection>
      </Container>
    </>
  )
}

export default MyLikes

const Container = styled.div`
  ${(props) => props.theme.flexColumn};
  height: 100%;
  justify-content: flex-start;
  overflow: auto;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`
const Title = styled.div`
  width: 100%;
  height: 5.5rem;
  padding-top: 2.313rem;
  padding-left: 7.313rem;
  h1 {
    font-size: ${(props) => props.theme.fontL};
  }
  ${(props) => props.theme.midTablet} {
    text-align: center;
    padding: 0;
    padding-top: 1.5rem;
  }
  ${(props) => props.theme.tablet} {
    padding-top: 1rem;
    height: 3.5rem;
  }
  ${(props) => props.theme.mobile} {
    padding-top: 0.6rem;
    height: 2.2rem;
  }
`
const UpperSection = styled.div`
  width: 100%;
  height: 5.688rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem 0 5rem;
  color: ${(props) => props.theme.text};
  ${(props) => props.theme.laptop} {
    padding: 0 3.5rem;
    font-size: 15px;
  }
  ${(props) => props.theme.midTablet} {
    flex-direction: column-reverse;
    padding-left: 3rem;
  }
  ${(props) => props.theme.midTablet} {
    flex-direction: column-reverse;
    align-items: flex-start;
    padding: 0 4.9rem;
    gap: 1rem;
  }
  ${(props) => props.theme.mobile} {
    padding: 0 1rem;
    justify-content: center;
    gap: 0;
    height: auto;
  }
`
const ResponsiveRight = styled.div`
  ${(props) => props.theme.flexRow};
  height: 5.688rem;
  justify-content: flex-start;
  gap: 3rem;
  ${(props) => props.theme.laptop} {
    gap: 2rem;
  }
  ${(props) => props.theme.tablet} {
    gap: 1rem;
  }
  ${(props) => props.theme.mobile} {
    justify-content: center;
    max-width: 91vw;
    height: 4.5rem;
  }
`
const SearchSection = styled.div`
  max-width: 100%;
  width: auto;
  height: 100%;
  display: flex;
  position: relative;
  ${(props) => props.theme.tablet} {
    max-width: 85%;
  }
  ${(props) => props.theme.mobile} {
    max-width: 91vw;
    height: 4.5rem;
  }
`
const DropDownContainer = styled.ul`
  background-color: ${(props) => props.theme.transp};
  display: block;
  width: 34.438rem;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  color: ${(props) => props.theme.reverse};
  top: 71px;
  padding: 0.5rem 0;
  border: none;
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 3;
  > li {
    padding: 0 1rem;
    &:hover {
      background-color: grey;
    }
    &.selected {
      background-color: grey;
    }
  }
`
const Allsearch = styled.div`
  min-width: 3.521rem;
  text-align: center;
  cursor: pointer;
  ${(props) => props.theme.laptop} {
    min-width: 3.521rem;
    width: auto;
  }
  ${(props) => props.theme.tablet} {
    min-width: 15%;
    margin: 0;
  }
  ${(props) => props.theme.mobile} {
    display: none;
  }
`
const ResponsiveLeft = styled.div`
  display: flex;
  position: relative;
  width: 9rem;
  min-width: 7rem;
  gap: 3rem;
  height: 100%;
  ${(props) => props.theme.laptop} {
    gap: 2rem;
  }
  ${(props) => props.theme.mobile} {
    width: 100%;
    height: 1.5rem;
    align-items: center;
  }
`
const RspAllsearch = styled(Allsearch)`
  display: none;
  ${(props) => props.theme.mobile} {
    color: ${(props) => props.theme.text};
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-end;
  }
`
const DreamSection = styled.div`
  width: 100%;
  height: calc(100vh - 4.375rem - 5.5rem - 5.688rem);
  position: relative;
`
