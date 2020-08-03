/**
 * 시간 지연 유틸리티
 * @function
 * @param {Number} ms 밀리초
 */
export const delay = (ms = 1000) => {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(), ms)
  })
}

/**
 * CSS 입력 유틸리티
 * @function
 * @param {Array} cssSet css`` 실행 과정에서 전달된 CSS 규칙 문자 값 (배열의 첫번째 아이템으로 설정 됨)
 */
export const css = (cssSet) =>
  cssSet[0]
    .split(';')
    .filter((rule) => rule.trim())
    .map((rule) => rule.trim())
    .reduce((acc, rule) => {
      const [ key, value ] = rule.split(':')
      // 속성 이름 'background-color' → 'backgroundColor' 변경
      acc[key.replace(/-\w/g, ($1) => $1.slice(1).toUpperCase())] = value
      return acc
    }, {})

/**
 * Firebase 오류 메시지 번역
 * @function
 * @param {String} message Firebase 오류 메시지(영문)
 */
export function translateErrorMessage(message) {
  switch (message) {
    case 'Password should be at least 6 characters':
      return '비밀번호는 6자 이상 이어야 합니다.'
    case 'The email address is already in use by another account.':
      return '이미 가입된 이메일 주소입니다.'
    case 'The password is invalid or the user does not have a password.':
      return '입력한 패스워드가 잘못 되었습니다.'
    case 'There is no user record corresponding to this identifier. The user may have been deleted.':
      return '가입된 사용자가 아니거나, 탈퇴한 사용자입니다.'
    case 'Missing or insufficient permissions.':
      return '사용 권한이 없습니다.'
    default:
      return '알 수 없는 오류가 발생했습니다.'
  }
}

/**
 * 랜덤 아바타 생성
 * @reference https://ui-avatars.com/random-avatar-generator/
 * @param {String} email 이메일 주소
 */
export function generateRandomAvatar(email) {
  const name = email.split('@')[0]
  return 'https://ui-avatars.com/api/?name=' + name + '&background=fff&color=1976d2'
}
