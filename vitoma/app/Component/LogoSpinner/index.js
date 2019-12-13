import React from 'react'
import { View, Animated, Image, StyleSheet } from 'react-native'

class LogoSpinner extends React.Component {
  constructor(props) {
    super(props)

    this.animateValue = new Animated.Value(0)
    this.animatedStyle = {
      transform: [
        {
          rotate: this.animateValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    }

    this.doAnimation = this.doAnimation.bind(this)
  }

  componentDidMount() {
    this.doAnimation()
  }

  doAnimation() {
    this.animateValue.setValue(0)
    Animated.sequence([
      Animated.timing(this.animateValue, {
        toValue: 6,
        duration: 3000,
        friction: 0.5,
      }),
    ]).start(() => this.doAnimation())
  }

  render() {
    const { fullStretch, style, logo } = this.props
    return (
      <View
        style={[
          fullStretch ? styles.container_full_stretch : styles.container,
          style,
        ]}
      >
        <Animated.View style={this.animatedStyle}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: null,
    width: null,
  },
  container_full_stretch: {
    height: null,
    width: null,
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  logo: {
    height: 50,
    width: 50,
  },
})

//noinspection JSUnusedGlobalSymbols
LogoSpinner.defaultProps = {
  logo: require('@Asset/images/logoSpin.png'),
  fullStretch: true,
}

export default LogoSpinner
