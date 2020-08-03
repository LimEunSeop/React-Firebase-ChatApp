/* -------------------------------------------------------------------------- */
/* 액션 크리에이터(Action Creators)                                               */
/* -------------------------------------------------------------------------- */
import * as actionTypes from './types'

/* -------------------------------------------------------------------------- */
// 사용자 인증 액션 크리에이터

export const saveUser = (user) => ({
  type: actionTypes.SAVE_USER,
  payload: { authUser: user },
})

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER,
})

/* -------------------------------------------------------------------------- */
// 채널 액션 크리에이터

export const setCurrentChannel = (channel) => ({
  type: actionTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  },
})
