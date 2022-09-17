import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message} from 'antd';

class TeamSettingFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            return state;
        },()=>{
            this.formRef.current.setFieldsValue(item);
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        },()=>{
            window.location.reload();
        });
    }
    onSaveOrUpdate=async(e)=>{
        const {id,name} = e;
        let path = "/api/team/modify";
        let content = {id:id,name:name};
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post(path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            const _teamView_ = JSON.stringify({id:id,name:name});
            sessionStorage.setItem('teamView', _teamView_);
            this.onCannel();
        }
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
                <Form id="_form" layout="vertical" ref={this.formRef}  onFinish={this.onSaveOrUpdate}>
                    <Form.Item name="id" label="编号" noStyle hidden={true}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default TeamSettingFormView;