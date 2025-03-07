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
  Dimensions,
  AppState,
  NativeModules,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { SafeAreaView } from 'react-native-safe-area-context';

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

function ChannelList(): React.JSX.Element {
  const {PipModule} = NativeModules;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [backgroundDeteced, setBackgroundDeteced] = React.useState(false);
  const playerRef = useRef<YoutubeIframeRef>(null);


  //CNBC :- UCmRbHAgG2k2vDUvb3xsEunQ
  //AajTak:-UCt4t-jeY85JegMlZ-E5UWtA

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
      if (ev === 'background') {
        setBackgroundDeteced(true);

        PipModule.EnterPipMode();
      } else {
        setBackgroundDeteced(false);
      }
    });
    return () => {
      appstatus.remove();
    };
  }, [PipModule]);

  const onStateChange = useCallback((state: any) => {
    if (state === 'ended') {

    }
  }, []);

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedVideo(item.id.videoId);
        console.log('item.id.videoId===', item.id.videoId);
      }}>
      <View style={styles.mainView}>
        <Image
          source={{uri: item.snippet.thumbnails.medium.url}}
          style={styles.image}
        />
        <View style={styles.viewText}>
          <Text style={styles.snippetTitle}>{item.snippet.title}</Text>
          <Text style={styles.snippetChannelTitle}>
            {item.snippet.channelTitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {selectedVideo ? (
        <>
          <YoutubePlayer
            height={250}
            play={true}
            videoId={selectedVideo}
            onChangeState={onStateChange}
            // playInBackground={true}
            // playInBackgroundMode="always"
            ref={playerRef}
            webViewProps={{
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
  mainView: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {width: 120, height: 70, borderRadius: 5},
  viewText: {flex: 1, marginLeft: 10},
  snippetTitle: {fontSize: 16, fontWeight: 'bold'},
  snippetChannelTitle: {color: 'gray'},
  safeAreaView: {flex: 1, backgroundColor: 'white'},
});

export default ChannelList;
