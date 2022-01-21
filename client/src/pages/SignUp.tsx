import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Modal from '../components/reusable/Modal';
import {useHistory} from 'react-router-dom';
import { emailIsValid, pwIsValid } from '../components/reusable/Validator';
import { darkTheme } from '../styles/theme';

type ErrorMsgType = {
  [index: string]: string
  Email: string,
  Username: string,
  Password: string,
  PasswordCheck: string
}

function SignUp(){
  const history = useHistory();
  const [signupInfo, setSignupInfo] = useState<ErrorMsgType>({
    Email:'',
    Username:'',
    Password:'',
    PasswordCheck:''
  })
  const [errorMessage, setErrorMessage] = useState<ErrorMsgType>({
    Email: '',
    Username: '',
    Password: '',
    PasswordCheck: '',
  })
  const [valid, setValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const userlist = [
    { name: 'Username', type: 'text', key: 'Username'},
    { name: 'Email', type: 'email', key: 'Email'},
    { name: 'Password', type: 'password', key: 'Password'},
    { name: 'Password', type: 'password', key: 'PasswordCheck'},
  ]

  const handleInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupInfo({ ...signupInfo, [key]: e.target.value})
  }

  // 이메일, 비번 유효성 검사
  const validationCheck = (key: string) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let message
    if(!signupInfo[key]){
      setErrorMessage({...errorMessage, [key] : ''}) 
      return;
    }
    if(key === 'Email'){
      message = emailIsValid(value)
      if(typeof(message) === 'string'){ // email 타입 검사
        setErrorMessage({...errorMessage, [key] : message}) // 올바른 형식 아닐때
        return false;
      }
    }
    if(key === 'Password'){ // 비번 검사
      message = pwIsValid(value)
      if(typeof(message) === 'string'){ 
        setErrorMessage({...errorMessage, [key] : message})
        return false;
      }
    }
    if(key === 'PasswordCheck'){
      if(value !== signupInfo.Password){ // 비번 일치하지 않을때
        setErrorMessage({...errorMessage, [key] : '비밀번호가 일치하지 않습니다.'}) 
        return false;
      }
    }
    setErrorMessage({...errorMessage, [key] : ''}) 
    setValid(true);
  }

  // 회원가입 버튼 클릭
  const handleSubmit = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if(!signupInfo.Username){
      setErrorMessage({...errorMessage, Username : '이름을 입력해 주세요.'}) 
      return;
    }
    if(!valid){
      return;
    }
    axios
      .post(process.env.REACT_APP_URL + `/sign/signup`,{
        username: signupInfo.Username,
        email: signupInfo.Email,
        password: signupInfo.Password
        })
      .then((res)=>{
        if(res.status === 200){
          setSignupInfo({
            Email:'',
            Username:'',
            Password:'',
            PasswordCheck:''
          })
          setIsOpen(true);
        }
      })
      .catch((err)=>{
        console.log(err)
      })  
  }

  const handleClick = () => {
    setIsOpen(false)
    history.push('./login')
  }

  return (
     <Container>
       {isOpen && <Modal handleClick={handleClick}>회원 가입이 완료되었습니다.</Modal>}
       <SignupBox>
         <Title>
           <h1>Sign Up</h1>
          </Title>
          <Content>
            <InputBox>
              {userlist.map((el,idx)=>{
                return(
                  <InputWrapper key={idx}>
                    <SingleInput>
                      <div>{el.name}</div>
                      <input type={el.type} placeholder={el.name} onChange={handleInput(el.key)} onBlur={validationCheck(el.key)}/>
                    </SingleInput>
                    {<Error err={errorMessage[el.key]? 'err' : ''}>{errorMessage[el.key]}</Error>}
                  </InputWrapper>
                )
              })}
            </InputBox>
            <Button onClick={handleSubmit}>
              Sign Up
            </Button>
          </Content>
          <HaveAccount>
            <p>이미 계정이 있으신가요?</p><LinkedP to='/login'>로그인</LinkedP>
          </HaveAccount>
       </SignupBox>
     </Container>
  );
}

export default SignUp;

const Container = styled.div`            
  overflow: hidden;
  display: flex;
  ${props => props.theme.flexRow};
  height: calc(100vh - 4.375rem);
  ${props=> props.theme.mobile}{
   min-height: calc(100vh - 3.6rem);
  }
`;

const SignupBox = styled.div`
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
  height: 24.5rem;
  gap: 2rem;
  margin-top: 0.8rem;
  @media only screen and (max-width: 550px){
    max-width: 28.063rem;
    max-height: 24.5rem;
    width: 95%;
    height: auto;
  }
  ${props=>props.theme.mobile}{
    gap: 1rem;
    width: 100%;
  }
  
`;

const InputBox = styled.div`
  width: 100%;
  height: 17.938rem;
  @media only screen and (max-width: 550px){
    max-height: 17.938rem;
    height: auto;
  }
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 4.5rem;
  @media only screen and (max-width: 550px){
    height: 4rem;
  }
 
`;

const SingleInput = styled.div`
  ${props => props.theme.flexRow};
  justify-content: space-around;
  align-items: flex-end;
  height: 3.2rem;
  border-bottom: 1px solid ${props=> props.theme.transp};
  font-size: 20px;
  padding-bottom: 0.5rem;
  text-indent: 0.5rem;
  > div{
    width: 4.875rem;
    /* font-size: 16px; */
  }
  > input{
    width: 21.813rem;
    text-indent: 5rem;
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
  
`;

const Error = styled.div<{err: string;}>`
  ${props => props.theme.flexRow};
  font-size: ${props => props.theme.fontS};
  align-items: flex-end;
  height: 1.2rem;
  color: ${props=> props.theme.point};
  @media only screen and (max-width: 550px){
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
  :hover{
    background: transparent; 
    border: 1px solid ${props=> props.theme.transp};  
    color: ${props=> props.theme.text};
    transition: all 0.3s ease-in-out;
  }
  /* @media only screen and (max-width: 550px){
    height: 3.4rem;
  } */
  ${props=>props.theme.mobile}{
    height: 3rem;
    font-weight: 500;
  }
`;

const HaveAccount = styled.div`
  ${props => props.theme.flexRow};
  height: 1rem;
  font-size: ${props => props.theme.fontS};
  margin-top: 1rem;
  gap: 1rem;
  > p:nth-child(2){
    color: ${props=> props.theme.point};
    cursor: pointer;
  }
  @media only screen and (max-width: 550px){
    margin: 0;
  }
`;

const LinkedP = styled(Link)`
  color: ${props=> props.theme.point};
  cursor: pointer;
  :hover{
    color: ${props=> props.theme.transp};
  }
`;