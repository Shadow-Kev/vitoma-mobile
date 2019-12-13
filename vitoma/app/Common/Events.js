import EventEmitter from '@Service/AppEventEmitter'

// Toast Events and Listeners
const toast = (msg, duration = 4000, token = '') => EventEmitter.emit('toast', msg, duration, token)
const onToast = func => EventEmitter.addListener('toast', func)

// Gallery Events
const openGallery = data => EventEmitter.emit('open.gallery.click', data)
const closeGallery = () => EventEmitter.emit('close.gallery.click')

const onOpenGallery = func => EventEmitter.addListener('open.gallery.click', func)
const onCloseGallery = func => EventEmitter.addListener('close.gallery.click', func)

export default {
  // Events
  toast,
  openGallery,
  closeGallery,

  // Listeners
  onToast,
  onOpenGallery,
  onCloseGallery
}
