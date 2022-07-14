import axios from "axios";

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params,}).then((response) => {
            const _res = JSON.parse(JSON.stringify(response.data));
            if(_res!=null){
                if(_res['code']==200||_res['status']=="success"){
                    return resolve(_res['results']);
                }
            }
            return reject(_res);
        }).catch((error) => {
            // console.log(error);
            reject(error);
        });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then((response) => {
            const _res = JSON.parse(JSON.stringify(response.data));
            if(_res!=null){
                if(_res['code']==200||_res['status']=="success"){
                    return resolve(_res['results']);
                }
            }
            return reject(_res);
        }).catch((error) => {
            // console.log(error);
            reject(error);
        });
    });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data).then((response) => {
            resolve(response.data);
        },(err) => {
            reject(err);
        });
    });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then((response) => {
            resolve(response.data);
        },(err) => {
            reject(err);
        });
    });
}


Date.prototype.Format = function (fmt) {
    var o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'H+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'S+': this.getMilliseconds()
    };
    //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
    if (/(y+)/.test(fmt)) {
      //第一种：利用字符串连接符“+”给date.getFullYear()+''，加一个空字符串便可以将number类型转换成字符串。
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
      }
    }
    return fmt;
  };


