import React, { useState }  from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { SignInAct } from '../../actions';
import { RootState } from '../../reducers';
import { Buffer } from 'buffer';
import Modal from '../reusable/Modal';

function MyAccount() {
  const { accessToken, email, username, profile } = useSelector((state: RootState)=> state.usersReducer.user);
  const dispatch = useDispatch();
  const [ isOpen, setIsOpen] = useState(false);
  const [ wdOpen, setWdOpen ] = useState(false);
  const userlist = [
    { name: 'Username', val: username },
    { name: 'Email', val: email},
    { name: 'Password', type: 'password', key: 'Password'},
    { name: 'Password', type: 'password', key: 'PasswordCheck'},
  ]
  const profileImg = 
    typeof(profile) === 'string' ?
     profile : "data:image/png;base64, " + Buffer.from(profile, 'binary').toString('base64');

  const handleClick = ()=> {
    setIsOpen(false);
  }   
  const handleWdOpen = () => {
    setWdOpen(!wdOpen);
  }
  return (
     <Container>
      {isOpen && <Modal handleClick={handleClick}>회원 정보 수정이 완료되었습니다.</Modal>}
      {wdOpen 
      && 
        <Modal handleClick={handleWdOpen} handleSignOut={handleWdOpen} header='회원님의 개인 정보 및 모든 이용 기록은 삭제되며, 복구가 불가능합니다.'>
          정말 탈퇴하시겠어요?
        </Modal>
      }
       <Title><h1>나의 계정 보기</h1></Title>
       <Content>
         <PhotoBox>
           <UserPhotoBox>
           <Camera src='/images/camera.svg'/>
             <Photo>
               <PhotoCircle src={profileImg} alt='img'/>
               </Photo>
            </UserPhotoBox>
          </PhotoBox>
          <InfoBox>
            <InfoUl>
            {userlist.map((user,idx)=>{
              return(
                <InfoList key={idx}>
                  <div>{user.name}</div>
                  { user.key ?  <input type={user.type} /> : <div>{user.val}</div> }
                </InfoList>
              )
            })}
            </InfoUl>
            <SubmitBtn>수정</SubmitBtn>
          </InfoBox>
          <WithDrawl onClick={handleWdOpen}>회원 탈퇴</WithDrawl>
       </Content>  
     </Container>
  );
}

export default MyAccount;

const Container = styled.div`            
  width: 100%;
  ${props=> props.theme.flexColumn};
  justify-content: flex-start;
`;

const Title = styled.div`
  width: 100%;
  height: 6.438rem;
  padding-top: 2.313rem;
  padding-left: 7.313rem;
  h1{
    font-size: ${props=>props.theme.fontL};
  }
`;

const Content = styled.div`
  width: 29rem;
  height: 37.563rem;
  display: flex;
  flex-direction: column;
  gap: 2.125rem;
`;

const PhotoBox = styled.div`
  width: 100%;
  height: 7.467rem;
  display: flex;
  justify-content: center;
`;
const UserPhotoBox = styled.div`
  height: 100%;
  width: 8.313rem;
  position: relative; 
`; 
const Photo = styled.div`
  height: 7.467rem;
  width: 7.467rem;
  border-radius: 100%;
  display: flex;
  overflow: hidden;
  z-index:-1px;
`;
const PhotoCircle = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #CEB1B1;
`;

const Camera = styled.img`
  width: 48px;
  height: 48px;
  position: absolute; 
  z-index:5px;
  bottom: 5px;
  left: 80px;
  cursor: pointer;
`;

const InfoBox = styled.div`
  width: 100%;
  height: 22.813rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const InfoUl = styled.ul`
  width: 100%;
  height: 18.063rem;
  display: flex;
  flex-direction: column;
`;

const InfoList = styled.li`
  height: 100%;
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${props=> props.theme.transp};
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 0.5rem;
  text-indent: 0.5rem;
  > div{
    width: 4.875rem;
    color:  ${props=> props.theme.transp};
  }
  > div:nth-child(2){
    width: 21.813rem;
    text-indent: 5rem;
    color: ${props=> props.theme.text}; 
    font-size: 18px;
  }
  > input{
    width: 21.813rem;
    text-indent: 5rem;
    color: ${props=> props.theme.text}; 
    background-color: transparent; 
    font-size: 20px;
      ::placeholder{
        color: ${props=> props.theme.transp};
      }
  }
`;


const SubmitBtn = styled.button`
  width: 9.063rem;
  height: 2.5rem;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-family: "EB Garamond","Gowun Batang",'Noto Serif KR', Georgia, serif;
  transition: all 0.3s ease-in-out;
  background: ${props=> props.theme.dream};  
  border: transparent; 
  color: ${props=> props.theme.reverse};
  :hover{
    background: transparent; 
    border: 1px solid ${props=> props.theme.transp};  
    transition: all 0.3s ease-in-out;
    color: ${props=> props.theme.text};
  }
`;
const WithDrawl = styled.div`
  height: 2.875rem;
  border-bottom: 1px solid ${props=> props.theme.transp};
  color: ${props=> props.theme.point};
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  font-size: 14px;
  padding-bottom: 0.5rem;
  text-indent: -5rem;
  cursor: pointer;
  :hover{
    font-weight: bold;
    color: ${props=> props.theme.transp};
  }
`;
