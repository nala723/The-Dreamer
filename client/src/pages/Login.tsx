import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Login(){
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
                  <input  type='email'/>
                </SingleInput>
                <SingleInput>
                  <div>Password</div>
                  <input  type='password'/>
                </SingleInput>
                <Button>
                Log In
               </Button>
            </InputBox>   
            <div>or</div>
            <SocialBox>
              <GoogleBtn>Google</GoogleBtn>
              <NaverBtn>Naver</NaverBtn>
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
  gap: 4rem;
  > div{
    width: 4.875rem;
  }
  > input{
    width: 21.813rem;
    color: ${props=> props.theme.transp}; 
    background-color: transparent; 
    font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
    font-size: 20px;
      ::placeholder{
        color: ${props=> props.theme.transp};
      }
  }
`;

const Button = styled.div`
  ${props => props.theme.flexRow};
  height: 3.75rem;
  /* border: 1px solid ${props=> props.theme.transp};   */
  border-radius: 5px;
  font-size: ${props => props.theme.fontL};
  font-weight: 600;
  cursor: pointer;
  transition: all 1.5s ease-in-out;
  background: ${props=> props.theme.dream};  
  /* border: transparent;  */
  margin-top: 2.688rem;
  :hover{
    background: transparent; 
    border: 1px solid ${props=> props.theme.transp};  
    transition: all 1.5s ease-in-out;
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
`;