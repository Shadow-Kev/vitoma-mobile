import React from 'react'
import { Button, Icon, View } from 'native-base'

import NavigationService from '@Service/Navigation'

import Style from '@Theme/Style'

class FooterNav extends React.Component {
  render() {
    return (
      <View style={Style.footer}>
          <View style={Style.fNav}>
              <Button transparent style={Style.fBtn} onPress={() => {
                  NavigationService.navigate('PublicHome')
              }}>
                  <Icon name='home' style={Style.fBtnIcon} type="FontAwesome" />
              </Button>
          </View>
          <View style={Style.fNav}>
              <Button transparent style={Style.fBtn} onPress={() => {
                  NavigationService.navigate('PublicAdsSearch')
              }}>
                  <Icon name='search' style={Style.fBtnIcon} type="FontAwesome" />
              </Button>
          </View>
          <View style={Style.fNavActive}>
              <Button transparent style={Style.fBtn} onPress={() => {
                  NavigationService.navigate('MemberAdCreate')
              }}>
                  <Icon name='plus' style={Style.fBtnIconActive} type="Foundation" />
              </Button>
          </View>
          <View style={Style.fNav}>
              <Button transparent style={Style.fBtn} onPress={() => {
                  NavigationService.navigate('MemberBookmark')
              }}>
                  <Icon name='bookmark' style={Style.fBtnIcon} type="Octicons" />
              </Button>
          </View>
          <View style={Style.fNav}>
              <Button transparent style={Style.fBtn} onPress={() => {
                  NavigationService.navigate('MemberMessages')
              }}>
                  <Icon name='bell' style={Style.fBtnIcon} type="Entypo" />
              </Button>
          </View>
      </View>
    )
  }
}

export default FooterNav
