import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import css from './style'

export default class Index extends Component {
  render() {
    return (
      <View
        style={[
          css.spinner,
          typeof this.props.css != 'undefined' ? this.props.css : null,
        ]}
      >
        <ActivityIndicator
          color={this.props.color ? this.props.color : '#333333'}
        />
      </View>
    )
  }
}
