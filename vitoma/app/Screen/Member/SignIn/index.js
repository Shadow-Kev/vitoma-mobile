import { Languages, Events } from '@common';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import css from '@Screen/Member/SignIn/Style';
import { Button, Container, Content, Header, Label, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import * as firebase from "firebase"
import Toast from '@Component/Toast';
import registerForPushNotificationsAsync from '@Service/registerForPushNotification'
import { onAuthStateChanged, onFacebookLogin, setUserFullProfile } from '@redux/actions';
import { connect } from 'react-redux';
import * as Facebook from 'expo-facebook';

class SignIn extends React.Component {

    signInEmailPassword = () => {
      NavigationService.navigate('MemberSignInEmailPassword')
    }

    signInWithPhone = () => {
      NavigationService.navigate('MemberSignInWithPhone')
    }

    logInWithFacebook = async () => {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('228431151058020', {
        permissions: ['public_profile', 'email'],
      });

      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
          .then(result => {
            var user = result.user;
            var displayName = user.displayName || '';
            var profile = {
              uid: user.uid,
              email: user.email,
              phoneNumber: user.phoneNumber,
              emailVerified: user.emailVerified,
              profileURL: user.photoURL,
              displayName,
              firstName: displayName.split(' ').slice(0, -1).join(' '),
              lastName: displayName.split(' ').slice(-1).join(' '),
              disabled: false
            };

            this.props.onAuthStateChanged(profile, 'FACEBOOK')

            this.props.onFacebookLogin(profile, (data, error) => {
              if(!error) {
                this.props.setUserFullProfile(profile.uid)
              }
            })

            // Save the notification token that will be use to send display notifications
            registerForPushNotificationsAsync((pushToken) => {
              firebase.database().ref('usersMetadata/' + user.uid).set({ pushToken })
            })

            NavigationService.navigate('PublicHome')
          }).catch(error => {
            Events.toast(Languages.Auth.facebookAuthError + ' (code: 100)')
          });
      } else {
        Events.toast(Languages.Auth.facebookAuthError)
      }
    }

    render() {
      return (
        <View style={css.wrap}>
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
            <View style={css.wrapButton}>
              <TouchableOpacity
                style={[css.btnLogInDefault, css.btnLogIn, css.btnPhone]}
                onPress={this.signInWithPhone}>
                <Icon
                  name="phone-square"
                  size={22}
                  color="#fff"
                  style={css.iconButton}
                />
                <Text style={[css.btnLogInDefaultLabel, css.btnLogInText]}>{Languages.Auth.phoneNumber}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[css.btnLogInDefault, css.btnLogIn]}
                onPress={this.logInWithFacebook}>
                <Icon
                  name="facebook"
                  size={22}
                  color="#fff"
                  style={css.iconButton}
                />
                <Text style={[css.btnLogInDefaultLabel, css.btnLogInText]}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[css.btnLogInDefault, css.btnLogIn, css.btnEmailPassword]}
                onPress={this.signInEmailPassword}>
                <Icon
                  name="envelope"
                  size={22}
                  color="#CC0489"
                  style={css.iconButton}
                />
                <Text style={[css.btnLogInDefaultLabel, css.btnLogInLabel]}>{Languages.Auth.emailAdress}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Toast />
        </View>
      )
    }
}


const mapStateToProps = ({ }) => {
    return { }
}

export default connect(mapStateToProps, {
  onAuthStateChanged,
  onFacebookLogin,
  setUserFullProfile
})(SignIn)
