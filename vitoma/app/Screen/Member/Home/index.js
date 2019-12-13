import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Member/Home/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Right, Text, View } from 'native-base';
import React from 'react';
import { FlatList, Image, ImageBackground, StatusBar, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Languages } from "@common"
import { connect } from "react-redux"
import * as firebase from "firebase"
import moment from 'moment'

class Index extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
          messages: [],
          picture: null
        }
    }

    componentWillMount() {
      if(!(this.props.profile && this.props.profile.uid))
        return;

      // Subscribe to messages data changes
      this.messagesRef = firebase.database().ref('messages/' + this.props.profile.uid);
      this.messagesRef.on('value', this.onSnapshot);
    }

    componentWillUnmount() {
      if(this.messagesRef)
        this.messagesRef.off('value', this.onSnapshot)
    }

    onSnapshot = (snapshot) => {
      var messages = snapshot.val()

      if(messages)
        messages = Object.keys(messages)
        .filter(id => messages[id].active)
        .map(id => {
          var message = messages[id]
          message.id = id
          message.date = moment(message.date).format('YYYY-MM-DD | hh:mm')

          return message
        })
      else
        messages = []

      this.setState({ messages: messages.reverse().slice(0, 3) })
    }

    render() {
        return <Container style={Style.bgMain}>
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
                    <Text style={Style.actionBarText}>{''.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.section}>
                    <ImageBackground source={require('@Asset/images/bg_in.png')} imageStyle={'cover'} style={Styles.crv}>

                        <View style={Styles.profile}>
                            <View>
                                <Text style={Styles.profileName}>
                                  {Languages.UserProfile.hi + ' ' +  this.props.fullName.toUpperCase()}
                                </Text>
                                {
                                  this.props.creationTime  &&
                                  <Text style={Styles.profileLocation}>
                                    {Languages.UserProfile.memberSince + ' ' + moment(this.props.creationTime).format('YYYY-MM-DD')}
                                  </Text>
                                }
                            </View>
                        </View>

                        <View style={Styles.btnLayout}>
                            <TouchableOpacity style={Styles.btnBox} onPress={() => {
                                NavigationService.navigate('PublicHome')
                            }}>
                                <Text style={Styles.btnText}>{Languages.SideMenu.home}></Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.btnBox} onPress={() => {
                                NavigationService.navigate('MemberAds')
                            }}>
                                <Image source={require('@Asset/images/btn-ads.png')} resizeMode={'cover'} style={Styles.btnImg} />
                                <Text style={Styles.btnText}>{Languages.SideMenu.myAds}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.btnBox} onPress={() => {
                                NavigationService.navigate('MemberMessages')
                            }}>
                                <Image source={require('@Asset/images/btn-message.png')} style={Styles.btnImg} />
                                <Text style={Styles.btnText}>{Languages.SideMenu.messages}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.btnBox} onPress={() => {
                                NavigationService.navigate('MemberProfile')
                            }}>
                                <Image source={require('@Asset/images/btn-jobs.png')} style={Styles.btnImg} />
                                <Text style={Styles.btnText}>{Languages.SideMenu.profile}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.btnBoxBot} onPress={() => {
                                NavigationService.navigate('MemberBookmark')
                            }}>
                                <Image source={require('@Asset/images/btn-bookmark.png')} style={Styles.btnImg} />
                                <Text style={Styles.btnText}>{Languages.SideMenu.bookmark}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.btnBoxBot} onPress={() => {
                                NavigationService.navigate('MemberSettings')
                            }}>
                                <Image source={require('@Asset/images/btn-services.png')} style={Styles.btnImg} />
                                <Text style={Styles.btnText}>{Languages.SideMenu.settings}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={Styles.btnBox} onPress={() => {
                                NavigationService.navigate('PublicHome')
                            }}>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                    <View style={Styles.message}>
                        <View style={Styles.headerBg}>
                            <Icon name="envelope" type="FontAwesome" style={Styles.headerIcon} />
                            <Text style={Styles.sHeader}>{Languages.Home.recentMessages.toUpperCase()}</Text>
                            <Right>
                                <Button small rounded transparent onPress={() => { NavigationService.navigate('MemberMessages') }}>
                                    <Image source={require('@Asset/images/dot.png')} />
                                </Button>
                            </Right>
                        </View>
                        <FlatList
                            data={this.state.messages}
                            style={Styles.item}
                            keyExtractor={(item, index) => 'msg-' + index}
                            renderItem={({ item, separators }) => (
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => {
                                        NavigationService.navigate('PublicMemberDetails', { member: { id: item.from } })
                                    }}>
                                    <View style={Styles.record}>
                                        {
                                          item.picture &&
                                          <Image source={{ uri: item.picture }} style={Styles.itemImg} />
                                        }
                                        {
                                          !item.picture &&
                                          <Image source={require('@Asset/images/avatar_green.png')} style={Styles.itemImg} />
                                        }
                                        <View style={Styles.itemInfo}>
                                            <Text style={Styles.itemTitle}>{item.fullName}</Text>
                                            <Text style={Styles.itemDesc}>{item.message}</Text>
                                        </View>
                                        <Text style={Styles.itemDate}>{item.date}</Text>
                                    </View>
                                </TouchableHighlight>
                            )}
                        />
                    </View>

                </View>

            </Content>

            <FooterNav />

        </Container>
    }
}

export default connect(({ user }) => {
  const data = user.fullProfile || {}
  return {
    fullName: data ? (data.fullName || '') : '',
    creationTime: user.creationTime ? user.creationTime : '',
    profile: user.profile
  }
}, { })(Index)
