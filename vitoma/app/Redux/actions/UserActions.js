/** @format */
import { Config, Languages } from '@common'
import {
  DELETE_USER_AD,
  ON_USER_STATE_CHANGED,
  SET_USER_FULL_PROFILE,
  SET_USER_PUSH_NOTIFICATIONS_TOKEN,
  ADD_USER_LAST_VIEWS,
  CHANGE_DEFAULT_PHONE_COUNTRY_CODE,
  CHANGE_DEFAULT_COUNTRY,
  CHANGE_DEFAULT_CURRENCY
} from '@redux/types'
import { get, remove, post } from './fetch'
import { Logger } from '@common'

export const onAuthStateChanged  = (user, provider = null) => {
  return (dispatch) =>
    dispatch({ type: ON_USER_STATE_CHANGED, payload: { user, provider } })
}

export const onFacebookLogin = (user, callback) => {
  const url = `${Config.URL.entryPoint}/auth/facebook/`

  var form = new FormData();
  form.append("userInfo", JSON.stringify(user));

  var headers = new Headers();
  headers.append("Content-Type", "multipart/form-data");

  const options = {
    method: 'POST',
    headers,
    body: form
  };

  return (dispatch) => {
    return post(url, options, {}, callback)
  }
}

export const onPhoneLogin = (user, callback) => {
  const url = `${Config.URL.entryPoint}/auth/phone/`

  var form = new FormData();
  form.append("userInfo", JSON.stringify(user));

  var headers = new Headers();
  headers.append("Content-Type", "multipart/form-data");

  const options = {
    method: 'POST',
    headers,
    body: form
  };

  return (dispatch) => {
    return post(url, options, {}, callback)
  }
}

export const setUserFullProfile  = (userId, callback) => {
  let url = `${Config.URL.entryPoint}/members/${userId}/details`

  return (dispatch) => {
    return get(url, dispatch, SET_USER_FULL_PROFILE, {}, callback)
  }
}

export const getUserAds = (userId, type, page = 1, currency = 'XOF', limit = Config.PagingLimit) => {
  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/ads/user?page=${page}&limit=${limit}&userId=${userId}&langId=${langId}&currency=${currency}`

  return (dispatch) => {
    return get(url, dispatch, type)
  }
}

export const deleteUserAd = (adId, userId) => {
  let url = `${Config.URL.entryPoint}/ads/${adId}/user/${userId}/delete`

  return (dispatch) => {
    return remove(url, dispatch, DELETE_USER_AD, { adId, userId })
  }
}

export const addLastViews  = (post) => {
  return (dispatch) =>
    dispatch({ type: ADD_USER_LAST_VIEWS, payload: { post } })
}

export const changeDefaultPhoneCountryCode  = (phoneCountryCode) => {
  return (dispatch) =>
    dispatch({ type: CHANGE_DEFAULT_PHONE_COUNTRY_CODE, payload: { phoneCountryCode } })
}

export const changeDefaultCountry = (country) => {
  return (dispatch) =>
    dispatch({ type: CHANGE_DEFAULT_COUNTRY, payload: { country } })
}

export const changeDefaultCurrency  = (currency) => {
  return (dispatch) =>
    dispatch({ type: CHANGE_DEFAULT_CURRENCY, payload: { currency } })
}
