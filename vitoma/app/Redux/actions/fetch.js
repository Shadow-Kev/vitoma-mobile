import { Logger } from '@common'

const get = async (url, dispatch, type, extra = {}, callback = null, options = {}) => {
  return fetch(url, options)
    .then(
      response => response.json(),
      error => {
        Logger.log({ ...error, url, type, extra, options })
      }
    )
    .then(data => {
      dispatch({ type, payload: { data }, extra })

      if(callback)
        callback(data)
    })
}

const post = async (url, options, extra = {}, callback) => {
  return (
    fetch(url, options)
    .then((response) => response.json())
    .then(data => {
      var dispatch = extra.dispatch;
      var type = extra.type;

      if(dispatch && type)
        dispatch({ type, payload: { data }, extra })

      if(callback)
        callback(data, null)
    })
    .catch(error => {
      if (callback)
        callback(null, error);

      Logger.log({ ...error, url, extra, options })
    })
  )
}

const remove = async (url, dispatch, type, extra = {}) => {
  return fetch(url, { method: 'DELETE' })
    .then(
      response => {
        dispatch({ type, payload: { error: !response.ok }, extra })
      },
      error => Logger.log({ ...error, url, extra, type })
    )
}

export { get, post, remove }
