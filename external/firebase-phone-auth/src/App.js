import React, { Component } from 'react';
import { Segment,  Dimmer, Loader  } from 'semantic-ui-react'
import LoginForm from './LoginForm';
import { DataProviderContext } from './services/DataProvider';
import logo from './logo.png';

import './App.css';

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
        isUserLogged: false,
        showLoader: true
      }
  }

  componentWillMount() {
    this.returnUrl = this.getParameterByName('returnUrl')
    this.captcha = this.getParameterByName('captcha')
    this.appTitle = this.getParameterByName('appTitle')
    this.platForm = this.getParameterByName('platForm')
    this.continueText = this.getParameterByName('continueText')
    this.env = this.getParameterByName('env')

    this.context.initializeApp(this.env || process.env.REACT_APP_MODE)

    this.setState({ showLoader: true })

    this.context.onAuthStateChanged((userData) => {
      this.setState({
        isUserLogged: userData != null,
        showLoader: false
      })
    })
  }

  getParameterByName = (name)  => {
      var url = window.location.href;
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  displayLoader = () => {
    return (
      <div className="loader">
        <Segment>
          <Dimmer active inverted>
            <Loader size='large'>{ 'loading' }</Loader>
          </Dimmer>
        </Segment>
      </div>
    )
  }

  render() {
    if(this.state.showLoader) {
      return this.displayLoader()
    }

    return (
      <React.Fragment>
        {
          this.state.isUserLogged &&
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <button onClick={() => this.context.logout()} className="ui inverted orange basic button">Logout</button>
              <h2>You are successfuly authenticated !</h2>
            </header>
          </div>
        }
        {
          !this.state.isUserLogged &&
          <LoginForm
            returnUrl={this.returnUrl}
            captcha={this.captcha}
            appTitle={this.appTitle}
            platForm={this.platForm}
            continueText={this.continueText}/>
        }
      </React.Fragment>
    );
  }
}

App.contextType = DataProviderContext;

export default App;
