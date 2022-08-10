import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message} from 'antd';

class CodeExtensionFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",codeTypeId:"",codeSourceId:""},
        formType:{add:{name:"新增扩展编码",code:"1"},update:{name:"修改扩展编码",code:"2"}},
        reloadTable:()=>{}
    }
    componentDidMount=async ()=>{
        await this.loadCodeType();
        await this.loadCodeSource();
    }
    loadCodeType = async()=>{
        const response = await post('/api/code/type/list',{}).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.codeTypeList = results;
                return state;
            });
        }
    }
    loadCodeSource = async()=>{
        const response = await post('/api/code/source/list',{}).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.codeSourceList = results;
                return state;
            });
        }
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
        const {id,name,code,codeSourceId,codeTypeId} = e;
        const {formStatus} = this.state;
        let path = "/api/code/extension/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {name:name,code:code,codeSourceId:codeSourceId,codeTypeId:codeTypeId};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/code/extension/modify";
            content = {id:id,name:name,code:code,codeSourceId:codeSourceId,codeTypeId:codeTypeId};
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
        const {dialog,formData,dialogTitle,codeTypeList,codeSourceList} = this.state;
        if(codeTypeList===undefined||codeSourceList===undefined){
            return ;
        }
        const codeTypeOptions = codeTypeList.map(e=>{
            return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
        });
        const codeSourceOptions = codeSourceList.map(e=>{
            return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
        });
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
                    <Form.Item name="codeTypeId" label="编码类型" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Select>{codeTypeOptions}</Select>
                    </Form.Item>
                    <Form.Item name="codeSourceId" label="编码来源" rules={[{ required: true, message: '编码不能为空' }]}>
                        <Select>{codeSourceOptions}</Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default CodeExtensionFormView;