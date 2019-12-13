import { Events, Languages, Tools } from '@common';
import FooterNav from '@Component/FooterNav';
import Toast from '@Component/Toast';
import { deleteUserAd, getUserAds } from '@redux/actions';
import { GET_USER_ADS, GET_USER_ADS_MORE } from '@redux/types';
import Styles from '@Screen/Member/Ads/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text, View } from 'native-base';
import React from 'react';
import { Alert, FlatList, Image, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.page = 1;

        this.deleteAction = false
    }

    componentWillMount() {
      this.props.getUserAds(this.props.userId, GET_USER_ADS, this.page, this.props.defaultCurrency)
    }

    componentDidUpdate() {
      if(this.deleteAction && this.props.error.deleting) {
        Events.toast(Languages.AdPublished.adNotDeleted)
      }

      this.deleteAction = false
    }

    beforeDeletingAd = (adId) => {
      this.deleteAction = false

      Alert.alert(
        Languages.AdPublished.warning,
        Languages.AdPublished.deleteWarning,
        [
          {text: Languages.AdPublished.no, onPress: () => console.log('Cancel Pressed'), style: 'no'},
          {text: Languages.AdPublished.yes, onPress: () => {
            this.deleteAction = true
            this.props.deleteUserAd(adId, this.props.userId)
          }, style: 'yes'},
        ],
        { cancelable: false }
      )
    }

    nextAds = () => {
      this.page += 1
      this.props.getUserAds(this.props.userId, GET_USER_ADS_MORE, this.page)
    }

    renderItem = ({ item, separators }) => {
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
                    <View style={Styles.itemImgBg} />
                    <Icon name="check-circle" type="MaterialIcons" style={Styles.itemFavorite} />
                </View>
                <Text style={Styles.rating}>{postInfos.rating} / 5</Text>
                <View style={Styles.overview}>
                    <View>
                        <Text style={Styles.adTitle}>{postInfos.displayTitle}</Text>
                        <Text style={Styles.adLocation}>{postInfos.location}</Text>
                    </View>
                    <View>
                        <Text style={Styles.adPrice}>{postInfos.price}</Text>
                    </View>
                </View>
                <View style={Styles.itemRowIcon}>
                    <View style={Styles.itemLeft}>
                        <TouchableOpacity style={Styles.itemBtn} onPress={() => {
                            NavigationService.navigate('MemberAdUpdate', { postDetailConfig })
                        }}>
                            <Icon name="edit" type="FontAwesome" style={Styles.itemLeftIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={Styles.itemBtn} onPress={() => this.beforeDeletingAd(item.id)}>
                            <Icon name="trash" type="FontAwesome" style={Styles.itemLeftIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.itemRight}>
                        <Text style={Styles.itemDate}>
                          {Languages.AdPublished.postedOn}{"\n"}{postInfos.publishedDate}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
      )
    }

    keyExtractor = (item, index) => item.id.toString()

    render() {
        return <Container style={Style.bgMain}>
            <Header style={Style.navigation}>
                <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} onPress={() => {
                        NavigationService.navigate('MemberHome')
                    }}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
                <View style={Style.actionBarMiddle}>
                    <Text style={Style.actionBarText}>{Languages.Ads.myAds.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                    <Button transparent style={Style.actionBtnRight} onPress={() => {
                        NavigationService.navigate('MemberAdCreate')
                    }}>
                        <Icon active name='plus' style={Style.actionIcon} type="FontAwesome" />
                    </Button>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.section}>
                    <FlatList
                        data={this.props.ads}
                        keyExtractor={this.keyExtractor}
                        showsHorizontalScrollIndicator={false}
                        onEndReached={this.nextAds}
                        renderItem={this.renderItem}
                    />

                </View>

            </Content>

            <FooterNav />

            <Toast />
        </Container>
    }
}

const mapStateToProps = ({ user }) => {
  return {
    userId: user.profile ? user.profile.uid : null,
    ads: user.list,
    error: user.error,
    defaultCurrency: user.currency
  }
}

export default connect(mapStateToProps, { getUserAds, deleteUserAd })(Index)
