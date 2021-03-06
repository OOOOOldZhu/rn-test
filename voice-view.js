import bindAll from 'lodash.bindall';
import React, { Component } from 'react'
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Button,
    Colors,
    TouchableHighlight
} from 'react-native';

/*
 第一步，申请原生权限
*/
import sdk from './sdk.js';

/**
 * NLP网络请求需要的参数，根据请求需要参数设置
 */
//sdk.setConfig({user_id:'number for example 123'});
let wavFileCode;
        
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
        sdk.requestPerssion((errCode) => {
            console.log('view中 JS权限 = '+errCode);
            if(errCode == 1)sdk.initRecognizer();
        });
    }

    render() {
        //console.log('render1...')
        let pClick = (e) => {
            console.log('pppp')
        }
        return <ScrollView onPress={pClick} contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
            <View onPress={pClick} style={styles.viewStyle} />

            <Button
                style={styles.btnStyle}
                onPress={() => {
                    console.log('开始按钮点击了 . . .')
                    if (!this.state.enable) {
                        return;
                    }
                    this.setState({ enable: false })
                    /*
                        第三步，引擎开始识别
                    */
                    sdk.startRecognizer((jsonObj, jsonString,err) => {
                        // 注意如果err为defined，那么前两者都为null,详情查看sdk.js源码
                        if(err){
                            this.setState({ enable: true, result: err })
                        }else{
                            wavFileCode = jsonObj.voiceid;
                            this.setState({ enable: true, result: '' + jsonString })
                        }
                    });
                }}
                title={this.state.enable ? '开始识别' : '正在识别中...'}
            />
            <View style={styles.viewStyle} />
            <Button
                style={styles.btnStyle}
                onPress={() => {
                    console.log('停止按钮被点击 . . .')
                    this.setState({ enable: true, result: '已经停止识别' })
                    /*
                        第四步，用户主动停止语音识别
                    */
                    sdk.stopRecognizer();
                }}
                title='停止识别'
            />
            <View style={styles.viewStyle} />
            <Button
                style={styles.btnStyle}
                title='播放刚才语音识别的音频文件'
                onPress={() => {
                    sdk.play(wavFileCode, (errCode) => {
                        //errCode=0 录音文件不存在，
                        //errCode=1 播放完成
                        console.log('播放录音文件的状态码:' + errCode);
                    });
                }}
            />
            <View style={styles.viewStyle} />
            <Button
                style={styles.btnStyle}
                onPress={() => {
                    sdk.recognizWithString('进度管理', (jsonObj, jsonString) => {
                        this.setState({ enable: true, result: '' + jsonString })
                    });
                }}
                title='使用文字字符串识别'
            />
            <View style={styles.viewStyle} />
            <Text>{this.state.result}</Text>

        </ScrollView>
    }
    /*
        第五步，释放语音引擎，节省手机内存
    */
    componentWillUnmount() {
        sdk.release();
    }

}

const styles = StyleSheet.create({
    scrollView: {
        // backgroundColor: Colors.lighter,
        backgroundColor: '#F8F8FF',
    },
    viewStyle: {
        backgroundColor: "yellow",
        height: 30
    },
    btnStyle: {
        backgroundColor: 'blue',
        height:50,
        margin: 4,
        padding: 4,
        borderRadius: 2,
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5
    },
});

