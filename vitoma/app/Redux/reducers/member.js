import {
  GET_MEMBERS,
  GET_MEMBERS_MORE,
  GET_MEMBER_DETAILS
} from '@redux/types'

import _ from 'lodash'

const initialState = {
  members: [],
  memberDetails: null
}

export default (state = initialState, action) => {
  const { extra, type, payload } = action
  switch (type) {
    case GET_MEMBERS:
      return {
        ...state,
        members: (payload.data && payload.data.result) ? payload.data.result : []
      }
    case GET_MEMBERS_MORE:
      let membersList = state.members.concat(payload.data.result || [])
      return {
        ...state,
        members: membersList
      }
    case GET_MEMBER_DETAILS: {
      let result = (payload.data && payload.data.result) ? payload.data.result : []
      return {
        ...state,
        memberDetails: result.length ? payload.data.result[0] : null
      }
    }
    default:
      return state
  }
}
