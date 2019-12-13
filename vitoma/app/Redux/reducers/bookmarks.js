import {
  ADD_TO_BOOKMARK,
  DELETE_FROM_BOOKMARK,
  GET_BOOKMARKS
} from '@redux/types'

import _ from 'lodash'

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  const { type, payload, extra } = action
  switch (type) {
    case GET_BOOKMARKS:
      return {
        ...state,
        list: payload.data || []
      }
    case ADD_TO_BOOKMARK:
      var bookmarks = state.list
      bookmarks.push(extra.post)

      return {
        ...state,
        list: bookmarks
      }
    case DELETE_FROM_BOOKMARK:
      var bookmarks = state.list.filter(bookmark => bookmark.id !== extra.postId)

      return {
        ...state,
        list: bookmarks
      }
    default:
      return state
  }
}
