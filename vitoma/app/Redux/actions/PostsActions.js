/** @format */

import {
  FETCH_POSTS,
  FETCH_POSTS_BY_CATEGORY,
  FETCH_POST_DETAIL,
  FETCH_FEATURES_AND_RECENTS,
  SORT_POSTS_OF_CATEGORY,
  FETCH_RECENTS,
  FETCH_FEATURED,
  FETCH_COUNTRIES
} from '@redux/types'

import { Config, Languages } from "@common"
import { get } from './fetch'

export const fetchPosts = (
  page = 1,
  limit = Config.PagingLimit,
  country = 'ALL_COUNTRIES',
  currency = 'XOF') => {

  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/categories?page=${page}&limit=${limit}&langId=${langId}&country=${country}&currency=${currency}`

  return (dispatch) => {
    return get(url, dispatch, FETCH_POSTS)
  }
}

export const fetchPostsByCategory = (
  page = 1,
  categoryId,
  country = 'ALL_COUNTRIES',
  currency = 'XOF',
  callback) => {

  let limit = Config.PagingLimit
  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/categories/${categoryId}/?page=${page}&limit=${limit}&langId=${langId}&country=${country}&currency=${currency}`

  return (dispatch) => {
    return get(url, dispatch, FETCH_POSTS_BY_CATEGORY, { page, categoryId }, callback)
  }
}

export const fetchPopularCountries = () => {
  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/ads/countries?langId=${langId}`

  return (dispatch) => {
    return get(url, dispatch, FETCH_COUNTRIES, {})
  }
}

export const fetchPostDetail = (
  postId,
  currency = 'XOF',
  callback = null) => {

  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/ads/${postId}/details?langId=${langId}&currency=${currency}`

  return (dispatch) => {
    return get(url, dispatch, FETCH_POST_DETAIL, { postId }, callback)
  }
}

export const fetchFeaturedAds = (
  country = 'ALL_COUNTRIES',
  currency = 'XOF',
  page = 1,
  limit = 10,
  type = FETCH_FEATURED) => {

  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/ads/featured?page=${page}&limit=${limit}&langId=${langId}&country=${country}&currency=${currency}`

  return (dispatch) => {
    return get(url, dispatch, type, {})
  }
}

export const fetchRecentsAds = (
  country = 'ALL_COUNTRIES',
  currency = 'XOF',
  page = 1,
  limit = 10,
  type = FETCH_RECENTS) => {

  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  let url = `${Config.URL.entryPoint}/ads/recents?page=${page}&limit=${limit}&langId=${langId}&country=${country}&currency=${currency}`

  return (dispatch) => {
    return get(url, dispatch, type, {})
  }
}

export const sortPostsOfCategory = (config) => {
  return (dispatch) => {
    dispatch({ type: SORT_POSTS_OF_CATEGORY, payload: config })
  }
}
