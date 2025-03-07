/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  AppState,
  NativeModules,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';
import {SafeAreaView} from 'react-native-safe-area-context';
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyD9r6iaBukBZGVpo_tMQ6na14JCL-X8kus',
    authDomain: 'livesteaming-b1caf.firebaseapp.com',
    projectId: 'livesteaming-b1caf',
    storageBucket: 'livesteaming-b1caf.appspot.com',
    messagingSenderId: '142783426471',
    appId: '142783426471',
  }); // Initialize Firebase
}

function LiveChannelList(): React.JSX.Element {
  const {PipModule} = NativeModules;

  const [backgroundDeteced, setBackgroundDeteced] = React.useState(false);
  const [videoHeight, setVideoHeight] = React.useState(300);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const playerRef = useRef<YoutubeIframeRef>(null);

  const signInWithGoogle = async () => {
    // GoogleSignin.configure({
    //   scopes: [
    //     'https://www.googleapis.com/auth/youtube',
    //     'https://www.googleapis.com/auth/youtube.readonly',
    //   ],
    //   webClientId:
    //     '876428263295-i8qu4b1bgkp0fc5chut9f3j886t2rbnh.apps.googleusercontent.com',
    //   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //   hostedDomain: '', // specifies a hosted domain restriction
    //   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    //   accountName: '', // [Android] specifies an account name on the device that should be used
    //   iosClientId: 'iosClientId', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    //   googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    //   openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    //   profileImageSize: 120,
    // });

    // await GoogleSignin.hasPlayServices();
    // const userInfo = await GoogleSignin.signIn();
    // const accessToken = (await GoogleSignin.getTokens()).accessToken;

    //Get ChannelID
    //https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=@aajtak&key=AIzaSyAKcjhj9ykFMhUQ5HyVWr_aCoGTMXDBV90
    //console.log('Access Token:', accessToken);
    //RuuXzTIr0OoDqI4S0RU6n4FqKEM
    //AIzaSyAKcjhj9ykFMhUQ5HyVWr_aCoGTMXDBV90

    // {"kind":"youtube#channelListResponse","etag":"kn0GFSi15Yfp0Xi-nxTAQdm-htw","pageInfo":{"totalResults":1,"resultsPerPage":5},"items":[{"kind":"youtube#channel","etag":"rmUl0Ya79msR8Tolc-eOnCKHrMM","id":"UCt4t-jeY85JegMlZ-E5UWtA"}]}
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCt4t-jeY85JegMlZ-E5UWtA&eventType=live&type=video&maxResults=100&key=AIzaSyAKcjhj9ykFMhUQ5HyVWr_aCoGTMXDBV90`,
      {},
    );

    const data = await response.json();
    console.log(JSON.stringify(data));

    // GoogleSignin.hasPlayServices()
    //   .then(hasPlayService => {
    //     if (hasPlayService) {
    //       GoogleSignin.signIn()
    //         .then(async userInfo => {
    //           console.log(JSON.stringify(userInfo));
    //         })
    //         .catch(e => {
    //           console.log('Jay ERROR IS: ' + JSON.stringify(e));
    //         });
    //     }
    //   })
    //   .catch(e => {
    //     console.log('ERROR IS: ' + JSON.stringify(e));
    //   });
  };

  useEffect(() => {
    async function callVideoLive() {
      let allResults: any = [];
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCt4t-jeY85JegMlZ-E5UWtA&eventType=live&type=video&maxResults=100&key=AIzaSyAKcjhj9ykFMhUQ5HyVWr_aCoGTMXDBV90`,
        {},
      );

      const data = await response.json();
      if (data.items) {
        allResults = [...allResults, ...data.items];
      }
      console.log('allResults===', allResults);
      setVideos(allResults);
      setLoading(false);
    }

    callVideoLive();
  }, []);

  React.useEffect(() => {
    const appstatus = AppState.addEventListener('change', ev => {
      if (ev === 'background' && selectedVideo) {
        setBackgroundDeteced(true);
        const videoUrl = `https://www.youtube.com/watch?v=${selectedVideo}`;
        PipModule?.EnterPipMode(videoUrl);
      } else {
        setBackgroundDeteced(false);
        setVideoHeight(300);
        if (PipModule?.cleanup) {
          PipModule.cleanup();
        }
      }
    });
  
    return () => {
      if (PipModule?.cleanup) {
        PipModule.cleanup();
      }
      appstatus.remove();
    };
  }, [PipModule, selectedVideo]);

  const onStateChange = useCallback((state: any) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedVideo(item.id.videoId);
        console.log('item.id.videoId===', item.id.videoId);
      }}>
      <View style={styles.renderItem}>
        <Image
          source={{uri: item.snippet.thumbnails.medium.url}}
          style={styles.image}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            {item.snippet.title}
          </Text>
          <Text style={{color: 'gray'}}>{item.snippet.channelTitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {selectedVideo ? (
        <>
          <YoutubePlayer
            height={videoHeight}
            ref={playerRef}
            // width={Dimensions.get('window').width}

            play={true}
            videoId={selectedVideo}
            onChangeState={onStateChange}
            // playInBackground
            // playInBackgroundMode="always"
            forceAndroidAutoplay={true}
            webViewProps={{
              // allowsInlineMediaPlayback: true, // Allow PiP
              allowsInlineMediaPlayback: true,
              allowsFullscreenVideo: true,
              mediaPlaybackRequiresUserAction: false,
            }}
          />
        </>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item: any) => item?.id?.videoId}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  renderItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {width: 120, height: 70, borderRadius: 5},
});

export default LiveChannelList;
