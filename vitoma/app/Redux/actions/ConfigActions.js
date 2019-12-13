/** @format */

import { UPDATE_LANGUAGE } from '@redux/types'

export const setLanguage = (lang) => {
  return (dispatch) =>
    dispatch({ type: UPDATE_LANGUAGE, payload: { lang: lang } })
}
