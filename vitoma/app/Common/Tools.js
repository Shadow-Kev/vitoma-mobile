/** @format */

'use strict'

import { AllHtmlEntities } from 'html-entities'
import truncate from 'lodash/truncate'
import moment from 'moment'

import Logger from './Logger'
import Constants from './Constants'

export default class Tools {

  static geoAddress(position) {
    const url = `http://maps.googleapis.com/maps/api/geocode/json?address=${
                  position.latitude
                },${position.longitude}`;

    return fetch(url)
    .then((response) => response.json())
    .catch((err) => Logger.log({...err, url}))
    .then((responseJson) => {
      return responseJson
    })
    .catch((err) => Logger.log({...err, url}))
  }

  static getImage(data, imageSize, imageIndex) {
    // default image url
    let imageURL = 'https://semantic-ui.com/images/wireframe/image.png'

    if (typeof data == 'undefined' || data == null || !data.length) {
      return imageURL
    }

    if (typeof imageSize == 'undefined') {
      imageSize = 'medium'
    }

    let dimensions

    if (imageSize == Constants.PostImage.small)
      dimensions = '200x200'

    if (imageSize == Constants.PostImage.medium)
      dimensions = '660x360'

    if (imageSize == Constants.PostImage.large)
      dimensions = '800x400'

    if (imageSize == Constants.PostImage.full)
      dimensions = '1000x600'

    let media = {}

    if(!imageIndex)
      imageIndex = 0

    media = data[imageIndex] || {}

    if (media.thumbnailsFullyQualifiedLocation && media.imagesFullyQualifiedLocation && media.fileName)
      imageURL = media.thumbnailsFullyQualifiedLocation + '/'+
                 dimensions + '/' +
                 media.imagesFullyQualifiedLocation + '/' +
                 media.fileName

    else if (media.isFromDevice && media.src)
      imageURL = media.src

    return imageURL;
  }

  static formatText(desc, limit) {
    if (typeof limit == 'undefined') {
      limit = 50
    }

    if (typeof desc == 'undefined') {
      return ''
    }

    var desc = desc.replace('<p>', '')
    desc = truncate(desc, { length: limit, separator: ' ' })

    return AllHtmlEntities.decode(desc)
  }

  static getFormattedCost(cost) {
    // GEt the cost as a string
    cost = cost + ""

    var reverseCost = "";
    var formattedCost = "";
    var counter = 0;

    for(var i = cost.length - 1; i >= 0; i--) {
        reverseCost += cost.charAt(i);
        counter++;
        if(counter % 3 === 0 && counter < cost.length)
          reverseCost += "."
    }

    for(var i = reverseCost.length - 1; i >= 0; i--)
        formattedCost += reverseCost[i];

    return formattedCost;
  }

  static getPostInfos(post) {
    return {
      id: post.id,
      title: this.formatText(post.title),
      displayTitle: this.formatText(post.displayTitle),
      description: post.description || '---',
      imgUrl: this.getImage(post.galleryImages),
      price: (this.getFormattedCost(post.cost) + ' ' + post.currency.toUpperCase()),
      location: post.location ? post.location.addressText : '---',
      publishedDate: moment(post.publishedDate).format('YYYY-MM-DD'),
      nbViews: post.viewCount || 0,
      rating: post.rating,
      status: post.status,
      galleryImagesCount: post.galleryImagesCount
    }
  }

  static getPostOwnerInfos(owner, post) {
    return {
      userId: owner.userId,
      avatar: this.getImage([owner.profileImage], Constants.PostImage.small),
      fullName: ((owner.firstName || '') + ' ' + (owner.lastName || '')),
      location: owner.addressText || (post.location ? post.location.addressText : '---'),
      phone: owner.phone || "",
      email: owner.email || "",
      webSite: owner.webSite || ""
    }
  }

  static sendMessageNotification({ token, title, body, data }) {
    const url = `https://exp.host/--/api/v2/push/send`;

    return fetch(url, {
        method: 'POST',
        headers: {
        'host': 'exp.host',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: token,
          title,
          body,
          data
        }),
    })
    .then(
      (response) => response ? response.json() : null,
      (error) => Logger.log({...error, url, body, title, body, data, token })
    )
  }
}
