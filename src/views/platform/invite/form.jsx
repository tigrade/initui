import React,{DSComponent,Fragment,post,DSList} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Tabs ,message, Card, Empty, Select, Button,Row,Col} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

class InviteFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",level:"11"},
        teamView:{},
        reloadTable:()=>{}
    }
    onEditor=(item)=>{
        const type = item===undefined?"1":"2";
        this.setState(state=>{
            state.dialog = true;
            return state;
        },()=>{
           
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            state.formData = null;
            return state;
        });
    }
    onSaveOrUpdate=async(e)=>{
        const {id,name,code,level} = e;
        const {formStatus} = this.state;
        let path = "/api/role/save";
        let content = {};
        if(formStatus===this.props.formType.add.code){
            content = {name:name,code:code,level:level};
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/role/modify";
            content = {id:id,name:name,code:code,level:level};
        }
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post(path,params).catch(error => {
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
            this.props.reloadTable();
        });
    }
    render(){
        const {dialog,formData,dialogTitle} = this.state;
        const {teamView} = this.props;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                style={{ pointerEvents: "auto"}}
                modalRender={()=>{
                    return (
                    <Card bodyStyle={{padding:"0px 0px 24px"}} className={"fl-invite-form"}>
                    <Tabs defaultActiveKey="1" tabBarExtraContent={<CloseOutlined onClick={this.onCannel} style={{marginRight:"24px"}}/>} tabBarGutter={40}>
                        <Tabs.TabPane tab="连接邀请" key="1">
                        <div>
                            <div style={{position:"relative",padding:"12px 24px",height:"50px"}}>
                            <Row wrap={false} style={{width:"100%"}}>
                                <Col flex={"auto"}><span>选择参与的案件</span></Col>
                                <Col flex={"90px"} style={{textAlign:"right"}}>已选0</Col>
                            </Row>
                            </div>
                            <DSList condition={{teamId:teamView.id}} title={"title"} path="/api/lawCase/list"/>
                            <div style={{position:"relative",padding:"12px 24px",height:"50px"}}>
                                <Input.Group compact>
                                    <Select style={{ width: '380px' }} defaultValue="查看者">
                                        <Select.Option value="查看者">加入团队后,仅查看</Select.Option>
                                        <Select.Option value="编辑者">加入团队后,可编辑</Select.Option>
                                        <Select.Option value="管理员">加入团队后,可管理</Select.Option>
                                    </Select>
                                    <Button type="primary" shape="round">复制链接</Button>
                                </Input.Group>
                            </div>
                        </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="邮箱邀请" key="2">
                        <Empty/>
                        </Tabs.TabPane>
                    </Tabs>

                    </Card>
                    )
                }}
                >
            </Modal>
        </Fragment>
        );
    }
}
export default InviteFormView;