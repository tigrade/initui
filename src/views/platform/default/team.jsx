import React,{DSBase,DSTable,DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal,message,Row, Col,Space,Button} from 'antd';


class TeamView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.tableRef = React.createRef();
        this.state = {dialog:false,searchCondition:props.searchCondition};
    }
    static defaultProps = {
        searchCondition:{},
        formData:{id:"",name:"",linkman:""},
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "切换或创建团队";
            return state;
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        });
    }
    onSaveOrUpdate= async (e)=>{
        const {name,linkman} = e;
        const params = new FormData();
        const _content = {name:name,linkman:linkman};
        params.append('content', JSON.stringify(_content));
        const response = await post('/api/team/save',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {formData} = this.props;
            message.success(response.message);
            this.formRef.current.setFieldsValue(formData);
            this.onReload();
        }
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    onEnter=(item)=>{
        this.props.navigate(DSBase.list.P_DefaultView.path, { replace: true,state:{teamView:{id:item.id,name:item.name}}});
        this.props.navigate(0)
    }
    render(){
        const {dialog,dialogTitle,searchCondition} = this.state;
        const {formData} = this.props;
        const columns=[
        {title: '名称',dataIndex: 'name'},
        {title: '所有者',dataIndex: 'owner',width: 100},
        {title: '操作',width:120,render:(value,item,index)=>{
            return (
            <Space>
                <Button type="primary"  onClick={this.onEnter.bind(this,item)}>进入</Button>
            </Space>
            );
        }}];
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={600}
                // bodyStyle={{overflowY:"auto",padding:0}}
                onCancel={this.onCannel}
                footer={null}>
                    <div className='team-modal'>
                        <div className='team-form'>
                        <Form layout="inline" ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder=""  autoComplete="off"/>
                            </Form.Item>
                            <Row gutter={24}>
                                <Col span={11}>
                                <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                                    <Input placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                </Col>
                                <Col span={9}>
                                <Form.Item name="code" label="联络人">
                                    <Input placeholder=""  autoComplete="off"/>
                                </Form.Item>
                                </Col>
                                <Col span={3}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="middle">新增</Button>
                                </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        </div>
                        <div className='team-table'>
                        <DSTable columns={columns} searchCondition={searchCondition} path={'/api/team/list'} ref={this.tableRef} pageable={false} other={{style:{minHeight:"500px"},pagination:true}}></DSTable>
                        </div>
                    </div>
            </Modal>
        </Fragment>
        );
    }
}
export default TeamView;