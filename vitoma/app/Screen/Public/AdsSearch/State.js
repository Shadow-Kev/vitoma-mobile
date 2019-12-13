import { Languages } from '@common'
import _ from 'lodash'

const State = {
  title: {
    value: '',
    valid: false,
    errorMsg: '',
    validations: [
      { validate: (value) => value.length, errorMsg: 'requiredField' },
      { validate: (value) => value.length > 2, errorMsg: 'tooShort' }
    ]
  },
  categories: {
    value: 'ELECTRONIC',
    valid: false,
    errorMsg: '',
    list: [
      {
          id: 'ELECTRONIC',
          labelId: 'electronics'
      },
      {
          id: 'HOME',
          labelId: 'home'
      },
      {
          id: 'HEALTHBEAUTY',
          labelId: 'healthBeauty'
      },
      {
          id: 'CLOTHINGSHOESJEWELRY',
          labelId: 'clothingShoes'
      },
      {
          id: 'TOYSKIDSBABY',
          labelId: 'toysKidsBaby'
      },
      {
          id: 'HANDMADE',
          labelId: 'handMade'
      },
      {
          id: 'GROCERYWHOLEFOODSMARKET',
          labelId: 'grocery'
      },
      {
          id: 'SPORTOUTDOORS',
          labelId: 'sportOutdoors'
      },
      {
        id: 'REALESTATE',
        labelId: 'realEstate'
      },
      {
        id: 'AUTOMOTIVEINDUSTRIAL',
        labelId: 'automotiveIndustrial'
      },
      {
        id: 'BOOKS',
        labelId: 'books'
      },
      {
        id: 'JOBS',
        labelId: 'jobs'
      }
    ],
    validations: [
      { validate: (value) => value.length, errorMsg: 'requiredField' },
    ]
  },
  country: {
    value: '',
    valid: true,
    errorMsg: '',
    list: ['benin', 'togo', 'guinea', 'mali',  "ivoryCost", 'burkinaFaso', 'ghana'],
    validations: []
  },
  currencies: {
    value: '',
    valid: true,
    errorMsg: '',
    list: [
      { title: 'Franc CFA (XOF)', value: 'XOF' },
      { title: 'Franc CFA (XAF)', value: 'XAF' },
      { title: 'Franc GNF', value: 'GNF' },
      { title: 'Dollar US', value: 'USD' },
      { title: 'Dollar CAN', value: 'CAD' },
      { title: 'Euro', value: 'EUR' }
    ],
    validations: []
  },
  price: {
    min: 0,
    max: 0,
    valid: false,
    errorMsg: '',
    list: [
      "1000", "5000", "10000", "50000", "100000", "500000", "1000000"
    ],
    validations: [
      {
        validate: (min, max) => {
          return (
            (min === null || max === null) ||
            (parseInt(min) <= parseInt(max))
          )
        },
        errorMsg: 'minAndMaxPriceInvalid'
      },
    ]
  },
}

export default State
