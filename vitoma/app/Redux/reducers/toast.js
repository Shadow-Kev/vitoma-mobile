import { ADD_TOAST, REMOVE_TOAST } from '@redux/types'

const initialState = {
  list: [],
}

export default (state = initialState, action) => {
  const { type, payload } = action
  const { list } = state

  switch (type) {
    case ADD_TOAST: {
      return {
        ...state,
        list: list.some(toast => toast.msg === payload.msg)
          ? list
          : [payload, ...list],
      }
    }
    case REMOVE_TOAST: {
      return {
        ...state,
        list: list.filter(msg => msg.key !== payload.key),
      }
    }
    default: {
      return state
    }
  }
}
