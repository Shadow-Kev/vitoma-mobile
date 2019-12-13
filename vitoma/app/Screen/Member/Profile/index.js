import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Member/Profile/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Accordion, Button, Container, Content, Icon, Text, View, Label } from 'native-base';
import React from 'react';
import { Dimensions, Image, ImageBackground, Picker, StatusBar, TextInput } from 'react-native';
import { Languages, Events, Config, Tools, Logger } from "@common"
import { setUserFullProfile, changeDefaultPhoneCountryCode } from "@redux/actions"
import { connect } from "react-redux"
import * as firebase from "firebase"
import Toast from '@Component/Toast';
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import PhoneInput from 'react-native-phone-input'

//const {width, height} = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.initialState = {
          firstName: '',
          lastName: '',
          gender: '',
          aboutYou: '',

          address: '',
          city: '',
          region: '',
          country: '',
          postalCode: '',

          phone: '',
          webSite: '',

          picture: null,

          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }

        this.state = this.initialState

        this.renderAccordionHeader = this.renderAccordionHeader.bind(this)
        this.renderAccordionContent = this.renderAccordionContent.bind(this)
        this.renderAccordionContentBasic = this.renderAccordionContentBasic.bind(this)
        this.renderAccordionContentAddress = this.renderAccordionContentAddress.bind(this)
        this.renderAccordionContentContact = this.renderAccordionContentContact.bind(this)
        this.renderAccordionContentChangePassword = this.renderAccordionContentChangePassword.bind(this)
    }

    componentWillMount() {
      if(!(this.props.profile && this.props.profile.uid))
        return;

      this.props.setUserFullProfile(this.props.profile.uid, (data) => {
        let result = (data && data.result) ? data.result : []
        data =  result.length ? result[0] : {}

        // Init the user data to display
        var userData = this.props.fullProfile || data

        if(userData.media)
          userData.picture = Tools.getImage([userData.media])

        this.setState({ ...userData })
      })
    }

    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateAndRetrieveDataWithCredential(cred);
    }

    updateBasicInformations = () => {
      if(!this.state.firstName) {
        Events.toast(Languages.Validations.firstNameRequired)
        return;
      }

      if(!this.state.lastName) {
        Events.toast(Languages.Validations.lastNameRequired)
        return;
      }

      this.setUserAttributes({
        firstName: this.state.firstName.trim(),
        lastName: this.state.lastName.trim(),
        fullName: this.state.firstName.trim() + " " + this.state.lastName.trim(),
        gender: this.state.gender,
        aboutYou: this.state.aboutYou.trim()
      })
    }


    updateAddressInformations = () => {
      this.setUserAttributes({
        address: this.state.address.trim(),
        city: this.state.city.trim(),
        region: this.state.region.trim(),
        country: this.state.country.trim(),
        postalCode: this.state.postalCode.trim(),
      })
    }

    updateContactInformations = () => {
      var phoneNumber = this.state.phone.trim()

      if(!phoneNumber || phoneNumber.indexOf('+') < 0) {
        Events.toast(Languages.Validations.enterValidPhoneNumber)
        return;
      }

      this.setUserAttributes({
        phone: phoneNumber,
        webSite: this.state.webSite.trim()
      })
    }

    updatePassword = () => {
      var oldPassword = this.state.oldPassword
      var newPassword = this.state.newPassword
      var confirmPassword = this.state.confirmPassword

      if(!oldPassword) {
        Events.toast(Languages.Validations.invalidPassword)
        return;
      }

      var passwordRegExp = /[A-Z]+/
      if(!(newPassword.length >= 6 && passwordRegExp.test(newPassword))) {
        Events.toast(Languages.Validations.invalidPassword)
        return;
      }

      if(newPassword !== confirmPassword) {
        Events.toast(Languages.Validations.invalidConfirmPassword)
        return;
      }

      this.reauthenticate(oldPassword).then(() => {
        var user = firebase.auth().currentUser;

        user.updatePassword(newPassword).then(() => {
            Events.toast(Languages.Validations.modificationPerformed)
        }).catch((error) => {
            Events.toast(Languages.Validations.unexpectedError)
        });
      }).catch((error) => {
          Events.toast(Languages.Validations.invalidCurrentPassword)
      });
    }

    pickImage = async () => {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera roll
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            });

            this.updatePicture(pickerResult);
        }
    };

    updatePicture = async (pickerResult) => {
        if(pickerResult.cancelled) return;

        var form = new FormData();

        // Add the picture to the form data
        let extension = this.getImageExtension(pickerResult.uri)
        form.append('photo', {
            uri: pickerResult.uri,
            name: 'photo.' + extension,
            type: `image/${extension}`
        })

        var options = {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'multipart/form-data' }),
            body: form
        };

        var url = Config.URL.entryPoint + '/members/' + this.props.profile.uid + '/updateUserProfile';

        fetch(url, options)
            .then(
                (response) => {
                    return response.json()
                },
            ).then(
                (data) => {
                    if(data && data.status == 'SUCCESS') {
                        Events.toast(Languages.Validations.modificationPerformed)

                        this.setState({ picture: pickerResult.uri });
                    } else {
                        Events.toast(Languages.Validations.unexpectedError)
                    }
                }
            ).catch(error => {
                Events.toast(Languages.Validations.unexpectedError)
                Logger.log({ ...error, url, options })
            });
    };

    getImageExtension = (file) => {
        let extension = 'jpeg', _;

        [ _, extension ] = file.match(/\.(\w+)$/);

        return extension;
    }

    setUserAttributes = (attributes, callback) => {
      if(!this.props.profile.uid)
        return;

      // delete password attributes
      var userData = {
        ...this.state,
        ...attributes
      }
      delete userData.oldPassword
      delete userData.newPassword
      delete userData.confirmPassword
      delete userData.picture
      delete userData.media

      var url = Config.URL.entryPoint + '/members/' + this.props.profile.uid + '/update';

      var options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      }

      fetch(url, options)
        .then(
          (response) => {
            return response.json()
          },
        ).then(
          (data) => {
            if(data && data.status == 'SUCCESS') {
              Events.toast(Languages.Validations.modificationPerformed)
            } else {
              Events.toast(Languages.Validations.unexpectedError)
            }
          }
        ).catch(error => {
            Events.toast(Languages.Validations.unexpectedError)
            Logger.log({ ...error, url, options })
        })
    }

    renderAccordionHeader(item, expanded) {
        return (
            <View style={Styles.accordionTab}>
                <Text style={Styles.accordionTabText}>
                    {" "}{item.title}
                </Text>
                {expanded
                    ? <Icon style={Styles.accordionTabIcon} name="keyboard-arrow-down" type="MaterialIcons" />
                    : <Icon style={Styles.accordionTabIcon} name="keyboard-arrow-right" type="MaterialIcons" />}
            </View>
        );
    }

    renderAccordionContent(item) {
        var fn = 'renderAccordionContent' + (item.type.charAt(0).toUpperCase() + item.type.substr(1));
        return <View style={Styles.accordionContent}>
            {this[fn]()}
        </View>
    }

    renderAccordionContentBasic() {
        return <View>
            <View style={Styles.col}>
                <TextInput
                  style={Styles.textInputHalf}
                  value={this.state.firstName}
                  maxLength={15}
                  placeholder={Languages.UserProfile.firstName}
                  onChangeText={(firstName) => this.setState({ firstName })} />
                <TextInput
                  style={Styles.textInputHalf}
                  value={this.state.lastName}
                  maxLength={15}
                  placeholder={Languages.UserProfile.lastName}
                  onChangeText={(lastName) => this.setState({ lastName })}/>
            </View>
            <View style={Styles.formPicker}>
                <Picker
                    selectedValue={this.state.gender}
                    onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
                    <Picker.Item label={Languages.UserProfile.none} value="" />
                    <Picker.Item label={Languages.UserProfile.male} value="M" style={Styles.pickerText} />
                    <Picker.Item label={Languages.UserProfile.femele} value="F" />
                </Picker>
            </View>
            <TextInput
              style={Styles.textInputMulti}
              value={this.state.aboutYou}
              multiline={true}
              numberOfLines={8}
              placeholder={Languages.UserProfile.aboutYou}
              onChangeText={(aboutYou) => this.setState({ aboutYou })} />
            <Button style={Styles.btn} onPress={this.updateBasicInformations}>
                <Text style={Styles.formBtnText}>{Languages.UserProfile.save.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    renderAccordionContentAddress() {
        return <View>
            <TextInput
              style={Styles.textInput}
              numberOfLines={2}
              placeholder={Languages.UserProfile.address}
              value={this.state.address}
              onChangeText={(address) => this.setState({ address })} />
            <View style={Styles.col}>
                <TextInput
                  style={Styles.textInputHalf}
                  placeholder={Languages.UserProfile.city}
                  value={this.state.city}
                  onChangeText={(city) => this.setState({ city })}/>
                <TextInput
                  style={Styles.textInputHalf}
                  placeholder={Languages.UserProfile.state}
                  value={this.state.region}
                  onChangeText={(region) => this.setState({ region })} />
            </View>
            <TextInput
              style={Styles.textInput}
              placeholder={Languages.UserProfile.country}
              value={this.state.country}
              onChangeText={(country) => this.setState({ country })} />
            <TextInput
              style={Styles.textInputLast}
              placeholder={Languages.UserProfile.postCode}
              textContentType='postalCode'
              value={this.state.postalCode}
              onChangeText={(postalCode) => this.setState({ postalCode })}/>
            <Button style={Styles.btn} onPress={this.updateAddressInformations}>
                <Text style={Styles.formBtnText}>{Languages.UserProfile.save.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    renderAccordionContentContact() {
        return <View>
            <View style={[ { marginTop: 10, marginBottom: 10, paddingBottom: 10, borderBottomColor: '#E8BB03', borderBottomWidth: 2 }]}>
              <Label style={[Styles.label, {marginBottom: 10}]}>{Languages.UserProfile.phoneNumber}</Label>
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

            <TextInput
              style={Styles.textInputLast}
              placeholder={Languages.UserProfile.webSiteUrl}
              value={this.state.webSite}
              textContentType='URL'
              onChangeText={(webSite) => this.setState({webSite})}/>
            <Button style={Styles.btn} onPress={this.updateContactInformations}>
                <Text style={Styles.formBtnText}>{Languages.UserProfile.save.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    renderAccordionContentChangePassword() {
        return <View>
            <TextInput
              style={Styles.textInput}
              value={this.state.oldPassword}
              placeholder={Languages.UserProfile.oldPassword}
              textContentType='password'
              secureTextEntry={true}
              onChangeText={(oldPassword) => this.setState({ oldPassword })}/>
            <TextInput
              style={Styles.textInput}
              value={this.state.newPassword}
              placeholder={Languages.UserProfile.newPassword}
              textContentType='password'
              secureTextEntry={true}
              onChangeText={(newPassword) => this.setState({ newPassword })}/>
            <TextInput
              style={Styles.textInput}
              value={this.state.confirmPassword}
              placeholder={Languages.UserProfile.confirmPassword}
              textContentType='password'
              secureTextEntry={true}
              onChangeText={(confirmPassword) => this.setState({ confirmPassword })} />
            <Button style={Styles.btn} onPress={this.updatePassword}>
                <Text style={Styles.formBtnText}>{Languages.UserProfile.save.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

    render() {
        return <Container style={Style.bgMain}>
            <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.profile}>
                    <ImageBackground source={require('@Asset/images/bg_main.png')} imageStyle={'cover'} style={Styles.coverImg} />
                    <View style={Styles.bgBlue} />

                    <View style={Styles.owner}>
                        {
                            !this.state.picture &&
                            <View style={Styles.ownerBg}>
                                <Image source={require('@Asset/images/avatar.png')} style={Styles.ownerAvatarImg} />
                            </View>
                        }
                        {
                            this.state.picture &&
                            <View style={Styles.ownerBg}>
                                <Image source={{ uri: this.state.picture }} style={Styles.ownerAvatarImg} />
                            </View>
                        }
                        <Button transparent style={Styles.profleEdit} onPress={this.pickImage}>
                            <Icon active name='edit' style={Style.textWhite} type="FontAwesome" />
                        </Button>
                        <View style={Styles.ownerInfo}>
                            <Text style={Styles.ownerName}>{this.props.fullName.toUpperCase()}</Text>
                            {
                              this.props.creationTime &&
                              <Text style={Styles.ownerDateMember}>
                                {Languages.UserProfile.memberSince + ' ' + moment(this.props.creationTime).format('YYYY-MM-DD')}
                              </Text>
                            }
                        </View>
                    </View>

                    <View style={[Styles.back, Style.actionBarIn]}>
                        <Button transparent style={Style.actionBarBtn} onPress={() => {
                            NavigationService.navigate('MemberHome')
                        }}>
                            <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                        </Button>
                    </View>
                </View>

                <View style={Styles.formBg}>
                    <Accordion
                        style={Styles.accordion}
                        dataArray={[
                            {
                                type: 'basic',
                                title: Languages.UserProfile.basicsInformations,
                            },
                            {
                                type: 'address',
                                title: Languages.UserProfile.addressInformations
                            },
                            {
                                type: 'contact',
                                title: Languages.UserProfile.contactInformations,
                            },
                            {
                                type: 'changePassword',
                                title: Languages.UserProfile.changePassword
                            },
                        ]}
                        expanded={-1}
                        renderHeader={this.renderAccordionHeader}
                        renderContent={this.renderAccordionContent}
                    />
                </View>

            </Content>

            <FooterNav />

            <Toast />
        </Container>
    }
}

export default connect(({ user }) => {
  return {
    profile: user.profile,
    fullProfile: user.fullProfile,
    fullName: user.fullProfile ? (user.fullProfile.fullName || '') : '',
    creationTime: user.creationTime ? user.creationTime : null,
    phoneCountryCode: user.phoneCountryCode
  }
}, { setUserFullProfile, changeDefaultPhoneCountryCode })(Profile)
