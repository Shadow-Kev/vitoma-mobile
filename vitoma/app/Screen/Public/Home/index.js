import { Languages, Tools, Constants, Config } from '@common';
import { Notifications } from 'expo'
import FooterNav from '@Component/FooterNav';
import {
  fetchFeaturedAds,
  fetchRecentsAds,
  fetchPopularCountries,
  getMembers,
  fetchPostsByCategory
} from '@redux/actions';
import Styles from '@Screen/Public/Home/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Right, Text, View } from 'native-base';
import React from 'react';
import { FlatList, Image, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from "firebase"

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          searchQuery: '',
          postsOfCategories: []
        }
    }

    componentWillMount() {
      this.fetchData()

      this.refreshRef = firebase.database().ref('refreshContentEvents/refreshHomePageEvent');
      this.refreshRef.on('value', this.onRefreshSnapshot);
    }

    componentWillUnmount() {
      if(this.refreshRef)
        this.refreshRef.off('value', this.onRefreshSnapshot)
    }

    componentDidUpdate(prevProps) {
      // Utilisation classique (pensez bien à comparer les props) :
      if (this.props.defaultCountry  !== prevProps.defaultCountry ||
          this.props.defaultCurrency !== prevProps.defaultCurrency) {
        this.fetchData();
      }
    }

    onRefreshSnapshot = (snapshot) => {
      this.fetchData()
    }

    fetchData = () => {
      this.props.fetchFeaturedAds(this.props.defaultCountry, this.props.defaultCurrency)
      this.props.fetchRecentsAds(this.props.defaultCountry, this.props.defaultCurrency)
      this.props.fetchPopularCountries()
      this.props.getMembers()
      this.fetchPostsOfCategories()
    }

    renderFeatureItem = ({ item, separators }) => {
      const postDetailConfig = { postId: item.id }
      const postInfos = Tools.getPostInfos(item)

      return (
        <TouchableOpacity
          style={Styles.item}
          underlayColor='transparent'
          onPress={() => { NavigationService.navigate('PublicAdsDetail', { postDetailConfig }) }}>
            <View>
                <View>
                    <Image source={{ uri: postInfos.imgUrl }} style={Styles.itemImg} />
                    <View style={Styles.itemNoCrv}></View>
                    <Icon name="bookmark" type="FontAwesome" style={Styles.itemFavorite} />
                </View>
                <Text style={Styles.itemTitleSm}>{postInfos.title}</Text>

                {/*<Text style={Styles.itemLocation}>{postInfos.location}</Text>*/}
                <Text style={Styles.itemImageCount}>
                  {postInfos.galleryImagesCount + (postInfos.galleryImagesCount < 2 ? ' Photo' : ' Photos')}
                </Text>

                <View style={Styles.itemBg}>
                    <View style={Styles.itemLeftSm}>
                        <Text style={Styles.itemPriceSm}>{postInfos.price}</Text>
                    </View>
                    <View style={Styles.itemRight}>
                        <View style={Styles.itemPosted}>
                            <Icon name="calendar" type="FontAwesome" style={Styles.itemIcon} />
                            <Text style={Styles.itemDate}>{postInfos.publishedDate}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      )
    }

    renderRecentItem = ({ item, separators }) => {
      const postDetailConfig = { postId: item.id }
      const postInfos = Tools.getPostInfos(item)

      return (
        <TouchableOpacity
          style={Styles.item}
          underlayColor='transparent'
          onPress={() => { NavigationService.navigate('PublicAdsDetail', { postDetailConfig }) }}>
            <View>
                <View>
                    <Image source={{ uri: postInfos.imgUrl }} style={Styles.itemImg} />
                    <View style={Styles.itemNoCrv}></View>
                </View>
                <Text style={Styles.itemTitleSm}>{postInfos.title}</Text>

                {/*<Text style={Styles.itemLocation}>{postInfos.location}</Text>*/}
                <Text style={Styles.itemImageCount}>
                  {postInfos.galleryImagesCount + (postInfos.galleryImagesCount < 2 ? ' Photo' : ' Photos')}
                </Text>

                <View style={Styles.itemBg}>
                    <View style={Styles.itemLeftSm}>
                        <Text style={Styles.itemPriceSm}>{postInfos.price}</Text>
                    </View>
                    <View style={Styles.itemRight}>
                        <View style={Styles.itemPosted}>
                            <Icon name="calendar" type="FontAwesome" style={Styles.itemIcon} />
                            <Text style={Styles.itemDate}>{postInfos.publishedDate}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      )
    }

    renderCategoriesIcons = () => {
        return this.getCategoriesConfigs().map((config, index) => {
            return (
                <TouchableOpacity key={config.categoryId + '-' + index} style={Styles.btnBox} onPress={() => {
                    NavigationService.navigate('PublicAds', { config })
                }}>
                    <Image source={config.icon} resizeMode={'cover'} style={Styles.btnImg} />
                    <Text style={Styles.btnText}>{config.categoryName}</Text>
                </TouchableOpacity>
            )
        })
    }

    getCategoriesConfigs = () => {
      const configs = [
          {
              categoryId: 'REALESTATE',
              categoryName: Languages.Categories.realEstate,
              icon: require('@Asset/images/btn-real_estate.png'),
              materialIcon: 'home'
          },
          {
              categoryId: 'AUTOMOTIVEINDUSTRIAL',
              categoryName: Languages.Categories.automotiveIndustrial,
              icon: require('@Asset/images/btn-car.png'),
              materialIcon: 'car'
          },
          {
              categoryId: 'ELECTRONICS',
              categoryName: Languages.Categories.electronics,
              icon: require('@Asset/images/btn-eletronics.png'),
              materialIcon: 'deskphone'
          },
          {
              categoryId: 'CLOTHINGSHOESJEWELRY',
              categoryName: Languages.Categories.fashion,
              icon: require('@Asset/images/btn-fashion.png')
          },
          {
              categoryId: 'HOME',
              categoryName: Languages.Categories.household,
              icon: require('@Asset/images/btn-household.png')
          },
          {
              categoryId: 'JOBS',
              categoryName: Languages.Categories.jobs,
              icon: require('@Asset/images/btn-jobs.png')
          }
      ]

      return (configs);
    }

    fetchPostsOfCategories = () => {
      var postsOfCategories = [];
      this.getCategoriesConfigs().forEach(config => {
        this.props.fetchPostsByCategory(1/*page*/, config.categoryId,
          this.props.defaultCountry,
          this.props.defaultCurrency, (data) => {
          if(data && data.length && data[0].ads && data[0].ads.length) {
            postsOfCategories.push({
              categoryId: config.categoryId,
              categoryName: config.categoryName,
              materialIcon: config.materialIcon,
              posts: data[0].ads
            })

            this.setState({ postsOfCategories })
          }
        })
      })
    }

    keyExtractor = (item, index) => item.id.toString()

    displayAds = (config) => {
      config.query = ''
      NavigationService.navigate('PublicSearchResults', {
        config,
        token: Date.now()
      })
    }

    render() {
        const features = this.props.featuredPosts
        const recents = this.props.recentsPosts
        const lastViews = this.props.lastViews
        const popularCountries = this.props.popularCountries

        return <Container>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionMenu} onPress={() => {
                        NavigationService.openDrawer()
                    }}>
                        <Image source={require('@Asset/images/menu.png')} />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.Home.home.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>
                <View style={Styles.search}>
                    <TextInput
                      placeholder={'e.g. Maison'}
                      value={this.state.searchQuery}
                      onChangeText={(text) => this.setState({ searchQuery: text })}
                      style={Styles.textInput} />
                    <Button transparent style={Styles.searchBtn} onPress={() => {
                        NavigationService.navigate('PublicSearchResults', {
                          config: {
                            query: this.state.searchQuery
                          },
                          token: Date.now()
                        })
                    }}>
                        <Icon active name='search' type="FontAwesome" style={Styles.searchBtnIcon} />
                    </Button>
                </View>


                <View style={Styles.btnLayout}>
                    {this.renderCategoriesIcons()}
                </View>


                <View style={Styles.headerBg}>
                    <Icon name="briefcase" type="Feather" style={Styles.headerIcon} />
                    <Text style={Styles.sHeader}>{Languages.Home.featuresAds.toUpperCase()}</Text>
                    <Right>
                        <Button small rounded transparent onPress={() => this.displayAds({ isForFeaturedAds: true })}>
                            <Image source={require('@Asset/images/dot.png')} />
                        </Button>
                    </Right>
                </View>
                <FlatList
                    data={features}
                    keyExtractor={this.keyExtractor}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={Styles.featureList}
                    renderItem={this.renderFeatureItem}
                />


                

                <View style={Styles.section}>
                    <View style={Styles.headerBg}>
                        <Icon name="clock" type="Feather" style={Styles.headerIcon} />
                        <Text style={Styles.sHeader}>{Languages.Home.recentAds.toUpperCase()}</Text>
                        <Right>
                            <Button small rounded transparent onPress={() => this.displayAds({ isForRecentAds: true })}>
                                <Image source={require('@Asset/images/dot.png')} />
                            </Button>
                        </Right>
                    </View>
                    <FlatList
                        data={recents}
                        keyExtractor={this.keyExtractor}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={Styles.flatList}
                        renderItem={this.renderRecentItem}
                    />
                </View>

                {
                  lastViews.length > 0 &&
                  <View style={Styles.section}>
                      <View style={Styles.headerBg}>
                          <Icon name='eye' type="MaterialCommunityIcons" style={Styles.headerIcon} />
                          <Text style={Styles.sHeader}>{Languages.Home.myLastViews.toUpperCase()}</Text>
                      </View>
                      <FlatList
                          data={lastViews}
                          keyExtractor={this.keyExtractor}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={Styles.flatList}
                          renderItem={this.renderRecentItem}
                      />
                  </View>
                }

                {
                  this.state.postsOfCategories.map(item => {
                    return (
                      <View style={Styles.section} key={item.categoryId}>
                          <View style={Styles.headerBg}>
                              <Icon name={item.materialIcon || 'tab'} type="MaterialCommunityIcons" style={Styles.headerIcon} />
                              <Text style={Styles.sHeader}>{item.categoryName.toUpperCase()}</Text>
                              <Right>
                            <Button small rounded transparent onPress={() => {
                              NavigationService.navigate('PublicAds', {
                                config: {
                                  categoryId: item.categoryId,
                                  categoryName: item.categoryName
                                }
                              })}}>
                                  <Image source={require('@Asset/images/dot.png')} />
                                </Button>
                              </Right>
                          </View>
                          <FlatList
                              data={item.posts}
                              keyExtractor={this.keyExtractor}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              style={Styles.flatList}
                              renderItem={this.renderRecentItem}
                          />
                      </View>
                    )
                  })
                }

            </Content>

            <FooterNav />

        </Container>
    }
}


const mapStateToProps = ({ posts, member, user }) => {
  return {
    featuredPosts: posts.featuredPosts,
    recentsPosts: posts.recentsPosts,
    lastViews: user.lastViewsList,
    popularCountries: posts.popularCountries,
    popularMembers: member.members.slice(0, 10),
    defaultCountry: user.country,
    defaultCurrency: user.currency
  }
}

export default connect(mapStateToProps, {
  fetchFeaturedAds,
  fetchRecentsAds,
  fetchPopularCountries,
  getMembers,
  fetchPostsByCategory
})(Index)
