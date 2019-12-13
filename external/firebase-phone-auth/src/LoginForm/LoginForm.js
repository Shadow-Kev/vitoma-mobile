import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react'
import { DataProviderContext } from '../services/DataProvider';

import '../App.css';
import './LoginForm.css';

class LoginForm extends Component {
  state = {
    redirectionLinkActivated: false,
    redirectionLinkHref: null
  }

  componentDidMount() {
    this.isCaptcha = (this.props.captcha === 'true');

    if(this.isCaptcha)
      this.context.getTokenFromRecaptchaVerifier("firebase-ui-form", this.onCaptchaVerified)
    else
      this.signInUi = this.context.getSignInUi("#firebase-ui-form");
  }

  onCaptchaVerified = (token) => {
    if(this.isCaptcha && this.props.returnUrl) {
      var returnUrl = this.props.returnUrl + '?token=' + token;

      if(this.props.platForm !== 'ios') {
        // window.open statement is not supported on ios.
        // A link will be used to make the redirection.
        window.open(returnUrl);
      } else {
        this.setState({
          redirectionLinkActivated: true,
          redirectionLinkHref: returnUrl
        })
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className='login-form'>
          {/*
            Heads up! The styles below are necessary for the correct render of this example.
            You can do same with CSS, the main idea is that all the elements up to the `Grid`
            below must have a height of 100%.
          */}
          <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
              height: 100%;
            }
          `}</style>
          <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h1' textAlign='center'>
                <div style={{ color: '#173471' }}>
                  {this.props.appTitle ? this.props.appTitle : 'Log-In' }
                </div>
              </Header>
              <div id='firebase-ui-form'></div>
              {
                this.state.redirectionLinkActivated &&
                <a className='redirect-link' href={this.state.redirectionLinkHref} target="_blank" rel="noreferrer noopener">
                  {this.props.continueText || 'Continue'}
                </a>
              }
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

LoginForm.contextType = DataProviderContext;

export default LoginForm;
