import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message} from 'antd';

class RoleFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",level:"11"},
        formType:{add:{name:"新增角色",code:"1"},update:{name:"修改角色",code:"2"}},
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
        const {id,name,code,level} = e;
        const {formStatus} = this.state;
        let path = "/api/role/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {name:name,code:code,level:level};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/role/modify";
            content = {id:id,name:name,code:code,level:level};
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
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="code" label="编码" rules={[{ required: true, message: '编码不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="level" label="等级" rules={[{ required: true, message: '等级不能为空' }]}>
                        <Select>
                            <Select.Option value="31">普通角色</Select.Option>
                            <Select.Option value="21">商戶角色</Select.Option>
                            <Select.Option value="11">系統角色</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default RoleFormView;