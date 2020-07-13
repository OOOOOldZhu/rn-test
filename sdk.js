
import { PermissionsAndroid } from 'react-native';
import RNVoicesdk from 'voicesdk';

class SDK{
    constructor(){
        this.init.bind(this);
        this.initRecognizer.bind(this);
        this.startRecognizer.bind(this);
        this.stopRecognizer.bind(this);
        this.release.bind(this);
    }
    //function a(){};
    async init() {
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
                this.initRecognizer();
            } else {
                //this.show("获取读写权限失败")
            }
        } catch (err) {
            //this.show(err.toString())
        }
    };
    initRecognizer(){
        console.log('initRecognizer()');
        RNVoicesdk.init();
    }
    startRecognizer(callback){
        RNVoicesdk.startRecognizer(msg => {
            console.log('js接收的数据 => ' + msg);
            callback(msg);
        });
    }
    stopRecognizer(){
        RNVoicesdk.stopRecognizer();
    }
    release(){
        RNVoicesdk.release();
    }
}
// word = 进度管理
let request  = (word)=>{
    return new Promise((resolve,reject)=>{
        let url = 'http://124.207.197.54:8809/api?q='+word+'&user_id=614&jianos_user_id=1';
        
        let xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        // xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.onload = () => {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.response);
                if (!response.data) {
                    reject();
                    return
                }
                console.log('response => '+response);
                resolve(response);
            }
        };
        xhr.onerror = () => {
            reject();
        };
        xhr.send();
    });
}

// let afterResult = {
//     txt:response.data.question,
//     result:response.data.result,
//     action:response.data.action
// }

export default new SDK();