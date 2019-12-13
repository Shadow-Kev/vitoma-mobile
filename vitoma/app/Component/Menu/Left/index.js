import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
  View,
} from "native-base";
import styles from "./Style";

import * as firebase from 'firebase'

import NavigationService from './../../../Service/Navigation'

import { Languages, Tools } from "@common"
import { onAuthStateChanged} from '@redux/actions';
import { connect } from 'react-redux';

const drawerCover = require("@Asset/images/bg_in.png");
const drawerAvatar = require("@Asset/images/avatar.png");
const drawerLogoCover = require("@Asset/images/logoCover.png");

const datas1 = [
  {
    name: 'home',
    route: "PublicHome",
    icon: "home",
  },
  {
    name: 'createAd',
    route: "MemberAdCreate",
    icon: "plus",
  },
  {
    name: 'adsSearch',
    route: "PublicAdsSearch",
    icon: "search",
  },
  {
    name: 'myAds',
    route: "MemberAds",
    icon: "news",
    type: "Entypo",
    authRequired: true
  },
  {
    name: 'messages',
    route: "MemberMessages",
    icon: "message",
    type: "MaterialIcons",
    authRequired: true
  },
  {
    name: 'bookmark',
    route: "MemberBookmark",
    icon: "bookmarks",
    type: "Entypo",
  },
  {
    name: 'profile',
    route: "MemberProfile",
    icon: "user-circle-o",
    authRequired: true
  },
  {
    name: 'members',
    route: "PublicMembers",
    icon: "group",
    authRequired: true
  },
];

const datas2 = [
  {
    name: 'signIn',
    route: "MemberSignIn",
    icon: "login-variant",
    type: "MaterialCommunityIcons",
    hideWhenAuthenticated: true
  },
  {
    name: 'aboutAfricauri',
    route: "PublicAboutUs",
    icon: "info-circle"
  },
  {
    name: 'contact',
    route: "PublicContact",
    icon: "envelope",
  },
  {
    name: 'settings',
    route: "MemberSettings",
    icon: "gears",
  },
  {
    name: 'logout',
    route: "PublicHome",
    icon: "logout",
    type: "MaterialCommunityIcons",
    authRequired: true
  }
];

class MenuLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  getCoverImage = () => {
    if(this.props.isAuthenticated) {

      if(this.props.fullProfile && this.props.fullProfile.media) {
        var picture = Tools.getImage([this.props.fullProfile.media], 'small')

        return <Image square style={styles.drawerUserImage} source={{ uri: picture }} />
      } else {
        return <Image square style={styles.drawerAvatarAndLogo} source={drawerAvatar} />
      }

    } else {
      return <Image square style={styles.drawerAvatarAndLogo} source={drawerLogoCover} />
    }
  }

  getCoverText = () => {
    if(this.props.isAuthenticated) {
      return (this.props.fullName.toUpperCase())
    } else {
      return Languages.Intro.biggestAfricainInventory
    }
  }

  renderList(datas) {
    return (
      <List
        dataArray={datas}
        renderRow={data =>
          <ListItem
            button
            noBorder
            onPress={() => {
              if(data.name === 'logout') {
                firebase.auth().signOut();
                this.props.onAuthStateChanged(null);
              }
              NavigationService.navigate(data.route)
            }}>
            <Left>
              <Icon
                active
                name={data.icon}
                style={{ color: "#333", fontSize: 24, width: 30 }}
                type={data.type || 'FontAwesome'}
              />
              <Text style={styles.text}>
                {Languages.SideMenu[data.name]}
              </Text>
            </Left>
            {
              data.types &&
              <Right style={{ flex: 1 }}>
                <Badge>
                  <Text
                    style={styles.badgeText}
                  >{`${data.types}`}</Text>
                </Badge>
              </Right>
            }
          </ListItem>}
      />
    )
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, top: -1 }}
          render
        >
          <View style={styles.drawerBg}>
            { this.getCoverImage() }
            <Text style={styles.drawerText}>{ this.getCoverText() }</Text>
          </View>


          <View style={styles.divider}>
            {this.renderList(datas1.filter(item => {
              if (item.authRequired && !this.props.isAuthenticated) {
                return false
              }

              if (item.hideWhenAuthenticated && this.props.isAuthenticated) {
                return false
              }

              return true
            }))}
          </View>
          <View>
            {this.renderList(datas2.filter(item => {
              if (item.authRequired && !this.props.isAuthenticated) {
                return false
              }

              if (item.hideWhenAuthenticated && this.props.isAuthenticated) {
                return false
              }

              return true
            }))}
          </View>

        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    isAuthenticated: user.profile !== null,
    fullName: user.fullProfile ? (user.fullProfile.fullName || '') : '',
    fullProfile: user.fullProfile
  }
}

export default connect(mapStateToProps, { onAuthStateChanged })(MenuLeft)
