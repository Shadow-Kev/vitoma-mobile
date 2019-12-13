import { Languages, Events } from '@common';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import css from '@Screen/Member/ForgotPassword/Style';
import * as firebase from 'firebase';
import { Button, Container, Content, Header, Label, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, ActivityIndicator, Image, StatusBar, TextInput, ImageBackground } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import Spinkit from '@Component/Spinkit';
import Toast from '@Component/Toast';

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          email: '',
          loading: false
        }
    }

    onForgotPassword = () => {
      if(!this.state.email) {
        Events.toast(Languages.Validations['enterValidEmail'])
        return;
      }

      // Validate the emailAdress
      var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if(!emailRegExp.test(this.state.email)) {
        Events.toast(Languages.Validations['enterValidEmail'])
        return;
      }

      this.setState({ loading: true })

      firebase.auth().sendPasswordResetEmail(this.state.email)
        .then(() => {
          this.setState({ loading: false })
          Events.toast(Languages.Auth.resetPasswordEmailSended)
        }, (error) => {
          this.setState({ loading: false })
          Events.toast(Languages.Validations['unexpectedError'])
        })
    }

    render() {
      return (
        <View style={css.wrap}>
          <View style={css.body}>
            <TouchableOpacity
              style={css.backSignInBtn}
              onPress={() => NavigationService.navigate('MemberSignIn')}>
                <Icon name="chevron-left" type="FontAwesome" style={css.headerIcon} />
                <Text style={css.backSignInLabel}>{Languages.Auth.signIn}</Text>
            </TouchableOpacity>
            <View style={css.wrapTitle}>
                <Text style={css.title}>{Languages.Auth.forgotPassword}</Text>
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
            </View>

            <View style={css.wrapButton}>
              {this.state.loading ? (
                <TouchableOpacity style={css.btnLogInLoading}>
                  <Spinkit />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={css.btnLogIn} onPress={this.onForgotPassword} disabled={this.state.loading}>
                  <Text style={css.btnLogInText}> {Languages.Auth.resetPassword} </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Toast />
        </View>
      )
    }
}
