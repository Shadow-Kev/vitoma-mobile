/** @format */

import * as Localization from 'expo-localization';
import LocalizedStrings from 'localized-strings'
import { Platform } from 'react-native'

/* API
 setLanguage(languageCode) - to force manually a particular language
 getLanguage() - to get the current displayed language
 getInterfaceLanguage() - to get the current device interface language
 formatString() - to format the passed string replacing its placeholders with the other arguments strings
 */

const Languages = new LocalizedStrings({

  fr: {
    // validations
    Validations: {
      requiredField: 'Ce champ est requis',
      tooShort: 'Trop court',
      enterValidNumber: 'Entrez un chiffre valide',
      onePhotosRequired: 'Vous devez télécharger au moins une photo',
      enterValidEmail: 'Veuillez saisir un email valide',
      enterValidPhoneNumber: 'Entrez un numéro de téléphone valide précédé du code regionale',
      enterValidEmailBecauseOfConfig: 'Veuillez saisir un email ou modifier les options de contact',
      minAndMaxPriceInvalid: 'Le prix minimum doit être inferieur au prix maximum',
      notPublishedAd: "Votre annonce n'a pas été publiée. Veuillez réessayer plus tard ou contactez le service à la clientèle.",
      notUpdatedAd: "Votre annonce n'a pas été modifiée. Veuillez réessayer plus tard ou contactez le service à la clientèle.",
      invalidEmailPassword: "L'email ou le mot de passe est erroné! Veuillez réessayer à nouveau.",
      invalidCurrentPassword: "Erreur: Verifier à nouveau que le mot de passe actuel est exacte",
      invalidPassword: 'Le mot de passe doit contenir au moins 6 caractères et une lettre majuscule',
      invalidConfirmPassword: 'Le mot de passe et la confirmation ne sont pas identiques',
      emailNotVerified: 'Vous devez confirmer votre adresse email. Un courriel vous a été envoyé',
      sendEmailVerificationFailed: "Nous ne sommes pas en mésure de vous envoyer un courriel de vérification. Contactez notre service à la clientèle ou utilisez un autre email.",
      firstNameRequired: "Le prénom est requis",
      lastNameRequired: "Le nom est requis",
      setProfilePermissionDenied: "Vous n'ètes pas autorisé à effectuer cette opération. Commencez par vous déconnecter, puis reconnectez pour recommencer à nouveau",
      unexpectedError: "Une erreur est survenue sur le serveur. Veuillez réessayer ultérieurement !",
      modificationPerformed: "Modificaion effectuée avec succès",
      messageRequired: "Le message est requis",
      messageSuccesfullySended: 'Votre message est envoyé avec succès',
      messageNotSended: "Impossible d'envoyer votre message. Réessayer à nouveau",
      recentConnexionRequired: "Vous devez être recemment connecté pour éffectuer cette opération.",
      recaptchaNotVerified: "Recaptcha non verifié"
    },

    // Authentication
    Auth: {
      loginToYourAccount: 'Connectez-vous à votre compte !',
      newUserSignUp: 'Inscrivez-vous comme nouvel utilisateur',
      signUp: "S'inscrire",
      signIn: "Se connecter",
      emailAdress: "Adresse email",
      phoneNumber: "Numero de téléphone",
      password: "Mot de passe",
      confirmPassword: "Confirmation mot de passe",
      doYouHaveAnAccount: "Avez-vous un compte ?",
      emailOrPhone: 'Adresse email ou numéro de téléphone.',
      donotHaveAnAccount: "Vous n'avez pas encore de compte ?",
      forgotPassword: "Mot de passe oublié ?",
      authInfo: 'Vous y êtes presque',
      needToBeLogIn: 'Seul les utilisateurs connectés peuvent poster des annonces. Connectez-vous !',
      needToBeLogInToSendMessage: 'Seul les utilisateurs connectés peuvent envoyer des messaages. Connectez-vous !',
      goBack: 'Retour',
      resetPassword: 'Réinitialiser le mot de passe',
      reset: 'Réinitialiser',
      resetPasswordEmailSended: 'Un email vous à été envoyé pour réinitialiser votre mot de passe',
      facebookAuthError: "Echec d'authentication avec Facebook. Veuillez réessayer !",
      phoneAuthError: "Echec d'authentication avec votre numéro de téléphone. Veuillez réessayer !",
      error: 'Erreur',
      verify: "Vérifier",
      enterCode: "Entrer le code",
      enterVerificationCode: "Entrer le code de vérification",
      codeSent: 'Un code de vérification est envoyé à votre numéro',
      codeNotValid: "Le code que vous avez saisi n'est pas valide",
      continue: 'Continuer',
      firstName: 'Prénom',
      lastName: 'Nom'
    },

    // Categories
    Categories: {
      fashion: 'Mode',
      books: 'Livres',
      household: 'Ménages',
      pets: 'Animaux',
      jobs: 'Emplois',
      services: 'Services',
      others: 'Autres',
      electronics: 'Électroniques',
      home: 'Maison',
      healthBeauty: 'Santé et Beauté',
      clothingShoes: 'Vêtements et Chaussures',
      toysKidsBaby: 'Jouets',
      handMade: 'Fait-main',
      grocery: 'Épicerie et Marché',
      sportOutdoors: 'Sports et Plein air',
      automotiveIndustrial: 'Automotile et Industrielle',
      realEstate: 'Immobilier'
    },

    // Intro Screen
    Intro: {
      searchWhatYouWant: 'Cherchez ce que vous voulez',
      alwaysAspire: 'Aspirez toujours à être meilleur(e) dans ce que vous souhaitez',
      preferTheBest: 'Préférer le meilleur',
      exploreCategories: 'Explorez les catégories à votre goût',
      buyAndSellWithUs: 'Achetez / Vendez avec nous',
      weEarnMoneyFromServices: "Nous gagnons de l'argent avec les services, pas avec les utilisateurs",
      getStarted: 'Commencer',
      next: 'Suivant',
      skip: 'Ignorer',
      biggestAfricainInventory: 'Le plus grand inventaire Togolais'
    },

    // Home Screen
    Home: {
      home: 'Accueil',
      featuresAds: 'Annonces sponsorisées',
      popularCountries: 'Pays populaires',
      recentAds: 'Annonces récentes',
      myLastViews: 'Mes dernières vues',
      recentMessages: 'Messages récents',
      popularMembers: 'Membres populaires',
      noResultsSearch: 'Aucune annonce trouvée',
      ok: 'Ok',
      skip: 'Ignorer'
    },

    // Members Screen
    Members: {
      members: 'Membres',
      noAdPublished: 'Aucune annonce publiée',
      oneAdPublised: 'Une annonce publiée',
      adsPublished: 'annonces publiées',
      memberAds: "Annonces",
      address: "Adresse",
      phoneNumber: "Numéro de téléphone",
      email: 'Email',
      webSite: 'Site Web'
    },

    // Ads Screen
    Ads: {
        ads: 'Annonces',
        myAds: 'Mes Annonces',
        sortByPrice: 'Trier par prix',
        filters: 'Filtres'
    },

    // AdsDetail Screen
    AdsDetail: {
      sharedWithYou: 'Partager avec vous:',
      publishedDate: 'Date de publication',
      rating: 'Votes',
      likes: "Personnes qui aiment",
      overview: 'Description',
      photoGallery: 'Galerie de photos',
      contact: 'Contact',
      firstName: 'Prénom',
      lastName: 'Nom',
      yourEmailAddress: 'Votre adresse email',
      yourMobile: 'Votre numéro de téléphone',
      yourMessage: 'Votre message',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      webSite: 'Site web',
      sameUserPosts: 'Du même utilisateur',
      similarAds: 'Annonces Similaires',
      myLastViews: 'Mes dernières vues',
      send: 'Envoyer',
      contactForm: "Formulaire de contact",
      contactInfos: 'Infos',
      next: 'Suivant',
      prev: 'Précédent',
      close: 'Fermer'
    },

    // SendMsgForm
    SendMsgForm: {
      firstName: 'Prénom',
      lastName: 'Nom',
      yourEmailAddress: 'Votre adresse email',
      yourMobile: 'Votre numéro de téléphone',
      yourMessage: 'Votre message',
      send: 'Envoyer',
      youHaveAMsg: 'Vous avez reçu un message',
      cannotSendMessageToYourself: 'Désolé, vous ne pouvez pas vous envoyer un message.'
    },

    // Bookmark Screen
    Bookmark: {
      bookmark: 'Mes Favoris',
      bookmarkAdded: 'Annonce ajoutée dans vos favoris',
      bookmarkNotAdded: "Erreur lors de l'ajout dans vos favoris. Veuillez réessayer plus tard !",
      bookmarkDeleted: 'Annonce supprimée de vos favoris',
      bookmarkNotDeleted: "Erreur lors de la suppression de vos favoris. Veuillez réessayer plus tard !",
      noBookmarks: 'Aucun favori ajouté pour le moment'
    },

    // AdsSearch Screen
    AdsSearch: {
        search: 'Recherche',
        adTitle: "Titre de l'annonce",
        adCurrency: 'Devise',
        adPrice: 'Prix',
        category: 'Categorie',
        selectOne: 'Choisissez',
        country: 'Pays',
        noResultsSearch: 'Aucune annonce trouvée',
        allCountries: 'Tous les pays'
    },

    // AdCreate Screen
    AdCreate: {
      createAd: 'Poster une annonce',
      publish: 'Publier',
      Overview: {
        step1: 'ÉTAPE 1. Description',
        adTitle: "Titre de l'annonce",
        adDescription: "Description de l'annonce",
        adPrice: 'Prix',
        adCurrency: 'Devise',
        adCountry: 'Pays',
        adDescriptionMinChars: '20 caractères minimum',
      },
      CategoryInfos: {
        step2: 'ÉTAPE 2. Informations sur la catégorie',
        category: 'Categorie',
        selectOne: 'Choisissez',
        back: 'Retour',
        company: 'Compagnie',
        model: 'Modèle',
        fuel: 'Type de carburant',
        year: 'Année',
        color: 'Couleur'
      },
      ContactInfos: {
        step3: 'ÉTAPE 3. Informations de contact',
        email: 'Email',
        phone: 'Téléphone',
        emailPhoneConfig: 'Configuration / Options',
        showPhoneNumber: 'Afficher uniquement le numéro de téléphone',
        showEmail: "Afficher uniquement l'email",
        showBoth: "Afficher l'email et le numéro de téléphone"
      },
      Photos: {
        step4: 'ÉTAPE 4. Photos'
      },
      optional: 'Optionnel',
      required: 'Requis'
    },

    // AdUpdate Screen
    AdUpdate: {
      updateAd: 'Modifier votre annonce',
      publish: 'Modifier'
    },

    // Ad Published Screen
    AdPublished: {
      published: 'Publiée',
      congratulations: 'Félicitations',
      successfulyPublished: 'Votre annonce a été publiée',
      preview: 'Aperçu',
      postedOn: 'Publiée le:',
      warning: 'Avertissement',
      deleteWarning: "Voulez-vous vraiment supprimer cette annonce?",
      yes: 'Supprimer',
      no: 'Annuler',
      adDeleted: 'Votre annonce à bien été supprimée',
      adNotDeleted: 'Une erreur est survenue lors de la suppression. Veuillez réessayer à nouveau.'
    },

    UserProfile: {
      basicsInformations: "Informations de base",
      firstName: "Prénom",
      lastName: "Nom",
      none: "Aucun",
      male: "Masculin",
      femele: "Fémimin",
      addressInformations: "Informations d'adresse",
      address: "Adresse",
      city: "Ville",
      state: "Province",
      country: "Pays",
      postCode: "Code Postal",
      contactInformations: "Informations de contact",
      phoneNumber: "Numéro de téléphone",
      webSiteUrl: "Site web",
      changePassword: "Changer de mot de passe",
      oldPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmation du mot de passe",
      save: "Sauvegarder",
      aboutYou: "À propos de vous",
      memberSince: 'Membre depuis',
      hi: 'SALUT'
    },

    // Settings Screen
    Settings: {
      settings: "Paramètres",
      english: 'Anglais',
      french: 'Français',
      languages: 'Langues',
      save: 'Sauvegarder',
      countries: 'Pays',
      changesDone: 'Modification effectuée aux paramètres',
      currency: 'Devise'
    },

    // AboutUs Screen
    AboutUs: {
      aboutUs: 'À Propos de Nous',
      aboutUsDescription: "Fondée en 2019, Vitoma est une plateforme dynamique qui vous permet de faire des échanges dans de multiples domaines.\n\n\
      Vitoma représente le plus grand marché virtuel Africain avec ces 55 catégories différentes vous permettant de trouver de poster des annonces aisément mais aussi de vendre et d’acheter des produits locaux de qualité.\n\n\
      C'est un site internet mais aussi une application mobile qui vous permet de vous connecter via les différents réseaux sociaux existants comme Facebook, Twitter, Instagram ou encore Google plus. Une application simple à utiliser, qui permet de poster une annonce en quelques clics."
    },

    // Contact Screen
    Contact: {
      contactUs:'Contactez-nous',
      address: 'Adresse',
      email: 'Email',
      phone: 'Téléphone',
      webSite: 'Site Web'
    },

    // SideMenu
    SideMenu: {
      home: 'Accueil',
      adsSearch: 'Recherche',
      members: 'Membres',
      memberDetail: 'Détail du Membre',
      aboutAfricauri: 'À Propos de Vitoma',
      contact: 'Contact',
      register: "S'inscrire",
      signIn: "Se connecter",
      dashboard: "Tableau de bord",
      myAds: "Mes annonces",
      createAd: "Poster une annonce",
      messages: "Mes messages",
      profile: "Profil",
      bookmark: "Mes favoris",
      settings: "Paramètres",
      logout: 'Se déconnecter'
    },

    // Messages
    Messages: {
      warning: 'Avertissement',
      warningDeleteMessage: 'Voulez vous vraiment supprimer ce message ?',
      warningDeleteAllMessages: 'Voulez vous vraiment supprimer tous vos messages ?',
      noMessages: 'Votre boite de message est vide',
      yes: 'Oui',
      no: 'Non'
    },

    // Shared
    Shared: {
      cancel: "Annuler",
      confirm: "Confirmer"
    },

    // Countries
    Countries: {
      benin: 'Benin',
      togo: 'Togo',
      guinea: 'Guinée',
      mali: 'Mali',
      ivoryCost: "Côte d'ivoire",
      burkinaFaso: 'Burkina Faso',
      ghana: 'Ghana'
    },
  },

  en: {
    // validations
    Validations: {
      requiredField: 'This field is required',
      tooShort: 'Too short',
      enterValidNumber: 'Enter a valid number',
      onePhotosRequired: 'You must upload at least one photo',
      enterValidEmail: 'Please enter a valid email',
      enterValidPhoneNumber: 'Please enter a valid phone number preceded by the country code',
      enterValidEmailBecauseOfConfig: 'Enter an email or change the contact settgins',
      minAndMaxPriceInvalid: 'The minimum price must be less than the maximum price',
      notPublishedAd: "Your ad has not been published. Please try again or contact customer service.",
      notUpdatedAd: "Your ad has not been updated. Please try again or contact customer service.",
      invalidEmailPassword: "Email or Password is wrong! Please check again.",
      invalidCurrentPassword: "Error: Check again that the current password is correct",
      invalidPassword: 'The password must contain at least 6 characters and a capital letter',
      invalidConfirmPassword: 'The password and confirmation are not identical',
      emailNotVerified: 'You must confirm your email address. An email has been sent to you',
      sendEmailVerificationFailed: 'We are not able to send you an email to verify your email address. Please contat our customer service or try to use another email address.',
      firstNameRequired: "The first name is required",
      lastNameRequired: "The last name is required",
      setProfilePermissionDenied: "You are not allowed to perform this action, You could log out, then log in and try again",
      unexpectedError: "An error occured in the server, please try again later!",
      modificationPerformed: "Modificaion successfully performed",
      messageRequired: "The message is required",
      messageSuccesfullySended: 'Your message is successfully sent',
      messageNotSended: "Message not sent. Try again,",
      recentConnexionRequired: 'You must be recently connected to perform this operation.',
      recaptchaNotVerified: "Recaptcha not verified"
    },

    // Authentication
    Auth: {
      loginToYourAccount: 'Log-In to your account !',
      newUserSignUp: 'Sign up with a new account',
      signUp: "Register",
      signIn: "Sign in",
      emailAdress: "Email Address",
      phoneNumber: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      doYouHaveAnAccount: "Do you have an account?",
      emailOrPhone: "Email Address or Mobile No.",
      donotHaveAnAccount: "Don't have an account yet?",
      forgotPassword: "Forgot Password?",
      authInfo: 'You are almost there',
      needToBeLogIn: 'Only logged in users can post ads. Sign In now!',
      needToBeLogInToSendMessage: 'Only logged in users can send messages to others. Sign In now!',
      goBack: 'Back',
      resetPassword: 'Reset Password',
      reset: 'Reset',
      resetPasswordEmailSended: 'An email has been sent to reset your password',
      facebookAuthError: "Failed to authenticate with Facebook. Please Try Again !",
      phoneAuthError: "Failed to authenticate with your phone number. Please Try Again !",
      error: 'Error',
      verify: "Verify",
      enterCode: "Enter the code",
      enterVerificationCode: "Enter the verification code",
      codeSent: 'A verification code has been sent to your phone number',
      codeNotValid: "The code you provided is not valid",
      continue: 'Continue',
      firstName: 'First Name',
      lastName: 'Last Name'
    },

    // Intro Screen
    Intro: {
      searchWhatYouWant: 'Search What You Want',
      alwaysAspire: 'Always aspire to be the best in "what you need" ',
      preferTheBest: 'Prefer The Best',
      exploreCategories: 'Explore categories to your taste',
      buyAndSellWithUs: 'Buy/Sell With Us',
      weEarnMoneyFromServices: 'We earn money from services, not from users',
      getStarted: 'Get started',
      next: 'Next',
      skip: 'Skip',
      biggestAfricainInventory: 'The biggest Togolese inventory'
    },

    // Categories
    Categories: {
      electronics: 'Electronics',
      fashion: 'Fashion',
      books: 'Books',
      household: 'Household',
      pets: 'Pets',
      jobs: 'Jobs',
      services: 'Services',
      others: 'Others',
      home: 'Home',
      healthBeauty: 'Health & Beauty',
      clothingShoes: 'Clothing, Shoes & Jewelry',
      toysKidsBaby: 'Toys',
      handMade: 'Handmade',
      grocery: 'Grocery & Whole Foods Market',
      sportOutdoors: 'Sports & Outdoors',
      automotiveIndustrial: 'Automotive & Industrial',
      realEstate: 'Real estate',
    },

    // Home Screen
    Home: {
      home: 'Home',
      featuresAds: 'Features Ads',
      popularCountries: 'Popular countries',
      recentAds: 'Recent Ads',
      myLastViews: 'My Last Views',
      recentMessages: 'Recent Messages',
      popularMembers: 'Popular Members',
      noResultsSearch: 'No ads found',
      ok: 'Ok',
      skip: 'Skip'
    },

    // Members Screen
    Members: {
      members: 'Members',
      noAdPublished: 'No Ad Published',
      oneAdPublised: 'One Ad Published',
      adsPublished: 'Ads Published',
      memberAds: 'Member Ads',
      address: "Address",
      phoneNumber: "Phone",
      email: 'Email',
      webSite: 'Website'
    },

    // Ads Screen
    Ads: {
        ads: 'Ads',
        myAds: 'My Ads',
        sortByPrice: 'Sort by Price',
        filters: 'Filters'
    },

    // AdsDetail Screen
    AdsDetail: {
      sharedWithYou: 'Shared with you:',
      publishedDate: 'Published Date',
      rating: 'Rating',
      likes: "Likes",
      overview: 'Overview',
      photoGallery: 'Photo Gallery',
      contact: 'Contact',
      firstName: 'First Name',
      lastName: 'Last Name',
      yourEmailAddress: 'Your Email Address',
      yourMobile: 'Your Mobile No',
      yourMessage: 'Your Message',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      webSite: 'Website',
      sameUserPosts: 'Same User Posts',
      similarAds: 'Similar Ads',
      myLastViews: 'My Last Views',
      send: 'Send',
      contactForm: 'Enquiry Form',
      contactInfos: 'Infos',
      next: 'Next',
      prev: 'Prev',
      close: 'Close'
    },

    // SendMsgForm
    SendMsgForm: {
      firstName: 'First Name',
      lastName: 'Last Name',
      yourEmailAddress: 'Your Email Address',
      yourMobile: 'Your Mobile No',
      yourMessage: 'Your Message',
      send: 'Send',
      youHaveAMsg: 'You have received a new message',
      cannotSendMessageToYourself: 'Sorry, you can not send a message to yourself'
    },

    // Bookmark Screen
    Bookmark: {
      bookmark: 'Bookmark',
      bookmarkAdded: 'Successfully added to your favorites',
      bookmarkNotAdded: "An error occured while adding to your favorites. Please try again !",
      bookmarkDeleted: 'Successfully removed from your favorites',
      bookmarkNotDeleted: "An error occured while deleting from your favorites. Please try again !",
      noBookmarks: 'You do not have any favorite for the moment.'
    },

    // AdsSearch Screen
    AdsSearch: {
        search: 'Search',
        adTitle: 'Ad Title',
        adCurrency: 'Currency',
        adPrice: 'Price',
        category: 'Category',
        selectOne: 'Select One',
        country: 'Country',
        noResultsSearch: 'No ads found',
        allCountries: 'All Countries'
    },

    // AdCreate Screen
    AdCreate: {
      createAd: 'Create Ad',
      publish: 'Publish',
      Overview: {
        step1: 'STEP 1. Overview',
        adTitle: 'Ad Title',
        adDescription: 'Ad Description',
        adPrice: 'Price',
        adCurrency: 'Currency',
        adCountry: 'Country',
        adDescriptionMinChars: 'Minimum 20 characters'
      },
      CategoryInfos: {
        step2: 'STEP 2. Category Informations',
        category: 'Category',
        selectOne: 'Select One',
        back: 'Back',
        company: 'Company',
        model: 'Model',
        fuel: 'Fuel',
        year: 'Year',
        color: 'Color'
      },
      ContactInfos: {
        step3: 'STEP 3. Contact Informations',
        email: 'Email',
        phone: 'Phone',
        emailPhoneConfig: 'Configuration / Options',
        showPhoneNumber: 'Show Only Phone Number',
        showEmail: 'Show Only Email',
        showBoth: 'Show Email and Phone Number'
      },
      Photos: {
        step4: 'STEP 4. Photos'
      },
      optional: 'Optional',
      required: 'Required'
    },

    // AdUpdate Screen
    AdUpdate: {
      updateAd: 'Update Ad',
      publish: 'Update'
    },

    // Ad Published Screen
    AdPublished: {
      published: 'Published',
      congratulations: 'Congratulations',
      successfulyPublished: 'Your advertisement has been published',
      preview: 'Preview',
      postedOn: 'Posted on:',
      warning: 'Warning',
      deleteWarning: "Are you sure you want to delete this ad?",
      yes: 'Delete',
      no: 'Cancel',
      adDeleted: 'Your ad has been successfully deleted',
      adNotDeleted: 'An error occurred while deleting. Please try again. '
    },

    UserProfile: {
      basicsInformations: "Basic",
      firstName: "First Name",
      lastName: "Last Name",
      none: "None",
      male: "Male",
      femele: "Femele",
      addressInformations: "Address Informations",
      address: "Adress",
      city: "City",
      state: "State",
      country: "Country",
      postCode: "postCode",
      contactInformations: "Contact Informations",
      phoneNumber: "Phone Number",
      webSiteUrl: "Web Site",
      changePassword: "Change Password",
      oldPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirmation Password",
      save: "Save",
      aboutYou: "About You",
      memberSince: 'Member Since',
      hi: 'HI'
    },

    // Settings Screen
    Settings: {
      settings: "Settings",
      english: 'English',
      french: 'French',
      languages: 'Languages',
      save: 'Save',
      countries: 'Countries',
      changesDone: 'Settings modification done',
      currency: 'Currency'
    },

    // AboutUs Screen
    AboutUs: {
      aboutUs: 'About Us',
      aboutUsDescription: "Founded in 2019, Vitoma is a dynamic platform that allows you to trade in multiple domains.\n\n\
      Vitoma represents the largest African virtual market with these 55 different categories allowing you to find ads easily but also sell and buy quality local products.\n\n\
      It is a website but also a mobile application that allows you to connect via various existing social networks such as Facebook, Twitter, Instagram or Google plus. An easy-to-use application that allows you to post an ad in a few clicks."
    },

    // Contact Screen
    Contact: {
      contactUs:'Contact us',
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      webSite: 'WebSite'
    },

    // SideMenu
    SideMenu: {
      home: 'Home',
      adsSearch: 'Ads Search',
      members: 'Members',
      memberDetail: 'Member Detail',
      aboutAfricauri: 'About Vitoma',
      contact: 'Contact',
      register: "Register",
      signIn: "Sign In",
      dashboard: "Dashboard",
      myAds: "My Ads",
      createAd: "Create Ad",
      messages: "Messages",
      profile: "Profile",
      bookmark: "Bookmark",
      settings: "Settings",
      logout: 'Logout'
    },

    // Messages
    Messages: {
      warning: 'Warning',
      warningDeleteMessage: 'Are you sure about deleting this message ?',
      warningDeleteAllMessages: 'Are you sure about deleting all your messages ?',
      noMessages: 'Your message box is empty',
      yes: 'Yes',
      no: 'No'
    },

    // Shared
    Shared: {
      cancel: "Cancel",
      confirm: "Confirm"
    },

    // Countries
    Countries: {
      benin: 'Benin',
      togo: 'Togo',
      guinea: 'Guinea',
      mali: 'Mali',
      ivoryCost: "Ivory Cost",
      burkinaFaso: 'Burkina Faso',
      ghana: 'Ghana'
    },
  }
}, {
  customLanguageInterface: () => {
    // TODO: Device language on androind can change
    //    https://docs.expo.io/versions/latest/sdk/localization/
    /*if(Platform.OS === 'android') {
      const { locale } = await Localization.getLocalizationAsync();
      return locale;
    } else {
      return Localization.locale;
    }*/

    return Localization.locale;
  }
});

export default Languages
