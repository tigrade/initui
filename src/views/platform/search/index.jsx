import React,{DSBase,DSComponent,Fragment,DSNavigate} from 'comp/index';
import {Button} from 'antd';
import './index.less'

class SearchView extends DSComponent{   
    componentDidMount=()=>{
    }
    render(){
        debugger;
        return (
        <Fragment>SearchView
            <DSNavigate url={DSBase.list.P_CaseView.path} element={<Button type="link">返回</Button>}/>
        </Fragment>
        );
    }
}
export default SearchView;