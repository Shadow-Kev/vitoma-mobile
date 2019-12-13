import React from 'react'
import { Dimensions, YellowBox, Alert } from 'react-native'
import Expo, { Notifications } from 'expo'
import * as Font from 'expo-font'
import { createDrawerNavigator, createStackNavigator } from "react-navigation"
import { Languages, Config, Logger } from '@common';

import * as firebase from 'firebase'

import DrawerContent from '@Component/Menu/Left'

import PublicIntro from '@Screen/Public/Intro'
import PublicHome from '@Screen/Public/Home'
import PublicSearchResults from '@Screen/Public/SearchResults'
import PublicAds from '@Screen/Public/Ads'
import PublicAdsDetail from '@Screen/Public/AdsDetail'
import PublicAdsSearch from '@Screen/Public/AdsSearch'
import PublicMembers from '@Screen/Public/Members'
import PublicMemberDetails from '@Screen/Public/MemberDetails'
import PublicAboutUs from '@Screen/Public/AboutUs'
import PublicContact from '@Screen/Public/Contact'

import MemberSignIn from '@Screen/Member/SignIn'
import MemberSignInEmailPassword from '@Screen/Member/SignInEmailPassword'
import MemberSignInWithPhone from '@Screen/Member/SignInWithPhone'
import MemberSignUp from '@Screen/Member/SignUp'
import MemberForgotPassword from '@Screen/Member/ForgotPassword'
import MemberHome from '@Screen/Member/Home'
import MemberAds from '@Screen/Member/Ads'
import MemberAdCreate from '@Screen/Member/AdCreate'
import MemberAdUpdate from '@Screen/Member/AdUpdate'
import MemberAdPublished from '@Screen/Member/AdCreate/Published'
import MemberBookmark from '@Screen/Member/Bookmark'
import MemberSettings from '@Screen/Member/Settings'
import MemberProfile from '@Screen/Member/Profile'
import MemberMessages from '@Screen/Member/Messages'

import NavigationService from '@Service/Navigation'

const deviceWidth = Dimensions.get("window").width;

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore } from 'redux-persist'
import reducers from '@redux/reducers'
import thunk from 'redux-thunk'

const middleware = [thunk]
const store = compose(applyMiddleware(...middleware))(createStore)(reducers)

persistStore(store)//.purge()

if (!__DEV__) {
  console.log = function () { }
  console.info = function () { }
  console.warn = function () { }
  console.error = function () { }
  console.debug = function () { }
}

// Ignore some warnings
YellowBox.ignoreWarnings([
  'Setting a timer for a long period of time',
  // TODO: - Mettre a jour NativeBase
  'Warning: ListView'
]);

const Drawer = createDrawerNavigator(
  {
    PublicHome: {
      screen: PublicHome,
    },
    PublicSearchResults: {
      screen: PublicSearchResults
    },
    MemberHome: {
      screen: MemberHome,
    },
  },
  {
    contentComponent: DrawerContent,
    contentOptions: {
      activeTintColor: "#e91e63"
    },
    headerMode: "none",
    initialRouteName: "PublicHome",
    drawerWidth: deviceWidth - 50
  }
)

const AppNav = createStackNavigator(
  {
    // PublicIntro Screens
    PublicIntro: {
      screen: PublicIntro
    },
    PublicAds: {
      screen: PublicAds
    },
    PublicAdsSearch: {
      screen: PublicAdsSearch
    },
    PublicAdsDetail: {
      screen: PublicAdsDetail
    },
    PublicMembers: {
      screen: PublicMembers
    },
    PublicMemberDetails: {
      screen: PublicMemberDetails
    },
    PublicAboutUs: {
      screen: PublicAboutUs
    },
    PublicContact: {
      screen: PublicContact
    },

    // Member Screens
    MemberSignUp: {
      screen: MemberSignUp
    },
    MemberSignIn: {
      screen: MemberSignIn
    },
    MemberSignInEmailPassword: {
      screen: MemberSignInEmailPassword
    },
    MemberSignInWithPhone: {
      screen: MemberSignInWithPhone
    },
    MemberForgotPassword: {
      screen: MemberForgotPassword
    },
    MemberAds: {
      screen: MemberAds
    },
    MemberAdCreate: {
      screen: MemberAdCreate
    },
    MemberAdUpdate: {
      screen: MemberAdUpdate
    },
    MemberAdPublished: {
      screen: MemberAdPublished
    },
    MemberMessages: {
      screen: MemberMessages
    },
    MemberProfile: {
      screen: MemberProfile
    },
    MemberSettings: {
      screen: MemberSettings
    },
    MemberBookmark: {
      screen: MemberBookmark
    },

    // Drawer Screens
    Drawer: {
      screen: Drawer
    }
  },
  {
    headerMode: "none",
    initialRouteName: "PublicIntro"
  }
)


const fontAssets = {
  'JosefinSans-Bold': require('@Asset/fonts/JosefinSans-Bold.ttf'),
  'JosefinSans-Regular': require('@Asset/fonts/JosefinSans-Regular.ttf'),
  'JosefinSans-SemiBold': require('@Asset/fonts/JosefinSans-SemiBold.ttf'),
  'Lato-Medium': require('@Asset/fonts/Lato-Medium.ttf'),
  'Lato-Regular': require('@Asset/fonts/Lato-Regular.ttf'),
  'Lato-Semibold': require('@Asset/fonts/Lato-Semibold.ttf'),
  'Montserrat-Regular': require('@Asset/fonts/Montserrat-Regular.ttf'),
  'Montserrat-SemiBold': require('@Asset/fonts/Montserrat-SemiBold.ttf'),
  'Roboto_medium': require('./node_modules/native-base/Fonts/Roboto_medium.ttf')
}

export default class App extends React.Component {

  componentWillMount() {
    // Initialize Firebase
    firebase.initializeApp(Config.FirebaseConfig);

    // Initialize the logger
    new Logger();
  }

  async componentDidMount() {
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    await Font.loadAsync(fontAssets)
  }

  componentWillUnmount() {
    if (this._notificationSubscription)
      this._notificationSubscription.remove()
  }

  _handleNotification = (notification) => {
    if (notification && notification.data) {
      var type = notification.data.type
      if (type === 'NEW_MESSAGE') {
        Alert.alert(
          'MESSAGE',
          Languages.SendMsgForm.youHaveAMsg,
          [
            {
              text: Languages.Home.skip,
              onPress: () => { }
            },
            {
              text: Languages.Home.ok,
              onPress: () => {
                NavigationService.navigate('MemberMessages')
              }
            },
          ],
          { cancelable: false }
        )
      }
    }
  };

  render() {
    return (
      <Provider store={store}>
        <AppNav ref={(r) => { NavigationService.setTopLevelNavigator(r) }} />
      </Provider>
    );
  }
}
