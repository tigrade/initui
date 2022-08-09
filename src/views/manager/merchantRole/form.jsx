import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message} from 'antd';

class MerchantRoleFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",merchantTypeId:"",merchantTypeName:"",roleId:"",roleName:""},
        formType:{add:{name:"新增商户角色",code:"1"},update:{name:"修改商户角色",code:"2"}},
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
        const response = await post('/api/role/list',{}).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.roleSource = results;
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
        const {id,merchantTypeId,roleId} = e;
        const {formStatus} = this.state;
        let path = "/api/merchant/role/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {merchantTypeId:merchantTypeId,roleId:roleId};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/merchant/role/modify";
            content = {id:id,merchantTypeId:merchantTypeId,roleId:roleId};
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
        const {dialog,formData,dialogTitle,roleSource,merchantTypeSource} = this.state;
        if(roleSource===undefined||merchantTypeSource===undefined){
            return ;
        }
        const roleOptions = roleSource.map(e=>{
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
                    <Form.Item name="merchantTypeId" label="商户类型" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Select>{merchantTypeOptions}</Select>
                    </Form.Item>
                    <Form.Item name="roleId" label="角色名称" rules={[{ required: true, message: '编码不能为空' }]}>
                        <Select>{roleOptions}</Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default MerchantRoleFormView;