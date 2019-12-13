import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Member/Messages/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Text } from 'native-base';
import React from 'react';
import { Alert, FlatList, Image, ImageBackground, StatusBar, TouchableHighlight, View } from 'react-native';
import { connect } from "react-redux"
import * as firebase from "firebase"
import moment from 'moment'
import { Languages } from '@common'

class Index extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          messages: [],
          canShowEmptyMessage: false
        }
    }

    componentWillMount() {
      if(!(this.props.profile && this.props.profile.uid))
        return;

      // Subscribe to messages data changes
      this.messagesRef = firebase.database().ref('messages/' + this.props.profile.uid);
      this.messagesRef.on('value', this.onSnapshot);

      this.canShowEmptyMessageTimer = setTimeout(() => {
        this.setState({ canShowEmptyMessage: true })
        this.canShowEmptyMessageTimer = 0;
      }, 2000);
    }

    componentWillUnmount() {
      if(this.messagesRef)
        this.messagesRef.off('value', this.onSnapshot)

      if(this.canShowEmptyMessageTimer)
        clearTimeout(this.canShowEmptyMessageTimer);
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

      this.setState({ messages: messages.reverse() })
    }

    beforeDeletingMessage = (messageId) => {
      Alert.alert(
        Languages.Messages.warning,
        Languages.Messages.warningDeleteMessage,
        [
          {text: Languages.Messages.no, onPress: () => console.log('Cancel Pressed'), style: 'no'},
          {text: Languages.Messages.yes, onPress: () => {
            this.deleteMessage(messageId)
          }, style: 'yes'},
        ],
        { cancelable: true }
      )
    }

    beforeDeletingAllMessages = () => {
      Alert.alert(
        Languages.Messages.warning,
        Languages.Messages.warningDeleteAllMessages,
        [
          {text: Languages.Messages.no, onPress: () => console.log('Cancel Pressed'), style: 'no'},
          {text: Languages.Messages.yes, onPress: () => {
            this.deleteAllMessages()
          }, style: 'yes'},
        ],
        { cancelable: true }
      )
    }


    deleteMessage = (messageId) => {
      firebase.database()
      .ref('messages/' + this.props.profile.uid + '/' + messageId)
      .update({ active: false })
    }

    deleteAllMessages = () => {
      firebase.database().ref('/messages/' + this.props.profile.uid)
      .once('value')
      .then((snapshot) => {
        var messages = snapshot.val() || {};
        // delete all user messages by changing their active status to false.
        Object.keys(messages).forEach(id => this.deleteMessage(id));
      });
    }

    keyExtractor = (item, index) => ('msg-' + index)

    render() {
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
                    <Text style={Style.actionBarText}>{'Messages'.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                  {
                    this.state.messages.length >= 2 &&
                    <Button transparent style={Style.actionBtnRight} onPress={() => this.beforeDeletingAllMessages()}>
                        <Icon active name='trash' style={Style.actionIcon} type="FontAwesome" />
                    </Button>
                  }
                </View>
            </Header>

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                    <View style={Styles.section}>
                        <FlatList
                            data={this.state.messages}
                            style={Styles.item}
                            keyExtractor={this.keyExtractor}
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
                                          <Image
                                            source={require('@Asset/images/avatar_green.png')}
                                            style={Styles.itemImg} />
                                        }

                                        <View style={Styles.itemInfo}>
                                            <Text style={Styles.itemTitle}>{item.fullName}</Text>
                                            <Text style={Styles.itemDesc}>{item.message}</Text>
                                        </View>
                                        <View style={Styles.itemRight}>
                                          <Text style={Styles.itemDate}>{item.date}</Text>
                                          <Button transparent onPress={() => this.beforeDeletingMessage(item.id)}>
                                              <Icon active name='trash' style={Styles.trash} type="FontAwesome" />
                                          </Button>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )}
                        />
                    </View>

                    {
                      (this.state.canShowEmptyMessage && !this.state.messages.length) &&
                      <View style={Styles.noResultContainer}>
                        <Text>{Languages.Messages.noMessages}</Text>
                      </View>
                    }
            </Content>

            <FooterNav />

        </Container>
    }
}

export default connect(({ user }) => {
  return {
    profile: user.profile || {}
  }
}, { })(Index)
