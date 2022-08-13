import React from 'react';
import { useNavigate  } from "react-router-dom";

function DSNavigate(props){
    const navigate = useNavigate();
    const {element,url,params} = props;

    function handleClick(url){
        return ()=>{
            if(url==='/logout'){
                localStorage.removeItem('isLogin');
                localStorage.removeItem('token');
                url = '/api/sign_up';
            }
            navigate(url, { replace: true,...params });
        }
    }
    return React.cloneElement(element,{onClick:handleClick(url)});
}

export default DSNavigate;