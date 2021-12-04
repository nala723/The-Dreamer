module.exports = {
    emailIsValid: (email) => {
      const regExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      if (!regExp.test(email)) return "올바른 이메일 형식을 입력해주세요.";
      return true;
    },
    pwIsValid: (pw) => {
        let num = pw.search(/[0-9]/g);
        let eng = pw.search(/[a-z]/gi);
        let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    
        if (pw) {
          if (pw.length < 8 || pw.length > 20) {
            return "8자리 ~ 20자리 이내로 입력해주세요.";
          } else if (pw.search(/\s/) != -1) {
            return "비밀번호는 공백 없이 입력해주세요.";
          } else if (num < 0 || eng < 0 || spe < 0) {
            return "영문, 숫자, 특수문자를 혼합하여 입력해주세요.";
          } else {
            return true;
          }
        }

    //   // ? # 8-16자 영문, 숫자 반드시 1개 포함 (특수문자 불가능)
    //   const regExp1 = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    //   // ? # 8-16자 영문, 숫자 반드시 1개 포함 (특수문자 가능)
    //   const regExp2 = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
    //   // ? # 8-16자 영문, 숫자, 특수문자 반드시 1개 포함
    //   const regExp3 =
    //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
  
    //   if (regExp2.test(pw)) return true;
    //   return false;
    },
  };

  // (/) 슬래시로 감싸서 문자열 찾기 시작  
  // i : 대소문자 구분 안함
  // g : 검색된 모든 결과 리턴(없으면 첫번째로 나오는 겨로가만)
  // ^	줄(Line)의 시작에서 일치 /^abc/
  // ^는 문자열의 처음을 의미하며, 문자열에서 ^뒤에 붙은 단어로 시작하는 부분을 찾습니다. 
  // 일치하는 부분이 있더라도, 그 부분이 문자열의 시작부분이 아니면 null 
  // https://urclass.codestates.com/2fed1952-302e-40ba-9348-e8746ab1d8af?playlist=1017