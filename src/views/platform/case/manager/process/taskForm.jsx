import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Modal,message, Button,Form,Input,Select} from 'antd';

class CaseTaskFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,memberSourceList:[]};
    }
    static defaultProps = {
        formData:{id:"",title:"",remark:"",executeUserId:""},
        lawCase:{},
        onReloadList:()=>{}

    }
    componentDidMount = async() => {}
    onEditor=async(e)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "任务编辑";
            state.formData = Object.assign({},e,{remark:e.content});
            return state;
        },async()=>{
            await this.onReload();
            const {formData} = this.state;
            this.formRef.current.setFieldsValue(formData);
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        },()=>{

        });
    }
    onReload=async()=>{
        const {lawCase} = this.props;
        const _params = new FormData();
        _params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseMember/list',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.memberSourceList = (results===null||results===undefined)?[]:results;
                return state;
            });
        }
    }
    onUpdate=async(e)=>{
        const {title,executeUserId,remark,status} = e;
        const {formData} = this.state;
        const {id} = formData;
        const params = new FormData();
        const content = {id:id,title:title,executeUserId:executeUserId,content:remark,status:status};
        params.append('content', JSON.stringify(content));
        const response = await post('/api/lawCaseTask/modify',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onCannel();
            this.props.onReloadList();
        }
    }
    render(){
        const {dialog,dialogTitle,formData,memberSourceList} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                onCancel={this.onCannel}
                okText="确认"
                cancelText="取消">
                <Form id="_form" layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onUpdate}>
                    <Form.Item name="id" label="编号" noStyle hidden={true}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="title" label="标题" rules={[{ required: true, message: '标题不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="executeUserId" label="执行者">
                        <Select>
                            {memberSourceList.map(e=>{
                                return <Select.Option value={e.id} key={e.id}>{e.memberAlias}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="status" label="状态" rules={[{ required: true, message: '状态不能为空' }]}>
                        <Select>
                            <Select.Option value="PANDING">待处理</Select.Option>
                            <Select.Option value="HANDLE">处理中</Select.Option>
                            <Select.Option value="FINISH">完成</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default CaseTaskFormView;