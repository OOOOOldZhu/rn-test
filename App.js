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

import RNVoicesdk from 'react-native-voicesdk';

let result = '返回结果';

const App: () => React$Node = () => {

    console.log('RNVoicesdk => ', RNVoicesdk);
    DeviceEventEmitter.addListener('result', (e) => {
        console.log('接收到通知 => '+e);
        result = e.toString();
    });
    RNVoicesdk.init(null);
    let onStart = () => {
        console.log('1');
        RNVoicesdk.startRecognizer();
    };
    let onStop = () => {
        console.log('2');
        RNVoicesdk.stopRecognizer();
    };
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
                    <View style={{height: 30}}/>
                    <Button
                        containerStyle={styles.containerStyle}
                        style={{color: 'white'}}
                        onPress={onStart}
                        onResponderTerminationRequest={() => true}
                        title='点击按钮开始识别'
                    />
                    <View style={{height: 30}}/>
                    <Button
                        containerStyle={styles.containerStyle}
                        style={{color: 'white'}}
                        onPress={onStop}
                        title='停止识别'
                    />
                    <View style={{height: 30}}/>
                    <Text>{result}</Text>

                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    containerStyle: {
        backgroundColor: '#0275d8',
        margin: 4,
        padding: 4,
        borderRadius: 2,
    },
});

export default App;
