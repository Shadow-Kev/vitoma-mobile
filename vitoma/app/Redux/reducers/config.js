import { UPDATE_LANGUAGE } from '@redux/types'
import { Languages } from '@common';

const initialState = {
  lang: null
}

export default (state = initialState, action) => {
  const { extra, type, payload } = action
  switch (type) {
    case UPDATE_LANGUAGE:
      // set the default language
      Languages.setLanguage(payload.lang)

      return {
        ...state,
        lang: payload.lang
      }
    default:
      return state
  }
}
