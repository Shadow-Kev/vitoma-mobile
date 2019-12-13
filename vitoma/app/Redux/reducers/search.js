import { SEARCH_ADS, SEARCH_ADS_MORE } from '@redux/types'

const initialState = {
  searchResults: []
}

export default (state = initialState, action) => {
  const { extra, type, payload } = action
  switch (type) {
    case SEARCH_ADS:
      return {
        ...state,
        searchResults: payload.data || []
      }
    case SEARCH_ADS_MORE:
      let results = state.searchResults.concat(payload.data || [])
      return {
        ...state,
        searchResults: results
      }
    default:
      return state
  }
}
