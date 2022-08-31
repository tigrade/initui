import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,InputNumber,Radio,Popconfirm,Empty,Tree} from 'antd';

class CaseFieldGroupFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,formData:props.formData,formType:1,dataSource:[],selectedKeys:[]};
    }
    static defaultProps = {
        formData:{id:"",name:"",serialNumber:""},
        reloadTable:()=>{}
    }
    onEditor=async(caseType)=>{
        const dataSource = await this.onReload(caseType);
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "字段分组";
            state.caseType = caseType;
            state.dataSource = dataSource||[];
            state.formType = 1;
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
    onReload=async(caseType)=>{
        const params = new FormData();
        params.append('caseTypeId', caseType.id);
        const response = await post('/api/caseFieldGroup/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            if(response.results){
                return response.results.map(e=>{
                    return {title:e.name,key:e.id,isLeaf:true};
                });
            }
        }
        return null;
    }
    onSelectNode=async(keys,node)=>{
        if(node.selected===true){
            const params = new FormData();
            params.append('id',node.node.key);
            const response = await post('/api/caseFieldGroup/find/one',params).catch(error => {
                message.error(error.message);
            });
            const {results} = response;
            const {id,name,serialNumber} = results;
            const formData = {id:id,name:name,serialNumber:serialNumber};
            
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
        const {id,name,serialNumber} = e;
        const {formType,caseType} = this.state;
        let _path;
        let content = {name:name,serialNumber:serialNumber,caseTypeId:caseType.id};
        if(formType===2){
            _path = "/api/caseFieldGroup/modify"
            content = Object.assign(content,{id:id});
        }else{
            _path = "/api/caseFieldGroup/save"
        }
        const params = new FormData();
        params.append('content', JSON.stringify(content));
        const response = await post(_path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            const dataSource = await this.onReload(caseType);
            const {formData} = this.props;
            this.setState(state=>{
                state.formType = 1;
                state.dataSource = dataSource||[];
                state.formData = formData;
                state.selectedKeys = [];
                return state;
            },()=>{
                const {formData} = this.state;
                this.formRef.current.setFieldsValue(formData);
                message.success(response.message);
            });
        }
    }
    onDeleteNode=async()=>{
        const {formData,caseType} = this.state;
        const {id} = formData;
        const params = new FormData();
        params.append('id', id);
        const response = await post('/api/caseFieldGroup/delete',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            const dataSource = await this.onReload(caseType);
            const {formData} = this.props;
            this.setState(state=>{
                state.formType = 1;
                state.dataSource = dataSource||[];
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
        const {dialog,dialogTitle,formData,formType,dataSource,selectedKeys} = this.state;
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
                            <Radio value={2} disabled={formType!==2}>编辑</Radio>
                            <Popconfirm
                                placement="bottom" 
                                title={`确认删除【${formData.name}】`}
                                onConfirm={this.onDeleteNode}
                                okText={"确认"}
                                cancelText={"取消"}>
                            <Radio value={3} disabled={formType!==2}>删除</Radio>
                            </Popconfirm>
                        </Radio.Group>
                        <Form layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            
                            <Form.Item name="serialNumber" label="排序" rules={[{ required: true, message: '排序不能为空' }]}>
                                <InputNumber placeholder=""  autoComplete="off" style={{ width: '100%' }}/>
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
export default CaseFieldGroupFormView;



