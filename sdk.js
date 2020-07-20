
import { Platform } from 'react-native';
//import {request,requestMultiple, PERMISSIONS} from 'react-native-permissions';
let PermissionsAndroid = null;
if(Platform == 'android'){
    let {PermissionsAndroid} = require('react-native');
}
import Voicesdk from 'voicesdk';

let config = {
    user_id: '614'
}

class SDK {
    constructor() {
        //this.init.bind(this);
        this.initRecognizer.bind(this);
        this.startRecognizer.bind(this);
        this.stopRecognizer.bind(this);
        this.release.bind(this);
        this.requestPerssion.bind(this);
        this.setConfig.bind(this);
        this.recognizWithString.bind(this);
    }
    /*
     NLP后端需要的网络请求配置 user_id
    */
    setConfig(confi) {
        if (confi) config = confi;
    }
    // init() {
    //     requestPerssion()
    //     .then(_=>{
    //         this.initRecognizer();
    //     })
    //     .catch(e=>{})
    // };
    initRecognizer() {
        Voicesdk.initial();
    }
    startRecognizer(callback) {
        Voicesdk.startRecognizer(wordObj => {
            /* wordObj
               {
                voiceid:123,
                word:'语音识别的结果'
               }
            */
            console.log('js接收的数据 => ' + wordObj.word);
            // 进度管理
            requestApi(wordObj.word)
                .then(respObj => generateLast(respObj, wordObj))
                .then(resObj => {
                    let jsonString = JSON.stringify(resObj)
                    callback(resObj, jsonString);
                })
                .catch(e => { console.log('请求报错0： ' + e) });
        });
    }
    stopRecognizer() {
        Voicesdk.stopRecognizer();
    }
    release() {
        Voicesdk.releaseMSC();
    }
    recognizWithString(str, callback) {
        let wordObj = {
            voiceid: '0000',
            word: str
        }
        requestApi(wordObj.word)
            .then(respObj => generateLast(respObj, wordObj))
            .then(resObj => {
                let jsonString = JSON.stringify(resObj)
                callback(resObj, jsonString);
            })
            .catch(e => { console.log('请求报错0： ' + e) });
    }
    requestPerssion(callback) {
        console.log('JS申请权限 . . . ',Platform.OS)
        if (Platform.OS == 'ios') {
            Voicesdk.requestPermi((codeString)=>{
                if(codeString.toString().indexOf('1')>=0){
                    callback(1);
                }else{
                    callback(0);
                }
            });
            return;
        }
        try {
            //返回string类型
            const granted = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
                PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
                PermissionsAndroid.PERMISSIONS.CHANGE_NETWORK_STATE,
                //PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                PermissionsAndroid.PERMISSIONS.WRITE_SETTINGS,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要读写权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("你已获取了读写权限")
                if (callback) callback(1)
            } else {
                console.log("获取读写权限失败")
                if (callback) callback(0)
            }
        } catch (e) {
            if (callback) callback(0)
        }
    }
}

// word = 进度管理
let requestApi = (word) => {
    return new Promise((resolve, reject) => {
        let url = 'http://124.207.197.54:8809/api?q=' + word + '&user_id=' + config.user_id + '&jianos_user_id=1';
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        // xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.onload = () => {
            if (xhr.status == 200) {
                let responseObj = JSON.parse(xhr.response)
                console.log('NLP请求结果 => ', responseObj)
                resolve(responseObj);
                return;
            }
            console.error('NLP请求其他错误 ...')
        };
        xhr.onerror = (e) => {
            console.error('NLP请求报错' + e)
            reject();
        };
        xhr.send();
    });
}
//从result.json摘出所需要的数据
let generateLast = (response, wordObj) => {
    return new Promise((resolve, reject) => {
        try {
            console.log(11)
            let afterResult = {
                voiceid: wordObj.voiceid,
                txt: wordObj.word,
                result: response.data.result,
                action: response.data.action,
                //action_value: response.data.action_value
            }
            console.log(22)
            resolve(afterResult);
        } catch (e) {
            console.log(33)
            resolve(
                {
                    voiceid: wordObj.voiceid,
                    txt: wordObj.word,
                    result: 'null',
                    action: 'null'
                }
            )
        }
    });
}

export default new SDK();
