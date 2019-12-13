/** @format */

import {
  ADD_TO_BOOKMARK,
  DELETE_FROM_BOOKMARK,
  GET_BOOKMARKS
} from '@redux/types'


import { Config, Languages } from "@common"
import { get, post } from './fetch'

export const addToBookmark = (postToBookmark, trackedUserId, userId, callback) => {
  const postId = postToBookmark.id
  const url = `${Config.URL.entryPoint}/ads/${postId}/like`
  const options = {
    method: 'POST',
    headers: getRequestHeaders(trackedUserId, userId)
  };

  return (dispatch) => {
    return post(url, options, {
      dispatch,
      type: ADD_TO_BOOKMARK,
      post: postToBookmark
    }, callback)
  }
}

export const deleteFromBookmark = (postId, trackedUserId, userId, callback) => {
  const url = `${Config.URL.entryPoint}/ads/${postId}/unlike`
  const options = {
    method: 'POST',
    headers: getRequestHeaders(trackedUserId, userId)
  };

  return (dispatch) => {
    return post(url, options, {
      dispatch,
      type: DELETE_FROM_BOOKMARK,
      postId
    }, callback)
  }
}

export const getBookmarks = (
  trackedUserId,
  userId,
  country = 'ALL_COUNTRIES',
  currency = 'XOF') => {

  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/ads/likes`

  const options = {
    method: 'GET',
    headers: getRequestHeaders(trackedUserId, userId, langId, country, currency)
  };

  return (dispatch) => {
    return get(url, dispatch, GET_BOOKMARKS, {}, null, options)
  }
}

getRequestHeaders = (
  trackedUserId,
  userId,
  langId = 'fr_FR',
  country = 'ALL_COUNTRIES',
  currency = 'XOF') => {
  var reqHeaders = new Headers();
  reqHeaders.append("Content-Type", "application/json");

  if(trackedUserId)
    reqHeaders.append("trackedUserId", trackedUserId);

  if(userId)
    reqHeaders.append("userId", userId);

  reqHeaders.append("langId", langId);
  reqHeaders.append("country", country);
  reqHeaders.append("currency", currency);

  return reqHeaders;
}
