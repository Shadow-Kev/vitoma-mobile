import { Config, Constants, Languages, Tools, Events, Logger } from '@common';
import FooterNav from '@Component/FooterNav';
import Toast from '@Component/Toast';
import SendMsgForm from '@Component/SendMsgForm';
import LogoSpinner from '@Component/LogoSpinner';
import {
  addToBookmark,
  deleteFromBookmark,
  fetchPostDetail,
  getBookmarks,
  addLastViews
 } from '@redux/actions';
import Styles from '@Screen/Public/AdsDetail/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import moment from 'moment';
import { Button, Container, Content, Fab, Icon, List, ListItem, Right, Tab, Tabs, Text, View } from 'native-base';
import React from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Linking, Modal, Platform, Share, StatusBar, TouchableHighlight, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import { connect } from 'react-redux';

class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            modalGallery: {
                visible: false,
                selected: 0
            },
            loading: false,
            isFabActive: false
        };

        this.changeGalleryImage = this.changeGalleryImage.bind(this)
        this.closeGallery = this.closeGallery.bind(this)
        this.openGallery = this.openGallery.bind(this)
    }

    componentWillMount() {
      const config = this.props.navigation.state.params.postDetailConfig

      this.showSpinner()

      this.fetchPostDetail(config.postId)
    }

    componentWillReceiveProps(nextProps) {
      const nextConfig = nextProps.navigation.state.params.postDetailConfig
      const currentConfig = this.props.navigation.state.params.postDetailConfig

      if(nextConfig.postId !== currentConfig.postId) {

        this.showSpinner()

        this.fetchPostDetail(nextConfig.postId)
      }
    }

    componentWillUnmount = () => {
      if(this.loadingTimer)
        clearTimeout(this.loadingTimer);
    };

    fetchPostDetail = (postId) => {
      this.props.fetchPostDetail(postId, this.props.defaultCurrency, (post) => this.props.addLastViews(post))
      this.props.getBookmarks(this.props.trackedUserId, this.props.userId)
    }

    showSpinner() {
      this.setState({ loading: true})
      this.loadingTimer = setTimeout(() => {
        this.setState({ loading: false })
        this.loadingTimer = 0;
      }, 1000);
    }

    closeGallery() {
        const modalGallery = { ...this.state.modalGallery }
        modalGallery.visible = false
        this.setState({
            modalGallery
        })
    }

    openGallery(selected) {
        const modalGallery = { ...this.state.modalGallery }
        modalGallery.visible = true
        modalGallery.selected = selected
        this.setState({
            modalGallery
        })
    }

    changeGalleryImage(selected) {
        const modalGallery = { ...this.state.modalGallery }
        modalGallery.selected = selected
        this.setState({
            modalGallery
        })
    }

    renderAdItem = ({ item }) => {
      const postInfos = Tools.getPostInfos(item)

      return (
        <TouchableOpacity
        style={Styles.item}
        underlayColor='transparent'
        onPress={() => { this.fetchPostDetail(postInfos.id) }}>
            <View style={Styles.itemLeft}>
                <Image source={{ uri: postInfos.imgUrl }} style={Styles.itemImg} />
            </View>
            <View style={Styles.itemRight}>
                <Text style={Styles.itemTitle}>{postInfos.title}</Text>

                {/*<Text style={Styles.itemLocation}>{postInfos.location}</Text>*/}
                <Text style={Styles.itemImageCount}>
                  {postInfos.galleryImagesCount + (postInfos.galleryImagesCount < 2 ? ' Photo' : ' Photos')}
                </Text>

                <Text style={Styles.itemPrice}>{postInfos.price}</Text>
                <View style={Styles.itemPosted}>
                    <Icon name="calendar" type="FontAwesome" style={Styles.itemIcon} />
                    <Text style={Styles.itemDate}>{postInfos.publishedDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
      )
    }

    openPhone = (phone) => {
      if(!phone || phone == '' || phone == '---')
        return

      const phoneOpen =
        Platform.OS == 'ios' ? 'telprompt:' + phone : 'tel:' + phone
      Linking.canOpenURL(phoneOpen)
        .then((supported) => {
          if (supported) {
            return (Linking.openURL(phoneOpen)
                          .catch((err) => Logger.log(err)))
          }
        })
        .catch((err) => Logger.log(err))
    }

    sharePost(post) {
      const title = Tools.formatText(post.title)
      const price = (post.cost + ' ' + post.currency)
      var message = title + ' (' + price + ')'
      const url = Config.URL.adDetailEntryPoint + '/' + post.id + '/1'

      // The url is only for ios devices.
      // Append the url to the message for android devices.
      if(Platform.OS !== 'ios')
        message += " | " + url;

      Share.share(
        { message: message, url: url, title: title },
        {
          dialogTitle: Languages.AdsDetail.sharedWithYou + ' ' + title,
          excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
          tintColor: 'green',
        }
      ).catch(error => {
        this.setState({ shareError: 'error: ' + error.message })
        Logger.log(error)
      })
    }

    addToBookmark = () => {
      const trackedUserId = this.props.trackedUserId
      const userId = this.props.userId

      this.props.addToBookmark(this.props.post, trackedUserId, userId,
        (data, error) => {
          if(data && data.success) {
            Events.toast(Languages.Bookmark.bookmarkAdded, 2000)
          } else {
            Events.toast(Languages.Bookmark.bookmarkNotAdded, 2000)
          }
        })
    }

    deleteFromBookmark = (postId) => {
      const trackedUserId = this.props.trackedUserId
      const userId = this.props.userId

      this.props.deleteFromBookmark(postId, trackedUserId, userId,
        (data, error) => {
          if(data && data.success) {
            Events.toast(Languages.Bookmark.bookmarkDeleted, 2000)
          } else {
            Events.toast(Languages.Bookmark.bookmarkNotDeleted, 2000)
          }
        })
    }

    getPostAttributes = (post) => {
      let attributes = (post.attributes || []);

      attributes.push({
          label: Languages.AdsDetail.publishedDate,
          value: moment(post.publishedDate).locale(Languages.getLanguage()).format('DD MMM YYYY')
      })

      attributes.push({
          label: Languages.AdsDetail.rating,
          value: post.rating + '/5'
      })

      attributes.push({
          label: Languages.AdsDetail.likes,
          value: post.likeCount
      })

      attributes.push({
          label: post.galleryImagesCount < 2 ? 'Photo' : 'Photos',
          value: post.galleryImagesCount
      })

      return attributes
    }

    render() {
        if(this.state.loading || !this.props.post.id)
          return (<LogoSpinner fullStretch={true} />)

        const post = this.props.post
        const postInfos = Tools.getPostInfos(post)
        const isBookmarked = this.props.bookmarks.filter(bookmark => bookmark.id == post.id).length == 1

        const galleryImages = post.galleryImages.map((img, i) => {
          return Tools.getImage(post.galleryImages, Constants.PostImage.small, i)
        })

        const postAttributes = this.getPostAttributes(post)
        const owner = Tools.getPostOwnerInfos(this.props.owner, post)

        return <Container style={Style.bgMain}>
            <StatusBar backgroundColor="#173471" animated barStyle="light-content" />

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <ImageBackground source={{ uri: galleryImages[0] }} imageStyle={'cover'} style={Styles.coverImg}>
                    <View style={Style.actionBarIn}>
                        <Button transparent style={Style.actionBarBtn} onPress={() => {
                            NavigationService.navigate('PublicHome')
                        }}>
                            <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                        </Button>
                    </View>
                </ImageBackground>

                <View style={Styles.section}>
                    <Text style={Styles.title}>{postInfos.title}</Text>
                    <View style={Styles.locationTop}>
                        <Icon active name='map-marker-radius' style={Styles.locationTopIcon} type="MaterialCommunityIcons" />
                        <Text style={Styles.locationTopInfo}>{postInfos.location}</Text>

                        <Icon active name='eye' style={Styles.locationTopIcon} type="MaterialCommunityIcons" />
                        <Text style={Styles.locationTopInfo}>{postInfos.nbViews}</Text>
                    </View>
                    <Text style={Styles.price}>{postInfos.price}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Fab
                        active={this.state.isFabActive}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: '#CC0489' }}
                        position="bottomRight"
                        onPress={() => this.setState({ isFabActive: !this.state.isFabActive })}>
                        <Icon name={this.state.isFabActive ? "angle-double-down" : "angle-double-up"} type="FontAwesome" />
                        <Button style={{ backgroundColor: 'green' }} onPress={() => this.sharePost(post)}>
                            <Icon name="share" type="MaterialCommunityIcons" />
                        </Button>
                        {
                          isBookmarked &&
                          <Button style={{ backgroundColor: '#E8BB03' }} onPress={() => this.deleteFromBookmark(postInfos.id)}>
                              <Icon name="heart" type="MaterialCommunityIcons" />
                          </Button>
                        }
                        {
                          !isBookmarked &&
                          <Button style={{ backgroundColor: '#FFF' }} onPress={() => this.addToBookmark()}>
                              <Icon name="heart" type="MaterialCommunityIcons" style={{ color: '#111111' }}/>
                          </Button>
                        }
                    </Fab>
                </View>


                <ImageBackground source={require('@Asset/images/shadow.png')} imageStyle={'cover'} style={Styles.shadow} />

                {
                  postAttributes.length > 0 &&
                  <View style={Styles.overview}>
                      <List>
                          {postAttributes.map((attribute, index) => {
                            return (
                              <ListItem key={'postAttributes-' + index } style={Styles.oItem}>
                                  <Text style={Styles.oLabel}>{attribute.label}</Text>
                                  <Text style={Styles.oValue}>{attribute.value}</Text>
                              </ListItem>
                            )
                          })}
                      </List>
                  </View>
                }

                <View style={Styles.overview}>
                    <Text style={Styles.overviewTitle}>{Languages.AdsDetail.overview}</Text>
                    <HTML baseFontStyle={{fontSize: 13}}
                          html={postInfos.description}
                          imagesMaxWidth={Dimensions.get('window').width} />
                </View>

                <View style={Styles.gallery}>
                    <Text style={Styles.galleryTitle}>{Languages.AdsDetail.photoGallery}</Text>
                    <View style={Styles.galleryImg}>
                        {galleryImages.map((image, index) => {
                            return <TouchableHighlight key={'galleryImage-' + index} style={Styles.galleryItem} onPress={() => {
                                this.openGallery(index)
                            }}>
                                <Image source={{ uri: image }} style={Styles.galleryPic} />
                            </TouchableHighlight>
                        })}
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalGallery.visible}
                    onRequestClose={() => {}}
                >
                    <View style={Styles.photo}>
                        <Image source={{ uri: galleryImages[this.state.modalGallery.selected] }} resizeMode={'contain'} style={Styles.photoPic} />

                        <View style={Styles.photoBtn}>
                            {
                                galleryImages[this.state.modalGallery.selected - 1]
                                    ?
                                    <TouchableHighlight style={Styles.photoButton}
                                        onPress={() => {
                                            this.changeGalleryImage(this.state.modalGallery.selected - 1)
                                        }}>
                                        <Text style={Styles.photoBtnText}>{Languages.AdsDetail.prev}</Text>
                                    </TouchableHighlight>
                                    :
                                    null
                            }
                            <TouchableHighlight style={Styles.photoButton}
                                onPress={() => {
                                    this.closeGallery()
                                }}>
                                <Text style={Styles.photoBtnText}>{Languages.AdsDetail.close}</Text>
                            </TouchableHighlight>
                            {
                                galleryImages[this.state.modalGallery.selected + 1]
                                    ?
                                    <TouchableHighlight style={Styles.photoButton}
                                        onPress={() => {
                                            this.changeGalleryImage(this.state.modalGallery.selected + 1)
                                        }}>
                                        <Text style={Styles.photoBtnText}>{Languages.AdsDetail.next}</Text>
                                    </TouchableHighlight>
                                    :
                                    null
                            }
                        </View>
                    </View>
                </Modal>

                {
                  owner.fullName.trim().length > 0 &&
                  <View style={Styles.owner}>
                      <Text style={Styles.ownerTitle}>{Languages.AdsDetail.contact}</Text>
                      <ListItem style={Styles.ownerAvatar} onPress={() => {
                          NavigationService.navigate('PublicMemberDetails')
                      }}>
                          {
                            owner.avatar.length > 0 &&
                            <Image source={{ uri: owner.avatar }} style={Styles.ownerAvatarImg} />
                          }
                          {
                            !owner.avatar &&
                            <Image source={require("@Asset/images/avatar.png")} style={Styles.ownerAvatarImg} />
                          }
                          <View style={Styles.ownerInfo}>
                              <View>
                                  <Text style={Styles.ownerName}>{owner.fullName}</Text>
                                  <Text style={Styles.ownerLocation}>{owner.location}</Text>
                              </View>
                          </View>
                      </ListItem>
                  </View>
                }

                <Tabs tabBarUnderlineStyle={Styles.tabBorder}>
                    <Tab tabStyle={Styles.tabGrey} textStyle={Styles.tabText} activeTabStyle={Styles.tabGrey} activeTextStyle={Styles.tabText} heading={Languages.AdsDetail.contactForm}>
                      <SendMsgForm recipientUserId={owner.userId} />
                    </Tab>
                    <Tab tabStyle={Styles.tabGrey} textStyle={Styles.tabTextActive} activeTabStyle={Styles.tabGrey} activeTextStyle={Styles.tabTextActive} heading={Languages.AdsDetail.contactInfos}>
                        <List style={Styles.infoTab}>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="map-marker-radius" type="MaterialCommunityIcons" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.AdsDetail.address.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{postInfos.location}</Text>
                                </View>
                            </ListItem>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="phone" type="FontAwesome" style={Styles.infoIcon} />
                                <TouchableOpacity
                                  activeOpacity={0.9}
                                  onPress={() => this.openPhone(owner.phone)}>
                                    <View>
                                        <Text style={Styles.infoHeader}>{Languages.AdsDetail.phone.toUpperCase()}</Text>
                                        <Text style={Styles.infoDesc}>{owner.phone}</Text>
                                    </View>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="mail" type="Entypo" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.AdsDetail.email.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{owner.email}</Text>
                                </View>
                            </ListItem>
                            <ListItem style={[Styles.infoItem, Styles.infoItemLast]}>
                                <Icon name="web" type="MaterialCommunityIcons" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.AdsDetail.webSite.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{owner.webSite}</Text>
                                </View>
                            </ListItem>
                        </List>
                    </Tab>
                </Tabs>

                {
                  this.props.sameUserAds.length > 0 &&
                  <View style={Styles.section}>
                      <View style={Styles.headerBg}>
                          <Icon name="account" type="MaterialCommunityIcons" style={Styles.headerIcon} />
                          <Text style={Styles.sHeader}>{Languages.AdsDetail.sameUserPosts.toUpperCase()}</Text>
                      </View>
                      <View>
                          <FlatList
                              data={this.props.sameUserAds}
                              keyExtractor={(item, index) => 'sameUserAds-' + item.id}
                              showsHorizontalScrollIndicator={false}
                              renderItem={this.renderAdItem}
                          />
                      </View>
                  </View>
                }

                {
                  this.props.relatedPosts.length > 0 &&
                  <View style={Styles.section}>
                      <View style={Styles.headerBg}>
                          <Icon name="briefcase" type="MaterialCommunityIcons" style={Styles.headerIcon} />
                          <Text style={Styles.sHeader}>{Languages.AdsDetail.similarAds.toUpperCase()}</Text>
                      </View>
                      <View>
                          <FlatList
                              data={this.props.relatedPosts}
                              keyExtractor={(item, index) => 'relatedPosts-' + item.id}
                              showsHorizontalScrollIndicator={false}
                              renderItem={this.renderAdItem}
                          />
                      </View>
                  </View>
                }

                {
                  this.props.lastViews.length > 0 &&
                  <View style={Styles.section}>
                      <View style={Styles.headerBg}>
                          <Icon name="briefcase" type="MaterialCommunityIcons" style={Styles.headerIcon} />
                          <Text style={Styles.sHeader}>{Languages.AdsDetail.myLastViews.toUpperCase()}</Text>
                      </View>
                      <View>
                          <FlatList
                              data={this.props.lastViews}
                              keyExtractor={(item, index) => 'lastViews-' + item.id}
                              showsHorizontalScrollIndicator={false}
                              renderItem={this.renderAdItem}
                          />
                      </View>
                  </View>
                }

            </Content>

            <FooterNav />

            <Toast />
        </Container>
    }
}

const mapStateToProps = ({ posts, bookmarks, user }) => {
  const postDetail = posts.postDetail
  const sameUserAds = postDetail.sameUserAds || []
  const similarAds = postDetail.similarAds || []

  return {
    userId: user.profile ? user.profile.uid : null,
    trackedUserId: user.trackedUserId,
    post: postDetail,
    owner: postDetail.owner,
    sameUserAds: sameUserAds.filter((item) => item.id != postDetail.id).slice(0, 5),
    relatedPosts: similarAds.slice(0, 5),
    lastViews: user.lastViewsList.slice(0, 5),
    bookmarks: bookmarks.list,
    defaultCurrency: user.currency
  }
}
export default connect(mapStateToProps, {
  fetchPostDetail,
  addToBookmark,
  deleteFromBookmark,
  getBookmarks,
  addLastViews
 })(Index)
