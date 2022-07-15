import React, { Component, Fragment } from 'react';
import './index.less'

import { useNavigate  } from "react-router-dom";

function Btn(){
    const navigate = useNavigate();
    function test(){
        return ()=>{
            navigate("/case", { replace: true });
        }
    }
    return (<button onClick={test()}>ddd</button>);
}

class DefaultView extends Component{   
    constructor(props){
        super(props);
        this.state={btnRef :React.createRef()};
    }
    componentDidMount=()=>{
    }
    render(){
        return (
        <Fragment>
             <Btn onRef={this.state.btnRef}/>
        </Fragment>
        );
    }
}
export default DefaultView;