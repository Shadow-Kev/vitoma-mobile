const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
  },
  drawerBg: {
    height: deviceHeight / 3.5,
    alignSelf: "stretch",
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: '#CC0489',
    padding: 20
  },
  drawerUserImage: {
    resizeMode: "cover",
    height: 120,
    width: 120,
    marginTop: 16,
    marginBottom: 10
  },
  drawerAvatarAndLogo: {
    resizeMode: "cover",
    marginTop: 20,
    marginBottom: 20
  },
  drawerText: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 8
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 12,
    marginLeft: 20,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined,
    justifyContent: "center",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    paddingBottom: 20,
    marginBottom: 20,
  },

};
