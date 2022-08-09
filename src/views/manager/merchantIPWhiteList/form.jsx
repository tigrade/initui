import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message} from 'antd';

class IPWhiteListFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",merchantId:"",useType:"",ip:""},
        formType:{add:{name:"新增访问地址",code:"1"},update:{name:"修改访问地址",code:"2"}},
        reloadTable:()=>{}
    }
    componentDidMount=async ()=>{
        await this.loadMercahnt();
    }
    loadMercahnt = async()=>{
        const response = await post('/api/merchant/list',{}).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.merchantSource = results;
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
        const {id,merchantId,ip,useType} = e;
        const {formStatus} = this.state;
        let path = "/api/merchant/ipWhiteList/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {merchantId:merchantId,useType:useType,ip:ip};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/merchant/ipWhiteList/modify";
            content = {id:id,merchantId:merchantId,useType:useType,ip:ip};
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
        const {dialog,formData,dialogTitle,merchantSource} = this.state;
        if(merchantSource===undefined){
            return ;
        }
        const merchantOptions = merchantSource.map(e=>{
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
                    <Form.Item name="merchantId" label="商户" rules={[{ required: true, message: '商户不能为空' }]}>
                        <Select>{merchantOptions}</Select>
                    </Form.Item>
                    <Form.Item name="ip" label="IP" rules={[{ required: true, message: '地址不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="useType" label="类型" rules={[{ required: true, message: '类型不能为空' }]}>
                        <Select>
                            <Select.Option value="1">商戶登陸ip</Select.Option>
                            <Select.Option value="2">API接口ip</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default IPWhiteListFormView;