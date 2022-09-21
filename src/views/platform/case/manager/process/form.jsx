import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,Select,Radio,Popconfirm,Empty,Tree} from 'antd';

class CaseProcessFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.taskFormRef = React.createRef();
        this.state = {dialog:false,formData:props.formData,formType:1,dataSource:[],selectedKeys:[],memberSourceList:[]};
    }
    static defaultProps = {
        formData:{id:"",title:""},
        taskFormData:{id:"",title:"",remark:"",executeUserId:""},
        lawCase:{},
        reloadTable:()=>{}
    }
    componentDidMount = async() => {
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
    onEditor=async()=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "流程设置";
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
        const params = new FormData();
        params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseProcess/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            const dataSource = results.map(e=>{
                return {title:e.title,key:e.id,isLeaf:true};
            });
            this.setState(state=>{
                state.dataSource = dataSource;
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
            const response = await post('/api/lawCaseProcess/find/one',params).catch(error => {
                message.error(error.message);
            });
            const {results} = response;
            const {id,title} = results;
            const formData = {id:id,title:title};
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
        const {id,title} = e;
        const {formType} = this.state;
        const {lawCase} = this.props;
        let _path;
        let content = {title:title,lawCaseId:lawCase.id};
        if(formType===2){
            _path = "/api/lawCaseProcess/modify"
            content = Object.assign(content,{id:id});
        }else{
            _path = "/api/lawCaseProcess/save"
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
        const response = await post('/api/lawCaseProcess/delete',params).catch(error => {
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
    onTaskSave=async(e)=>{
        const {title,executeUserId,remark} = e;
        const {formData} = this.state;
        const {id} = formData;
        const params = new FormData();
        const content = {title:title,executeUserId:executeUserId,content:remark,lawCaseProcessId:id};
        params.append('content', JSON.stringify(content));
        const response = await post('/api/lawCaseTask/save',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {taskFormData} = this.props;
            this.taskFormRef.current.setFieldsValue(taskFormData);
            message.success(response.message);
            
        }
    }
    render(){
        const {dialog,dialogTitle,formData,taskFormData,formType,dataSource,selectedKeys,memberSourceList} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={800}
                bodyStyle={{overflowY:"auto",padding:0}}
                onCancel={this.onCannel}
                footer={null}>
                    <div className='menu-modal'>
                    <Row>
                    <Col flex="150px">
                        <div style={{overflowY:"auto",maxHeight:600,padding:"20px 0px"}}>
                        {dataSource.length<=0&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        {dataSource.length>0&&
                        <Tree 
                        selectable={true} 
                        onSelect={this.onSelectNode} 
                        selectedKeys={selectedKeys}
                        treeData={dataSource}
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
                                title={`确认删除【${formData.title}】`}
                                onConfirm={this.onDeleteNode}
                                okText={"确认"}
                                cancelText={"取消"}>
                            <Radio value={3} disabled={formType!==2&&formType!==4}>删除</Radio>
                            </Popconfirm>
                            <Radio value={4} disabled={formType!==2&&formType!==4}>任务</Radio>
                        </Radio.Group>
                        {formType!==4&&
                        <Form layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="title" label="标题" rules={[{ required: true, message: '标题不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large">{formType===1&&"新增"}{formType===2&&"更新"}</Button>
                            </Form.Item>
                        </Form>
                        }
                        {formType===4&&
                        <Form layout="vertical" ref={this.taskFormRef} initialValues={taskFormData} onFinish={this.onTaskSave}>
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
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large">新增</Button>
                            </Form.Item>
                        </Form>
                        }
                    </Col>
                </Row>
                    </div>
                
            </Modal>
        </Fragment>
        );
    }
}
export default CaseProcessFormView;