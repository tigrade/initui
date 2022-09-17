import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message} from 'antd';

class TeamFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "成员设置";
            state.merchantRoleCode = item.merchantRoleCode;
            return state;
        },()=>{
            const {id,alias,merchantRoleCode} = item;
            const formData = {id:id,alias:alias,merchantRoleCode:merchantRoleCode}
            this.formRef.current.setFieldsValue(formData);
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        },()=>{
            this.props.reloadTable();
        });
    }
    onSaveOrUpdate=async(e)=>{
        const {id,alias,merchantRoleCode} = e;
        let content = {id:id,alias:alias,merchantRoleCode:merchantRoleCode};
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post('/api/team/user/modify',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onCannel();
        }
    }
    render(){
        const {dialog,dialogTitle,merchantRoleCode} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                onCancel={this.onCannel}
                okText="确认"
                cancelText="取消">
                <Form id="_form" layout="vertical" ref={this.formRef} onFinish={this.onSaveOrUpdate}>
                    <Form.Item name="id" label="编号" noStyle hidden={true}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="alias" label="备注" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    {merchantRoleCode!=="TEAM_OWNER"&&
                    <Form.Item name="merchantRoleCode" label="权限" rules={[{ required: true, message: '等级不能为空' }]}>
                        <Select>
                            <Select.Option value="TEAM_VIEW">加入团队后,仅查看</Select.Option>
                            <Select.Option value="TEAM_EDIT">加入团队后,可编辑</Select.Option>
                            <Select.Option value="TEAM_ADMIN">加入团队后,可管理</Select.Option>
                        </Select>
                    </Form.Item>
                    }
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default TeamFormView;