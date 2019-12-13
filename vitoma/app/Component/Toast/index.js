/**
 * @format
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { BlockTimer, Events } from '@common'

class Toast extends Component {
  constructor(props) {
    super(props)
    this.nextToastId = 0
    this.renderToast = this.renderToast.bind(this)
  }

  componentDidMount() {
    this.toastListener = Events.onToast(this.doToast.bind(this))
  }

  componentWillUnmount() {
    this.toastListener.remove()
  }

  shouldComponentUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    return true
  }

  render() {
    const { toast } = this.props
    const list = toast.list.filter(item => (this.props.token || '') === item.token)

    return (
      <View style={styles.container}>{list.map(this.renderToast)}</View>
    )
  }

  renderToast(msg, index) {
    const { removeToast } = this.props
    const onPress = () => removeToast(msg.key)
    return (
      <TouchableOpacity key={index} style={styles.textWrap} onPress={onPress}>
        <Text style={styles.text}>{msg.msg}</Text>
      </TouchableOpacity>
    )
  }

  doToast(msg, duration = 4000, token = '') {
    const { addToast, removeToast } = this.props
    const key = this.nextToastId++ //unique message key
    addToast(msg, key, token)
    BlockTimer.timer().setTimeout(() => removeToast(key), duration)
  }
}

const _height = Dimensions.get('window').height
const height = Platform.OS !== 'ios' ? _height : _height - 20
const width = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height / 10 + 20, //padding bottom
    left: width / 20,
    right: width / 20, // padding horizontal
    alignItems: 'center',
    padding: 20,
  },
  textWrap: {
    backgroundColor: 'rgba(60,60,60,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  text: {
    color: '#FFFFFF',
  },
})

Toast.propTypes = {
  toast: PropTypes.object.isRequired,
  addToast: PropTypes.func.isRequired,
  removeToast: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    toast: state.toast,
  }
}

const mapDispatchToProps = (dispatch) => {
  const { addToast, removeToast } = require('@redux/actions')
  return {
    addToast: (msg, key, token) => dispatch(addToast(msg, key, token)),
    removeToast: (msg) => dispatch(removeToast(msg)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toast)
