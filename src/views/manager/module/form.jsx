import React,{DSComponent,Fragment,post,DSTreeSelect} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message} from 'antd';

class ModuleFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,moduleSource:[]};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",path:"",module:{id:"",name:""}},
        formType:{add:{name:"新增模块",code:"1"},update:{name:"修改模块",code:"2"}},
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
                const module = {id:item.moduleId,name:item.moduleName};
                const _params = Object.assign({},item,{module:module});
                this.formRef.current.setFieldsValue(_params);
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
        const {id,name,code,path,module} = e;
        const {formStatus} = this.state;
        let _path = "/api/module/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {name:name,code:code,path:path,moduleId:module.id};
        }
        if(formStatus===this.props.formType.update.code){
            _path = "/api/module/modify";
            content = {id:id,name:name,code:code,path:path,moduleId:module.id};
        }
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post(_path,params).catch(error => {
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
                        <Input placeholder="" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="moduleId" label="模块编号" noStyle hidden={true}>
                        <Input placeholder="" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder="" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="code" label="编码" rules={[{ required: true, message: '编码不能为空' }]}>
                        <Input placeholder="" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="path" label="路径" rules={[{ required: true, message: '路径不能为空' }]}>
                        <Input placeholder="" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="module" label="模块" rules={[{ required: true, message: '模块不能为空' }]}>
                        <DSTreeSelect path='/api/module/list' code={{title:'name',value:'id',isLeaf:'isLeaf',pId:"moduleId"}}></DSTreeSelect>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default ModuleFormView;