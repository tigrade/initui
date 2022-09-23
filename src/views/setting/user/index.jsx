import React,{DSComponent,Fragment,post,get} from 'comp/index';
// import './index.less'

import { Form,Input,Modal,message,Tabs,Button} from 'antd';

class UserSettingView extends DSComponent{   
    constructor(props){
        super(props);
        this.resetPswdFormRef = React.createRef();
        this.aliasFormRef = React.createRef();
        this.state = {dialog:false,info:{}};
    }
    static defaultProps = {
    }
    componentDidMount = async() => {
        await this.loadInfo();
    }
    onEditor=()=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "账号设置";
            return state;
        });
    }
    loadInfo=async()=>{
        const response = await get('/api/user/info').catch(error => {
            message.error(error.message);
        });
        if(response){
           const {results} = response;
           const {aliasName,email,lastLoginIp,lastLoginTime} = results;
           const data = {aliasName:aliasName,email:email,lastLoginIp:lastLoginIp,lastLoginTime:lastLoginTime};
           this.setState(state=>{
            state.info = data;
            return state;
           });
        }
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        });
    }
    onAlias=async(e)=>{
        const {aliasName} = e;
        const params = new FormData();
        params.append('aliasName', aliasName);
        const response = await post('/api/client/alias',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
        }
    }
    onPassword=async(e)=>{
        const {oldPassword,newPassword} = e;
        const params = new FormData();
        params.append('oldPassword', oldPassword);
        params.append('newPassword', newPassword);
        const response = await post('/api/client/modify/password',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
        }
    }
    render(){
        const {dialog,dialogTitle,info} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                bodyStyle={{overflowY:"auto",padding:0,minHeight:500}}
                onCancel={this.onCannel}
                footer={null}>
                <Tabs tabPosition={"left"} style={{height:"500px"}} >
                    <Tabs.TabPane tab="基本信息" key={1} forceRender={true} style={{padding:16}}>
                        <Form layout="vertical" initialValues={info} ref={this.aliasFormRef} onFinish={this.onAlias}>
                            <Form.Item name="aliasName" label="昵称" rules={[{ required: true, message: '昵称不能为空' }]}>
                                <Input placeholder=""  autoComplete="off" />
                            </Form.Item>
                            <Form.Item name="email" label="邮箱">
                                <Input placeholder=""  autoComplete="off" disabled={true}/>
                            </Form.Item>
                            <Form.Item name="lastLoginIp" label="最后登录IP">
                                <Input placeholder=""  autoComplete="off" disabled={true}/>
                            </Form.Item>
                            <Form.Item name="lastLoginTime" label="最后操作时间">
                                <Input placeholder=""  autoComplete="off" disabled={true}/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block={true}>更新昵称</Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>    
                    <Tabs.TabPane tab="密码设置" key={2} forceRender={true} style={{padding:16}}>
                        <Form layout="vertical" ref={this.resetPswdFormRef} onFinish={this.onPassword}>
                            <Form.Item name="oldPassword" label="默认密码" rules={[{ required: true, message: '默认密码不能为空' }]}>
                                <Input.Password placeholder=""  autoComplete="off" />
                            </Form.Item>
                            <Form.Item name="newPassword" label="新设密码" rules={[{ required: true, message: '新设密码不能为空' }]}>
                                <Input.Password placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block={true}>更新</Button>
                            </Form.Item>
                        </Form>
                    </Tabs.TabPane>
                </Tabs>
            </Modal>
        </Fragment>
        );
    }
}
export default UserSettingView;