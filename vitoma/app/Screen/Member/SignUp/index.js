import { Languages, Events, Config, Logger } from '@common';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import css from '@Screen/Member/SignUp/Style';
import * as firebase from 'firebase';
import { Button, Container, Content, Header, Label, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, ActivityIndicator, Image, StatusBar, TextInput, ImageBackground } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import Spinkit from '@Component/Spinkit';
import Toast from '@Component/Toast';

export default class SignUp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          email: '',
          password: '',
          confirmPassword: '',
          loading: false
        }
    }

    signUp = () => {
      if(!(this.state.email && this.state.password && this.state.confirmPassword)) {
        Events.toast(Languages.Validations['invalidEmailPassword'])
        return;
      }

      // Validate the emailAdress
      var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if(!emailRegExp.test(this.state.email)) {
        Events.toast(Languages.Validations['enterValidEmail'])
        return;
      }

      var passwordRegExp = /[A-Z]+/
      if(!(this.state.password.length >= 6 && passwordRegExp.test(this.state.password))) {
        Events.toast(Languages.Validations['invalidPassword'])
        return;
      }

      if(this.state.password !== this.state.confirmPassword) {
        Events.toast(Languages.Validations['invalidConfirmPassword'])
        return;
      }

      this.setState({ loading: true })

      var url = Config.URL.entryPoint + '/members/create';

      var options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      }

      fetch(url, options)
        .then(
          (response) => {
            return response.json()
          },
        ).then(
          (data) => {
            if(data && data.status == 'SUCCESS') {
              this.setState({ loading: false })
              NavigationService.navigate('MemberSignIn')
            } else {
              this.setState({ loading: false })
              Events.toast(Languages.Validations['invalidEmailPassword'])
            }
          }
        ).catch(error => {
          this.setState({ loading: false })
          Events.toast(Languages.Validations['invalidEmailPassword'])
          Logger.log({ ...error, url, options, file: "Screen/Member/SignUp/index.js" });
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
                <Text style={css.title}>{Languages.Auth.newUserSignUp}</Text>
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

              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>{Languages.Auth.confirmPassword}</Text>
                <TextInput
                  placeholder={Languages.Auth.confirmPassword}
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  textContentType='password'
                  secureTextEntry={true}
                  onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                />
              </View>
            </View>

            <View style={css.wrapButton}>
              {this.state.loading ? (
                <TouchableOpacity style={css.btnLogInLoading}>
                  <Spinkit />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={css.btnLogIn} onPress={this.signUp} disabled={this.state.loading}>
                  <Text style={css.btnLogInText}> {Languages.Auth.signUp} </Text>
                </TouchableOpacity>
              )}

              <View style={css.redirectBtn}>
                  <Button transparent onPress={() => {
                      NavigationService.navigate('MemberSignIn')
                  }}>
                      <Text style={css.textLabel}>{Languages.Auth.doYouHaveAnAccount + ' ' + Languages.Auth.signIn}</Text>
                  </Button>
              </View>
            </View>
          </View>
          <Toast />
        </View>
      )
    }
}
