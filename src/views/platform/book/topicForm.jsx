import React,{DSComponent,Fragment,post,DSTreeSelect} from 'comp/index';
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
        formData:{id:"",title:"",briefId:"",content:""},
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "新增专题";
            return state;
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
        this.props.reloadTable();
    }

    onSaveOrUpdate=async(e)=>{
        const {id,title,content,briefId} = e;
        let data = {title:title,briefId:briefId.id,content:content};
        const params = new FormData();
        params.append('content', JSON.stringify(data));
        const response = await post('/api/briefTopic/save',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            this.formRef.current.resetFields();
            message.success(response.message);
            this.onCannel();
            window.open(`/content/briefTopic/detail?id=${response.results.id}`, '_blank');
        }
    }
    
    render(){
        const {dialog,dialogTitle,formData} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={1200}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                // bodyStyle={{overflowY:"auto",padding:0,maxHeight:800}}
                onCancel={this.onCannel}
                okText="确认"
                cancelText="取消">
                    <div className='menu-modal'>
                    <Form id="_form"  layout="vertical" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                        <Form.Item name="id" label="编号" noStyle hidden={true}>
                            <Input placeholder=""  autoComplete="off"/>
                        </Form.Item>
                        <Form.Item name="briefId" label="案由" rules={[{ required: true, message: '案由不能为空' }]}>
                            <DSTreeSelect path='/api/brief/list' code={{title:'name',value:'id',isLeaf:'isLeaf',pId:"briefId"}}></DSTreeSelect>
                        </Form.Item>
                        <Form.Item name="title" label="标题" rules={[{ required: true, message: '标题不能为空' }]}>
                            <Input placeholder=""  autoComplete="off"/>
                        </Form.Item>
                        <Form.Item name="content" label="概述" rules={[{ required: true, message: '概述不能为空' }]}>
                            <Input.TextArea placeholder=""  autoComplete="off" autoSize={{minRows: 8}}/>
                        </Form.Item>
                    </Form>
                    </div>
                
            </Modal>
        </Fragment>
        );
    }
}
export default TopicFormView;



