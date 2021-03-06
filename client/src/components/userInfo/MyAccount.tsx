import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { getTokenAct, editUserAct, withDrawlAct } from '../../actions'
import { RootState } from '../../reducers'
import { Buffer } from 'buffer'
import Modal from '../reusable/Modal'
import { pwIsValid } from '../../components/reusable/Validator'
import axios from 'axios'
import { darkTheme } from '../../styles/theme'

function MyAccount(): JSX.Element {
  const { accessToken, email, username, profile, isSocial } = useSelector(
    (state: RootState) => state.usersReducer.user,
  )
  const dispatch = useDispatch()
  const history = useHistory()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [withdrawalOpen, setWithdrawalOpen] = useState(false)
  const [valid, setValid] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [isWithDraw, setWithDraw] = useState(false)
  const [confirmWdOpen, setConfirmWdOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)
  const photoInput = useRef<HTMLInputElement>(null)
  const [currentInput, setCurrentInput] = useState<{
    [index: string]: any
    imgFile: string | File | null
    Password: string
    PasswordCheck: string
  }>({
    imgFile: '',
    previewUrl: '',
    Password: '',
    PasswordCheck: '',
  })
  const [errorMessage, setErrorMessage] = useState<{
    [index: string]: string
  }>({
    Password: '',
    PasswordCheck: '',
  })
  const userlist = [
    { name: 'Username', val: username },
    { name: 'Email', val: email },
    { name: 'Password', type: 'password', key: 'Password' },
    { name: 'Password', type: 'password', key: 'PasswordCheck' },
  ]

  const profileImg =
    typeof profile !== 'object' && typeof profile === 'string'
      ? profile
      : 'data:image/png;base64, ' +
        Buffer.from(profile, 'binary').toString('base64')

  // 최초 렌더링시 유저정보 받아오기
  useEffect(() => {
    if (!isSocial) {
      getUserInfo()
    }
  }, [])

  useEffect(() => {
    if (isWithDraw) {
      setConfirmWdOpen(true)
    }
  }, [isWithDraw])

  useEffect(() => {
   if(currentInput.imgFile && currentInput.Password && currentInput.PasswordCheck && !errorMessage.Password && !errorMessage.PasswordCheck){
     setValid(true);
   }
  }, [currentInput.imgFile && currentInput.Password && currentInput.PasswordCheck])

  // 유저 정보 요청 함수 
  const getUserInfo = () => {
    axios
      .get(process.env.REACT_APP_URL + `/mypage/user-info`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ` + accessToken,
        },
      })
      .then((res) => {
        if (res.headers.accessToken) {
          dispatch(getTokenAct(res.headers.accessToken))
        }
        typeof profile !== 'object' && typeof profile === 'string'
          ? res.data.profile
          : 'data:image/png;base64, ' +
            Buffer.from(profile, 'binary').toString('base64')
        dispatch(
          editUserAct({
            username: res.data.username,
            profile: res.data.profile,
            email: res.data.email,
          }),
        )
      })
      .catch((err) => {
        console.log(err)
        history.push('/notfound')
      })
  }

  // 카메라 아이콘 커스텀
  const handlePhotoClick = (e: React.MouseEvent) => {
    if (isSocial) {
      return handleSocial()
    }
    e.preventDefault()
    photoInput.current && photoInput.current.click()
  }
  // 이미지 업로드
  const imageFileHandler =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (isSocial) {
        return handleSocial()
      }
      const reader = new FileReader()
      const file = (e.target.files as FileList)[0]
      if (!file) {
        return
      }
      reader.onloadend = () => {
        setCurrentInput({
          ...currentInput,
          imgFile: file,
          previewUrl: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }

  // 인풋창
  const handleInputValue =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isSocial) {
        return handleSocial()
      }
      setCurrentInput({ ...currentInput, [key]: e.target.value })
    }

  const canclePhoto = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentInput({
      ...currentInput,
      imgFile: '',
      previewUrl: '',
    })
  }

  // 이메일, 비번 유효성 검사
  const validationCheck =
    (key: string) => (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value
      let message
      if (!currentInput[key]) {
        setErrorMessage({ ...errorMessage, [key]: '' })
        return
      }
      if (key === 'Password') {
        // 비번 검사
        message = pwIsValid(value)
        if (typeof message === 'string') {
          setErrorMessage({ ...errorMessage, [key]: message })
          return false
        }
      }
      if (key === 'PasswordCheck') {
        if (value !== currentInput.Password) {
          // 비번 일치하지 않을때
          setErrorMessage({
            ...errorMessage,
            [key]: '비밀번호가 일치하지 않습니다.',
          })
          return false
        }
      }
      setErrorMessage({ ...errorMessage, [key]: '' })
    }

  //회원 정보 수정
  const onSubmitHandler = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!valid) {
      return
    }

    const MAX_WIDTH = 320
    const MAX_HEIGHT = 180
    const MIME_TYPE = 'image/*'
    const QUALITY = 0.7

    let imgforaxios

    const file = currentInput.imgFile
    const blobURL = URL.createObjectURL(file)
    const img = new Image()
    img.src = blobURL
    img.onerror = function () {
      URL.revokeObjectURL(this.src)
    }
    img.onload = await function () {
      URL.revokeObjectURL((this as HTMLImageElement).src)
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT)
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      const ctx = canvas.getContext('2d')
      ctx && ctx.drawImage(img, 0, 0, newWidth, newHeight)
      canvas.toBlob(
        (blob) => {
          imgforaxios = blob
          const formData = new FormData()
          imgforaxios && formData.append('profile', imgforaxios)
          formData.append('password', currentInput.Password)

          axios
            .patch(
              `${process.env.REACT_APP_URL}` + `/mypage/user-info`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  authorization: `Bearer ` + accessToken,
                },
                withCredentials: true,
              },
            )
            .then((res) => {
              if (res.headers.accessToken) {
                dispatch(getTokenAct(res.headers.accessToken))
              }
              setIsChanged(true)
              confirmUpdate()
            })
            .catch((err) => {
              console.log(err)
              history.push('/notfound')
            })
        },
        MIME_TYPE,
        QUALITY,
      )
    }
    // 이미지 사이즈 계산
    function calculateSize(
      img: HTMLImageElement,
      maxWidth: number,
      maxHeight: number,
    ) {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }
      return [width, height]
    }
  },[valid, currentInput.imgFile])

  // 회원 탈퇴 요청
  const withdrawalRequest = async () => {
    await axios
      .delete(`${process.env.REACT_APP_URL}` + `/sign/withdrawal`, {
        headers: {
          authorization: `Bearer ` + accessToken,
        },
      })
      .then(() => {
        dispatch(
          withDrawlAct({
            accessToken: '',
            email: '',
            username: '',
            profile: '',
            isSocial: false,
          }),
        )
        history.push('/')
      })
      .catch((err) => {
        console.log(err, '에러러러러')
        history.push('/notfound')
      })
  }

  // 유저 정보 업데이트 후 확인 모달
  const confirmUpdate = useCallback(() => {
    setUpdateOpen(!updateOpen)
    if (isChanged) {
      setCurrentInput({
        imgFile: '',
        previewUrl: '',
        Password: '',
        PasswordCheck: '',
      })
      setValid(false)
      setIsChanged(false)
      getUserInfo()
    }
  }, [updateOpen])

  // 회원 탈퇴 누를 시 모달
  const handleWithdrawal = useCallback(
    (arg?: any) => {
      if (arg === true) {
        setWithDraw(true)
      }
      setWithdrawalOpen(!withdrawalOpen)
    },
    [withdrawalOpen],
  )

  // 탈퇴 모달에서 예를 누를 시
  const confirmWithDrawl = useCallback(() => {
    if (confirmWdOpen) {
      setConfirmWdOpen(false)
      withdrawalRequest()
    }
  }, [confirmWdOpen])

  const handleSocial = useCallback(() => {
    if (isSocial) {
      setSocialOpen(!socialOpen)
    }
  }, [socialOpen])

  return (
    <Container>
      {socialOpen && (
        <Modal handleClick={handleSocial}>
          소셜 로그인 유저는 정보 수정을 할 수 없습니다.
        </Modal>
      )}
      {updateOpen && (
        <Modal handleClick={confirmUpdate}>
          회원 정보 수정이 완료되었습니다.
        </Modal>
      )}
      {withdrawalOpen && (
        <Modal
          handleClick={handleWithdrawal}
          handleSignOut={handleWithdrawal}
          header="회원님의 개인 정보 및 모든 이용 기록은 삭제되며, 복구가 불가능합니다."
        >
          정말 탈퇴하시겠어요?
        </Modal>
      )}
      {confirmWdOpen && (
        <Modal handleClick={confirmWithDrawl}>
          회원 탈퇴가 완료되었습니다.
        </Modal>
      )}
      <Title>
        <h1>나의 계정 보기</h1>
      </Title>
      <ContentBox>
        <Content>
          <PhotoBox>
            <UserPhotoBox>
              <Camera src="/images/camera.svg" onClick={handlePhotoClick} />
              <Photo>
                <input
                  type="file"
                  accept="image/*"
                  name="profile"
                  ref={photoInput}
                  onChange={imageFileHandler('profile')}
                />
                <PhotoCircle
                  src={
                    currentInput.imgFile ? currentInput.previewUrl : profileImg
                  }
                  alt="img"
                />
              </Photo>
            </UserPhotoBox>
            {currentInput.imgFile && (
              <CanclePhoto onClick={canclePhoto}>사진 삭제</CanclePhoto>
            )}
          </PhotoBox>
          <InfoBox>
            <InfoUl>
              {userlist.map((user, idx) => {
                return (
                  <InputWrapper key={idx}>
                    <InfoList>
                      <div>{user.name}</div>
                      {user.key ? (
                        <input
                          type={user.type}
                          placeholder={user.key}
                          onChange={handleInputValue(user.key)}
                          value={currentInput[user.key]}
                          onBlur={validationCheck(user.key)}
                        />
                      ) : (
                        <div>{user.val}</div>
                      )}
                    </InfoList>
                    {user.key && <Error>{errorMessage[user.key]}</Error>}
                  </InputWrapper>
                )
              })}
            </InfoUl>
            <SubmitBtn onClick={onSubmitHandler}>수정</SubmitBtn>
          </InfoBox>
          <WithDrawl onClick={handleWithdrawal}>회원 탈퇴</WithDrawl>
        </Content>
      </ContentBox>
    </Container>
  )
}

export default MyAccount

const Container = styled.div`
  height: 100%;
  ${(props) => props.theme.flexColumn};
  justify-content: flex-start;
`
const Title = styled.div`
  width: 100%;
  height: 6.438rem;
  padding-top: 2.313rem;
  padding-left: 7.313rem;
  h1 {
    font-size: ${(props) => props.theme.fontL};
  }
  ${(props) => props.theme.midTablet} {
    padding-top: 1rem;
    padding-left: 0;
    text-align: center;
  }
  ${(props) => props.theme.mobile} {
    padding-top: 0.6rem;
    height: auto;
  }
`
const ContentBox = styled.div`
  ${(props) => props.theme.flexColumn};
  height: 78%;
  ${(props) => props.theme.mobile} {
    height: calc(100% - 2.099rem);
  }
`
const Content = styled.div`
  width: 29rem;
  height: 37.563rem;
  display: flex;
  flex-direction: column;
  gap: 2.125rem;
  @media only screen and (max-width: 550px) {
    max-width: 29rem;
    max-height: 37.563rem;
    width: 80vw;
    height: auto;
  }
  ${(props) => props.theme.mobile} {
    gap: 1.5rem;
  }
`
const PhotoBox = styled.div`
  position: relative;
  width: 100%;
  height: 7.467rem;
  display: flex;
  justify-content: center;
`
const CanclePhoto = styled.div`
  position: absolute;
  color: ${(props) => props.theme.point};
  bottom: 0;
  right: 0;
  font-size: 14px;
  text-indent: -5rem;
  cursor: pointer;
  :hover {
    font-weight: bold;
    color: ${(props) => props.theme.transp};
  }
`
const UserPhotoBox = styled.div`
  height: 100%;
  width: 8.313rem;
  position: relative;
  left: 0.9rem;
`
const Photo = styled.div`
  height: 7.467rem;
  width: 7.467rem;
  border-radius: 100%;
  display: flex;
  overflow: hidden;
  z-index: -1px;
  > input {
    display: none;
  }
`
const PhotoCircle = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #ceb1b1;
`

const Camera = styled.img`
  width: 48px;
  height: 48px;
  position: absolute;
  z-index: 5px;
  bottom: 5px;
  left: 80px;
  cursor: pointer;
`
const InfoBox = styled.div`
  width: 100%;
  height: 22.813rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media only screen and (max-width: 550px) {
    max-height: 22.813rem;
    height: auto;
    gap: 1rem;
  }
`
const InfoUl = styled.ul`
  width: 100%;
  height: 18.1rem;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 550px) {
    max-height: 18.1rem;
    height: auto;
  }
`
const InputWrapper = styled.li`
  display: flex;
  flex-direction: column;
  height: calc(100% / 4);
`
const InfoList = styled.div`
  height: 3.5rem;
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.transp};
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 0.5rem;
  text-indent: 0.5rem;
  > div {
    width: 4.875rem;
    color: ${(props) =>
      props.theme === darkTheme
        ? 'rgba(255, 255, 255, 0.6)'
        : 'rgba(147, 133, 168, 0.6)'};
  }
  > div:nth-child(2) {
    width: 21.813rem;
    text-indent: 5rem;
    color: ${(props) => props.theme.text};
    font-size: 22px;
  }
  > input {
    width: 21.813rem;
    text-indent: 5rem;
    color: ${(props) => props.theme.text};
    background-color: transparent;
    font-size: 22px;
    ::placeholder {
      color: transparent;
    }
  }
  @media only screen and (max-width: 550px) {
    > div:nth-child(1) {
      display: none;
    }
    > div:nth-child(2) {
      font-size: 18px;
      width: 100%;
      text-indent: 1rem;
      text-align: start;
    }
    > input {
      width: 100%;
      text-indent: 1rem;
      ::placeholder {
        color: ${(props) =>
          props.theme === darkTheme
            ? 'rgba(255, 255, 255, 0.6)'
            : 'rgba(147, 133, 168, 0.6)'};
      }
      font-size: 16px;
    }
  }
  ${(props) => props.theme.mobile} {
    min-height: 3rem;
    height: auto;
  }
`
const Error = styled.div`
  ${(props) => props.theme.flexRow};
  font-size: ${(props) => props.theme.fontS};
  align-items: flex-end;
  height: 1.2rem;
  color: ${(props) => props.theme.point};
`
const SubmitBtn = styled.button`
  width: 9.063rem;
  height: 2.5rem;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'EB Garamond', 'Gowun Batang', 'Noto Serif KR', Georgia, serif;
  transition: all 0.3s ease-in-out;
  background: ${(props) => props.theme.dream};
  border: transparent;
  color: ${(props) => props.theme.reverse};
  :hover {
    background: transparent;
    border: 1px solid ${(props) => props.theme.transp};
    transition: all 0.3s ease-in-out;
    color: ${(props) => props.theme.text};
  }
`
const WithDrawl = styled.div`
  height: 2.875rem;
  border-bottom: 1px solid ${(props) => props.theme.transp};
  color: ${(props) => props.theme.point};
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-size: 14px;
  padding-bottom: 0.5rem;
  text-indent: -5rem;
  cursor: pointer;
  :hover {
    font-weight: bold;
    color: ${(props) => props.theme.transp};
  }
  @media only screen and (max-width: 550px) {
    height: 2rem;
  }
`
