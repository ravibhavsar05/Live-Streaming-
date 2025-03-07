// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChannelList from './screens/ChannelList';
import LiveChannelList from './screens/LiveChannelList';

type RootStackParamList = {
  ChannelList: undefined;
  LiveChannelList: {item: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LiveChannelList"
          component={LiveChannelList}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="LiveChannelList" component={LiveChannelList} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
