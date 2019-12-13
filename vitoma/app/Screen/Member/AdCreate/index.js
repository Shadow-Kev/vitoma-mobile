import { Config, Events, Languages, Logger } from '@common';
import FooterNav from '@Component/FooterNav';
import Toast from '@Component/Toast';
import Styles from '@Screen/Member/AdCreate/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import _ from 'lodash';
import { Button, Container, Content, Header, Icon, Label, Picker, Text } from 'native-base';
import React from 'react';
import { Alert, Image, StatusBar, TextInput, View, ActivityIndicator } from 'react-native';
import AdCreateState from './State';
import { connect } from "react-redux"
import PhoneInput from 'react-native-phone-input'
import { changeDefaultPhoneCountryCode } from '@redux/actions'

class AdCreate extends React.Component {
    constructor(props) {
      super(props)

      this.state = AdCreateState(props)

      this.showLoader = false;
    }

    componentWillMount() {
      this.checkUserIsAuthenticated()

      var userData = this.props.userData;

      if(userData.email || userData.phone) {
        var phoneState = this.state.phone;
        var emailState = this.state.email;

        phoneState.value = userData.phone || '';
        emailState.value = userData.email || '';

        phoneState.valid = phoneState
          .validations.filter(item => !item.validate(phoneState.value, this.state.emailPhoneConfig.value)).length == 0;

        emailState.valid = emailState
          .validations.filter(item => !item.validate(emailState.value, this.state.emailPhoneConfig.value)).length == 0;

        this.setState({ email: emailState, phone: phoneState })
      }
    }

