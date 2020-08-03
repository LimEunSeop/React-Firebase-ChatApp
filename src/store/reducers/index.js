/* -------------------------------------------------------------------------- */
/* 리듀서(Reducers)                                                             */
/* -------------------------------------------------------------------------- */
import * as actionTypes from 'store/actions/types'

/* -------------------------------------------------------------------------- */
// 사용자 리듀서

const initialUserState = {
  authUser: null,
  isLoading: true,
}

export function userReducer(state = initialUserState, action) {
  switch (action.type) {
    // 사용자 정보 저장
    case actionTypes.SAVE_USER:
      const { authUser } = action.payload
      return {
        ...state,
        isLoading: false,
        authUser,
      }

    // 사용자 정보 초기화
    case actionTypes.CLEAR_USER:
      return {
        ...initialUserState,
        isLoading: false,
      }

    default:
      return state
  }
}

/* -------------------------------------------------------------------------- */
// 채널 리듀서

const initialChannelState = {
  currentChannel: null,
}

export function channelReducer(state = initialChannelState, action) {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      }

    default:
      return state
  }
}
