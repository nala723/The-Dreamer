import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInAct } from '../actions';
import { RootState } from '../reducers';
import { GoogleLogin } from 'react-google-login';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import dotenv from "dotenv";
import { darkTheme } from '../styles/theme';
dotenv.config();

//window객체에서 뽑아서야 하는 naver 파라미터는 아래와 같이 global로 선언해주지 않으면 사용이 불가능하다. 
//꼭 필수로 해줘야함.
declare global {
  interface Window {
    naver: any;
  }
}

const { naver } = window;

function Login(){
  const dispatch = useDispatch();
  const history = useHistory();
  const [loginInfo, setLoginInfo] = useState({
    Email:'',
    Password:''
  })
  const [errorMessage, setErrorMessage] = useState('')
  const naverRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    naverLogin(); 
  },[])

  const handleInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value})
  }

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    axios
      .post(process.env.REACT_APP_URL + `/sign/signin`,{
        email: loginInfo.Email,
        password: loginInfo.Password
        })
      .then((res)=>{
          res.data.profile = (typeof res.data.profile !== 'object' && typeof res.data.profile === 'string') ?
          res.data.profile : "data:image/png;base64, " + Buffer.from(res.data.profile, 'binary').toString('base64');   
          dispatch(signInAct(res.data))
          history.push('./searchdream')
      })
      .catch((err)=>{
        if(err.response.status === 401){
          setErrorMessage('이메일 또는 비밀번호를 잘못 입력하셨습니다.')
        }else {
          history.push('/notfound');
        }
      })  
  }

/* 네이버 로그인, 커스텀 버튼, 누르면 컴ㅍ넌트 상태 true로 렌더링 */
  const naverLogin = async() => {
    const loginId = await new naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_ID,
      callbackUrl: 'http://localhost:3000/login', // 나중 수정
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 40},
      callbackHandle: true
    }) 
    loginId.init();
    loginId.logout();
    loginId.getLoginStatus(function (status: any) {
      if (status) {
        const email = loginId.user.email // 필수로 설정할것을 받아와 아래처럼 조건문을 줍니다.
        const username = loginId.user.nickname
        const profile = loginId.user.profile_image
         if( !email  || !username ) {
          alert("필수 정보제공에 동의해주세요.");
          loginId.reprompt();
          return;
        }
        socialLoginRq(email, username, profile)
      } else {
        console.log("callback 처리에 실패하였습니다.");
      }
    });
  }
  /* 구글 로그인 */
  const responseGoogle = (res: any) => {
    const email = res.profileObj.email;
    const username = res.profileObj.name;
    const profile = res.profileObj.imageUrl;
    socialLoginRq(email, username, profile )
  };  

  /* 종합 소셜 로그인 */
  const socialLoginRq = async(email: string, username: string, profile: string ) => {
    await axios
        .post(process.env.REACT_APP_URL + '/social/signin',{
          email,
          username,
        })
        .then((res)=>{
          if(res.status === 200){
            dispatch(signInAct({isSocial: true, profile: profile,...res.data}))
            history.push('./searchdream')
          }
        })
        .catch(err=>{
          console.log(err)
          history.push('./notfound')
        })
    }

  // 네이버 버튼 커스텀 - 클릭시 naverRef.current의 첫번째 chileren에 click이벤트 할당
  const handleNaverBtn = () => {
    naverRef.current && (naverRef.current.children[0] as HTMLElement).click();
  } 
    
  return (
    <Container>
       <LogInBox>
         <Title>
           <h1>Log In</h1>
          </Title>
          <Content>
            <InputBox>
                <SingleInput>
                  <div>Email</div>
                  <input  type='email' placeholder='Email' onChange={handleInput('Email')}/>
                </SingleInput>
                <SingleInput>
                  <div>Password</div>
                  <input  type='password' placeholder='Password' onChange={handleInput('Password')}/>
                </SingleInput>
                <Error err={errorMessage? 'err' : ''}>{errorMessage}</Error>
                <Button onClick={handleSubmit}>
                Log In
               </Button>
            </InputBox>   
            < OrBox>or</OrBox>
            <SocialBox>
              <GoogleBtn clientId={`${process.env.REACT_APP_GOOGLE_ID}`} buttonText='구글 아이디로 로그인' 
               onSuccess={responseGoogle}/>
              <HideBtn ref={naverRef} id="naverIdLogin" />
              <NaverBtn onClick={handleNaverBtn} id="naverIdLogin">
                <img src='/images/naverbtn.png' alt='naver' />
                <div>네이버 아이디로 로그인</div>
              </NaverBtn>
            </SocialBox>
          </Content>
          <HaveAccount>
            <p>회원이 아니신가요?</p><LinkedP to='/signup'>회원가입</LinkedP>
          </HaveAccount>
       </LogInBox>
     </Container>
  );
}

export default Login;


const Container = styled.div`            
  overflow: hidden;
  display: flex;
  ${props => props.theme.flexRow};
  height: calc(100vh - 4.375rem);
  ${props=> props.theme.mobile}{
   min-height: calc(100vh - 3.6rem);
  }
`;

