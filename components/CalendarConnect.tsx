import React, { useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';
import pkceChallenge from 'pkce-challenge';

// Set up your Google OAuth client credentials
const CLIENT_ID = '368051387801-qpo77u2sk9rv0q9su5l9sb842i7hre0e.apps.googleusercontent.com';
const REDIRECT_URI = AuthSession.makeRedirectUri({
  native: 'com.gabrielcode.dayta:/oauthredirect', // Your custom scheme in Info.plist
});

// Discovery document to use Google OAuth
const DISCOVERY = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface CalendarConnectProps {
  authToken: string | null; 
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const CalendarConnect: React.FC<CalendarConnectProps> = ({ authToken, setAuthToken }) => {
  const [calendarData, setCalendarData] = useState<any>(null);

  // State for PKCE challenge and verifier
  const [codeChallenge, setCodeChallenge] = useState<string | null>(null);
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

  // Generate PKCE challenge and verifier
  useEffect(() => {
    const generatePKCE = async () => {
      const { code_challenge, code_verifier } = await pkceChallenge();
      setCodeChallenge(code_challenge);
      setCodeVerifier(code_verifier);
    };

    generatePKCE();
  }, []);

  // Configure the request with Google OAuth parameters
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      responseType: 'code',
      extraParams: {
        code_challenge: codeChallenge || '', // Provide a default empty string if null
        code_challenge_method: 'S256',
      },
    },
    DISCOVERY
  );

  // Exchange the authorization code for an access token
  async function exchangeCodeForToken(code: string) {
    try {
      const tokenResponse = await axios.post(DISCOVERY.tokenEndpoint, {
        code,
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier, // Send the code verifier here
      });
      setAuthToken(tokenResponse.data.access_token); // Store access token
      console.log('Access token:', tokenResponse.data.access_token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error status:', error.response.status);
        } else {
          console.error('Axios error message:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  // Handle the OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  // Fetch calendar data using the access token
  useEffect(() => {
    if (authToken) {
      axios
        .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((res) => {
          setCalendarData(res.data);
        })
        .catch((error) => {
          console.error('Error fetching calendar data:', error);
        });
    }
  }, [authToken]);

  return (
    <View style={{ padding: 50 }}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
      {/* {calendarData && <Text>{JSON.stringify(calendarData, null, 2)}</Text>} */}
    </View>
  );
}

export default CalendarConnect