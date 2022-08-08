import React,{DSComponent,Fragment,post,DSTreeSelect} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,Select,Radio,Popconfirm} from 'antd';
import MenuTreeView from 'views/manager/roleResource/menu';

class RoleMenuFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.menuTreeRef = React.createRef();
        this.formRef = React.createRef();
        //nodeItem:{id:"",name:""}
        this.state = {dialog:false,condition:{},nodeSelect:false,formData:props.formData,formType:1};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",path:"",sourceType:"",serialNumber:"",pname:"",module:{id:"",name:""}},
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "菜单管理";
            state.roleCode = item.code;
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
                const _formData = Object.assign({},formData,{pname:name});
                this.formRef.current.setFieldsValue(_formData);
            }else{
                this.formRef.current.setFieldsValue(formData);
            }
        });
    }
    onValuesChange=(field,a)=>{
        const fieldName = Object.keys(field)[0];
        if(fieldName==="sourceType"){
            const fieldValue = field[fieldName];
            this.setState(state=>{
                if(fieldValue==='module'){
                    state.sourceType = "module";
                }
                if(fieldValue==='custom'){
                    state.sourceType = "custom";
                }
                return state;
            })
        }
    }
    onSaveOrUpdate=async(e)=>{
        const {id,name,code,path,sourceType,serialNumber,module} = e;
        const {roleCode,formType,nodeSelect,nodeItem} = this.state;
        let _path;
        let content = {name:name,code:code,sourceType:sourceType,serialNumber:serialNumber};
        if(nodeSelect){
            content = Object.assign(content,{pid:nodeItem.id});
        }
        if(formType===2){
            _path = "/api/menu/modify"
            content = Object.assign(content,{id:id});
        }else{
            _path = "/api/menu/save"
        }
        if(sourceType==="module"){
            content = Object.assign(content,{moduleId:module.id});
        }
        if(sourceType==="custom"){
            content = Object.assign(content,{path:path});
        }
        const params = new FormData();
        params.append('roleCode', roleCode);
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
                state.sourceType = "";
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
        // debugger;
        if(value===2){
            const {nodeItem} = this.state;
            const {id} = nodeItem;
            const params = new FormData();
            params.append('id', id);
            const response = await post('/api/menu/find/one',params).catch(error => {
                message.error(error.message);
            });
            if(response){
                const {results} = response;
                const {id,name,code,sourceType,serialNumber,path,moduleId,moduleName} = results;
                this.setState(state=>{
                    state.formType = value;
                    state.sourceType = sourceType;
                    return state;
                },()=>{
                    const data = {id:id,name:name,code:code,path:path,sourceType:sourceType,serialNumber:serialNumber,module:{id:moduleId,name:moduleName}}
                    this.formRef.current.setFieldsValue(data);
                });
            }
        }
        if(value===1){
            this.setState(state=>{
                state.formType = value;
                state.sourceType = "";
                return state;
            },()=>{
                const {formData} = this.props;
                const {nodeSelect,nodeItem} = this.state;
                if(nodeSelect===true){
                    const {name} = nodeItem;
                    const _formData = Object.assign({},formData,{pname:name});
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
        const response = await post('/api/menu/delete',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            //重置表单
            this.setState(state=>{
                state.nodeSelect = false;
                state.nodeItem = {};
                state.formType = 1;
                state.sourceType = "";
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
        const {dialog,dialogTitle,roleCode,sourceType,nodeSelect,formData,formType} = this.state;
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
                        <MenuTreeView roleCode={roleCode} onSelect={this.onSelectNode} ref={this.menuTreeRef}></MenuTreeView>
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
                        <Form layout="vertical" onValuesChange={this.onValuesChange} ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            {nodeSelect&&formType===1&&
                            <Form.Item name="pname" label="上级" rules={[{ required: true, message: '名称不能为空' }]}>
                                <Input placeholder=""  autoComplete="off" disabled={true}/>
                            </Form.Item>
                            }
                            <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="code" label="编码" rules={[{ required: true, message: '编码不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Form.Item name="sourceType" label="类型" rules={[{ required: true, message: '类型不能为空' }]}>
                                <Select>
                                    <Select.Option value="module">模块</Select.Option>
                                    <Select.Option value="custom">自定义</Select.Option>
                                </Select>
                            </Form.Item>
                            {sourceType&&sourceType==="custom"&&
                            <Form.Item name="path" label="路径">
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            }
                            {sourceType&&sourceType==="module"&&
                            <Form.Item name="module" label="模块" rules={[{ required: true, message: '排序不能为空' }]}>
                                <DSTreeSelect path='/api/module/list' code={{title:'name',value:'id',isLeaf:'isLeaf',pId:"moduleId"}}></DSTreeSelect>
                            </Form.Item>
                            }
                            <Form.Item name="serialNumber" label="排序" rules={[{ required: true, message: '排序不能为空' }]}>
                                <Input placeholder=""  autoComplete="off"/>
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
export default RoleMenuFormView;



