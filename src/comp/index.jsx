import React, {Component} from 'react';
import 'antd/dist/antd.less';

export class DSComponent extends Component{
    componentDidUpdate(){
        document.title = `鱼律科技 一律给力`
    }
}
export {Fragment,useEffect,useState,useRef,useCallback} from 'react';

export { get,post } from 'utils/http';
export {default as DSBase} from 'conf/index';
export { nanoid as DSID } from 'nanoid'; 
export default React;


export {default as DSSelectList} from 'comp/selectlist/index';
export {default as DSTable} from 'comp/table/index';
export {default as DSTreeSelect} from 'comp/tree/index';
export {default as DSNavigate} from 'comp/nav/index';
export {default as DSList} from 'comp/list/index';



export { useNavigate,Link  } from "react-router-dom";
