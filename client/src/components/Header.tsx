import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { signInAct } from '../actions'
import { RootState } from '../reducers'
import { Buffer } from 'buffer'
import Option from './Option'
import Modal from './reusable/Modal'
import Toggle from './Toogle'
import axios from 'axios'
import { ReactComponent as Hamburger } from '../assets/hamburger.svg'

function Header(props: { themeToggler: () => void; themeValue: string }): JSX.Element {
  const { accessToken, username, profile } = useSelector(
    (state: RootState) => state.usersReducer.user,
  )
  const dispatch = useDispatch()
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)
  const { themeToggler, themeValue } = props
  const [dropdown, setDropdown] = useState(false)
  const [button, setButton] = useState(false)
  const menulist = [
    { menu: '꿈 알아보기', url: '/searchdream' },
    { menu: '꿈 그리기', url: '/drawdream' },
    { menu: '로그인', url: '/login' },
  ]

  let profileImg: any

  if (profile === null) {
    dispatch(
      signInAct({
        email: '',
        username: '',
        accessToken: '',
        profile: '',
        isSocial: false,
      }),
    )
  } else {
    profileImg =
      typeof profile !== 'object' && typeof profile === 'string'
        ? profile
        : 'data:image/png;base64, ' +
          Buffer.from(profile, 'binary').toString('base64')
  }

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(true)
    } else {
      setButton(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', showButton)
    showButton()
    return () => {
      window.removeEventListener('resize', showButton)
    }
  }, [])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const closeDropbox = () => {
    setDropdown(false)
  }

  const handleSignOut = async (choice: boolean) => {
    if (choice) {
      setIsOpen(false)
      await axios
        .get(process.env.REACT_APP_URL + '/sign/signout', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ` + accessToken,
          },
        })
        .then(() => {
            dispatch(
              signInAct({
                email: '',
                username: '',
                accessToken: '',
                profile: '',
                isSocial: false,
              }),
            )
            history.push('/')
        })
        .catch(() => history.push('/notfound'))
    } else {
      return
    }
  }

  return (
    <>
      <Container>
        {isOpen && (
          <Modal handleClick={handleClick} handleSignOut={handleSignOut}>
            로그아웃 하시겠습니까?
          </Modal>
        )}
        <LogoBox to="/">
          <Logo />
        </LogoBox>
        <RightBox resize={button ? 'resize' : ''}>
          {button ? (
            username ? (
              <UserPic onClick={() => setDropdown(!dropdown)}>
                <img src={profileImg} alt="img" />
                {dropdown && (
                  <Option
                    handleClick={handleClick}
                    resize={button}
                    user={username}
                    handleDropbox={closeDropbox}
                  />
                )}
              </UserPic>
            ) : (
              <Menu>
                <StyledHambgr onClick={() => setDropdown(!dropdown)} />
                {dropdown && (
                  <Option resize={button} handleDropbox={closeDropbox} />
                )}
              </Menu>
            )
          ) : (
            <Menu>
              {menulist.map((menu, idx) => {
                return username && idx === 2 ? (
                  <UserPic key={idx} onClick={() => setDropdown(!dropdown)}>
                    <img src={profileImg} alt="img" />
                    {dropdown && (
                      <Option
                        handleClick={handleClick}
                        user={username}
                        handleDropbox={closeDropbox}
                      />
                    )}
                  </UserPic>
                ) : (
                  <LinkMenu to={menu.url} key={idx}>
                    {menu.menu}
                  </LinkMenu>
                )
              })}
            </Menu>
          )}
          <Toggle themeToggler={themeToggler} themeValue={themeValue} />
        </RightBox>
      </Container>
    </>
  )
}

export default Header

const Container = styled.div`
  display: flex;
  width: inherit;
  height: 4.375rem;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 10;
  ${(props) => props.theme.tablet} {
    padding: 0 1rem 0 0;
  }
  ${(props) => props.theme.mobile} {
    height: 3.6rem;
  }
`
const LogoBox = styled(Link)`
  ${(props) => props.theme.tablet} {
    transform: scale(0.8);
  }
  ${(props) => props.theme.mobile} {
    transform: scale(0.7);
  }
`
const Logo = styled.img.attrs((props) => {
  return { src: props.theme.imgsrc }
})``

const RightBox = styled.div<{ resize: string }>`
  display: flex;
  width: ${(props) => (props.resize !== '' ? 'auto' : '23rem')};
  height: inherit;
  align-items: center;
  gap: 1.5rem;
  ${(props) => props.theme.mobile} {
    gap: 1rem;
  }
`
const Menu = styled.ul`
  display: flex;
  align-items: center;
  width: 100%;
  height: inherit;
  justify-content: space-around;
  -webkit-justify-content: space-around;
`
const UserPic = styled.li`
  width: 1.813rem;
  height: 1.813rem;
  border-radius: 100%;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    background: ${(props) => props.theme.dream};
  }
`
const StyledHambgr = styled(Hamburger)`
  ${(props) => props.theme.mobile} {
    width: 90%;
  }
`
const LinkMenu = styled(Link)`
  color: ${(props) => props.theme.text};
  font-size: ${(props) => props.theme.fontS};
  position: relative;
  cursor: pointer;
  :nth-child(3) {
    color: ${(props) => props.theme.point};
    > img {
    }
    :hover:after {
      background-color: ${(props) => props.theme.point};
    }
    :hover {
      color: ${(props) => props.theme.point};
      text-shadow: 4px -4px 10px ${(props) => props.theme.point};
    }
  }
  :after {
    content: '';
    position: absolute;
    left: -4px;
    bottom: -10px;
    width: 0px;
    height: 1.5px;
    margin: 5px 0 0;
    transition: all 0.5s ease-in-out;
    transition-duration: 0.3s;
    opacity: 0;
    background-color: ${(props) => props.theme.anker};
  }
  :hover {
    color: ${(props) => props.theme.anker};
    text-shadow: 4px 4px 10px ${(props) => props.theme.anker};
  }
  :hover:after {
    width: 120%;
    opacity: 1;
  }
`
