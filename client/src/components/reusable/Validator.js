module.exports = {
  emailIsValid: (email) => {
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
    if (!regExp.test(email)) return '올바른 이메일 형식을 입력해주세요.'
    return true
  },
  pwIsValid: (pw) => {
    let num = pw.search(/[0-9]/g)
    let eng = pw.search(/[a-z]/gi)
    let spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)

    if (pw) {
      if (pw.length < 8 || pw.length > 20) {
        return '8자리 ~ 20자리 이내로 입력해주세요.'
      } else if (pw.search(/\s/) != -1) {
        return '비밀번호는 공백 없이 입력해주세요.'
      } else if (num < 0 || eng < 0 || spe < 0) {
        return '영문, 숫자, 특수문자를 혼합하여 입력해주세요.'
      } else {
        return true
      }
    }
  },
}
