import { Languages, Events, Tools } from '@common';
import FooterNav from '@Component/FooterNav';
import {
  deleteFromBookmark,
  getBookmarks
} from '@redux/actions';
import Styles from '@Screen/Member/Bookmark/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text } from 'native-base';
import React from 'react';
import { FlatList, Image, StatusBar, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Toast from '@Component/Toast';
import LogoSpinner from '@Component/LogoSpinner';

class Index extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false
        };
    }

    componentWillMount() {
      this.showSpinner()
      this.getBookmarks()
    }

    componentWillUnmount = () => {
      if(this.loadingTimer)
        clearTimeout(this.loadingTimer);
    };

    getBookmarks = () => {
      this.props.getBookmarks(this.props.trackedUserId, this.props.userId)
    }

    showSpinner() {
      this.setState({ loading: true})
      this.loadingTimer = setTimeout(() => {
        this.setState({ loading: false })
        this.loadingTimer = 0;
      }, 1000);
    }

    deleteFromBookmark = (postId) => {
      const trackedUserId = this.props.trackedUserId
      const userId = this.props.userId

      this.props.deleteFromBookmark(postId, trackedUserId, userId,
        (data, error) => {
          if(data) {
            Events.toast(Languages.Bookmark.bookmarkDeleted, 2000)
          } else {
            Events.toast(Languages.Bookmark.bookmarkNotDeleted)
          }
        })
    }

    render() {
        const bookmarks = this.props.bookmarks

        if(this.state.loading)
          return (<LogoSpinner fullStretch={true} />)


        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#173471" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('PublicHome')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.Bookmark.bookmark.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>
              <View style={Styles.section}>
                  <FlatList
                      data={bookmarks}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, idnex) => item.id}
                      renderItem={({ item, separators }) => {
                        item = Tools.getPostInfos(item)
                        return (
                          <TouchableOpacity style={Styles.item} underlayColor='transparent' onPress={() => {
                            NavigationService.navigate('PublicAdsDetail', { postDetailConfig: { postId: item.id } }) }
                          }>
                              <View style={Styles.itemLeft}>
                                  <Image source={{ uri: item.imgUrl }} style={Styles.itemImg} />
                              </View>
                              <View style={Styles.itemContent}>
                                  <Text style={Styles.itemTitle}>{item.title}</Text>

                                  {/*<Text style={Styles.itemLocation}>{item.location}</Text>*/}
                                  <Text style={Styles.itemImageCount}>
                                    {item.galleryImagesCount + (item.galleryImagesCount < 2 ? ' Photo' : ' Photos')}
                                  </Text>

                                  <Text style={Styles.itemPrice}>{item.price}</Text>
                                  <View style={Styles.itemPosted}>
                                      <Icon name="calendar" type="FontAwesome" style={Styles.itemIcon} />
                                      <Text style={Styles.itemDate}>{item.publishedDate}</Text>
                                  </View>
                              </View>
                              <View style={Styles.itemRight}>
                                  <Button transparent style={Style.actionBarBtn} onPress={() => this.deleteFromBookmark(item.id)}>
                                      <Icon active name='trash' style={Styles.trash} type="FontAwesome" />
                                  </Button>
                              </View>
                          </TouchableOpacity>
                        );
                      }}
                  />
              </View>

              {
                !bookmarks.length &&
                <View style={Styles.noResultContainer}>
                  <Text>{Languages.Bookmark.noBookmarks}</Text>
                </View>
              }
            </Content>

            <FooterNav />

            <Toast />
        </Container>
    }
}

const mapStateToProps = ({ user, bookmarks }) => {
  return {
    userId: user.profile ? user.profile.uid : null,
    trackedUserId: user.trackedUserId,
    bookmarks: bookmarks.list
  }
}

export default connect(mapStateToProps, { deleteFromBookmark, getBookmarks })(Index)
