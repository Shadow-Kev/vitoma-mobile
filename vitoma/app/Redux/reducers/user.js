import {
  GET_USER_ADS,
  GET_USER_ADS_MORE,
  DELETE_USER_AD,
  ON_USER_STATE_CHANGED,
  SET_USER_FULL_PROFILE,
  SET_USER_PUSH_NOTIFICATIONS_TOKEN,
  ADD_USER_LAST_VIEWS,
  CHANGE_DEFAULT_PHONE_COUNTRY_CODE,
  CHANGE_DEFAULT_COUNTRY,
  CHANGE_DEFAULT_CURRENCY
} from '@redux/types'
import { Config } from '@common';
import _ from 'lodash'
import uuidv1 from 'uuid/v1';

const initialState = {
  phoneCountryCode: 'us',
  phoneAuthFirstNameCache: '',
  phoneAuthLastNameCache: '',
  country: null,
  currency: 'XOF',
  profile: null,
  fullProfile: null,
  creationTime: null,
  list: [],
  lastViewsList: [],
  error: {
    deleting: false
  },
  trackedUserId: uuidv1()
}

export default (state = initialState, action) => {
  const { extra, type, payload } = action
  switch (type) {
    case ON_USER_STATE_CHANGED:
      // when the user logged out
      if(!payload.user)
        return {
          ...state,
          profile: null,
          fullProfile: null,
          creationTime: null,
          trackedUserId: uuidv1()
        }

      // The user is connected
      var completeProfile = state.fullProfile ? Object.assign(state.fullProfile, {}) : {}

      completeProfile.phone = completeProfile.phone || payload.user.phoneNumber;
      completeProfile.fullName = completeProfile.fullName || payload.user.displayName;

      // Update the user fullName based on it's profile infos
      // Do not change the fullName with state.profile because sometimes the email is not available in firebase user object
      // state.profile is a copy of firebase user object
      if(!completeProfile.fullName && state.profile && state.profile.email) {
        completeProfile.fullName = state.profile.email.substring(0, state.profile.email.indexOf("@"))
      }

      return {
        ...state,
        profile: payload.user,
        fullProfile: completeProfile,
        creationTime: (payload.user.metadata) ? payload.user.metadata.creationTime : state.creationTime
      }
    case SET_USER_FULL_PROFILE: {
      let result = (payload.data && payload.data.result) ? payload.data.result : []
      var completeProfile =  result.length ? result[0] : {}

      // Set the user fullName with the firstName/lastName or using the email
      if(completeProfile.firstName && completeProfile.lastName) {
        completeProfile.fullName = completeProfile.firstName + ' ' + completeProfile.lastName;
      } else if (state.profile && state.profile.email) {
        completeProfile.fullName = state.profile.email.substring(0, state.profile.email.indexOf("@"))
      }

      return {
        ...state,
        fullProfile: completeProfile,
        phoneAuthFirstNameCache: completeProfile.firstName || '',
        phoneAuthLastNameCache: completeProfile.lastName || ''
      }
    }
    case GET_USER_ADS:
      return {
        ...state,
        list: payload.data || [],
        error: {
          deleting: false
        }
      }
    case GET_USER_ADS_MORE:
      let ads = state.list.concat(payload.data || [])
      return {
        ...state,
        list: ads,
        error: {
          deleting: false
        }
      }
    case DELETE_USER_AD:
      const index = _.findIndex(state.list, (ad) => ad.id == extra.adId);

      if(payload.error || index == -1) {
        return {
          ...state,
          error: {
            ...state.error,
            deleting: true
          }
        }
      }

      return {
        ...state,
        list: [...state.list.slice(0, index), ...state.list.slice(index + 1)],
        error: {
          deleting: false
        }
      }
    case ADD_USER_LAST_VIEWS:
      var lastViewsList = state.lastViewsList;
      lastViewsList.unshift(payload.post)

      lastViewsList = _.uniqBy(lastViewsList, 'id');

      // Remove the last item
      if(lastViewsList.length > Config.MaxLastViews)
        lastViewsList.pop()

      return {
        ...state,
        lastViewsList
      }
    case CHANGE_DEFAULT_PHONE_COUNTRY_CODE:
      return {
        ...state,
        phoneCountryCode: payload.phoneCountryCode
      }
    case CHANGE_DEFAULT_COUNTRY:
      return {
        ...state,
        country: payload.country
      }
    case CHANGE_DEFAULT_CURRENCY:
      return {
        ...state,
        currency: payload.currency
      }
    default:
      return state
  }
}
