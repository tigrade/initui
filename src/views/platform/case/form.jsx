import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Select,message,Button,Row,Col,Divider} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

class CaseFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",level:"11"},
        reloadTable:()=>{}
    }
    componentDidMount=async ()=>{
        
    }
    loadTeamUserList = async(teamId)=>{
        const params = new FormData();
        params.append("teamId", teamId);
        const response = await post('/api/team/user/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.teamUserList = results;
                return state;
            },()=>{
                
            });
        }
    }
    loadCaseTypeList = async(teamId)=>{
        const params = new FormData();
        params.append("teamId", teamId);
        const response = await post('/api/caseType/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.caseTypeList = results;
                return state;
            });
        }
    }
    loadCustomerList = async(teamId)=>{
        const params = new FormData();
        params.append("teamId", teamId);
        const response = await post('/api/team/customer/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.customerList = results;
                return state;
            },()=>{
                
            });
        }
    }
    onEditor=async (teamView)=>{
        await this.loadTeamUserList(teamView.id);
        await this.loadCaseTypeList(teamView.id);
        await this.loadCustomerList(teamView.id);
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "新增案件";
            state.teamId = teamView.id;
            return state;
        },async ()=>{
            const {formData} = this.props;
            this.formRef.current.setFieldsValue(formData);
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            state.formData = null;
            return state;
        },()=>{
            const {formData} = this.props;
            this.formRef.current.setFieldsValue(formData);
        });
    }
    onSaveOrUpdate=async(e)=>{
        const {teamId} = this.state;
        const params = new FormData();
        const content = Object.assign({},e,{teamId:teamId})
        params.append("content", JSON.stringify(content));
        const response = await post('/api/lawCase/save',params).catch(error => {
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
            this.formRef.current.resetFields();
            this.props.reloadTable();
            window.open(`/content/lawCase/detail?id=${response.results.id}`, '_blank');
        });
    }
    
    render(){
        const {dialog,formData,dialogTitle,teamUserList,caseTypeList,customerList} = this.state;
        if(teamUserList===undefined||caseTypeList===undefined){
            return ;
        }
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
                    <Form.Item name="title" label="案件名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input.TextArea placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="teamCustomerId" label="客户" rules={[{ required: true, message: '客户不能为空' }]}>
                        <Select>
                        {customerList&&customerList.map(e=>{
                            return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                        })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="caseTypeId" label="案件类型" rules={[{ required: true, message: '案件类型不能为空' }]}>
                        <Select>
                        {caseTypeList&&caseTypeList.map(e=>{
                            return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                        })}
                        </Select>
                    </Form.Item>
                    <Divider>选择成员</Divider>
                    <Form.List name="memberList">
                    {(fields, { add, remove }) => (
                        <>
                        {fields.map((field, index) => {
                            return (
                                <Row align="top" key={index}>
                                    <Col flex="150px">
                                    <Form.Item {...field} name={[field.name,"memberType"]} rules={[{ required: true, message: "类型不能为空" }]}>
                                        <Select>
                                            <Select.Option value="SOURCE">案源人员</Select.Option>
                                            <Select.Option value="INNER_HANDLER">内部办案成员</Select.Option>
                                            <Select.Option value="OUTER_HANDLER">外部办案成员</Select.Option>
                                            <Select.Option value="CUSTOMER">客户成员</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    </Col>
                                    <Col flex="auto" style={{paddingLeft:"12px"}}>
                                    <Form.Item {...field} name={[field.name,"memberId"]} rules={[{ required: true, message: "人员不能为空" }]}>
                                        <Select>
                                            {teamUserList.map(e=>{
                                                return <Select.Option value={e.id} key={e.id}>{e.alias}</Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    </Col>
                                    <Col flex="50px" style={{paddingLeft:"12px",paddingTop:"6px"}}><MinusCircleOutlined onClick={() => remove(index)} /></Col>
                                </Row>
                            );
                        })}
                        <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加成员</Button>
                        </Form.Item>
                        </>
                    )}
                    </Form.List>
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default CaseFormView;