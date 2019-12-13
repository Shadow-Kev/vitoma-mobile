import { Languages, Events, Config } from '@common';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import Styles from '@Screen/Member/Profile/Style';
import css from '@Screen/Member/SignInWithPhone/Style';
import * as firebase from 'firebase';
import { Button, Text, View, Label } from 'native-base';
import React from 'react';
import { TouchableOpacity, TextInput, Platform, Linking } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import Toast from '@Component/Toast';
import { onAuthStateChanged, onPhoneLogin, changeDefaultPhoneCountryCode, setUserFullProfile } from '@redux/actions';
import { connect } from 'react-redux';
import registerForPushNotificationsAsync from '@Service/registerForPushNotification'
import * as WebBrowser from 'expo-web-browser';
import * as Expo from 'expo'
import PhoneInput from 'react-native-phone-input'

const captchaUrl = `${Config.URL.captchaUrl}/?env=${Config.URL.captchaEnv}&captcha=true&appTitle=Africauri&continueText=${Languages.Auth.continue}&platForm=${Platform.OS}&returnUrl=${Expo.Linking.makeUrl('login/phone')}`

class SignInWithPhone extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          firstName: props.phoneAuthFirstNameCache,
          lastName: props.phoneAuthLastNameCache,
          phone: '',
          code: '',
          codeSent: false
        }
    }

    componentWillUnmount() {
      Linking.removeEventListener('url', this.onBackToApp)
    }

    onUserVerified = (userInfo, data) => {
      var user = userInfo.user;
      var displayName = this.state.firstName + ' ' + this.state.lastName;
      var profile = {
        uid: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        profileURL: user.photoURL,
        displayName,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        disabled: false
      };

      this.props.onAuthStateChanged(profile, 'PHONE')

      this.props.onPhoneLogin(profile, (data, error) => {
        if(!error) {
          this.props.setUserFullProfile(profile.uid)
        }
      })

      // Save the notification token that will be use to send display notifications
      registerForPushNotificationsAsync((token) => {
        firebase.database().ref('usersMetadata/' + user.uid).set({
          pushToken: token
        })
      })

      NavigationService.navigate('PublicHome')
    }

    onVerifyCode = () => {
      const { confirmResult } = this.state;

      const code = this.state.code.trim()

      if(!code) {
        Events.toast(Languages.Auth.codeNotValid)
        return;
      }

      confirmResult.confirm(code.trim())
        .then((user) => {
          if(!user) {
            Events.toast(Languages.Auth.codeNotValid + " (code: NOT_VALID_CODE)")
            return;
          }

          this.onUserVerified(user, { user, code })
        })
        .catch((error) => Events.toast(Languages.Auth.codeNotValid + ' (code: CONFIRM_CODE)'));
    }

    authenticatePhoneNumber = async () => {
      const phone = this.state.phone.trim()
      const firstName = this.state.firstName.trim()
      const lastName = this.state.lastName.trim()

      if(!firstName) {
        Events.toast(Languages.Validations.firstNameRequired)
        return;
      }

      if(!lastName) {
        Events.toast(Languages.Validations.lastNameRequired)
        return;
      }

      if(!phone) {
        Events.toast(Languages.Validations.enterValidPhoneNumber)
        return;
      }

      Linking.removeEventListener('url', this.onBackToApp)
      Linking.addEventListener('url', this.onBackToApp)
      Linking.openURL(captchaUrl)
    }

    onBackToApp = async ({ url }) => {
      var token = null;
      const tokenEncoded = Expo.Linking.parse(url).queryParams['token']

      if (tokenEncoded)
          token = decodeURIComponent(tokenEncoded)

      if (token) {
          //fake firebase.auth.ApplicationVerifier
          const captchaVerifier = {
              type: 'recaptcha',
              verify: () => Promise.resolve(token)
          }

          const phone = this.state.phone.trim();

          try {
              const confirmResult = await firebase.auth().signInWithPhoneNumber(phone, captchaVerifier)
              this.setState({
                confirmResult,
                codeSent: true
              })
          } catch (e) {
              Events.toast(e.message)
          }

      } else {
        Events.toast(Languages.Validations.recaptchaNotVerified)
      }
    }

    phoneNumberForm = () => {
      return (
        <View style={css.body}>
          <TouchableOpacity
            style={css.backHomeBtn}
            onPress={() => NavigationService.navigate('PublicHome')}>
              <Icon name="chevron-left" type="FontAwesome" style={css.headerIcon} />
              <Text style={css.backHomeLabel}>{Languages.Home.home}</Text>
          </TouchableOpacity>
          <View style={css.wrapTitle}>
              <Text style={css.title}>{Languages.Auth.loginToYourAccount}</Text>
          </View>
          <View style={css.wrapForm}>
            <View style={css.textInputWrapInline}>
              <View style={[css.textInputTwoCol, css.textInputWrap]}>
                <Text style={css.textLabel}>{Languages.Auth.firstName}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  value={this.state.firstName}
                  onChangeText={(firstName) => this.setState({ firstName })}
                />
              </View>
              <View style={[css.textInputTwoCol, css.textInputWrap]}>
                <Text style={css.textLabel}>{Languages.Auth.lastName}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  value={this.state.lastName}
                  onChangeText={(lastName) => this.setState({ lastName })}
                />
              </View>
            </View>
            <View style={[ { marginTop: 10, marginBottom: 10, paddingBottom: 10, borderBottomColor: '#CC0489', borderBottomWidth: 2 }]}>
              <Label style={[css.textLabel, {marginBottom: 10}]}>{Languages.Auth.phoneNumber}</Label>
              <PhoneInput
                ref='phone'
                value={this.state.phone || ''}
                cancelText={Languages.Shared.cancel}
                confirmText={Languages.Shared.confirm}
                initialCountry={this.props.phoneCountryCode}
                onSelectCountry={(code) => this.props.changeDefaultPhoneCountryCode(code)}
                onChangePhoneNumber={(phone) => {
                  this.setState({ phone })
                }}/>
            </View>
          </View>
          <View style={css.wrapButton}>
            <TouchableOpacity style={css.btnLogIn} onPress={this.authenticatePhoneNumber}>
              <Text style={css.btnLogInText}> {Languages.Auth.signIn} </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    verifyCodeForm = () => {
      return (
        <View style={css.body}>
          <TouchableOpacity
            style={css.backHomeBtn}
            onPress={() => this.setState({ codeSent: false })}>
              <Icon name="chevron-left" type="FontAwesome" style={css.headerIcon} />
              <Text style={css.backHomeLabel}>{Languages.Auth.phoneNumber}</Text>
          </TouchableOpacity>
          <View style={css.wrapTitle}>
              <Text style={css.title}>{Languages.Auth.enterVerificationCode}</Text>
          </View>
          <View style={css.wrapForm}>
            <View style={css.textInputWrap}>
              <Text style={css.textLabel}>{Languages.Auth.enterCode}</Text>
              <TextInput
                placeholder={Languages.Auth.code}
                underlineColorAndroid="transparent"
                style={css.textInput}
                keyboardType='numeric'
                value={this.state.code}
                onChangeText={(code) => this.setState({ code })}
              />
            </View>
          </View>
          <View style={css.wrapButton}>
            <TouchableOpacity style={css.btnLogIn} onPress={this.onVerifyCode}>
              <Text style={css.btnLogInText}> {Languages.Auth.verify} </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    render() {
      return (
        <View style={css.wrap}>
          { !this.state.codeSent && this.phoneNumberForm() }
          { this.state.codeSent && this.verifyCodeForm() }
          <Toast />
        </View>
      )
    }
}

const mapStateToProps = ({ user }) => {
    return {
      phoneCountryCode: user.phoneCountryCode,
      phoneAuthFirstNameCache: user.phoneAuthFirstNameCache,
      phoneAuthLastNameCache: user.phoneAuthLastNameCache
    }
}

export default connect(mapStateToProps, {
  onAuthStateChanged,
  onPhoneLogin,
  changeDefaultPhoneCountryCode,
  setUserFullProfile
})(SignInWithPhone)
