import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message} from 'antd';

class MerchantFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",name:"",linkman:"",phone:"",email:"",customerId:"",merchantTypeId:""},
        formType:{add:{name:"新增商户",code:"1"},update:{name:"修改商户",code:"2"}},
        reloadTable:()=>{}
    }
    componentDidMount=async ()=>{
        await this.loadMercahntType();
        await this.loadRole();
    }
    loadMercahntType = async()=>{
        const response = await post('/api/merchant/type/list',{}).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.merchantTypeSource = results;
                return state;
            });
        }
    }
    loadRole = async()=>{
        const response = await post('/api/customer/list',{}).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.customerSource = results;
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
        const {id,name,linkman,phone,email,customerId,merchantTypeId} = e;

        const {formStatus} = this.state;
        let path = "/api/merchant/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {name:name,linkman:linkman,phone:phone,email:email,customerId:customerId,merchantTypeId:merchantTypeId};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/merchant/modify";
            content = {id:id,name:name,linkman:linkman,phone:phone,email:email,customerId:customerId,merchantTypeId:merchantTypeId};
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
        const {dialog,formData,dialogTitle,customerSource,merchantTypeSource} = this.state;
        if(customerSource===undefined||merchantTypeSource===undefined){
            return ;
        }
        const customerOptions = customerSource.map(e=>{
            return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
        });
        const merchantTypeOptions = merchantTypeSource.map(e=>{
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
                    <Form.Item name="customerId" label="客户名称" rules={[{ required: true, message: '客户不能为空' }]}>
                        <Select>{customerOptions}</Select>
                    </Form.Item>
                    <Form.Item name="merchantTypeId" label="商户类型" rules={[{ required: true, message: '商户类型不能为空' }]}>
                        <Select>{merchantTypeOptions}</Select>
                    </Form.Item>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="linkman" label="联络人">
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="phone" label="手机">
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="email" label="邮箱">
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default MerchantFormView;