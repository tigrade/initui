import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message} from 'antd';

class TeamRobotFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,dialogTitle:"釘釘機器人設置"};
    }
    static defaultProps = {
        reloadTable:()=>{}
    }
    onEditor=(teamId)=>{
        this.setState(state=>{
            state.dialog = true;
            state.teamId = teamId;
            return state;
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
        const {secret,path} = e;
        const {teamId} = this.state;
        let content = {secret:secret,path:path,teamId:teamId};
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post("/api/dingTalkSetting/save",params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onCannel();
        }
    }
    render(){
        const {dialog,dialogTitle} = this.state;
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
                    <Form.Item name="secret" label="安全設置->加簽" rules={[{ required: true, message: '安全碼不能为空' }]}>
                    <Input.TextArea rows={4} placeholder="" autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Form.Item>
                    <Form.Item name="path" label="Webhook" rules={[{ required: true, message: 'Webhook不能为空' }]}>
                    <Input.TextArea rows={4} placeholder=""  autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default TeamRobotFormView;