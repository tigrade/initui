import React, { Component, Fragment } from 'react';
import './index.less'

import DSNavigate from 'comp/nav/index'

class DefaultView extends Component{   
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