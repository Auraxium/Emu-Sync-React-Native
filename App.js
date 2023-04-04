/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {View, Button, Text, TouchableOpacity} from 'react-native';
import axios from 'axios';
import fs from 'react-native-fs';
// import {google} from 'googleapis';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
// import { GoogleAuth } from 'google-auth-library';

const key = "AIzaSyAExsadbuHCgyxzjac3NnQAdzy_xMdgEgM";
let accessToken;

async function doo() {
  try {
    const response = await drive.files.list({
      pageSize: 20,
      fields: 'nextPageToken, files(id, name)',
    });

    const files = response.data.files;
    if (files.length === 0) {
      console.log('No files found.');
      return;
    }

    console.log({files: files});
  } catch (err) {
    console.log(err);
  }
}

// let oauth = new google.auth.OAuth2(
// 	client_id,
// 	client_secret,
// 	"http://localhost:8888/oauth/callback"
// );

export default function App() {
	const [user, setUser] = useState({})

  useEffect(() => {
    GoogleSignin.configure({
			scopes: ['profile', 'email', "https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/drive.file",],
      webClientId: '37664464621-pk1fv4afs5d71v16a1ldbmd98toj5hc4.apps.googleusercontent.com',
			androidClientId: '37664464621-c5h1t813daf79okiefefvplpc1pb0c0l.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

		//isSignedIn()
  },[]);
//clutchmasterman@gmail.com
	async function signIn() {
		try {
			await GoogleSignin.hasPlayServices();
			console.log('reach')
			const userInfo = await GoogleSignin.signIn();
			console.log(userInfo);
			const tokens = await GoogleSignin.getTokens();
			accessToken = tokens["accessToken"]
			
			// oauth.current.setCredentials({
			// 	access_token: tokens["accessToken"],
			// 	refresh_token: tokens["refreshToken"],
			// 	key: "AIzaSyAExsadbuHCgyxzjac3NnQAdzy_xMdgEgM",
			// });


			console.log(tokens)
			setUser(userInfo)
		} catch (error) {
			console.log('i err: ' + error);
		}
	}


	async function signOut() {
		try {
			await GoogleSignin.revokeAccess()
			await GoogleSignin.signOut()
			setUser({})
		} catch(err) {
			console.log(err)
		}
	}

  async function write() {
    console.log('path');
    let path = fs.DocumentDirectoryPath + '/test.txt';
    // fs.writeFile(path, "yo", 'utf8').then(console.log).catch(console.log)
		// axios(`https://www.googleapis.com/drive/v3/files?key=${key}`, {
		// 	headers: {
		// 		Authorization: `Bearer ${accessToken}`,
		// 		Accept: 'application/json'
		// 	}
		// }).then(console.log).catch(console.log)

		axios({
			url: `https://drive.google.com/uc?export=download&id=${'17TsFBtD1EffuBGSVtLpgEnB5aFrOQjm8'}`,
			method: 'GET',
			responseType: 'stream' 
		}).then(ax => {
			console.log(fs.DocumentDirectoryPath + '/Mcd001.ps2')
			const writer = fs.createWriteStream(fs.DocumentDirectoryPath + '/Mcd001.ps2')
			ax.data.pipe(writer);

		writer.on('finish', () => {
			console.log(`File downloaded: ${outputFileName}`);
		});
	
		writer.on('error', err => {
			console.error('Error downloading file:', err);
		});
	}).catch(err => {
		console.error('Error downloading file:', err);
	});
  }

  return (
    <View>
      <Text>Hello Emus!</Text>
      <Button title="Write it nao" onPress={write}></Button>
			<View>
				{!user.idToken ? 
				<GoogleSigninButton 
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Light}
				onPress={signIn}/>
				 : 
				<Button title="signout" onPress={signOut}>
				</Button> }
			</View>
    </View>
  );
}
