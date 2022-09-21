import React,{DSComponent,Fragment,post,DSSelectList} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message} from 'antd';
import ModuleTreeView from 'views/manager/roleResource/module';

class RoleResourceFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.ListRef = React.createRef();
        this.moduleTreeRef = React.createRef();
        
        this.state = {dialog:false,condition:{}};
    }
    static defaultProps = {
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "角色授权";
            state.condition = {roleId:item.id};
            return state;
        },()=>{
           this.onReload();
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        });
    }
    onReload=()=>{
        this.ListRef.current.reload();
    }
    onSelectNode=(node)=>{
        this.setState(state=>{
            state.condition = Object.assign({},state.condition,{moduleId:node[0]});
            return state;
        },()=>{
            this.onReload();
        });
    }
    onChange= async(keyList,items)=>{
        const {condition} = this.state;
        const params = new FormData();
        params.append("roleId", condition.roleId);
        params.append("resourceIds", keyList);
        const response = await post("/api/authorization/role/permission/batch/save",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
        }
    }
    render(){
        const {dialog,dialogTitle,condition,} = this.state;
        const columns=[
            {title: '名称',dataIndex: 'resourceName'},
            {title: '编码',dataIndex: 'resourceCode'},
            {title: '路径',dataIndex: 'resourcePath'}];
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={800}
                bodyStyle={{height: 1000,overflowY:"auto"}}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                onCancel={this.onCannel}
                footer={null}>
                <Row>
                    <Col flex="250px">
                        <div style={{marginTop:12}}>
                            <ModuleTreeView onSelect={this.onSelectNode} ref={this.moduleTreeRef}></ModuleTreeView>
                        </div>
                    </Col>
                    <Col flex="auto">
                        <DSSelectList columns={columns} onChange={this.onChange} id="resourceId" condition={condition} path={'/api/authorization/role/permission/list'} ref={this.ListRef} other={{pagination:false}} ></DSSelectList>
                    </Col>
                </Row>
            </Modal>
        </Fragment>
        );
    }
}
export default RoleResourceFormView;



