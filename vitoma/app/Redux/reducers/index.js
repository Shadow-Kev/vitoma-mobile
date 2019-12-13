/** @format */

import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const root = {
  key: 'root',
  storage,
  blacklist: [],
}

import posts from './posts'
import bookmarks from './bookmarks'
import config from './config'
import search from './search'
import toast from './toast'
import user from './user'
import member from './member'

export default persistCombineReducers(root, {
  posts,
  bookmarks,
  config,
  search,
  toast,
  user,
  member
})
