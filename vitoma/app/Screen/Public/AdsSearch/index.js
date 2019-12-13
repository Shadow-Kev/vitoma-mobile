import { Languages } from "@common";
import FooterNav from '@Component/FooterNav';
import Styles from '@Screen/Public/AdsSearch/Style';
import NavigationService from '@Service/Navigation';
//import Button as cButton from '@Component/Button'
import Style from '@Theme/Style';
import { Button, Container, Content, Header, Icon, Label, Text, View } from 'native-base';
import React from 'react';
import { Picker, StatusBar, TextInput } from 'react-native';
import AdsSearchState from './State';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = AdsSearchState
    }

    onChangeText = (inputId, text) => {
      let inputState = this.state[inputId]
      inputState.value = text

      this.setState({
        [inputId]: inputState
      })
    }

    onChangePicker = (id, value) => {
        let pickerState = this.state[id]
        pickerState.value = value

        this.setState({
          [id]: pickerState
        })
    }

    validateField = (inputId) => {
      let inputState = this.state[inputId]
      let isValidField = true
      let errorMsg = ''

      for(var i = 0; i < inputState.validations.length; i++) {
        const validations = inputState.validations[i]
        const isValid = (inputId == 'price') ? validations.validate(inputState.min, inputState.max) :
                                               validations.validate(inputState.value)
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

    displayTextInput = ({
      id,
      value,
      label,
      placeholder,
      onChange,
      validateField }) => {
        const inputState = this.state[id]

        return (
          <View style={Styles.textView}>
              <Label style={Styles.label}>{label}</Label>
              <TextInput
                bordered
                style={Styles.textInput}
                value={value || ''}
                placeholder={placeholder}
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

    onSearch = () => {
      // Validate visible fields that are invalid
      let invalidFields = Object.keys(this.state).filter(key => {
        return !this.validateField(key)
      })

      if(!invalidFields.length) {
        const params = {
          query: this.state.title.value,
          country: this.state.country.value,
          categoriesList: [
            this.state.categories.value
          ],
          currency: [
            this.state.currencies.value
          ],
          minPrice: this.state.price.min,
          maxPrice: this.state.price.max
        }

        NavigationService.navigate('PublicSearchResults', { config: params, token: Date.now() })
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
                    <Text style={Style.actionBarText}>{Languages.AdsSearch.search.toUpperCase()}</Text>
                </View>
                <View style={Style.actionBarRight}>
                </View>
            </Header>


            <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

                <View style={Styles.section}>
                    {
                      this.displayTextInput({
                        id: 'title',
                        label: Languages.AdsSearch.adTitle.toUpperCase(),
                        value: this.state.title.value,
                        placeholder: '',
                        onChange: this.onChangeText,
                        validateField: this.validateField
                      })
                    }

                    <View>
                      <View style={Styles.textView}>
                          <Label style={Styles.label}>{Languages.AdsSearch.category.toUpperCase()}</Label>
                      </View>
                      <View style={Styles.picker}>
                          <Picker
                              selectedValue={this.state.categories.value}
                              onValueChange={(itemValue) => this.onChangePicker('categories', itemValue)}>
                              <Picker.Item label={Languages.AdsSearch.selectOne} value="" />
                              {this.state.categories.list.map((item, index) => {
                                return <Picker.Item key={'category-' + index} label={Languages.Categories[item.labelId]} value={item.id} />
                              })}
                          </Picker>
                      </View>
                      {
                        !this.state.categories.valid && this.state.categories.errorMsg.length > 0 &&
                        <View style={Styles.textView}>
                          <Label style={Styles.errorLabel}>
                            {'* ' + Languages.Validations[this.state.categories.errorMsg]}
                          </Label>
                        </View>
                      }
                    </View>

                    <View>
                      <View style={Styles.textView}>
                          <Label style={Styles.label}>{Languages.AdsSearch.country.toUpperCase()}</Label>
                      </View>
                      <View style={Styles.picker}>
                          <Picker
                              selectedValue={this.state.country.value}
                              onValueChange={(itemValue) => this.onChangePicker('country', itemValue)}>
                              <Picker.Item label={Languages.AdsSearch.allCountries} value="" />
                              {this.state.country.list.map((item, index) => {
                                return <Picker.Item key={'country-' + index} label={Languages.Countries[item]} value={item} />
                              })}
                          </Picker>
                      </View>
                    </View>

                    <View>
                      <View style={Styles.textView}>
                          <Label style={Styles.label}>{Languages.AdsSearch.adCurrency.toUpperCase()}</Label>
                      </View>

                      <View style={Styles.picker}>
                        <Picker
                          selectedValue={this.state.currencies.value}
                          onValueChange={(itemValue) => this.onChangePicker('currencies', itemValue)}>
                          <Picker.Item label={Languages.AdsSearch.selectOne} value="" />
                          {this.state.currencies.list.map((item, index) => {
                            return <Picker.Item key={'currency-' + index} label={item.title} value={item.value}  />
                          })}
                        </Picker>
                      </View>
                    </View>

                    <View style={Styles.price}>
                        <Label style={Styles.label}>{Languages.AdsSearch.adPrice.toUpperCase()}</Label>
                        <View style={Styles.col}>
                            <View style={Styles.pricePicker}>
                                <Picker
                                    selectedValue={this.state.price.min}
                                    onValueChange={(itemValue, itemIndex) => {
                                      let price = this.state.price;
                                      price.min = itemValue
                                      this.setState({ price })
                                    }}>
                                    <Picker.Item label="Min" value={0} />
                                    {this.state.price.list.map((item, index) => {
                                      return <Picker.Item key={'priceMin-' + index} label={item} value={item} />
                                    })}
                                </Picker>
                            </View>
                            <View style={Styles.pricePicker}>
                                <Picker
                                  selectedValue={this.state.price.max}
                                  onValueChange={(itemValue, itemIndex) => {
                                    let price = this.state.price;
                                    price.max = itemValue
                                    this.setState({ price })
                                  }}>
                                  <Picker.Item label="Max" value={0} />
                                  {this.state.price.list.map((item, index) => {
                                    return <Picker.Item key={'priceMax-' + index} label={item} value={item} />
                                  })}
                                  <Picker.Item label="Plus" value={null} />
                                </Picker>
                            </View>
                        </View>
                        {
                          !this.state.price.valid && this.state.price.errorMsg.length > 0 &&
                          <Label style={Styles.errorLabel}>
                            {'* ' + Languages.Validations[this.state.price.errorMsg]}
                          </Label>
                        }
                    </View>

                    <View style={Styles.btnBg}>
                        <Button style={Styles.btn} onPress={this.onSearch}>
                            <Text style={Styles.btnText}>{Languages.AdsSearch.search.toUpperCase()}</Text>
                            <Icon active name='search' type="FontAwesome" style={Styles.btnIcon} />
                        </Button>
                    </View>
                </View>

            </Content>

            <FooterNav />

        </Container>
    }
}
