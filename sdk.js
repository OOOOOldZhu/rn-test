
import { PermissionsAndroid, Platform } from 'react-native';
import RNVoicesdk from 'voicesdk';

class SDK {
    constructor() {
        //this.init.bind(this);
        this.initRecognizer.bind(this);
        this.startRecognizer.bind(this);
        this.stopRecognizer.bind(this);
        this.release.bind(this);
        this.requestPerssion.bind(this);
        this.setConfig.bind(this);
        this.config = {
            user_id:'614'
        }
    }
    /*
     NLP后端需要的网络请求配置 user_id
    */
    setConfig(config){
        if(config)this.config = config;
    }
    // init() {
    //     requestPerssion()
    //     .then(_=>{
    //         this.initRecognizer();
    //     })
    //     .catch(e=>{})
    // };
    initRecognizer() {
        console.log('initRecognizer()')
        RNVoicesdk.init();
    }
    startRecognizer(callback) {
        RNVoicesdk.startRecognizer(wordObj => {
            /* wordObj
               {
                voiceid:123,
                word:'语音识别的结果'
               }
            */
            console.log('js接收的数据 => ' + wordObj);
            // 进度管理
            request(wordObj.word)
                .then(respObj => generateLast(respObj, wordObj))
                .then(resObj => {
                    let jsonString = JSON.stringify(resObj)
                    callback(resObj, jsonString);
                })
                .catch(e => { console.log('请求报错： ' + e) });
        });
    }
    stopRecognizer() {
        RNVoicesdk.stopRecognizer();
    }
    release() {
        RNVoicesdk.release();
    }
    requestPerssion(callback) {
        if (Platform == 'ios') {
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
let request = (word) => {
    return new Promise((resolve, reject) => {
        let url = 'http://124.207.197.54:8809/api?q=' + word + '&user_id='+this.config.user_id+'&jianos_user_id=1';
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
            let afterResult = {
                voiceid: wordObj.voiceid,
                txt: response.data.question,
                result: response.data.result,
                action: response.data.action,
                //action_value: response.data.action_value
            }
            resolve(afterResult);
        } catch (e) {
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
