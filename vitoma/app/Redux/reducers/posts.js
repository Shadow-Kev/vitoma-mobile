import {
  FETCH_POSTS,
  FETCH_POSTS_BY_CATEGORY,
  FETCH_POST_DETAIL,
  SORT_POSTS_OF_CATEGORY,
  FETCH_RECENTS,
  FETCH_FEATURED,
  FETCH_RECENTS_MORE,
  FETCH_FEATURED_MORE,
  FETCH_COUNTRIES
} from '@redux/types'

import _ from 'lodash'

const initialState = {
    allPosts: [],
    postDetail: {},
    featuredPosts: [],
    recentsPosts: [],
    allPostsOfCategory: {
      categoryId: null,
      posts: [],
      finish: false,
      sortPriceOrder: null
    },
    popularCountries: []
}

export default (state = initialState, action) => {
  const { type, payload, extra } = action

  switch (type) {
    case FETCH_POSTS: {
      const data = payload.data || []
      return {
        ...state,
        allPosts: data,
        finish: false
      }
    }
    case FETCH_POSTS_BY_CATEGORY: {
      const data = payload.data || []

      if(extra.page == 1) {
        // Display the category posts from the begining
        return ({
          ...state,
          allPostsOfCategory: {
            categoryId: extra.categoryId,
            posts: (data.length) ? data[0].ads : [],
            finish: !data.length || (data[0].ads == data[0].total),
            sortPriceOrder: null
          }
        })
      }

      // Combine the new and old posts. This is the pagination process
      const allPostsOfCategory = state.allPostsOfCategory
      const posts = ((data.length) ?
                   _.concat(allPostsOfCategory.posts, data[0].ads)
                    : allPostsOfCategory.posts) || [];
      return ({
        ...state,
        allPostsOfCategory: {
          categoryId: extra.categoryId,
          posts: posts,
          finish: (!data.length || posts.length == data[0].total)
        }
      })
    }
    case FETCH_POST_DETAIL: {
      return {
        ...state,
        postDetail: payload.data
      }
    }
    case FETCH_FEATURED: {
      return {
        ...state,
        featuredPosts: payload.data
      }
    }
    case FETCH_FEATURED_MORE: {
      let results = state.featuredPosts.concat(payload.data || [])
      return {
        ...state,
        featuredPosts: results
      }
    }
    case FETCH_RECENTS: {
      return {
        ...state,
        recentsPosts: payload.data
      }
    }
    case FETCH_RECENTS_MORE: {
      let results = state.recentsPosts.concat(payload.data || [])
      return {
        ...state,
        recentsPosts: results
      }
    }
    case FETCH_COUNTRIES: {
      return {
        ...state,
        popularCountries: (payload.data && payload.data.result) ? payload.data.result : []
      }
    }
    case SORT_POSTS_OF_CATEGORY: {
      if(payload.sortByPrice) {
        let postsOfCategory = Object.assign({}, state.allPostsOfCategory)
        const order = postsOfCategory.sortPriceOrder ? postsOfCategory.sortPriceOrder : 'asc'

        postsOfCategory.posts = _.orderBy(postsOfCategory.posts, ['cost'], [order]);

        // Toggle the order for the next sort action
        postsOfCategory.sortPriceOrder = (order == 'asc') ? 'desc' : 'asc'

        return {...state, allPostsOfCategory: postsOfCategory}
      }

      return state
    }
    default: {
      return state
    }
  }
}
