import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Modal,List,Checkbox,message} from 'antd';

class UserRoleFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {dialog:false,dataSource:[]};
    }
    static defaultProps = {
        reloadTable:()=>{}
    }
    
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "用户授权";
            state.userId = item.id;
            return state;
        },()=>{
            this.onLoad();
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            state.formData = null;
            return state;
        });
    }
    onSaveOrUpdate=async(e)=>{
        
    }
    onLoad= async()=>{
        const {userId} = this.state;
        const params = new FormData();
        params.append('userId', userId);
        const response = await post('/api/authorization/user/permission/list', params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            const { results} = response;
            const dataSource = results.map(e=>{
                return {roleName:e.roleName,selected:e.selected,id:e.id,roleId:e.roleId};
            });
            this.setState(state=>{
                state.dataSource = dataSource;
                return state;
            });
        }
    }
    onChange=async (item,e)=>{
        const {userId} = this.state;
        const {roleId} = item;
        let path;
        if(e.target.checked){
            path = '/api/authorization/user/permission/save';
        }else{
            path = '/api/authorization/user/permission/delete';
        }
        const params = new FormData();
        params.append('userId', userId);
        params.append('roleId',roleId);
        const response = await post(path, params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            message.success(response.message);
            this.onLoad();
        }
    }
    render(){
        const {dialog,dialogTitle,dataSource} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                footer={null}
                onCancel={this.onCannel}>
                <List
                    size="small"
                    // header={<div>Header</div>}
                    // footer={<div>Footer</div>}
                    // bordered
                    dataSource={dataSource}
                    renderItem={item => <List.Item>{<Checkbox checked={item.selected} onChange={this.onChange.bind(this,item)}>{item.roleName}</Checkbox>}</List.Item>}
                    />
            </Modal>
        </Fragment>
        );
    }
}
export default UserRoleFormView;