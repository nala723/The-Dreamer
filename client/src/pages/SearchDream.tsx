import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import {
  searchDreamAct,
  getTokenAct,
  likeDreamAct,
  disLikeDreamAct,
  removeDreamAct,
} from '../actions'
import { RootState } from '../reducers'
import SearchBar from '../components/reusable/SearchBar'
import HashTag from '../components/reusable/HashTag'
import CateGory from '../components/searchdream/Category'
import Modal from '../components/reusable/Modal'
import SingleDream from '../components/reusable/SingleDream'
import axios from 'axios'
import Loading from '../config/Loading'
import NotFound from './NotFound'

function SearchDream(): JSX.Element {
  const { loading, data, error } = useSelector(
    (state: RootState) => state.searchReducer.search,
  )
  const { username, accessToken } = useSelector(
    (state: RootState) => state.usersReducer.user,
  )
  const dispatch = useDispatch()
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)
  const [banGuest, setBanGuest] = useState(false)

  // // 처음 한번 이벤트 걸어볼까? 그러고 이 안에서 함수만들고 그에 따라 상태값변하게
  useEffect(() => {
    return () => {
      dispatch(removeDreamAct())
    }
  }, [])

  const handleSearch = (search: string) => {
    if (search === '') {
      setIsOpen(true)
      return
    }
    dispatch(searchDreamAct(search))
  }

  // 꿈 모달 닫기
  const handleClick = () => {
    setIsOpen(false)
  }

  // likes
  const handleLike = async (e: React.MouseEvent, idx: number) => {
    e.preventDefault()
    if (!username) {
      banGuestLike()
      return
    }
    await axios
      .post(
        process.env.REACT_APP_URL + '/search/like',
        {
          url: data[idx].link,
          content: data[idx].description,
          title: data[idx].title,
        },
        {
          headers: {
            authorization: `Bearer ` + accessToken,
          },
        },
      )
      .then((res) => {
        if (res.headers.accessToken) {
          dispatch(getTokenAct(res.headers.accessToken))
        }
        if (res.status === 200) {
          if (res.data.likeId) {
            const likeData = [
              {
                ...data[idx],
                id: res.data.likeId,
              },
            ]
            dispatch(likeDreamAct(likeData))
          }
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error)
          history.push('/notfound')
        }
      })
  }

  console.log('data??', data)
  const handleDislike = async (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    const dreamId = id
    await axios
      .delete(process.env.REACT_APP_URL + `/search/dislike/${dreamId}`, {
        headers: {
          authorization: `Bearer ` + accessToken,
        },
      })
      .then((res) => {
        if (res.headers.accessToken) {
          dispatch(getTokenAct(res.headers.accessToken))
        }
        if (res.status === 200) {
          dispatch(disLikeDreamAct(dreamId))
        } else {
          history.push('/notfound')
        }
      })
      .catch((error) => console.log(error))
  }

  const banGuestLike = () => {
    setBanGuest(!banGuest)
  }

  if (error) {
    return <NotFound />
  } else {
    return (
      <Container>
        {loading && <Loading />}
        {isOpen && (
          <Modal handleClick={handleClick}>검색하실 꿈을 입력해주세요.</Modal>
        )}
        {banGuest && (
          <Modal handleClick={banGuestLike}>
            로그인 후 이용가능한 서비스입니다.
          </Modal>
        )}
        <SearchSection>
          <SearchBar
            height="3.125rem"
            width="34.438rem"
            scale="(0.7)"
            font="1.125rem"
            handleSearch={handleSearch}
          />
        </SearchSection>
        <HashTag handleSearch={handleSearch} />
        <DreamSection>
          {data.length === 0 ? (
            <SingleDream header="검색한 꿈 혹은 결과가 없습니다.">
              상단의 검색바에서 꿈을 검색해 주세요.
            </SingleDream>
          ) : (
            <SingleDream
              data={data}
              handleLike={handleLike}
              handleDislike={handleDislike}
            />
          )}
        </DreamSection>
        <CateGory />
      </Container>
    )
  }
}

export default SearchDream

const Container = styled.div`
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 4.375rem);
  height: auto;
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  ${(props) => props.theme.mobile} {
    align-items: center;
    min-height: calc(100vh - 3.6rem);
    height: auto;
  }
`
const SearchSection = styled.div`
  width: 100%;
  height: 5.688rem;
  display: flex;
  align-items: flex-end;
  padding-left: 19.438rem;
  ${(props) => props.theme.midTablet} {
    padding-left: 13rem;
  }
  ${(props) => props.theme.tablet} {
    padding-left: 10.1rem;
    padding-top: 1rem;
    align-items: flex-start;
    height: auto;
    max-width: 97%;
  }
  ${(props) => props.theme.mobile} {
    width: 91vw;
    padding-left: 0;
    padding-top: 0.5rem;
  }
`
const DreamSection = styled.div`
  width: 100%;
  min-height: calc(100vh - 4.375rem - 5.688rem - 3.498rem);
  position: relative;
  top: 4rem;
  ${(props) => props.theme.laptop} {
    top: 6.5rem;
    min-height: calc(100vh - 4.375rem - 5.688rem - 6.396rem);
  }
  ${(props) => props.theme.tablet} {
    min-height: calc(100vh - 4.375rem - 4.125rem - 5.549rem);
  }
  ${(props) => props.theme.mobile} {
    top: 4rem;
    min-height: calc(100vh - 3.6rem - 3.399rem - 3.2rem);
  }
`
