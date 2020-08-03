/* -------------------------------------------------------------------------- */
/* 스토어(Store)                                                                */
/* -------------------------------------------------------------------------- */

import React from 'react'

// Redux, React Redux
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

// 개발툴, 미들웨어 모듈
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

/* -------------------------------------------------------------------------- */

// 리듀서 추출
import { userReducer, channelReducer } from 'store/reducers'

// 리듀서 병합
const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer,
})

/* -------------------------------------------------------------------------- */

// 미들웨어 리스트
const middlewares = [ thunk ]

// 개발 모드일 경우에만 Redux Logger 미들웨어 추가
if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}

// 스토어 생성
const store = createStore(
  rootReducer,
  // Redux 개발 도구 및 미들웨어 연결
  composeWithDevTools(applyMiddleware(...middlewares))
)

/* -------------------------------------------------------------------------- */

// 스토어 공급자 래퍼 컴포넌트
export default function StoreProvider(props) {
  return <Provider store={store}>{props.children}</Provider>
}
