import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import outputs from '../../amplify_outputs.json';

// Configure Amplify with the outputs from Amplify Gen 2
export function configureAmplify() {
  // Use the values from amplify_outputs.json for configuration
  const config = {
    Auth: {
      Cognito: {
        userPoolId: outputs.auth.user_pool_id,
        userPoolClientId: outputs.auth.user_pool_client_id,
        identityPoolId: outputs.auth.identity_pool_id,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
        },
      }
    },
    API: {
      GraphQL: {
        endpoint: outputs.data.url,
        region: outputs.data.aws_region,
        defaultAuthMode: outputs.data.default_authorization_type,
        apiKey: outputs.data.api_key,
      }
    }
  };

  /*console.log('Configuring Amplify with:', JSON.stringify({
    userPoolId: outputs.auth.user_pool_id,
    userPoolClientId: outputs.auth.user_pool_client_id,
    region: outputs.auth.aws_region
  }));*/
  
  Amplify.configure(config);
}