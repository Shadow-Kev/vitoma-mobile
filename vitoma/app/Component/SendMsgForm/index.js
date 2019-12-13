import { Languages, Events, Tools } from '@common';
import Styles from '@Component/SendMsgForm/Style';
import Toast from '@Component/Toast';
import NavigationService from '@Service/Navigation';
import { Button, Icon, Text, View, Label } from 'native-base';
import React from 'react';
import { Alert, TextInput } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from "firebase"
import { setUserFullProfile, changeDefaultPhoneCountryCode } from "@redux/actions"
import PhoneInput from 'react-native-phone-input'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          picture: null,
          message: '',
          disabledFirstName: false,
          disabledLastName: false,
          disabledPhoneNumber: false
        };

        this.sendMessageToastToken = 'SEND_MESSAGE_TOAST_TOKEN';
    }

    componentWillMount() {
      this.fetchProfile()
    }

    fetchProfile = () => {
      if(!this.props.currentUserId)
        return;

      this.props.setUserFullProfile(this.props.currentUserId, (data) => {
        let result = (data && data.result) ? data.result : []
        data =  result.length ? result[0] : {}

        // Init the user data to display
        var userData = this.props.fullProfile || data

        if(userData && this.props.isConnected) {
          const { firstName, lastName, phone, media } = userData;
          this.setState({
            firstName,
            lastName,
            phoneNumber: phone,
            picture: media ? Tools.getImage([media]) : null,
            disabledFirstName: (firstName && firstName.length != 0),
            disabledLastName: (lastName && lastName.length != 0),
            disabledPhoneNumber: (phone && phone.length != 0)
          })
        }
      })
    }

    notConnectedAlert = () => {
      Alert.alert(
        Languages.Auth.authInfo,
        Languages.Auth.needToBeLogInToSendMessage,
        [
          {
            text: Languages.Auth.goBack,
            onPress: () => {}
          },
          {
            text: Languages.Auth.signIn,
            onPress: () => {
              NavigationService.navigate('MemberSignIn')
            }
          },
        ],
        { cancelable: false }
      )
    }

    onSendEmail = () => {
      if(!(this.props.isConnected && this.props.currentUserId)) {
        this.notConnectedAlert()
        return;
      }

      if(this.props.currentUserId === this.props.recipientUserId) {
        this.displayToast(Languages.SendMsgForm.cannotSendMessageToYourself)
        return;
      }

      if(!this.state.firstName) {
        this.displayToast(Languages.Validations.firstNameRequired)
        return;
      }

      if(!this.state.lastName) {
        this.displayToast(Languages.Validations.lastNameRequired)
        return;
      }

      var phoneNumber = this.state.phoneNumber || ''
      phoneNumber = phoneNumber.trim()

      if(phoneNumber.length < 8) {
        this.displayToast(Languages.Validations.enterValidPhoneNumber)
        return;
      }

      if(!this.state.message) {
        this.displayToast(Languages.Validations.messageRequired)
        return;
      }

      var messageData = {
        from: this.props.currentUserId,
        fullName: this.state.firstName.trim() + ' ' + this.state.lastName.trim(),
        message: this.state.message.trim(),
        picture: this.state.picture,
        date: new Date().toUTCString(),
        active: true
      }

      var messagesRef = firebase.database().ref('messages/' + this.props.recipientUserId)
      var newMessageRef = messagesRef.push()

      newMessageRef.set(messageData, (error) => {
        if(error) {
          switch (error.code) {
            case 'PERMISSION_DENIED':
              this.displayToast(Languages.Validations.recentConnexionRequired)
              break;
            default:
              this.displayToast(Languages.Validations.messageNotSended)
          }
        } else {
          this.displayToast(Languages.Validations.messageSuccesfullySended)
          this.sendMessageNotification(messageData)
        }
      });
    }

    sendMessageNotification = (messageData) => {
      messageData.type = 'NEW_MESSAGE'
      firebase.database().ref('/usersMetadata/' + this.props.recipientUserId)
      .once('value')
      .then((snapshot) => {
        if(!snapshot)
          return;

        var metadata = snapshot.val()
        if(metadata && metadata.pushToken)
          Tools.sendMessageNotification({
            token: metadata.pushToken,
            title: Languages.SendMsgForm.youHaveAMsg,
            body: messageData.message,
            data: messageData
          })
      });
    }

    displayToast = (message) => {
      Events.toast(message, 4000, this.sendMessageToastToken)
    }

    render() {
        return (
          <View style={Styles.formBg}>
              <View style={[ { marginTop: 10, marginBottom: 10, paddingBottom: 10, borderBottomColor: '#E8BB03', borderBottomWidth: 2 }]}>
                <Label style={[Styles.label, {marginBottom: 10}]}>{Languages.SendMsgForm.yourMobile}</Label>
                <PhoneInput
                  ref='phone'
                  value={this.state.phoneNumber || ''}
                  disabled={this.state.disabledPhoneNumber}
                  cancelText={Languages.Shared.cancel}
                  confirmText={Languages.Shared.confirm}
                  initialCountry={this.props.phoneCountryCode}
                  onSelectCountry={(code) => this.props.changeDefaultPhoneCountryCode(code)}
                  onChangePhoneNumber={(phoneNumber) => {
                    this.setState({ phoneNumber })
                  }}/>
              </View>

              <View style={Styles.col}>
                  <TextInput
                    style={Styles.textInputHalf}
                    placeholder={Languages.SendMsgForm.firstName}
                    maxLength={15}
                    editable={!this.state.disabledFirstName}
                    value={this.state.firstName}
                    onChangeText={(firstName) => this.setState({ firstName })}/>

                  <TextInput
                    style={Styles.textInputHalf}
                    placeholder={Languages.SendMsgForm.lastName}
                    maxLength={15}
                    editable={!this.state.disabledLastName}
                    value={this.state.lastName}
                    onChangeText={(lastName) => this.setState({ lastName })}/>
              </View>

              <TextInput
                style={Styles.textInputMulti}
                multiline={true}
                numberOfLines={8}
                placeholder={Languages.SendMsgForm.yourMessage}
                value={this.state.message}
                onChangeText={(message) => this.setState({ message })}/>

              <Button style={Styles.btn} onPress={this.onSendEmail}>
                  <Text style={Styles.formBtnText}>{Languages.SendMsgForm.send.toUpperCase()}</Text>
                  <Icon active name='envelope' type="FontAwesome" style={Styles.formBtnIcon} />
              </Button>

              <Toast token={this.sendMessageToastToken}/>
          </View>
        )
    }
}

const mapStateToProps = ({ user }) => {
  var userData = {
    fullProfile: user.fullProfile,
    currentUserId: user.profile ? user.profile.uid : '',
    isConnected: (user.profile != null),
    phoneCountryCode: user.phoneCountryCode
  }

  return userData
}
export default connect(mapStateToProps, { setUserFullProfile, changeDefaultPhoneCountryCode })(Index)
