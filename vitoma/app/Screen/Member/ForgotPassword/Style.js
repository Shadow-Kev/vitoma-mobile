/** @format */

import React, {
  StyleSheet,
  Dimensions,
} from 'react-native'

const { width, height, scale } = Dimensions.get('window'),
  vh = height

export default StyleSheet.create({
  wrap: {
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 8,
    height: vh,
    position: 'relative',
  },
  body: {
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 8,
    height: vh / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  headerLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 20,
    marginTop: 10,
  },
  headerIcon: {
      fontSize: 22,
      color: '#CC0489',
  },
  backSignInBtn: {
      flexDirection: 'row',
      paddingTop: 20,
      paddingHorizontal: 20,
  },
  backSignInLabel: {
    fontSize: 14,
    color: '#CC0489',
    fontWeight: '500',
    marginTop: 2
  },
  imageBack: {
    width: 18,
    height: 20,
    flex: 1,
  },
  styleLogo: {
    color: 'rgba(72,194,172,1)',
    fontSize: 40,
  },
  wrapForm: {
    flex: 1,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    position: 'relative',
  },
  textInput: {
    borderBottomWidth: 1,
    paddingTop: 0,
    paddingRight: 12,
    paddingBottom: 0,
    paddingLeft: 12,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 10,
    marginLeft: 0,
    borderBottomColor: 'rgba(0,0,0, 0.2)',
    backgroundColor: '#FFF',
    height: 40,
    borderRadius: 2,
    fontSize: 15,
    color: '#333',
  },
  textInputWrap: {
    marginTop: 10,
  },
  textLabel: {
    fontSize: 12,
    color: '#CC0489',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8,
  },
  btnLogInText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orText: {
    color: 'rgb(51,51,51)',
    fontSize: 14,
    marginTop: 0,
    marginRight: 15,
    marginBottom: 0,
    marginLeft: 15,
  },
  underbtnLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLogInFace: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(59,89,152)',
    paddingTop: 9,
    paddingRight: 9,
    paddingBottom: 9,
    paddingLeft: 9,
    marginTop: 15,
    flexDirection: 'row',
  },
  bottomWrap: {
    flex: 1 / 2,
    position: 'relative',
  },
  bottomWrapContent: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    left: width / 4,
  },
  btnSignUpText: {
    color: 'rgb(72,194,172)',
    fontSize: 14,
    fontWeight: 'bold',
  },
  wrapButton: {
    flex: 1,
    marginTop: 15,
    marginRight: 15,
    marginBottom: 15,
    marginLeft: 15,
    alignItems: 'center',
  },
  btnLogIn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CC0489',
    width: width * 60 / 100,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    marginBottom: 14,
    borderRadius: 25,
  },
  btnLogInLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    width: width * 60 / 100,
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    marginBottom: 14,
    borderRadius: 25,
  },
  buttonView: {
    backgroundColor: '#eee',
    borderColor: '#eee',
    // "flex": 1,
    flexDirection: 'row',
  },
  btnLogInLabel: {
    color: '#999',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  wrapTitle: {
    marginTop: 16,
    marginVertical: 8
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#CC0489'
  }
})
