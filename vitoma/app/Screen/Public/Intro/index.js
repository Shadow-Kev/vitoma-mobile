import { Languages } from '@common';
import NavigationService from '@Service/Navigation';
import Style from '@Theme/Style';
import { Container } from 'native-base';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr'

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
  }
});

class Index extends React.Component {

  componentWillMount() {
    this.setLanguage()
  }

  setLanguage = () => {
    if (this.props.lang) {
      // TODO - Should be improve.
      // We do this to set the languages in the whole app
      Languages.setLanguage(this.props.lang)
      moment.locale(this.props.lang)
    } else {
      moment.locale(Languages.getLanguage())
    }
  }

  getSlides = () => {
    return [
      {
        key: '1',
        title: Languages.Intro.searchWhatYouWant,
        text: Languages.Intro.alwaysAspire,
        image: require('@Asset/images/1.png'),
        imageStyle: styles.image,
      },
      {
        key: '2',
        title: Languages.Intro.preferTheBest,
        text: Languages.Intro.exploreCategories,
        image: require('@Asset/images/2.png'),
        imageStyle: styles.image,
      },
      {
        key: '3',
        title: Languages.Intro.buyAndSellWithUs,
        text: Languages.Intro.weEarnMoneyFromServices,
        image: require('@Asset/images/3.png'),
        imageStyle: styles.image,
      },
    ];
  }

  onDone = () => {
    NavigationService.navigate('PublicHome')
  }

  onSkip = () => {
    NavigationService.navigate('PublicHome')
  }

  render() {
    return <Container style={Style.bgMainIntro}>
      <StatusBar backgroundColor="#CC0489" animated barStyle="light-content" />
      <AppIntroSlider
        slides={this.getSlides()}
        onDone={this.onDone}
        onSkip={this.onSkip}
        skipLabel={Languages.Intro.skip}
        nextLabel={Languages.Intro.next}
        doneLabel={Languages.Intro.getStarted}
        showSkipButton
      />
    </Container>
  }
}

const mapStateToProps = ({ config }) => {
  return {
    lang: config.lang
  }
}
export default connect(mapStateToProps, { })(Index)
