import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message} from 'antd';

class BaseFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",title:""},
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "案件编辑";
            return state;
        },()=>{
            const formData = {id:item.id,title:item.title};
            this.formRef.current.setFieldsValue(formData);
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        });
    }
    onSaveOrUpdate=async(e)=>{
        const {id,title} = e;
        let path = "/api/lawCase/modify";
        const content = {id:id,title:title};
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
            return state;
        },()=>{
            this.props.reloadPage();
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
                    <Form.Item name="title" label="案件名称" rules={[{ required: true, message: '案件名称不能为空' }]}>
                        <Input.TextArea placeholder=""  autoComplete="off"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default BaseFormView;