const LogInBox = styled.div`
  ${props => props.theme.flexColumn};
  margin-top: -2rem;
  width: 33.438rem;
  height: 42.125rem;
  padding: 2.75rem 0 ;
  gap: 2.7rem;
  color:  ${props=> props.theme === darkTheme ?
   'rgba(255, 255, 255, 0.6)' : 'rgba(147, 133, 168)'};
  @media only screen and (max-width: 550px){
    max-width: 33.438rem;
    max-height: 42.125rem;
    width: 80vw;
    height: 70vh;
  }
  ${props=>props.theme.mobile}{
    height: auto;
  }

`;

const Title = styled.div`
  width: 100%;
  height: auto;
  text-align: center;
  > h1 {
    font-size: 3.438rem;
    @media only screen and (max-width: 550px){
      font-size: 3rem;
    }
  }
`;

const Content = styled.div`
  ${props => props.theme.flexColumn};
  width: 28.063rem;
  height: 23.875rem;
  gap: 1.7rem;
  @media only screen and (max-width: 550px){
    max-width: 28.063rem;
    max-height: 23.875rem;
    width: 95%;
    height: 80%;
  }
  ${props=>props.theme.mobile}{
    height: auto;
    gap: 1rem;
    width: 100%;
  }
  
`;

const InputBox = styled.div`
  width: 100%;
  height: 15.813rem;
  @media only screen and (max-width: 550px){
    height: 70%;
  }
  
`;

const SingleInput = styled.div`
  ${props => props.theme.flexRow};
  justify-content: space-around;
  align-items: flex-end;
  height: 4.5rem;
  border-bottom: 1px solid ${props=> props.theme.transp};
  font-size: 20px;
  padding-bottom: 0.5rem;
  text-indent: 0.5rem;
  > div{
    width: 4.875rem;
  }
  > input{
    width: 21.813rem;
    text-indent: 3rem;
    color: ${props=> props.theme.text}; 
    background-color: transparent; 
    font-size: 20px;
      ::placeholder{
        color: transparent;
      }
  }
  @media only screen and (max-width: 550px){
    >div {
     display: none;
    }
    >input {
      width: 100%;
      text-indent: 1rem;
      ::placeholder{
        color: ${props=> props.theme === darkTheme ?
   'rgba(255, 255, 255, 0.6)' : 'rgba(147, 133, 168, 0.6)'};
      }
      font-size: 16px;
    }  
  }
  ${props=>props.theme.mobile}{
    height: 3.5rem;
  }
`;
const Error = styled.div<{err: string;}>`
  ${props => props.theme.flexRow};
  font-size: ${props => props.theme.fontS};
  align-items: flex-end;
  height: 1.2rem;
  color: ${props=> props.theme.point};
  ${props=>props.theme.mobile}{
    display: ${props=>props.err ? 'flex' : 'none'};
  }
`;
const Button = styled.div`
  ${props => props.theme.flexRow};
  height: 3.75rem;
  border-radius: 5px;
  font-size: ${props => props.theme.fontL};
  font-weight: 600;
  cursor: pointer;
  color: ${props=> props.theme.reverse};
  transition: all 0.3s ease-in-out;
  background: ${props=> props.theme.dream};  
  margin-top: 1.5rem;
  :hover{
    background: transparent; 
    border: 1px solid ${props=> props.theme.transp};  
    color: ${props=> props.theme.text};
    transition: all 0.3s ease-in-out;
  }
  ${props=>props.theme.mobile}{
    height: 3rem;
    font-weight: 500;
  }
`;

const OrBox = styled.div`
  width: 100%;
  height: auto;
  text-align: center;
  @media only screen and (max-width: 550px){
    /* height: 2rem; */
  }
  ${props=>props.theme.mobile}{
    height: 3rem;
  }
`;

const SocialBox = styled.div`
  height: 3.75rem;
  ${props => props.theme.flexRow};
  justify-content: space-between;
  ${props=>props.theme.mobile}{
    ${props => props.theme.flexColumn};
    height: 3rem;
    gap: 1rem;
  }
`;
const GoogleBtn = styled(GoogleLogin)`
  height: 100%;
  width: 48%;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  >div{
    display: flex;
    align-items: center;
    >svg{
      transform: scale(1.5);
    }
  }
  >span {
    margin-left: -2px;
  }
  ${props=>props.theme.mobile}{
    width: 100%;
    justify-content: flex-start;
    >div{
      height: 3rem;
      margin-left: 0.5rem;
      justify-content: center;
      >svg{
      transform: scale(1.4);
       }
    }
    >span{
      width: 75%;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const HideBtn = styled.div`
  display: none;
`;
const NaverBtn = styled.button`
  cursor: pointer;
  width: 48%;
  height: 100%;
  border: none;
  border-radius: 5px;
  background-color: #03C75A;
  display: flex;
  align-items: center;
  color: white;
  font-weight: bold;
  >img {
    height: 3.3rem;
  }
  ${props=>props.theme.mobile}{
    width: 100%;
    >img {
    height: 2.8rem;
    }  
    >div {
      width: 75%;
      text-align: center;
    }
  }
`;

const HaveAccount = styled.div`
  ${props => props.theme.flexRow};
  height: 1rem;
  font-size: ${props => props.theme.fontS};
  gap: 1rem;
  ${props=>props.theme.mobile}{
   margin-top: 0.7rem;
  }
`;

const LinkedP = styled(Link)`
  color: ${props=> props.theme.point};
  cursor: pointer;
  :hover{
    color: ${props=> props.theme.transp};
  }
`;