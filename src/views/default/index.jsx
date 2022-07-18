import React, { Component, Fragment } from 'react';
import './index.less'

import DSNavigate from 'comp/nav/index'

class DefaultView extends Component{   
    constructor(props){
        super(props);
    }
    componentDidMount=()=>{
    }
    render(){
        return (
        <Fragment>
            <DSNavigate url="/case/new" element={<button>ddd</button>} />
        </Fragment>
        );
    }
}
export default DefaultView;