import { Languages, Events } from '@common';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import css from '@Screen/Member/SignIn/Style';
import * as firebase from 'firebase';
import { Button, Container, Content, Header, Label, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, ActivityIndicator, Image, StatusBar, TextInput, ImageBackground } from 'react-native';
import { onAuthStateChanged, setUserFullProfile } from '@redux/actions';
import { connect } from 'react-redux';
import Icon from '@expo/vector-icons/FontAwesome';
import Spinkit from '@Component/Spinkit';
import Toast from '@Component/Toast';
import registerForPushNotificationsAsync from '@Service/registerForPushNotification'

class SignInEmailPassword extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          email: '',
          password: '',
          loading: false
        }
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
           if(user) {
                if(user.emailVerified) {
                    this.props.onAuthStateChanged(user)
                    this.props.setUserFullProfile(user.uid)

                    // Save the notification token that will be use to send display notifications
                    registerForPushNotificationsAsync((token) => {
                      firebase.database().ref('usersMetadata/' + user.uid).set({
                        pushToken: token
                      })
                    })

                    NavigationService.navigate('PublicHome')
                } else {
                    firebase.auth().signOut();
                    Events.toast(Languages.Validations['emailNotVerified'])
                }
           }
        });
    }

    signIn = () => {
      if(!(this.state.email && this.state.password)) {
        Events.toast(Languages.Validations['invalidEmailPassword'])
        return;
      }

      // Validate the emailAdress
      var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if(!emailRegExp.test(this.state.email)) {
        Events.toast(Languages.Validations['enterValidEmail'])
        return;
      }

      this.setState({ loading: true })

      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          this.setState({ loading: false })
        }, (error) => {
          this.setState({ loading: false })
          Events.toast(Languages.Validations['invalidEmailPassword'])
        })
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
            <View style={css.wrapForm}>
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>{Languages.Auth.emailAdress}</Text>
                <TextInput
                  placeholder={Languages.Auth.emailAdress}
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  keyboardType='email-address'
                  onChangeText={(email) => this.setState({ email })}
                />
              </View>

              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>{Languages.Auth.password}</Text>
                <TextInput
                  placeholder={Languages.Auth.password}
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  textContentType='password'
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({ password })}
                />
              </View>
            </View>

            <View style={css.wrapButton}>
              {this.state.loading ? (
                <TouchableOpacity style={css.btnLogInLoading}>
                  <Spinkit />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={css.btnLogIn} onPress={this.signIn} disabled={this.state.loading}>
                  <Text style={css.btnLogInText}> {Languages.Auth.signIn} </Text>
                </TouchableOpacity>
              )}

              <View style={css.redirectBtn}>
                  <Button transparent onPress={() => {
                      NavigationService.navigate('MemberForgotPassword')
                  }}>
                    <Text style={css.textLabel}>{Languages.Auth.forgotPassword}</Text>
                  </Button>
              </View>

              <View style={css.redirectBtn}>
                  <Button transparent onPress={() => {
                      NavigationService.navigate('MemberSignUp')
                  }}>
                      <Text style={css.textLabel}>{Languages.Auth.donotHaveAnAccount}</Text>
                  </Button>
              </View>
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
  setUserFullProfile
})(SignInEmailPassword)
