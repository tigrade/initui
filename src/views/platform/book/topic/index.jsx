import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,List,Collapse} from 'antd';
import BriefTreeView from 'views/platform/book/brief';
import { SettingOutlined,PlusSquareOutlined } from '@ant-design/icons';

class TopicFormView extends DSComponent{   
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
            state.dialogTitle = "新增专题";
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
            _path = "/api/topic/modify"
            content = Object.assign(content,{id:id});
        }else{
            _path = "/api/topic/save"
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
    
    render(){
        const {dialog,dialogTitle,formData,formType} = this.state;
        const genExtra = () => (
            <PlusSquareOutlined 
              onClick={(event) => {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
              }}
            />
          );
          const data = [
            {
              title: '相关法律1',desc:'内容01'
            },
            {
                title: '相关法律2',desc:'内容02'
            },
            {
                title: '相关法律3',desc:'内容03'
            }
          ];
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={1200}
                bodyStyle={{overflowY:"auto",padding:0,maxHeight:800}}
                onCancel={this.onCannel}
                footer={null}>
                    <div className='menu-modal'>
                    <Row>
                        <Col flex="250px">
                            <div style={{overflowY:"auto",maxHeight:800}}>
                            <BriefTreeView onSelect={this.onSelectNode} ref={this.menuTreeRef}></BriefTreeView>
                            </div>
                        </Col>
                        <Col flex="auto">
                            <Form layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                                <Form.Item name="id" label="编号" noStyle hidden={true}>
                                    <Input placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                <Form.Item name="name" label="标题" rules={[{ required: true, message: '名称不能为空' }]}>
                                    <Input placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                <Form.Item name="briefName" label="案由" rules={[{ required: true, message: '案由不能为空' }]}>
                                    <Input placeholder=""  autoComplete="off" disabled={true}/>
                                </Form.Item>
                                <Form.Item name="a" label="概述" rules={[{ required: true, message: '概述不能为空' }]}>
                                    <Input.TextArea placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                <Collapse
                                    defaultActiveKey={['1']}
                                    // onChange={onChange}
                                    // expandIconPosition={expandIconPosition}
                                >
                                    <Collapse.Panel header="法律规定" key="1" extra={genExtra()}>
                                    <div>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                            title={item.title}
                                            description={item.desc}
                                            />
                                        </List.Item>
                                        )}
                                    />
                                    </div>
                                    </Collapse.Panel>
                                    <Collapse.Panel header="相关判例" key="2" extra={genExtra()}>
                                    <div></div>
                                    </Collapse.Panel>
                                    <Collapse.Panel header="权威论述" key="3" extra={genExtra()}>
                                    <div></div>
                                    </Collapse.Panel>
                                    <Collapse.Panel header="其他" key="4" extra={genExtra()}>
                                    <div></div>
                                    </Collapse.Panel>
                                </Collapse>
                                {/* <Form.Item name="b" label="相关法律规定">
                                    <Input.TextArea placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                <Form.Item name="c" label="判例">
                                    <Input.TextArea placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                <Form.Item name="d" label="权威论述">
                                    <Input.TextArea placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                <Form.Item name="e" label="其他">
                                    <Input.TextArea placeholder=""  autoComplete="off"/>
                                </Form.Item> */}
                                {/* <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large">{formType===1&&"新增"}{formType===2&&"更新"}</Button>
                                </Form.Item> */}
                            </Form>
                        </Col>
                    </Row>
                    </div>
                
            </Modal>
        </Fragment>
        );
    }
}
export default TopicFormView;



