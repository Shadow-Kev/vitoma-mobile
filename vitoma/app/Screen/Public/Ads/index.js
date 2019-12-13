import { Languages, Tools } from '@common';
import LogoSpinner from '@Component/LogoSpinner';
import { fetchPostsByCategory, sortPostsOfCategory } from '@redux/actions';
import Styles from '@Screen/Public/Ads/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Footer, FooterTab, Header, Icon, Text, View } from 'native-base';
import React from 'react';
import { Animated, FlatList, Image, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class Index extends React.Component {
    state = { scrollY: new Animated.Value(0), loading: true }

    constructor(props) {
        super(props)
        this.page = 1;
        this.loadingTimer = 0;
    }

    componentWillMount() {
        const { state } = this.props.navigation
        const config = state.params.config
        this.props.fetchPostsByCategory(this.page, config.categoryId)
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

    nextPosts = () => {
      if(this.props.finish)
        return;

      const { state } = this.props.navigation
      const config = state.params.config
      this.page += 1
      this.props.fetchPostsByCategory(this.page, config.categoryId)
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

    keyExtractor = (item) => item.id.toString()

    render() {
        const posts = this.props.posts;

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
            </Content>

            <Footer style={Style.greyTopLine}>
                <FooterTab style={Style.bgFilter}>
                    <Button style={Style.bgFilter} onPress={() => {
                        this.props.sortPostsOfCategory({ sortByPrice: true })
                    }}>
                        <Icon name="sort-amount-asc" type="FontAwesome" style={Style.textBlue} />
                        <Text style={Style.textBlack}>{Languages.Ads.sortByPrice}</Text>
                    </Button>
                    <Button style={Style.bgFilter} onPress={() => {
                        NavigationService.navigate('PublicAdsSearch')
                    }}>
                        <Icon name="filter" type="FontAwesome" style={Style.textBlue} />
                        <Text style={Style.textBlack}>{Languages.Ads.filters}</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
    }
}

const mapStateToProps = ({ posts, bookmarks }) => {
    const allPostsOfCategory = posts.allPostsOfCategory

    return {
      posts: allPostsOfCategory.posts,
      finish: allPostsOfCategory.finish,
      bookmarks: bookmarks.list
    }
  }

 export default connect(mapStateToProps, { fetchPostsByCategory, sortPostsOfCategory })(Index)
