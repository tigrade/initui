import React,{DSComponent,Fragment,post,DSList} from 'comp/index';
import './index.less'

import { Form,Input,Modal,Tabs ,message, Card, Empty, Select, Button,Row,Col} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

class InviteFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,len:0,copyName:"复制链接"};
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
    onSelectCase=(item,keys)=>{
        this.setState(state=>{
            state.len = keys.length;
            return state;
        },()=>{
        });
    }
    onCopy=()=>{
        const text = "邀请地址：xxxxxx";
        navigator.clipboard.writeText(text).then(()=>{
            this.setState(state=>{
                state.copyName = "复制成功"
                return state;
            },()=>{
                const that = this;
                setTimeout(function(){
                    that.setState(state=>{
                        state.copyName = "复制链接"
                        return state;
                    })
                }, 2000);
            })
        });
        
    }
    render(){
        const {dialog,formData,dialogTitle,len,copyName} = this.state;
        const {teamView} = this.props;
        //Modal  style={{ pointerEvents: "auto"}}
        return (
        <Fragment>
            <Modal
                title={"邀请用户"}
                visible={dialog}
                width={520}
                bodyStyle={{overflowY:"auto",padding:0}}
                onCancel={this.onCannel}
                footer={null}>
                <div>
                    <div style={{position:"relative",padding:"12px 24px"}}>
                    <Row wrap={false} style={{width:"100%"}}>
                        <Col flex={"auto"}><span>选择参与的案件</span></Col>
                        <Col flex={"90px"} style={{textAlign:"right"}}>已选{len}</Col>
                    </Row>
                    </div>
                    <DSList condition={{teamId:teamView.id,status:"processing"}} title={"title"} path="/api/lawCase/find" mode={"multiple"} onChange={this.onSelectCase}/>
                    <div style={{position:"relative",padding:"24px 24px",borderTop:"1px solid #f0f0f0"}}>
                        <Input.Group compact>
                            <Select style={{ width: '380px' }} defaultValue="查看者">
                                <Select.Option value="查看者">加入团队后,仅查看</Select.Option>
                                <Select.Option value="编辑者">加入团队后,可编辑</Select.Option>
                                <Select.Option value="管理员">加入团队后,可管理</Select.Option>
                            </Select>
                            <Button type="primary" shape="round" onClick={this.onCopy}>{copyName}</Button>
                        </Input.Group>
                    </div>
                </div>
            </Modal>
        </Fragment>
        );
    }
}
export default InviteFormView;