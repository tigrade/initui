import React from 'react';
import { useNavigate  } from "react-router-dom";

function DSNavigate(props){
    const navigate = useNavigate();
    const {element,url} = props;
    function handleClick(url){
        return ()=>{
            navigate(url, { replace: true });
        }
    }
    return React.cloneElement(element,{onClick:handleClick(url)});
}
export default DSNavigate;