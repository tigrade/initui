import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message} from 'antd';

class CodeAttributeFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        codeExtensionId:"",
        formData:{id:"",name:"",code:"",type:"",sequence:""},
        formType:{add:{name:"新增属性编码",code:"1"},update:{name:"修改属性编码",code:"2"}},
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
        const {codeExtensionId} = this.props;
        const {id,name,code,type,sequence} = e;
        const {formStatus} = this.state;
        let path = "/api/code/attribute/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {codeExtensionId:codeExtensionId,name:name,code:code,type:type,sequence:sequence};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/code/attribute/modify";
            content = {id:id,codeExtensionId:codeExtensionId,name:name,code:code,type:type,sequence:sequence};
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
                    <Form.Item name="type" label="类型" rules={[{ required: true, message: '类型不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="sequence" label="序列" rules={[{ required: true, message: '序列不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default CodeAttributeFormView;