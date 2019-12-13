import { Languages, Events } from '@common';
import FooterNav from '@Component/FooterNav';
import { setLanguage, changeDefaultCountry, changeDefaultCurrency } from '@redux/actions';
import Styles from '@Screen/Member/Settings/Style';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Picker, Accordion, Body, Button, CheckBox, Container, Content, Icon, ListItem, Text, View } from 'native-base';
import React from 'react';
import { Image, ImageBackground, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Toast from '@Component/Toast';

class Index extends React.Component {
      constructor(props) {
          super(props)

          this.state = {
              gender: null,
              language: Languages.getLanguage(),

              countries: ['benin', 'togo', 'guinea', 'mali',  "ivoryCost", 'burkinaFaso', 'ghana'],
              currencies: [
                { title: 'Franc CFA (XOF)', value: 'XOF' },
                { title: 'Franc CFA (XAF)', value: 'XAF' },
                { title: 'Franc GNF', value: 'GNF' },
                { title: 'Dollar CAN', value: 'CAD' },
                { title: 'Dollar US', value: 'USD' },
                { title: 'Euro', value: 'EUR' }
              ],

              selectedCountry: props.defaultCountry || 'benin',
              selectedCurrency: props.defaultCurrency
          }

          this.renderAccordionHeader = this.renderAccordionHeader.bind(this)
          this.renderAccordionContent = this.renderAccordionContent.bind(this)
          this.renderAccordionContentLanguages = this.renderAccordionContentLanguages.bind(this)
          this.renderAccordionContentCountries = this.renderAccordionContentCountries.bind(this)
      }

      renderAccordionHeader(item, expanded) {
          return (
              <View style={Styles.accordionTab}>
                  <Text style={Styles.accordionTabText}>
                      {" "}{item.title}
                  </Text>
                  {expanded
                      ? <Icon style={Styles.accordionTabIcon} name="minus" type="Foundation" />
                      : <Icon style={Styles.accordionTabIcon} name="plus" type="Foundation" />}
              </View>
          );
      }

      renderAccordionContent(item) {
          var fn = 'renderAccordionContent' + (item.type.charAt(0).toUpperCase() + item.type.substr(1));
          return <View style={Styles.accordionContent}>
              {this[fn]()}
          </View>
      }

      renderAccordionContentLanguages() {
          return <View>
              <ListItem>
                  <CheckBox checked={this.state.language == 'en'} onPress={() => this.setState({ language: 'en'})} />
                  <Body>
                      <Text style={Styles.notifyText}>{Languages.Settings.english}</Text>
                  </Body>
              </ListItem>
              <ListItem>
                  <CheckBox checked={this.state.language == 'fr'} onPress={() => this.setState({ language: 'fr'})}/>
                  <Body>
                      <Text style={Styles.notifyText}>{Languages.Settings.french}</Text>
                  </Body>
              </ListItem>
              <Button style={Styles.btn} onPress={this.setLanguage}>
                  <Text style={Styles.formBtnText}>{Languages.Settings.save.toUpperCase()}</Text>
                  <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
              </Button>
          </View>
     }

     renderAccordionContentCountries() {
         return <View>
             <Picker
                 selectedValue={this.state.selectedCountry}
                 onValueChange={(selectedCountry) => this.setState({ selectedCountry })}>
                 <Picker.Item label={Languages.AdsSearch.allCountries} value="" />
                 {this.state.countries.map((item, index) => {
                   return <Picker.Item key={item} label={Languages.Countries[item]} value={item} />
                 })}
             </Picker>
             <Button style={Styles.btn} onPress={this.setDefaultCountry}>
                 <Text style={Styles.formBtnText}>{Languages.Settings.save.toUpperCase()}</Text>
                 <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
             </Button>
         </View>
    }

    renderAccordionContentCurrencies() {
        return <View>
            <Picker
                selectedValue={this.state.selectedCurrency}
                onValueChange={(selectedCurrency) => this.setState({ selectedCurrency })}>
                {this.state.currencies.map((item, index) => {
                  return <Picker.Item key={item} label={item.title} value={item.value} />
                })}
            </Picker>
            <Button style={Styles.btn} onPress={this.setDefaultCurrency}>
                <Text style={Styles.formBtnText}>{Languages.Settings.save.toUpperCase()}</Text>
                <Icon active name='arrow-right' type="Feather" style={Styles.formBtnIcon} />
            </Button>
        </View>
    }

   setLanguage = () => {
     this.props.setLanguage(this.state.language)
     NavigationService.navigate('PublicIntro')
   }

   setDefaultCountry = () => {
     this.props.changeDefaultCountry(this.state.selectedCountry)
     Events.toast(Languages.Settings.changesDone)
   }

   setDefaultCurrency = () => {
     this.props.changeDefaultCurrency(this.state.selectedCurrency)
     Events.toast(Languages.Settings.changesDone)
   }

  render() {
    return <Container style={Style.bgMain}>
        <StatusBar backgroundColor="#173471" animated barStyle="light-content" />

        <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>

            <View style={Styles.profile}>
                <ImageBackground source={{ uri: ('https://cdn.stocksnap.io/img-thumbs/960w/ZUAZ22R9AL.jpg') }} imageStyle={'cover'} style={Styles.coverImg}>
                </ImageBackground>

                <View style={Styles.bgBlue}>
                </View>

                <View style={[Styles.owner, Style.actionBarIn]}>
                    <View style={Styles.ownerBg}>
                        <Image source={{ uri: ('https://ssl.gstatic.com/images/branding/product/1x/android_for_work_settings_512dp.png') }} style={Styles.ownerAvatarImg} />
                    </View>
                    <View style={Styles.ownerInfo}>
                        <Text style={Styles.ownerName}>{Languages.Settings.settings}</Text>
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
                            type: 'languages',
                            title: Languages.Settings.languages
                        },
                        {
                            type: 'countries',
                            title: Languages.Settings.countries
                        },
                        {
                            type: 'currencies',
                            title: Languages.Settings.currency
                        },
                    ]}
                    expanded={2}
                    renderHeader={this.renderAccordionHeader}
                    renderContent={this.renderAccordionContent}
                />
            </View>

            <Toast />
        </Content>

        <FooterNav />

    </Container>
  }
}

export default connect(({ user }) => {
  return {
    defaultCountry: user.country,
    defaultCurrency: user.currency
  }
}, {
  setLanguage,
  changeDefaultCountry,
  changeDefaultCurrency
})(Index)
