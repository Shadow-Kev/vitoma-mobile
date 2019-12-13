const React = require("react-native");
const { Platform } = React;

export default {
  formBg: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  col: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    fontFamily: 'Montserrat-Regular',
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 12,
    width: '100%',
    marginBottom: 10,
    borderRadius: 0,
  },
  textInputHalf: {
    fontFamily: 'Montserrat-Regular',
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 12,
    width: '48.5%',
    marginBottom: 10,
    borderRadius: 0,
  },
  textInputMulti: {
    fontFamily: 'Montserrat-Regular',
    borderBottomWidth: 0,
    borderColor: '#DDD',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 12,
    width: '100%',
    marginBottom: 10,
    borderRadius: 0,
    ...Platform.select({
      ios: {
        height: 100,
        paddingTop: 20,
      },
      android: {
        textAlignVertical: 'top',
      },
    }),
  },
  btn: {
    width: '100%',
    borderRadius: 0,
    backgroundColor: '#E8BB03',
    paddingVertical: 15,
    paddingLeft: 5,
    ...Platform.select({
      android: {
        height: 60,
      },
    }),
  },
  btnText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    fontSize: 14,
    alignSelf: 'center',
  },

  formBtnText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFF',
    fontSize: 12,
  },
  formBtnIcon: {
    color: '#FFF',
    fontSize: 24,
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  }
}
