import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import DSRoutes from 'routes/index';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';


axios.defaults.timeout = 100000;
// axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.baseURL = "";
/**
 * http request 拦截器
 */
 axios.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    config.headers = {
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  (response) => {
    if (response.data.errCode === 2) {
      // console.log("过期");
    }
    return response;
  },
  (error) => {
    // console.log("请求出错：", error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
//装载
root.render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>
    <DSRoutes/>
  </ConfigProvider>
  
  // </React.StrictMode>
);
//卸载
// root.unmount();
//flushSync
//useSyncExternalStore 
//useTransition  -Suspense 
//useState，useEffect，useContext，useReducer，useCallback，useMemo，useRef，useTransition，useDeferredValue


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);//质量信号