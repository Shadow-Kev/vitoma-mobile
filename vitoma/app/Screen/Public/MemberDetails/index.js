import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Public/MemberDetails/Style';
import SendMsgForm from '@Component/SendMsgForm';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Icon, List, ListItem, Tab, Tabs, Text, View } from 'native-base';
import React from 'react';
import { FlatList, Image, ImageBackground, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { Languages, Tools, Constants } from '@common';
import { connect } from 'react-redux';
import { getMemberDetails } from '@redux/actions';

class Index extends React.Component {

    componentWillMount() {
      const { state } = this.props.navigation
      const member = state.params.member

      this.page = 1;
      this.props.getMemberDetails(member.id, this.props.defaultCurrency)
    }

    getAdsPublishedMessage = () => {
      let msg = Languages.Members.noAdPublished

      const nbAds = this.props.memberDetails && this.props.memberDetails.ads ?
                      this.props.memberDetails.ads.length : 0;

      if(nbAds == 1)
        msg = Languages.Members.oneAdPublised
      else if (nbAds > 1)
        msg = nbAds + ' ' + Languages.Members.adsPublished

      return msg;
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
                <Text style={Styles.itemLocation}>{postInfos.location}</Text>
                <Text style={Styles.itemPrice}>{postInfos.price}</Text>
                <View style={Styles.itemPosted}>
                    <Icon name="calendar" type="FontAwesome" style={Styles.itemIcon} />
                    <Text style={Styles.itemDate}>{postInfos.publishedDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
      )
    }

    nextPosts = () => {
      // TODO - fetch the next members ads and scroll the the flatlist container
      this.page += 1
    }

    render() {
        const memberDetails = this.props.memberDetails
        const firstName = memberDetails.firstName || '';
        const lastName = memberDetails.lastName || '';

        return <Container style={Style.bgMain}>
            <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.profile}>
                    <ImageBackground source={require('@Asset/images/bg_main.png')} imageStyle={'cover'} style={Styles.coverImg} />
                    <View style={Styles.owner}>
                        <Image source={{ uri: Tools.getImage([memberDetails.media], Constants.PostImage.small) }} style={Styles.ownerAvatarImg} />
                        <View style={Styles.ownerInfo}>
                            <Text style={Styles.ownerName}>{firstName + ' ' + lastName}</Text>
                            <Text style={Styles.ownerLocation}>{this.getAdsPublishedMessage()}</Text>
                        </View>
                    </View>

                    <View style={[Styles.back, Style.actionBarIn]}>
                        <Button transparent style={Style.actionBarBtn} onPress={() => {
                            NavigationService.navigate('PublicMembers')
                        }}>
                            <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                        </Button>
                    </View>
                </View>

                <Tabs tabBarUnderlineStyle={Styles.tabBorder}>
                    <Tab
                      tabStyle={Styles.tabGrey}
                      textStyle={Styles.tabTextActive}
                      activeTabStyle={Styles.tabGrey}
                      activeTextStyle={Styles.tabTextActive}
                      heading={Languages.Members.memberAds}>
                        <View style={Styles.overview}>

                            <FlatList
                                data={memberDetails.ads || []}
                                keyExtractor={(item, index) => 'member-ads-' + index}
                                showsHorizontalScrollIndicator={false}
                                renderItem={this.renderItem}
                                onEndReached={this.nextPosts}
                            />

                        </View>
                    </Tab>
                    <Tab tabStyle={Styles.tabGrey} textStyle={Styles.tabText} activeTabStyle={Styles.tabGrey} activeTextStyle={Styles.tabText} heading="Message">
                      <SendMsgForm recipientUserId={memberDetails.uuid}/>
                    </Tab>
                    <Tab tabStyle={Styles.tabGrey} textStyle={Styles.tabText} activeTabStyle={Styles.tabGrey} activeTextStyle={Styles.tabText} heading="Contact">
                        <List style={Styles.infoTab}>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="map-marker-radius" type="MaterialCommunityIcons" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Members.address.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{memberDetails.address || '---'}</Text>
                                </View>
                            </ListItem>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="phone" type="FontAwesome" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Members.phoneNumber.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{memberDetails.phone || '---'}</Text>
                                </View>
                            </ListItem>
                            <ListItem style={Styles.infoItem}>
                                <Icon name="mail" type="Entypo" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Members.email.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{memberDetails.email || '---'}</Text>
                                </View>
                            </ListItem>
                            <ListItem style={[Styles.infoItem, Styles.infoItemLast]}>
                                <Icon name="web" type="MaterialCommunityIcons" style={Styles.infoIcon} />
                                <View>
                                    <Text style={Styles.infoHeader}>{Languages.Members.webSite.toUpperCase()}</Text>
                                    <Text style={Styles.infoDesc}>{memberDetails.webSite || '---'}</Text>
                                </View>
                            </ListItem>
                        </List>
                    </Tab>
                </Tabs>


            </Content>

            <FooterNav />

        </Container>
    }
}

const mapStateToProps = ({ bookmarks, member, user}) => {
  return {
    memberDetails: member.memberDetails || {},
    bookmarks: bookmarks.list,
    defaultCurrency: user.currency
  }
}

export default connect(mapStateToProps, { getMemberDetails })(Index)
