
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