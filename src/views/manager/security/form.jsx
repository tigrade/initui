import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message, InputNumber} from 'antd';

class SecurityFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",type:"",source:"",minTimes:"",maxTimes:"",waitTime:""},
        formType:{add:{name:"新增操作受限",code:"1"},update:{name:"修改操作受限",code:"2"}},
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        const type = item===undefined?"1":"2";
        this.setState(state=>{
            state.dialog = true;
            state.formStatus = type;
            if(type===this.props.formType.add.code){
                state.dialogTitle = this.props.formType.add.name;
            }
            if(type===this.props.formType.update.code){
                state.dialogTitle = this.props.formType.update.name;
            }
            return state;
        },()=>{
            if(type===this.props.formType.add.code){
                const {formData} = this.props;
                this.formRef.current.setFieldsValue(formData);
            }
            if(type===this.props.formType.update.code){
                this.formRef.current.setFieldsValue(item);
            }
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
        const {id,type,source,minTimes,maxTimes,waitTime} = e;
        const {formStatus} = this.state;
        let path = "/api/handle/limit/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {type:type,source:source,minTimes:minTimes,maxTimes:maxTimes,waitTime:waitTime};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/handle/limit/modify";
            content = {id:id,type:type,source:source,minTimes:minTimes,maxTimes:maxTimes,waitTime:waitTime};
        }
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post(path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
        }
        this.setState(state=>{
            state.dialog = false;
            state.formData = null;
            return state;
        },()=>{
            this.props.reloadTable();
        });
    }
    render(){
        const {dialog,formData,dialogTitle} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                onCancel={this.onCannel}
                okText="确认"
                cancelText="取消">
                <Form id="_form" layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                    <Form.Item name="id" label="编号" noStyle hidden={true}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="source" label="验证类型" rules={[{ required: true, message: '验证类型不能为空' }]}>
                        <Select>
                            <Select.Option value="ACCOUNT">账号</Select.Option>
                            <Select.Option value="EMAIL">邮箱</Select.Option>
                            <Select.Option value="PHONE">手机</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item name="type" label="类型" rules={[{ required: true, message: '类型不能为空' }]}>
                        <Select>
                            <Select.Option value="LOGIN">登录</Select.Option>
                            <Select.Option value="REGEDIT_CODE">注册验证码</Select.Option>
                            <Select.Option value="LOGIN_CODE">登录验证码</Select.Option>
                            <Select.Option value="RESET_PASSWORD_CODE">重置密码验证码</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="minTimes" label="最小次数" rules={[{ required: true, message: '最小次数不能为空' }]}>
                        <InputNumber placeholder=""  autoComplete="off" style={{width:"100%"}}/>
                    </Form.Item>
                    <Form.Item name="maxTimes" label="最大次数" rules={[{ required: true, message: '最大次数不能为空' }]}>
                        <InputNumber placeholder=""  autoComplete="off" style={{width:"100%"}}/>
                    </Form.Item>
                    <Form.Item name="waitTime" label="等待时间【毫秒】" rules={[{ required: true, message: '等待时间不能为空' }]}>
                        <InputNumber placeholder=""  autoComplete="off" style={{width:"100%"}}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default SecurityFormView;