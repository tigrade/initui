import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,Radio,Popconfirm} from 'antd';
import BriefTreeView from 'views/platform/book/brief';

class BriefFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.menuTreeRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {dialog:false,condition:{},nodeSelect:false,formData:props.formData,formType:1};
    }
    static defaultProps = {
        formData:{id:"",name:"",briefName:"",serialNumber:""},
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "案由管理";
            return state;
        },()=>{
           this.onReload();
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        },()=>{
            this.onReload();
        });
    }
    onReload=()=>{
        this.menuTreeRef.current.reload();
    }
    onSelectNode=(item)=>{
        const {selected,node} = item;
        const {formData} = this.props;
        this.setState(state=>{
            state.nodeSelect = selected;
            const {title,key} = node;
            const nodeItem = {id:key,name:title};
            state.nodeItem = nodeItem;
            state.formType = 1;
            if(selected===false){
                state.nodeItem = {};
            }
            return state;
        },()=>{
            const {nodeSelect,nodeItem} = this.state;
            if(nodeSelect===true){
                const {name} = nodeItem;
                const _formData = Object.assign({},formData,{briefName:name});
                this.formRef.current.setFieldsValue(_formData);
            }else{
                this.formRef.current.setFieldsValue(formData);
            }
        });
    }

    onSaveOrUpdate=async(e)=>{
        const {id,name,serialNumber} = e;
        const {formType,nodeSelect,nodeItem} = this.state;
        let _path;
        let content = {name:name,serialNumber:serialNumber};
        if(nodeSelect){
            content = Object.assign(content,{briefId:nodeItem.id});
        }
        if(formType===2){
            _path = "/api/brief/modify"
            content = Object.assign(content,{id:id});
        }else{
            _path = "/api/brief/save"
        }
        const params = new FormData();
        params.append('content', JSON.stringify(content));
        const response = await post(_path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            this.setState(state=>{
                state.nodeSelect = false;
                state.nodeItem = {};
                state.formType = 1;
                return state;
            },()=>{
                const {formData} = this.props;
                this.formRef.current.setFieldsValue(formData);
                this.menuTreeRef.current.unSelect();
                this.onReload();//刷新菜单
                message.success(response.message);
            });
        }
    }
    onFormTypeChange=async(e)=>{
        const value = e.target.value;
        if(value===2){
            const {nodeItem} = this.state;
            const {id} = nodeItem;
            const params = new FormData();
            params.append('id', id);
            const response = await post('/api/brief/find/one',params).catch(error => {
                message.error(error.message);
            });
            if(response){
                const {results} = response;
                const {id,name,serialNumber} = results;
                this.setState(state=>{
                    state.formType = value;
                    return state;
                },()=>{
                    const data = {id:id,name:name,serialNumber:serialNumber}
                    this.formRef.current.setFieldsValue(data);
                });
            }
        }
        if(value===1){
            this.setState(state=>{
                state.formType = value;
                return state;
            },()=>{
                const {formData} = this.props;
                const {nodeSelect,nodeItem} = this.state;
                if(nodeSelect===true){
                    const {name} = nodeItem;
                    const _formData = Object.assign({},formData,{briefName:name});
                    this.formRef.current.setFieldsValue(_formData);
                }else{
                    this.formRef.current.setFieldsValue(formData);
                }
            });
        }
        if(value===3){
            e.preventDefault();
            return;
        }
    }
    onDeleteNode=async()=>{
        const {nodeItem} = this.state;
        const {id} = nodeItem;
        const params = new FormData();
        params.append('id', id);
        const response = await post('/api/brief/delete',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            this.setState(state=>{
                state.nodeSelect = false;
                state.nodeItem = {};
                state.formType = 1;
                return state;
            },()=>{
                const {formData} = this.props;
                this.formRef.current.setFieldsValue(formData);
                this.onReload();//刷新菜单
                message.success(response.message);
            });
        }
    }
    render(){
        const {dialog,dialogTitle,nodeSelect,formData,formType} = this.state;
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
                    <Col flex="250px">
                        <div style={{overflowY:"auto",maxHeight:600}}>
                        <BriefTreeView onSelect={this.onSelectNode} ref={this.menuTreeRef}></BriefTreeView>
                        </div>
                    </Col>
                    <Col flex="auto">
                        <Radio.Group value={formType} onChange={this.onFormTypeChange}>
                            <Radio value={1}>新增</Radio>
                            <Radio value={2} disabled={!nodeSelect}>编辑</Radio>
                            <Popconfirm
                                placement="bottom" 
                                title={`确认删除【${this.state.nodeItem?this.state.nodeItem.name:""}】`}
                                onConfirm={this.onDeleteNode}
                                okText={"确认"}
                                cancelText={"取消"}>
                            <Radio value={3} disabled={!nodeSelect}>删除</Radio>
                            </Popconfirm>
                        </Radio.Group>
                        {formType!==4&&
                        <Form layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            {nodeSelect&&formType===1&&
                            <Form.Item name="briefName" label="上级" rules={[{ required: true, message: '名称不能为空' }]}>
                                <Input placeholder=""  autoComplete="off" disabled={true}/>
                            </Form.Item>
                            }
                            <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            
                            <Form.Item name="serialNumber" label="排序" rules={[{ required: true, message: '排序不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large">{formType===1&&"新增"}{formType===2&&"更新"}</Button>
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
export default BriefFormView;



