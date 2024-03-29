import React, {
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native'

const { width, height, scale } = Dimensions.get('window'),
  vw = width / 100,
  vh = height / 100,
  vmin = Math.min(vw, vh),
  vmax = Math.max(vw, vh)

export default StyleSheet.create({
  spinner: {
    width: width,
    alignItems: 'center',
  },
})
