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

//添加 PermissionsAndroid RN自带的
import { PermissionsAndroid } from 'react-native';
//就举一个例子 记得加上async异步
let  requestReadPermission = async ()=> {
    try {
        //返回string类型
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
            PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
            PermissionsAndroid.PERMISSIONS.CHANGE_NETWORK_STATE,
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            PermissionsAndroid.PERMISSIONS.WRITE_SETTINGS,
            {
                //第一次请求拒绝后提示用户你为什么要这个权限
                'title': '我要读写权限',
                'message': '没权限我不能工作，同意就好了'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //this.show("你已获取了读写权限")
        } else {
            //this.show("获取读写权限失败")
        }
    } catch (err) {
        //this.show(err.toString())
    }
};
requestReadPermission();

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
