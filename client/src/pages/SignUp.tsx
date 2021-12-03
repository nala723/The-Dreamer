import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function SignUp(){
  const userlist = [
    { name: 'Username', type: 'text'},
    { name: 'Email', type: 'email'},
    { name: 'Password', type: 'password'},
    { name: 'Password', type: 'password'},
  ]
  return (
     <Container>
       <SignupBox>
         <Title>
           <h1>Sign Up</h1>
          </Title>
          <Content>
            <InputBox>
              {userlist.map((el,idx)=>{
                return(
                  <SingleInput key={idx}>
                    <div>{el.name}</div>
                    <input type={el.type} />
                  </SingleInput>
                )
              })}
            </InputBox>
            <Button>
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
  /* position: relative; */
  overflow: hidden;
  display: flex;
  ${props => props.theme.flexRow};
  height: calc(100vh - 4.375rem);
`;

const SignupBox = styled.div`
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
  height: 24.5rem;
  gap: 2.688rem;
`;

const InputBox = styled.div`
  width: 100%;
  height: 17.938rem;
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
  :hover{
    background: transparent; 
    border: 1px solid ${props=> props.theme.transp};  
    transition: all 1.5s ease-in-out;
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
`;

const LinkedP = styled(Link)`
  color: ${props=> props.theme.point};
  cursor: pointer;
`;