    checkUserIsAuthenticated = () => {
      if(!this.props.isAuthenticated) {
        Alert.alert(
          Languages.Auth.authInfo,
          Languages.Auth.needToBeLogIn,
          [
            {
              text: Languages.Auth.goBack,
              onPress: () => NavigationService.navigate('PublicHome')
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
    }

    onChangeCategory = (value, index) => {
        let categories = this.state.categories
        categories.value = value
        categories.valid = true
        categories.errorMsg = ''

        this.setState({categories})

        // TODO - Should be improve to use the index passed in params
        let category = _.find(categories.list, (category) => category.id == value);
        this.setVisibleFields(category.additionalFields)
    }

    onChangePicker = (id, value, index) => {
        let pickerState = this.state[id]
        pickerState.value = value

        this.setState({
          [id]: pickerState
        })
    }

    onChangeText = (inputId, text) => {
      let inputState = this.state[inputId]
      inputState.value = text

      this.setState({
        [inputId]: inputState
      })
    }

    validateField = (inputId) => {
      let inputState = this.state[inputId]
      let isValidField = true
      let errorMsg = ''

      for(var i = 0; i < inputState.validations.length; i++) {
        const validations = inputState.validations[i]
        const isValid = ((inputId == 'email' || inputId == 'phone') ?
                          validations.validate(inputState.value, this.state.emailPhoneConfig.value) :
                          validations.validate(inputState.value))
        if(!isValid) {
          isValidField = false
          errorMsg = validations.errorMsg
          break;
        }
      }

      inputState.valid = isValidField
      inputState.errorMsg = errorMsg

      this.setState({
        [inputId]: inputState
      })

      return isValidField
    }

    setVisibleFields = (additionalFields) => {
      let state = this.state

      Object.keys(state).forEach(function(key, index) {
        if(key == 'title' ||
           key == 'description' ||
           key == 'price' ||
           key == 'categories' ||
           key == 'photos' ||
           key == 'email' ||
           key == 'phone' ||
           key == 'emailPhoneConfig') return;

        state[key].visible = (additionalFields.indexOf(key) > -1)
      });

      this.setState({...state})
    }

    displayTextInput = ({
      id,
      value,
      label,
      placeholder,
      keyboardType,
      multiline,
      numberOfLines,
      onChange,
      validateField }) => {
        const inputStyle = multiline ? Styles.textInputMulti : Styles.textInput
        const inputState = this.state[id]

        return (
          <View style={Styles.row}>
              <Label style={Styles.label}>{label}</Label>
              <TextInput
                style={inputStyle}
                value={value || ''}
                placeholder={placeholder}
                numberOfLines={numberOfLines || 1}
                multiline={multiline}
                keyboardType={keyboardType}
                onChangeText={(text) => onChange(id, text)}
                onBlur={() => validateField(id) }/>
                {
                  !inputState.valid && inputState.errorMsg.length > 0 &&
                  <Label style={Styles.errorLabel}>
                    {'* ' + Languages.Validations[inputState.errorMsg]}
                  </Label>
                }
          </View>
        )
    }

    displayPhoneInput = ({ id, value, label, onChange, validateField }) => {
        const inputState = this.state[id]

        return (
          <View style={Styles.row}>
              <Label style={[Styles.label, {marginBottom: 10}]}>{label}</Label>
              <View style={[{paddingBottom: 10, borderBottomColor: '#CC0489', borderBottomWidth: 2}]}>
                <PhoneInput
                  ref='phone'
                  value={value || ''}
                  cancelText={Languages.Shared.cancel}
                  confirmText={Languages.Shared.confirm}
                  initialCountry={this.props.phoneCountryCode}
                  onSelectCountry={(code) => this.props.changeDefaultPhoneCountryCode(code)}
                  onChangePhoneNumber={(phoneNumber) => {
                    onChange(id, phoneNumber)
                    validateField(id)
                  }}/>
              </View>
              {
                !inputState.valid && inputState.errorMsg.length > 0 &&
                <Label style={Styles.errorLabel}>
                  {'* ' + Languages.Validations[inputState.errorMsg]}
                </Label>
              }
          </View>
        )
    }

    displayPicker = ({
      id,
      label,
      iosHeader,
      placeholder,
      headerBackButtonText,
      selectedValue,
      onChange,
      itemLabelPredicate,
      itemValuePredicate}) => {
        const pickerState = this.state[id]

        return (
          <View style={Styles.row}>
              <Label style={Styles.label}>{label}</Label>
              <View style={Styles.bgGrey}>
                  <Picker
                      iosHeader={iosHeader}
                      placeholder={placeholder}
                      headerBackButtonText={headerBackButtonText}
                      selectedValue={selectedValue}
                      height={20}
                      textStyle= {{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 12,
                      }}
                      onValueChange={(itemValue, itemIndex) => onChange(id, itemValue, itemIndex)}>
                      {pickerState.list.map((item, index) => {
                        return (
                          <Picker.Item
                            key={item}
                            label={itemLabelPredicate ? itemLabelPredicate(item) : (item + '')}
                            value={itemValuePredicate ? itemValuePredicate(item) : item} />
                        )
                      })}
                  </Picker>
              </View>
          </View>
        )
    }

    pickImage = async (index) => {
      const {
        status: cameraRollPerm
      } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      // only if user allows permission to camera roll
      if (cameraRollPerm === 'granted') {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });

        this.handleImagePicked(pickerResult, index);
      }
    };

    deleteImage = (index) => {
      const photos = this.state.photos;
      photos.value[index].src = null;
      this.setState({photos});
    }

    handleImagePicked = async (pickerResult, index) => {
      const photos = this.state.photos;

      if (!pickerResult.cancelled) {
          photos.value[index].src = pickerResult.uri;
          this.setState({photos});
      }
    };

    getImageExtension = (file) => {
  		let extension = 'jpeg', _;

      [ _, extension ] = file.match(/\.(\w+)$/);

  		return extension;
  	}

    onPublished = () => {
      this.checkUserIsAuthenticated()
      // Validate visible fields that are invalid
      let invalidFields = Object.keys(this.state).filter(key => {
        return this.state[key].visible && !this.validateField(key)
      })

      if(!invalidFields.length) {
        // call the api to post the ad
        const categoryIndex = _.findIndex(this.state.categories.list, (item) => item.id == this.state.categories.value);
        const additionalFields = this.state.categories.list[categoryIndex].additionalFields

        const data = {
          overview: {
            title: this.state.title.value,
            description: this.state.description.value,
            price: this.state.price.value,
            currency: this.state.currency.value,
            country: this.state.country.value
          },
          categoryInfos: {
            categoryId: this.state.categories.value,
            attributes: additionalFields.map(field => {
              return {
                label: field,
                value: this.state[field].value
              }
            })
          },
          contactInfos: {
            email: this.state.email.value,
            phone: this.state.phone.value,
            showOnlyEmail: this.state.emailPhoneConfig.value == 'showEmail',
            showOnlyPhone: this.state.emailPhoneConfig.value == 'showPhoneNumber',
            showBoth: this.state.emailPhoneConfig.value == 'showBoth'
          },
          photos: this.state.photos.value.filter(image => image.src != null)
        }

        var form = new FormData();

        // Add pictures to the form data
        var photos = data.photos;
        delete data.photos
        for(var i = 0; i < photos.length; i++) {
          let extension = this.getImageExtension(photos[i].src)
          form.append('photos', {
            uri: photos[i].src,
            name: 'photo' + (i + 1) + '.' + extension,
            type: `image/${extension}`
          })
        }

        form.append("userId", this.props.userId);
        form.append("ad", JSON.stringify(data));

        var reqHeaders = new Headers({
          'Content-Type': 'multipart/form-data'
        });

        var options = {
          method: 'POST',
          headers: reqHeaders,
          body: form
        };

        var url = Config.URL.entryPoint + '/ads/create';

        this.showLoader = true;
        fetch(url, options)
        .then(function(response) {
          return response.json()
        })
        .then((data) => {
          this.showLoader = false;

          if(data && data.status == 'SUCCESS') {
            this.setState({ published: { valid: true, visible: false } })

            const postDetailConfig = { postId: data.result[0].adId }
            NavigationService.navigate('MemberAdPublished', { postDetailConfig })
          } else {
            Events.toast(Languages.Validations.notPublishedAd)
            this.setState({ published: { valid: false, visible: false } })

            Logger.log({ data, url, options })
          }
        })
        .catch((error) => {
          this.showLoader = false;

          Events.toast(Languages.Validations.notPublishedAd)
          this.setState({ published: { valid: false, visible: false } })

          Logger.log({ ...error, url, options })
        });
      }
    }

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
                    <Text style={Style.actionBarText}>{Languages.AdCreate.createAd.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>

            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.section}>
                    <View style={Styles.step}>
                        <Text style={Styles.stepText}>{Languages.AdCreate.Overview.step1}</Text>
                    </View>

                    {
                      this.state.title.visible &&
                      this.displayTextInput({
                        id: 'title',
                        label: Languages.AdCreate.Overview.adTitle.toUpperCase(),
                        value: this.state.title.value,
                        placeholder: '',
                        onChange: this.onChangeText,
                        validateField: this.validateField
                      })
                    }

                    {
                      this.state.description.visible &&
                      this.displayTextInput({
                        id: 'description',
                        label: Languages.AdCreate.Overview.adDescription.toUpperCase(),
                        placeholder: Languages.AdCreate.Overview.adDescriptionMinChars,
                        value: this.state.description.value,
                        onChange: this.onChangeText,
                        validateField: this.validateField,
                        numberOfLines: 8,
                        multiline:true
                      })
                    }

                    {
                      this.state.country.visible &&
                      this.displayPicker({
                        id: 'country',
                        label: Languages.AdCreate.Overview.adCountry.toUpperCase(),
                        iosHeader: Languages.AdCreate.CategoryInfos.selectOne,
                        placeholder: Languages.AdCreate.CategoryInfos.selectOne,
                        headerBackButtonText: Languages.AdCreate.CategoryInfos.back,
                        selectedValue: this.state.country.value,
                        onChange: this.onChangePicker,
                        itemLabelPredicate: (item) => Languages.Countries[item]
                      })
                    }

                    {
                      this.state.price.visible &&
                      this.displayTextInput({
                        id: 'price',
                        label: Languages.AdCreate.Overview.adPrice.toUpperCase(),
                        placeholder: 'e.g. 100000',
                        value: this.state.price.value,
                        onChange: this.onChangeText,
                        validateField: this.validateField,
                        keyboardType: 'numeric'
                      })
                    }

                    {
                      this.state.currency.visible &&
                      this.displayPicker({
                        id: 'currency',
                        label: Languages.AdCreate.Overview.adCurrency.toUpperCase(),
                        iosHeader: Languages.AdCreate.CategoryInfos.selectOne,
                        placeholder: Languages.AdCreate.CategoryInfos.selectOne,
                        headerBackButtonText: Languages.AdCreate.CategoryInfos.back,
                        selectedValue: this.state.currency.value,
                        onChange: this.onChangePicker,
                        itemLabelPredicate: (item) => item.title,
                        itemValuePredicate: (item) => item.value
                      })
                    }

                    <View style={[Styles.step, Styles.spaceTop]}>
                        <Text style={Styles.stepText}>{Languages.AdCreate.CategoryInfos.step2}</Text>
                    </View>

                    <View style={Styles.row}>
                        <Label style={Styles.label}>{Languages.AdCreate.CategoryInfos.category.toUpperCase()}</Label>
                        <View style={Styles.bgGrey}>
                            <Picker
                                mode="dropdown"
                                iosHeader={Languages.AdCreate.CategoryInfos.selectOne}
                                placeholder={Languages.AdCreate.CategoryInfos.selectOne}
                                headerBackButtonText={Languages.AdCreate.CategoryInfos.back}
                                selectedValue={this.state.categories.value}
                                height={20}
                                itemTextStyle={{
                                    marginLeft: 0,
                                    paddingLeft: 0,
                                }}
                                textStyle= {{
                                    fontFamily: 'Montserrat-Regular',
                                    fontSize: 12,
                                  }}

                                onValueChange={(itemValue, itemIndex) => this.onChangeCategory(itemValue, itemIndex)}>
                                {this.state.categories.list.map(item => {
                                  return <Picker.Item key={item.id} label={Languages.Categories[item.labelId]} value={item.id} />
                                })}
                            </Picker>
                            {
                              !this.state.categories.valid && this.state.categories.errorMsg.length > 0 &&
                              <Label style={Styles.errorLabel}>
                                {'* ' + Languages.Validations[this.state.categories.errorMsg]}
                              </Label>
                            }
                        </View>
                    </View>

                    {
                      this.state.carCompany.visible &&
                      this.displayPicker({
                        id: 'carCompany',
                        label: Languages.AdCreate.CategoryInfos.company.toUpperCase(),
                        iosHeader: Languages.AdCreate.CategoryInfos.selectOne,
                        placeholder: Languages.AdCreate.CategoryInfos.selectOne,
                        headerBackButtonText: Languages.AdCreate.CategoryInfos.back,
                        selectedValue: this.state.carCompany.value,
                        onChange: this.onChangePicker
                      })
                    }

                    {
                      this.state.model.visible &&
                      this.displayTextInput({
                        id: 'model',
                        label: Languages.AdCreate.CategoryInfos.model.toUpperCase(),
                        value: this.state.model.value,
                        placeholder: '',
                        onChange: this.onChangeText,
                        validateField: this.validateField
                      })
                    }

                    {
                      this.state.fuel.visible &&
                      this.displayPicker({
                        id: 'fuel',
                        label: Languages.AdCreate.CategoryInfos.fuel.toUpperCase(),
                        iosHeader: Languages.AdCreate.CategoryInfos.selectOne,
                        placeholder: Languages.AdCreate.CategoryInfos.selectOne,
                        headerBackButtonText: Languages.AdCreate.CategoryInfos.back,
                        selectedValue: this.state.fuel.value,
                        onChange: this.onChangePicker
                      })
                    }

                    {
                      this.state.year.visible &&
                      this.displayPicker({
                        id: 'year',
                        label: Languages.AdCreate.CategoryInfos.year.toUpperCase(),
                        iosHeader: Languages.AdCreate.CategoryInfos.selectOne,
                        placeholder: Languages.AdCreate.CategoryInfos.selectOne,
                        headerBackButtonText: Languages.AdCreate.CategoryInfos.back,
                        selectedValue: this.state.year.value,
                        onChange: this.onChangePicker
                      })
                    }

                    {

                      this.state.color.visible &&
                      this.displayTextInput({
                        id: 'color',
                        label: Languages.AdCreate.CategoryInfos.color.toUpperCase(),
                        placeholder: '',
                        value: this.state.color.value,
                        onChange: this.onChangeText,
                        validateField: this.validateField
                      })
                    }

                    <View style={[Styles.step, Styles.spaceTop]}>
                        <Text style={Styles.stepText}>{Languages.AdCreate.ContactInfos.step3}</Text>
                    </View>

                    {

                      this.state.email.visible &&
                      this.displayTextInput({
                        id: 'email',
                        label: Languages.AdCreate.ContactInfos.email.toUpperCase(),
                        placeholder: (this.state.emailPhoneConfig.value == 'showBoth' ||
                                      this.state.emailPhoneConfig.value == 'showEmail') ?
                                      Languages.AdCreate.required : Languages.AdCreate.optional,
                        value: this.state.email.value,
                        onChange: this.onChangeText,
                        validateField: this.validateField
                      })
                    }

                    {
                      this.state.phone.visible &&
                      this.displayPhoneInput({
                        id: 'phone',
                        label: Languages.AdCreate.ContactInfos.phone.toUpperCase(),
                        value: this.state.phone.value,
                        onChange: this.onChangeText,
                        validateField: this.validateField
                      })
                    }

                    <View style={Styles.row}>
                        <Label style={Styles.label}>{Languages.AdCreate.ContactInfos.emailPhoneConfig.toUpperCase()}</Label>
                        <View style={Styles.bgGrey}>
                            <Picker
                                mode="dropdown"
                                iosHeader={Languages.AdCreate.CategoryInfos.selectOne}
                                placeholder={Languages.AdCreate.CategoryInfos.selectOne}
                                headerBackButtonText={Languages.AdCreate.CategoryInfos.back}
                                selectedValue={this.state.emailPhoneConfig.value}
                                height={20}
                                itemTextStyle={{
                                    marginLeft: 0,
                                    paddingLeft: 0,
                                }}
                                textStyle= {{
                                  fontFamily: 'Montserrat-Regular',
                                  fontSize: 12,
                                }}

                                onValueChange={(itemValue, itemIndex) => {
                                  let emailPhoneConfig = this.state.emailPhoneConfig
                                  emailPhoneConfig.value = itemValue
                                  this.setState({ emailPhoneConfig })
                                }}>
                                {this.state.emailPhoneConfig.list.map(item => {
                                  return <Picker.Item key={item} label={Languages.AdCreate.ContactInfos[item]} value={item} />
                                })}
                            </Picker>
                            {
                              !this.state.emailPhoneConfig.valid && this.state.emailPhoneConfig.errorMsg.length > 0 &&
                              <Label style={Styles.errorLabel}>
                                {'* ' + Languages.Validations[this.state.emailPhoneConfig.errorMsg]}
                              </Label>
                            }
                        </View>
                    </View>

                    <View style={[Styles.step, Styles.spaceTop]}>
                        <Text style={Styles.stepText}>{Languages.AdCreate.Photos.step4}</Text>
                    </View>

                    <View style={Styles.row}>
                        <View style={Styles.photo}>
                          {
                            this.state.photos.visible &&
                            this.state.photos.value.map((image, index) => {
                              if(image.src) {
                                return (
                                  <View key={'photo-' + index} style={Styles.photoItem}>
                                      <Image source={{ uri: image.src }} style={Styles.photoIcon} />
                                      <Button style={Styles.photoDelete} onPress={() => this.deleteImage(index)}>
                                          <Icon name="trash" type="FontAwesome" style={Styles.photoDeleteIcon} />
                                      </Button>
                                  </View>
                                )
                              } else {
                                return (
                                  <View key={'photo-' + index} style={Styles.photoItem}>
                                    <Button iconLeft transparent style={Styles.photoUploadBtn} onPress={() => this.pickImage(index)}>
                                        <Icon name="upload" type="FontAwesome" style={Styles.photoUploadIcon} />
                                    </Button>
                                  </View>
                                )
                              }
                            })
                          }
                          {
                            !this.state.photos.valid && this.state.photos.errorMsg.length > 0 &&
                            <Label style={Styles.errorLabel}>
                              {'* ' + Languages.Validations[this.state.photos.errorMsg]}
                            </Label>
                          }
                        </View>
                    </View>

                    <View style={Styles.itemFooter}>
                        <Button iconLeft transparent style={Styles.itemBtnActive} onPress={this.onPublished} disabled={this.showLoader}>
                            <Icon name="check" type="MaterialIcons" style={Styles.itemIcon} />
                            <Text style={Styles.itemText}>{Languages.AdCreate.publish}</Text>
                        </Button>
                    </View>

                    {
                      !this.state.published.valid &&
                      <Label style={Styles.errorLabel}>
                        {'* ' + Languages.Validations.notPublishedAd}
                      </Label>
                    }

                    {
                      this.showLoader &&
                      <ActivityIndicator size="large" color="#E8BB03" />
                    }
                </View>

            </Content>

            <FooterNav />

            <Toast />
        </Container>
    }
}

export default connect(({ user }) => {
  var email = ''
  var phone = ''

  if(user.profile) {
    email = user.profile.email;
    phone = user.profile.phoneNumber;
  }

  if(user.fullProfile) {
    email = !email ? user.fullProfile.email : email;
    phone = !phone ? user.fullProfile.phone : phone;
  }

  return {
    isAuthenticated: user.profile != null,
    userId: user.profile ? user.profile.uid : null,
    userData: { email, phone },
    phoneCountryCode: user.phoneCountryCode,
    defaultCountry: user.country,
    defaultCurrency: user.currency
  }
}, { changeDefaultPhoneCountryCode })(AdCreate)
