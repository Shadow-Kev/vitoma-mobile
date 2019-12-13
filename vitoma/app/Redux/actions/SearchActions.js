/** @format */

import { Config, Languages } from "@common"
import { get } from './fetch'

export const searchAds = (page = 1, params, type) => {
  let langId = (Languages.getLanguage() === 'fr') ? 'fr_FR' : 'en_US';
  // TODO - Supprimer le param pageNumber lorsque l'api ne le supportera plus
  let url = `${Config.URL.entryPoint}/ads/search?query=${params.query}&page=${page}&pageNumber=${page}`

  url += (params.country && params.country != '') ? '&country=' + params.country : '';
  url += (params.categoriesList && params.categoriesList.length) ? '&categoriesList=' + params.categoriesList[0] : '';
  url += (params.minPrice) ? '&minPrice=' + params.minPrice : '';
  url += (params.maxPrice) ? '&maxPrice=' + params.maxPrice : '';
  url += (params.currency) ? '&currency=' + params.currency : '';

  return (dispatch) => {
    return get(url, dispatch, type)
  }
}
