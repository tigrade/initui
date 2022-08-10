import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message,Divider,Row,Col} from 'antd';

class CodeSnapshotFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        codeExtensionId:"",
        formData:{id:"",name:"",code:"",snapshot:""},
        formType:{add:{name:"新增编码快照",code:"1"},update:{name:"修改编码快照",code:"2"}},
        reloadTable:()=>{}
    }
    componentDidMount=async ()=>{
        await this.loadCodeAttribute();
    }
    loadCodeAttribute = async()=>{
        const {codeExtensionId} = this.props;
        const params = new FormData();
        params.append("codeExtensionId", codeExtensionId);
        const response = await post('/api/code/attribute/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.codeAttributeList = results;
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
                const {codeAttributeList} = this.state;
                const attributeValues = codeAttributeList.map((k)=>{
                    return k.code;
                }).reduce((json, value) => { 
                    json[value] = ""; 
                    return json; 
                }, {});
                const data = Object.assign({},attributeValues,formData);
                this.formRef.current.setFieldsValue(data);
            }
            if(type===this.props.formType.update.code){
                const {id,name,code,snapshot,content} = item;
                const attributeValues = content.map((k)=>{
                    const v = {};
                    v[k.code] = k.value;
                    return v;
                }).reduce((json, value) => {
                    return value; 
                }, {});
                const data = Object.assign({id:id,name:name,code:code,snapshot:snapshot},attributeValues);
                this.formRef.current.setFieldsValue(data);
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
        const {codeAttributeList} = this.state;
        const {id,name,code,snapshot} = e;
        const {formStatus} = this.state;
        let path = "/api/code/snapshot/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            const attributeList = codeAttributeList.map(k=>{
                return {id:k.id,name:k.name,code:k.code,sequence:k.sequence,value:e[k.code]};
            });
            content = {codeExtensionId:codeExtensionId,name:name,code:code,snapshot:snapshot,content:attributeList};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/code/snapshot/modify";
            const attributeList = codeAttributeList.map(k=>{
                return {id:k.id,name:k.name,code:k.code,sequence:k.sequence,value:e[k.code]};
            });
            content = {id:id,codeExtensionId:codeExtensionId,name:name,code:code,snapshot:snapshot,content:attributeList};
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
    getDynamicAttribute=()=>{
        const {codeAttributeList} = this.state;
        if(codeAttributeList!==undefined){
            // debugger;
            return codeAttributeList.map(e=>{
                return (
                <Col span={8} key={e.id}>
                <Form.Item name={e.code} label={e.name} rules={[{ required: true, message: `${e.name}不能为空` }]}>
                    <Input placeholder=""  autoComplete="off"/>
                </Form.Item>
                </Col>);
            });
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
                width={1200}
                // bodyStyle={{overflowY:"auto",padding:0}}
                okText="确认"
                cancelText="取消">
                <Form id="_form" layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                    <Form.Item name="id" label="编号" noStyle hidden={true}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Row gutter={24}>
                    <Col span={8}>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                    <Form.Item name="code" label="编码" rules={[{ required: true, message: '编码不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                    <Form.Item name="snapshot" label="版本快照" rules={[{ required: true, message: '版本快照不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    </Col>
                    </Row>
                    <Divider orientation="left">动态属性</Divider>
                    <Row gutter={24}>
                        {this.getDynamicAttribute()}
                    </Row>
                    
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default CodeSnapshotFormView;