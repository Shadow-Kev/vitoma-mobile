import { ADD_TOAST, REMOVE_TOAST } from '@redux/types'

export const addToast = (msg, key, token) => {
  return { type: ADD_TOAST, payload: { msg, key, token } }
}
export const removeToast = key => {
  return { type: REMOVE_TOAST, payload: { key } }
}
