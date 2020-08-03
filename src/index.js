import 'react-app-polyfill/ie11'

// 스타일
import 'styles/index.scss'

import React from 'react'
import { render } from 'react-dom'

// Redux 스토어 공급자 래퍼 컴포넌트 불러오기
import StoreProvider from 'store'

// 라우터 컴포넌트 불러오기
import AppRouter from 'router'

/* -------------------------------------------------------------------------- */

render(
  <StoreProvider>
    <AppRouter />
  </StoreProvider>,
  document.getElementById('reactApp')
)

// 앱을 오프라인에서 작동시키고 보다 빠르게 로드 하고자 한다면?
// 아래 코드의 unregister()를 register()로 변경합니다.
// [⚠️주의! 이 방법은 몇 가지 문제를 발생할 수 있습니다.]
// 서비스 워커에 대해 자세히 알아보기: https://bit.ly/CRA-PWA
if (process.env.NODE_ENV === 'production') {
  import('@config/serviceWorker').then(({ register }) => register())
}
