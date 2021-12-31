import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SignInAct } from '../actions';
import { RootState } from '../reducers';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import dotenv from "dotenv";
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

  useEffect(()=>{
    naverLogin(); 
    // UserProfile();
  },[])

  const handleInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value})
  }

  const handleSubmit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_URL + `/sign/signin`,{
        email: loginInfo.Email,
        password: loginInfo.Password
        })
      .then((res)=>{
        if(res.status === 401){
          setErrorMessage('이메일 또는 비밀번호를 잘못 입력하셨습니다.')
        }else if(res.status === 200){
          dispatch(SignInAct(res.data))
          history.push('./searchdream')
        }
      })
      .catch((err)=>{
        console.log(err)
      })  
  }

  const naverLogin = () => {
    const loginId = new naver.LoginWithNaverId({
      clientId: 'GI8wPDg1GKr1M4un2re_',
      callbackUrl: 'http://localhost:3000/login',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 40},
      callbackHandle: true
    }) 
    loginId.init();
    loginId.getLoginStatus(function (status: any) {
      if (status) {
        const email = loginId.user.email // 필수로 설정할것을 받아와 아래처럼 조건문을 줍니다.
        const username = loginId.user.name
        console.log(loginId.user); 
          
         if( !email  || !username ) {
          alert("필수 정보제공에 동의해주세요.");
          loginId.reprompt();
          return;
        }
      } else {
        console.log("callback 처리에 실패하였습니다.");
      }
    });
  }
  // const UserProfile = () => {
  //   // window.location.href.includes('access_token') && GetUser();
  //   // function GetUser() {
  //   //   const location = window.location.href.split('=')[1];
  //   //   const token = location.split('&')[0];
  //   // }    
  //   }
//profile_image
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
                  <input  type='email' onChange={handleInput('Email')}/>
                </SingleInput>
                <SingleInput>
                  <div>Password</div>
                  <input  type='password' onChange={handleInput('Password')}/>
                </SingleInput>
                <Error>{errorMessage}</Error>
                <Button onClick={handleSubmit}>
                Log In
               </Button>
            </InputBox>   
            <div>or</div>
            <SocialBox>
              <GoogleBtn>Google</GoogleBtn>
              <NaverBtn onClick={naverLogin} id="naverIdLogin">Naver</NaverBtn>
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
`;

const LogInBox = styled.div`
  ${props => props.theme.flexColumn};
  margin-top: -2rem;
  width: 33.438rem;
  height: 42.125rem;
  padding: 2.75rem 0 ;
  gap: 2.7rem;
  color:  ${props=> props.theme.transp};
`;

const Title = styled.div`
  width: 100%;
  height: auto;
  text-align: center;
  > h1 {
    font-size: 3.438rem;
  }
`;

const Content = styled.div`
  ${props => props.theme.flexColumn};
  width: 28.063rem;
  height: 23.875rem;
  gap: 1.7rem;
`;

const InputBox = styled.div`
  width: 100%;
  height: 15.813rem;
  /* height: 9.375rem; */
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
    font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
    font-size: 20px;
      ::placeholder{
        color: ${props=> props.theme.transp};
      }
  }
`;

const Error = styled.div`
  ${props => props.theme.flexRow};
  font-size: ${props => props.theme.fontS};
  align-items: flex-end;
  height: 1.2rem;
  color: ${props=> props.theme.point};
`;
const Button = styled.div`
  ${props => props.theme.flexRow};
  height: 3.75rem;
  /* border: 1px solid ${props=> props.theme.transp};   */
  border-radius: 5px;
  font-size: ${props => props.theme.fontL};
  font-weight: 600;
  cursor: pointer;
  color: ${props=> props.theme.reverse};
  transition: all 0.3s ease-in-out;
  background: ${props=> props.theme.dream};  
  /* border: transparent;  */
  margin-top: 1.5rem;
  :hover{
    background: transparent; 
    border: 1px solid ${props=> props.theme.transp};  
    color: ${props=> props.theme.text};
    transition: all 0.3s ease-in-out;
  }
`;

const SocialBox = styled.div`
  height: 3.75rem;
  width: 100%;
  ${props => props.theme.flexRow};
  gap: 1.5rem;
`;
const GoogleBtn = styled.button`
  height: 3.75rem;
  width: 100%;
  border: none;
  border-radius: 5px;
  background-color: white;
  color: black;
`;
const NaverBtn = styled(GoogleBtn)`
  background-color: #71A82B;
  color:  white;
  object-fit: cover;
`;

const HaveAccount = styled.div`
  ${props => props.theme.flexRow};
  height: 1rem;
  font-size: ${props => props.theme.fontS};
  gap: 1rem;
`;

const LinkedP = styled(Link)`
  color: ${props=> props.theme.point};
  cursor: pointer;
  :hover{
    color: ${props=> props.theme.transp};
  }
`;