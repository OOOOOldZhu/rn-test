/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    StatusBar,
    DeviceEventEmitter,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import VoiceView from './voice-view.js';

const App: () => React$Node = () => {
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <VoiceView/>
            </SafeAreaView>
        </>
    );
};


export default App;
