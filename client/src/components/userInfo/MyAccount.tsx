import React, { useState, useCallback, useRef, useEffect }  from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { GetTokenAct, EditUserAct, WithDrawlAct, SignInAct } from '../../actions';
import { RootState } from '../../reducers';
import { Buffer } from 'buffer';
import Modal from '../reusable/Modal';
import { pwIsValid } from '../../components/reusable/Validator';
import axios from 'axios';



function MyAccount() {
  const { accessToken, email, username, profile } = useSelector((state: RootState)=> state.usersReducer.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [ isOpen, setIsOpen] = useState(false);
  const [ wdOpen, setWdOpen ] = useState(false);
  const [ valid, setValid] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  // const refPassword = useRef(null);
  // const refPasswordCheck = useRef(null);
  const [currentInput, setCurrentInput] = useState<{
    [index: string]: any
    imgFile: string | File | null,
    // previewUrl: string | ArrayBuffer | null,
    Password: string,
    PasswordCheck: string
  }>({
    imgFile:'',
    previewUrl: '',
    Password:'',
    PasswordCheck:''
})
  const [errorMessage, setErrorMessage] = useState({
    Password: '',
    PasswordCheck: '',
  })
  const userlist = [
    { name: 'Username', val: username },
    { name: 'Email', val: email},
    { name: 'Password', type: 'password', key: 'Password'},
    { name: 'Password', type: 'password', key: 'PasswordCheck'},
  ]
  const profileImg = 
    typeof(profile) === 'string' ?
     profile : "data:image/png;base64, " + Buffer.from(profile, 'binary').toString('base64');


    // 최초 렌더링시 유저정보 받아오기
  useEffect(()=>{
    // let token
      // if(googleToken){
      //   token = googleToken
      //    getUserInfo(token)
      // }else {
        // token = accessToken
      getUserInfo();
      // }
  },[])

   // 유저 정보 요청 함수 - 통과
  const getUserInfo = () => {
    // setLoading(true)
    axios
      .get(`${process.env.REACT_APP_URL}` + `/mypage/user-info`,{
        headers: {
          "Content-Type": "multipart/form-data",
            authorization: `Bearer ` + accessToken
            }
    })
    .then((res)=> {
        if(res.headers.accessToken){
            // if(googleToken){
            //         dispatch(getgoogleToken({accessToken: res.headers.accessToken}));
            //     }
            // else {
                dispatch(GetTokenAct(res.headers.accessToken));
            // }
          }
         if(res.status === 200){
            //  if(googleToken){
            //     dispatch(userInfo({vegType :res.data.vegType}))
            //  }
            // else{
              console.log('get 성공?')
            typeof(res.data.profile) === 'string' ?
            res.data.profile : "data:image/png;base64, " + Buffer.from(profile, 'binary').toString('base64');   
            dispatch(EditUserAct({username: res.data.username, profile: res.data.profile, email: res.data.email}))
            // }
         }
         else{
              history.push('/notfound');
         }
        //  setLoading(false) 
     })
     .catch(err => {
            console.log(err)
    })
}    
    // 이미지 업로드
  const imageFileHandler = (key: string) => (e : React.ChangeEvent<HTMLInputElement> ) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = (e.target.files as FileList)[0];  
        reader.onloadend = () => {
            setCurrentInput({
                ...currentInput,
                imgFile : file,
                previewUrl : reader.result
            })
        }
        reader.readAsDataURL(file);
  }
  // 카메라아이콘 커스텀
  const handlePhotoClick = (e: React.MouseEvent) => {
      e.preventDefault();
      photoInput.current && photoInput.current.click();
  }
  // 인풋창
  const handleInputValue = useCallback((key) => (e : React.ChangeEvent<HTMLInputElement> ) => {
      setCurrentInput({ ...currentInput, [key]:e.target.value})
  },[currentInput])

   // 이메일, 비번 유효성 검사
   const validationCheck = (key: string) => (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let message
    if(!currentInput[key]){
      setErrorMessage({...errorMessage, [key] : ''}) 
      return;
    }
    if(key === 'Password'){ // 비번 검사
      message = pwIsValid(value)
      if(typeof(message) === 'string'){ 
        setErrorMessage({...errorMessage, [key] : message})
        return false;
      }
    }
    if(key === 'PasswordCheck'){
      if(value !== currentInput.Password){ // 비번 일치하지 않을때
        setErrorMessage({...errorMessage, [key] : '비밀번호가 일치하지 않습니다.'}) 
        return false;
      }
    }
    setErrorMessage({...errorMessage, [key] : ''}) 
    setValid(true);
  }

  //회원정보 수정

  const onSubmitHandler = async(e : React.MouseEvent) => { 
    e.preventDefault();
    // if(googleToken){
    //     handleBack(e)
    //     return;
    // }
  
    if(!valid){
        return
    }
     
    //  if((!currentInput.inputPassword || !currentInput.imgFile || !currentInput.inputVegtype || inValidEditMSG)){
    //     setInvalidEditMSG('입력을 모두 완료해주세요') 
    //     return
    //  } 
    // setLoading(true)
    const MAX_WIDTH = 320;
    const MAX_HEIGHT = 180;
    const MIME_TYPE = "image/*";
    const QUALITY = 0.7;

    let imgforaxios;
    
    const file = currentInput.imgFile; 
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
        URL.revokeObjectURL(this.src);
    };
    img.onload = await function () {
        URL.revokeObjectURL((this as HTMLImageElement).src);
        const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
        const canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        ctx && ctx.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob(
        (blob) => {
            imgforaxios=blob;
            const formData = new FormData();
            imgforaxios && formData.append("profile",imgforaxios);
            formData.append("password",currentInput.Password);
            // 잘 가는지 확인
            for(const pair of formData.entries()) {
              console.log(pair[0]+ ', '+ pair[1]);
           }
                axios
                .patch(`${process.env.REACT_APP_URL}` + `/mypage/user-info`,formData,{
                       headers: {
                            "Content-Type": "multipart/form-data",
                            authorization: `Bearer ` + accessToken
                            },
                       withCredentials: true
                   })  
                   .then((res)=> {
                        if(res.headers.accessToken){
                            dispatch(GetTokenAct(res.headers.accessToken));
                            }
                        if(res.status === 200){
                            // dispatch(EditUserAct(profile: currentInput.imgFile)) // 그냥 get 받아서 변경해봐?
                             setIsChanged(true);
                            console.log('잘받아졌나')
                             handleClick();
                         }
                         else{
                             history.push('/notfound');
                         }
                     
                        //  setLoading(false) 
                    })
                    .catch(error=>
                        console.log(error)
                    )
            
        },
        MIME_TYPE,
        QUALITY
        );
    }; 
    // 이미지 사이즈 계산
    function calculateSize(img : HTMLImageElement, maxWidth: number, maxHeight: number) {
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
            }
        }
        return [width, height];
        }

};
//  // 인풋창 포커스 핸들
//   const handleMoveTopPW = (e)=>{
//       if(e.key === 'Enter') {
//           refPassword.current?.focus();
//       }
//     }
//   const handleMoveTopPWCheck = (e)=>{
//       if(e.key === 'Enter') {
//           refPasswordCheck.current?.focus();
//       }
//   };
      

  const handleClick = ()=> {
    setIsOpen(!isOpen);
    if(isChanged){
      setCurrentInput({
        imgFile:'',
        previewUrl: '',
        Password:'',
        PasswordCheck:''
      })
      setValid(false);
      setIsChanged(false);
      getUserInfo();
      
    }
    
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
           <Camera src='/images/camera.svg' onClick={handlePhotoClick}/>
             <Photo>
                <input type='file' accept='image/*' name="profile" ref={photoInput} onChange={imageFileHandler("profile")} />
                <PhotoCircle src={currentInput.imgFile?currentInput.previewUrl : profileImg} alt='img'/>
              </Photo>
            </UserPhotoBox>
          </PhotoBox>
          <InfoBox>
            <InfoUl>
            {userlist.map((user,idx)=>{
              return(
                <InfoList key={idx}>
                  <div>{user.name}</div>
                  { user.key 
                  ?  
                  <input type={user.type} onChange={handleInputValue(user.key)} 
                  value={currentInput[user.key]} onBlur={validationCheck(user.key)}/> 
                  : 
                  <div>{user.val}</div> }
                </InfoList>
              )
            })}
            </InfoUl>
            <SubmitBtn onClick={onSubmitHandler}>수정</SubmitBtn>
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
  >input{
    display: none;
  }
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
