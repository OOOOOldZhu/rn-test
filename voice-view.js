import bindAll from 'lodash.bindall';
import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    Colors
} from 'react-native'

// //添加 PermissionsAndroid RN自带的
import { PermissionsAndroid } from 'react-native';
//就举一个例子 记得加上async异步
let requestReadPermission = async () => {
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
            console.log("你已获取了读写权限")
            init();
        } else {
            //this.show("获取读写权限失败")
        }
    } catch (err) {
        //this.show(err.toString())
    }
};
requestReadPermission();

import RNVoicesdk from 'voicesdk';
let init = () => {
    RNVoicesdk.init();
}

let onStop = () => {
    console.log('2');
    RNVoicesdk.stopRecognizer();
};

export default class VoiceView extends Component {
    // constructor 一般也推荐都写出来
    constructor(props) {
        super(props)
        bindAll(this, [
            'onStart'
        ]);
        this.state = { result: '暂无结果' }
    }
    onStart () {
        console.log('1');
        RNVoicesdk.startRecognizer(msg => {
            console.log('js接收的数据 => ' + msg);
            this.setState({result:msg})
        });
    };
    render() {

        return <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View style={{ height: 30 }} />
            <Button
                containerStyle={styles.containerStyle}
                style={{ color: 'white' }}
                onPress={this.onStart}
                onResponderTerminationRequest={() => true}
                title='点击按钮开始识别'
            />
            <View style={{ height: 30 }} />
            <Button
                containerStyle={styles.containerStyle}
                style={{ color: 'white' }}
                onPress={onStop}
                title='停止识别'
            />
            <View style={{ height: 30 }} />
            <Text>{this.state.result}</Text>

        </ScrollView>
    }


}

const styles = StyleSheet.create({
    scrollView: {
        // backgroundColor: Colors.lighter,
        backgroundColor: '#F8F8FF',
    },
    containerStyle: {
        backgroundColor: '#0275d8',
        margin: 4,
        padding: 4,
        borderRadius: 2,
    },
});

