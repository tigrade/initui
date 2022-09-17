import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,Select,Radio,Popconfirm,Empty,Tree} from 'antd';

class CaseMemberFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.taskFormRef = React.createRef();
        this.state = {dialog:false,teamUserList:[],formData:props.formData,formType:1,selectedKeys:[],memberSourceList:[]};
    }
    static defaultProps = {
        formData:{id:"",memberId:"",memberType:""},
        lawCase:{},
        reloadTable:()=>{}
    }
    componentDidMount = async() => {
        const {lawCase} = this.props;
        await this.loadTeamUserList(lawCase.teamId);
    }
    loadTeamUserList=async(teamId)=>{
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
    onEditor=async()=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "人员设置";
            state.formType = 1;
            return state;
        },async()=>{
            await this.onReload();
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
    onReload=async()=>{
        const {lawCase} = this.props;
        const _params = new FormData();
        _params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseMember/list',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            let data = [];
            if(results!==undefined&&results!==null&&results.length>0){
                data = results.map(e=>{
                    return {title:e.memberAlias,key:e.id,isLeaf:true};
                });
            }
            this.setState(state=>{
                state.memberSourceList = data;
                return state;
            });
        }
    }
    onFormTypeChange=async(e)=>{
        const value = e.target.value;
        if(value===2){
            
        }
        if(value===1){
            
        }
        if(value===3){
            e.preventDefault();
            return;
        }
        this.setState(state=>{
            state.formType = value;
            return state;
        });
    }
    onSelectNode=async(keys,node)=>{
        if(node.selected===true){
            const params = new FormData();
            params.append('id',node.node.key);
            const response = await post('/api/lawCaseMember/find/one',params).catch(error => {
                message.error(error.message);
            });
            const {results} = response;
            const {id,memberId,memberType,memberAlias} = results;
            const formData = {id:id,memberId:memberId,memberType:memberType,memberAlias:memberAlias};
            this.setState(state=>{
                state.selectedKeys = keys;
                state.formType = 2;
                state.formData = formData;
                return state;
            },()=>{
                const {formData} = this.state;
                this.formRef.current.setFieldsValue(formData);
            });
        }else{
            const {formData} = this.props;
            this.setState(state=>{
                state.selectedKeys = keys;
                state.formData = formData;
                state.formType = 1;
                return state;
            },()=>{
                const {formData} = this.state;
                this.formRef.current.setFieldsValue(formData);
            });
        }
    }

    onSaveOrUpdate=async(e)=>{
        const {id,memberId,memberType} = e;
        const {formType} = this.state;
        const {lawCase} = this.props;
        let _path;
        let content = {memberId:memberId,memberType:memberType,lawCaseId:lawCase.id};
        if(formType===2){
            _path = "/api/lawCaseMember/modify"
            content = Object.assign(content,{id:id});
        }else{
            _path = "/api/lawCaseMember/save"
        }
        const params = new FormData();
        params.append('content', JSON.stringify(content));
        const response = await post(_path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            const {formData} = this.props;
            this.setState(state=>{
                state.formType = 1;
                state.formData = formData;
                state.selectedKeys = [];
                return state;
            },()=>{
                const {formData} = this.state;
                this.formRef.current.setFieldsValue(formData);
                message.success(response.message);
                this.onReload();
            });
        }
    }
    onDeleteNode=async()=>{
        const {formData} = this.state;
        const {id} = formData;
        const params = new FormData();
        params.append('id', id);
        const response = await post('/api/lawCaseMember/delete',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            const {formData} = this.props;
            this.setState(state=>{
                state.formType = 1;
                state.formData = formData;
                return state;
            },()=>{
                const {formData} = this.state;
                this.formRef.current.setFieldsValue(formData);
                message.success(response.message);
            });
        }
    }
    render(){
        const {dialog,dialogTitle,formData,teamUserList,formType,memberSourceList,selectedKeys} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={1200}
                bodyStyle={{overflowY:"auto",padding:0}}
                onCancel={this.onCannel}
                footer={null}>
                    <div className='menu-modal'>
                    <Row>
                    <Col flex="150px">
                        <div style={{overflowY:"auto",maxHeight:600,padding:"20px 0px"}}>
                        {memberSourceList.length<=0&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        {memberSourceList.length>0&&
                        <Tree 
                        selectable={true} 
                        onSelect={this.onSelectNode} 
                        selectedKeys={selectedKeys}
                        treeData={memberSourceList}
                        />
                        }
                        </div>
                    </Col>
                    <Col flex="auto">
                        <Radio.Group value={formType} onChange={this.onFormTypeChange}>
                            <Radio value={1} disabled={formType!==1}>新增</Radio>
                            <Radio value={2} disabled={formType!==2&&formType!==4}>编辑</Radio>
                            <Popconfirm
                                placement="bottom" 
                                title={`确认删除【${formData.memberAlias}】`}
                                onConfirm={this.onDeleteNode}
                                okText={"确认"}
                                cancelText={"取消"}>
                            <Radio value={3} disabled={formType!==2&&formType!==4}>删除</Radio>
                            </Popconfirm>
                        </Radio.Group>
                        <Form layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="memberType" label="类型" rules={[{ required: true, message: '人员类型不能为空' }]}>
                                <Select>
                                    <Select.Option value="SOURCE">案源人员</Select.Option>
                                    <Select.Option value="INNER_HANDLER">内部办案成员</Select.Option>
                                    <Select.Option value="OUTER_HANDLER">外部办案成员</Select.Option>
                                    <Select.Option value="CUSTOMER">客户成员</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="memberId" label="人员" rules={[{ required: true, message: '标题不能为空' }]}>
                                <Select>
                                    {teamUserList.map(e=>{
                                        return <Select.Option value={e.id} key={e.id}>{e.alias}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large">{formType===1&&"新增"}{formType===2&&"更新"}</Button>
                            </Form.Item>
                        </Form>
                       
                    </Col>
                </Row>
                    </div>
                
            </Modal>
        </Fragment>
        );
    }
}
export default CaseMemberFormView;