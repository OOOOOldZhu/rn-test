import bindAll from 'lodash.bindall';
import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    Colors
} from 'react-native';

/*
 第一步，申请原生权限
*/
import sdk from './sdk.js';
sdk.requestPerssion((isErr) => { });
/**
 * NLP网络请求需要的参数，根据请求需要参数设置
 */
//sdk.setConfig({user_id:'number for example 123'});

export default class VoiceView extends Component {

    constructor(props) {
        super(props)
        // bindAll(this, [
        //     'onStart'
        // ]);
        this.state = {
            result: '暂无结果',
            enable: true
        }
        /*
            第二步，初始化语音识别引擎,此函数也可以放在willMount的生命周期函数中
        */
        sdk.initRecognizer();
    }

    render() {

        return <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>

            <View style={{ height: 30 }} />

            <Button
                containerStyle={styles.containerStyle}
                onPress={() => {
                    console.log('开始按钮点击了 . . .')
                    if(!this.state.enable){
                        return;
                    }
                    this.setState({ enable: false })
                    /*
                        第三步，引擎开始识别
                    */
                    sdk.startRecognizer((jsonObj, jsonString) => {
                        this.setState({ enable: true, result: '' + jsonString })
                    });
                }}
                title={this.state.enable?'开始识别':'正在识别中...'}
            />
            <View style={{ height: 30 }} />
            <Button
                containerStyle={styles.containerStyle}
                onPress={() => {
                    console.log('停止按钮被点击 . . .')
                    this.setState({ enable: true,result: '已经停止识别'})
                    /*
                        第四步，用户主动停止语音识别
                    */
                    sdk.stopRecognizer();
                }}
                title='停止识别'
            />
            <View style={{ height: 30 }} />
            <Button
                onPress={() => {
                    sdk.recognizWithString('进度管理',(jsonObj, jsonString)=>{
                        this.setState({ enable: true, result: '' + jsonString })
                    });
                }}
                title='使用文字字符串识别'
            />
            <View style={{ height: 30 }} />
            <Text>{this.state.result}</Text>

        </ScrollView>
    }
    /*
        第五步，释放语音引擎，节省手机内存
    */
    componentWillUnmount(){
        sdk.release();
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

