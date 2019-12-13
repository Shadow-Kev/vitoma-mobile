import { Languages, Tools, Constants } from '@common'
import _ from 'lodash'

const State = function(actualState) {
  return ({
    title: {
      value: actualState.title,
      valid: true,
      visible: true,
      errorMsg: '',
      validations: [
        { validate: (value) => value.length, errorMsg: 'requiredField' },
        {  validate: (value) => value.length > 2, errorMsg: 'tooShort' }
      ]
    },
    description: {
      value: actualState.description,
      valid: false,
      visible: true,
      errorMsg: '',
      validations: [
        { validate: (value) => value.length, errorMsg: 'requiredField' },
        { validate: (value) => value.length >= 20, errorMsg: 'tooShort' }
      ]
    },
    price: {
      value: actualState.cost + '',
      valid: false,
      visible: true,
      errorMsg: '',
      validations: [
        { validate: (value) => (!isNaN(value) && value >= 0), errorMsg: 'enterValidNumber' }
      ]
    },
    currency: {
      value: actualState.currency || 'XOF',
      valid: true,
      visible: true,
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
    country: {
      value: actualState.country || 'benin',
      valid: true,
      visible: true,
      list:['benin', 'togo', 'guinea', 'mali',  "ivoryCost", 'burkinaFaso', 'ghana'],
      validations: []
    },
    email: {
      value: actualState.owner.email || "",
      valid: true,
      visible: true,
      errorMsg: '',
      validations: [
        {
          validate: (value, emailPhoneConfig) => {
            if(!value.length && emailPhoneConfig != 'showPhoneNumber')
              return false;

            return true
          },
          errorMsg: 'enterValidEmailBecauseOfConfig'
        },
        {
          validate: (value, emailPhoneConfig) => {
            if(!value.length && emailPhoneConfig == 'showPhoneNumber')
              return true;

            var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regExp.test(value);
          },
          errorMsg: 'enterValidEmail'
        }
      ]
    },
    phone: {
      value: actualState.owner.phone,
      valid: true,
      visible: true,
      errorMsg: '',
      validations: [
        {
          validate: (value, emailPhoneConfig) => {
            if(!value.length && emailPhoneConfig != 'showEmail')
              return false;

            return true
          },
          errorMsg: 'enterValidPhoneNumber'
        },
        {
          validate: (value, emailPhoneConfig) => {
            if(!value.length && emailPhoneConfig == 'showEmail')
              return true;

            return value.length >= 8
          },
          errorMsg: 'enterValidPhoneNumber'
        }
      ]
    },
    emailPhoneConfig: {
      value: 'showPhoneNumber',
      valid: true,
      visible: true,
      list: [ "showEmail", "showPhoneNumber", "showBoth"],
      validations: []
    },
    carCompany: {
      value: '',
      valid: true,
      visible: false,
      list: [
        "AC", "Acura", "Alfa Romeo", "AM General", "American Motors (AMC)", "Amphicar", "Aston Martin", "Auburn", "Audi", "Austin", "Austin-Healey", "Avanti-Studebaker",
        "Bentley", "BMW", "Bricklin", "Bugatti", "Buick", "Cadillac", "Caterham", "Chevrolet", "Chrysler", "Daewoo", "Daihatsu", "Daimler", "Datsun", "De Soto", "DeLorean", "Diamond T",
        "Dodge", "Dodge or Ram", "Durant", "Eagle", "Essex", "Excalibur", "Factory Five Racing", "Ferrari", "Fiat", "Fisker", "Ford", "Genesis", "Geo", "GMC", "Hino", "Honda", "Hudson",
        "Hummer", "Hupmobile", "Hyundai", "Infiniti", "International", "Isuzu", "Jaguar", "Jeep","Jensen", "Kaiser", "Karma", "Kelmark", "Kia", "Lada", "Lamborghini", "Land Rover", "Lexus",
        "Lincoln", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-AMG", "Mercedes-Benz", "Mercury", "MG", "MINI", "Mitsubishi", "Morgan", "Morris", "MP", "MV-1", "Nash", "Nissan", "Oldsmobile",
        "Opel", "Packard", "Peugeot", "Plymouth", "Pontiac", "Porsche", "Puma", "Ram", "Rambler", "Renault","Rolls-Royce", "Rover", "Ruggles", "Saab", "Saleen", "Saturn", "Scion", "Shelby",
        "Skoda", "smart", "Spyker", "Standard", "Sterling", "Studebaker", "Subaru", "Sunbeam", "Suzuki", "Tesla", "Toyota", "Triumph", "TVR", "Vauxhall", "Volkswagen", "Volvo", "Willys", "Yugo"
      ],
      validations: []
    },
    fuel: {
      value: '',
      valid: true,
      visible: false,
      list: [ "Petrol", "Diesel", "Eletric"],
      validations: []
    },
    year: {
      value: '',
      valid: true,
      visible: false,
      list: _.range(1999, 2020),
      validations: []
    },
    model: {
      value: '',
      valid: true,
      visible: false,
      errorMsg: '',
      validations: []
    },
    color: {
      value: '',
      valid: true,
      visible: false,
      errorMsg: '',
      validations: []
    },
    categories: {
      value: actualState.firstLevelCategory,
      valid: false,
      visible: true,
      errorMsg: '',
      list: [
        {
            id: 'ELECTRONICS',
            labelId: 'electronics',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'HOME',
            labelId: 'home',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'HEALTHBEAUTY',
            labelId: 'healthBeauty',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'CLOTHINGSHOESJEWELRY',
            labelId: 'clothingShoes',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'TOYSKIDSBABY',
            labelId: 'toysKidsBaby',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'HANDMADE',
            labelId: 'handMade',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'GROCERYWHOLEFOODSMARKET',
            labelId: 'grocery',
            subCategories: [],
            additionalFields: []
        },
        {
            id: 'SPORTOUTDOORS',
            labelId: 'sportOutdoors',
            subCategories: [],
            additionalFields: []
        },
        {
          id: 'REALESTATE',
          labelId: 'realEstate',
          subCategories: [],
          additionalFields: []
        },
        {
          id: 'AUTOMOTIVEINDUSTRIAL',
          labelId: 'automotiveIndustrial',
          subCategories: [],
          additionalFields: ['carCompany', 'fuel', 'model', 'year', 'color']
        },
        {
          id: 'BOOKS',
          labelId: 'books',
          subCategories: [],
          additionalFields: []
        },
        {
          id: 'JOBS',
          labelId: 'jobs',
          subCategories: [],
          additionalFields: []
        }
      ],
      validations: [
        { validate: (value) => value.length, errorMsg: 'requiredField' },
      ]
    },
    photos: {
      value: actualState.galleryImages.map((gallery, index) => {
        return {
          src: Tools.getImage(actualState.galleryImages, Constants.PostImage.small, index)
        }
      }),
      valid: true,
      visible: true,
      errorMsg: '',
      validations: [
        {
          validate: (images) => (images.filter(image => image.src != null).length > 0),
          errorMsg: 'onePhotosRequired'
        }
      ]
    },
    published: {
      valid: true,
      visible: false
    }
  });
}

export default State
