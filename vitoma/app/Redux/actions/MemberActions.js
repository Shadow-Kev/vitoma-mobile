/** @format */
import { Config, Languages } from '@common'
import { get } from './fetch'
import { GET_MEMBERS, GET_MEMBER_DETAILS } from '../types.js'

export const getMembers  = (type = GET_MEMBERS, page = 1, limit = 50) => {
    let url = `${Config.URL.entryPoint}/members/?page=${page}&limit=${limit}`

    return (dispatch) => {
      return get(url, dispatch, type)
    }
}

export const getMemberDetails  = (
  memberId,
  currency = 'XOF',
  page = 1,
  limit = 200) => {
    let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
    let url = `${Config.URL.entryPoint}/members/${memberId}/details?page=${page}&limit=${limit}&langId=${langId}&currency=${currency}`

    return (dispatch) => {
      return get(url, dispatch, GET_MEMBER_DETAILS)
    }
}
