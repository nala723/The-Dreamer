import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Modal from '../components/reusable/Modal'
import { useDispatch } from 'react-redux'
import { signInAct } from '../actions'

function NotFound(): JSX.Element {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    handleModal()
  }, [])

  const handleModal = () => {
    setOpen(!open)
    if (open) {
      dispatch(
        signInAct({
          email: '',
          username: '',
          accessToken: '',
          profile: '',
          isSocial: false,
        }),
      )
    }
  }

  return (
    <>
      <Container>
        {open && (
          <Modal
            handleClick={handleModal}
            header="네트워크 장애 혹은 액세스 토큰이 만료되었습니다. 로그인 후 다시 이용해주세요."
          >
            404 not found
          </Modal>
        )}
        <img src="/images/404.svg" alt="404" />
      </Container>
    </>
  )
}

export default NotFound

const Container = styled.div`
  ${(props) => props.theme.flexColumn};
  height: calc(100vh - 4.375rem);
  ${(props) => props.theme.mobile} {
    min-height: calc(100vh - 3.6rem);
  }
`
