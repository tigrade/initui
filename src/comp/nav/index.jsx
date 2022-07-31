import React from 'react';
import { useNavigate  } from "react-router-dom";

function DSNavigate(props){
    const navigate = useNavigate();
    const {element,url} = props;

    function handleClick(url){
        return ()=>{
            if(url==='/logout'){
                sessionStorage.removeItem('isLogin');
                sessionStorage.removeItem('token');
                url = '/api/sign_up';
            }
            navigate(url, { replace: true });
        }
    }
    return React.cloneElement(element,{onClick:handleClick(url)});
}

export default DSNavigate;