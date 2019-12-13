import { Languages, Tools } from '@common';
import FooterNav from '@Component/FooterNav';
import LogoSpinner from '@Component/LogoSpinner';
import {
  fetchFeaturedAds,
  fetchRecentsAds,
  searchAds
} from '@redux/actions';
import {
  SEARCH_ADS,
  SEARCH_ADS_MORE,
  FETCH_RECENTS,
  FETCH_FEATURED,
  FETCH_RECENTS_MORE,
  FETCH_FEATURED_MORE
} from '@redux/types';
import Styles from '@Screen/Public/SearchResults/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text, View } from 'native-base';
import React from 'react';
import { Animated, FlatList, Image, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class Index extends React.Component {
    state = {
      scrollY: new Animated.Value(0),
      loading: true,
    }

    constructor(props) {
        super(props)
        this.page = 1;
        this.loadingTimer = 0;
    }

    componentWillMount() {
      const { state } = this.props.navigation
      const config = state.params.config

      this.page = 1;
      this.fetchAds(this.page, config)
    }

    componentWillReceiveProps(nextProps) {
      const nextState = nextProps.navigation.state
      const currentState = this.props.navigation.state

      if(nextState.params.token !== currentState.params.token) {
        this.showSpinner();

        this.page = 1;
        this.fetchAds(this.page, nextState.params.config)
      }
    }

    componentDidMount() {
      this.loadingTimer = setTimeout(() => {
        this.setState({ loading: false })
        this.loadingTimer = 0;
      }, 1000);
    }

    componentWillUnmount = () => {
      if(this.loadingTimer)
        clearTimeout(this.loadingTimer);
    };

    showSpinner() {
      this.setState({ loading: true })
      this.loadingTimer = setTimeout(() => {
        this.setState({ loading: false })
        this.loadingTimer = 0;
      }, 1000);
    }

    nextPosts = () => {
      const { state } = this.props.navigation
      const config = state.params.config
      this.page += 1
      this.fetchAds(this.page, config)
    }

    fetchAds = (page, config) => {
      if(config.isForFeaturedAds) {
        var type = this.page == 1 ? FETCH_FEATURED : FETCH_FEATURED_MORE;
        this.props.fetchFeaturedAds(this.page, 10, type)
      } else if (config.isForRecentAds){
        var type = this.page == 1 ? FETCH_RECENTS : FETCH_RECENTS_MORE;
        this.props.fetchRecentsAds(this.page, 10, type)
      } else {
        var type = this.page == 1 ? SEARCH_ADS : SEARCH_ADS_MORE;
        this.props.searchAds(page, config, type)
      }
    }

    getPosts = () => {
      const config = this.props.navigation.state.params.config

      if(config.isForFeaturedAds)
        return this.props.featuredPosts
      else if (config.isForRecentAds)
        return this.props.recentsPosts
      else
        return this.props.searchResults
    }

    renderItem = ({ item }) => {
      const postDetailConfig = { postId: item.id }
      const postInfos = Tools.getPostInfos(item)
      const isBookmarked = this.props.bookmarks.filter(bookmark => bookmark.id == item.id).length == 1

      return (
        <TouchableOpacity
        style={Styles.item}
        underlayColor='transparent'
        onPress={() => { NavigationService.navigate('PublicAdsDetail', { postDetailConfig }) }}>
            <View style={Styles.itemLeft}>
                <Image source={{ uri: postInfos.imgUrl }} style={Styles.itemImg} />
                { isBookmarked && <Icon name="heart" type="MaterialCommunityIcons" style={Styles.itemFavorite} />}
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

    keyExtractor = (item, index) => item.id.toString() + '-' + index

    render() {
        const posts = this.getPosts();

        if(this.state.loading)
          return (<LogoSpinner fullStretch={true} />)

        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('PublicHome')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.Ads.ads.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                    <Button transparent style={Style.actionBtnRight} onPress={() => {
                        NavigationService.navigate('PublicAdsSearch')
                    }}>
                        <Icon active name='search' style={Style.actionIcon} type="FontAwesome" />
                    </Button>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>
              {
                posts.length > 0 &&
                <View style={Styles.section}>
                    <AnimatedFlatList
                        data={posts}
                        keyExtractor={this.keyExtractor}
                        showsHorizontalScrollIndicator={false}
                        onEndReached={this.nextPosts}
                        renderItem={this.renderItem}
                        scrollEventThrottle={1}
                        onScroll={Animated.event(
                          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                          { useNativeDriver: true }
                        )}
                    />
                </View>
              }

              {
                !posts.length &&
                <View style={Styles.noResultContainer}>
                  <Text>{Languages.Home.noResultsSearch}</Text>
                </View>
              }
            </Content>

            <FooterNav />
        </Container>
    }
}

const mapStateToProps = ({ posts, bookmarks, search }) => {
    return {
      bookmarks: bookmarks.list,
      searchResults: search.searchResults,
      featuredPosts: posts.featuredPosts,
      recentsPosts: posts.recentsPosts
    }
  }

 export default connect(mapStateToProps, {
   searchAds,
   fetchFeaturedAds,
   fetchRecentsAds
 })(Index)
