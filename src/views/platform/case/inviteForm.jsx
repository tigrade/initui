import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,Modal ,message,Select, Button} from 'antd';

class InviteFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,len:0,copyName:"点我复制链接",formData:props.formData};
    }
    static defaultProps = {
        formData:{teamMemberRole:"TEAM_VIEW",lawCaseMemberRole:"CUSTOMER"},
        lawCase:{teamId:'',teamName:'',id:''},
    }
    onEditor=()=>{
        const {id,teamId,teamName} = this.props.lawCase;
        this.setState(state=>{
            state.dialog = true;
            state.copyName = "点我复制链接";
            state.projectList= [{lawCaseId:id}];
            state.teamId = teamId
            state.teamName = teamName;
            return state;
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
        const {teamMemberRole,lawCaseMemberRole} = e;
        const {projectList,teamId,teamName} = this.state;
        const path = "/api/invite/save";
        let content = {teamId:teamId,type:'URL',teamMemberRoleCode:teamMemberRole,lawCaseMemberRole:lawCaseMemberRole,projectList:projectList};
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post(path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            const text = `邀请加入团队【${teamName}】，打开链接地址:http://www.fishlawer.com/content/invite?code=${response.results}`;
            navigator.clipboard.writeText(text).then(()=>{
                this.setState(state=>{
                    state.copyName = "复制成功"
                    return state;
                },()=>{
                    const that = this;
                    const {formData} = this.props;
                    this.formRef.current.setFieldsValue(formData);
                    setTimeout(function(){
                        that.setState(state=>{
                            state.copyName = "复制链接"
                            return state;
                        })
                    }, 10000);
                })
            });
        }
    }
    render(){
        const {dialog,formData,copyName} = this.state;
        const {teamRole} = this.props;
        return (
        <Fragment>
            <Modal
                title={"邀请用户"}
                visible={dialog}
                width={630}
                bodyStyle={{overflowY:"auto",padding:0}}
                onCancel={this.onCannel}
                footer={null}>
                {dialog===true&&
                <Form layout="vertical" ref={this.formRef} onFinish={this.onSaveOrUpdate} initialValues={formData}>
                    <div style={{position:"relative",padding:"24px 24px",borderTop:"1px solid #f0f0f0"}}>
                        <Input.Group compact>
                            <Form.Item name="teamMemberRole" noStyle>
                            <Select style={{ width: '180px' }} >
                                <Select.Option value="TEAM_VIEW">加入团队后,仅查看</Select.Option>
                                {(teamRole==="TEAM_OWNER"||teamRole==="TEAM_ADMIN"||teamRole==="TEAM_EDIT")&&
                                <Select.Option value="TEAM_EDIT">加入团队后,可编辑</Select.Option>
                                }
                                {(teamRole==="TEAM_OWNER"||teamRole==="TEAM_ADMIN")&&
                                <Select.Option value="TEAM_ADMIN">加入团队后,可管理</Select.Option>
                                }
                            </Select>
                            </Form.Item>
                            <Form.Item name="lawCaseMemberRole" noStyle>
                            <Select style={{ width: '280px' }}>
                                {(teamRole==="TEAM_OWNER"||teamRole==="TEAM_ADMIN"||teamRole==="TEAM_EDIT")&&
                                <Select.Option value="SOURCE">加入案件后,为案源人员</Select.Option>
                                }
                                {(teamRole==="TEAM_OWNER"||teamRole==="TEAM_ADMIN"||teamRole==="TEAM_EDIT")&&
                                <Select.Option value="INNER_HANDLER">加入案件后,为内部办案人员</Select.Option>
                                }
                                {(teamRole==="TEAM_OWNER"||teamRole==="TEAM_ADMIN"||teamRole==="TEAM_EDIT")&&
                                <Select.Option value="OUTER_HANDLER">加入案件后,为外部办案人员</Select.Option>
                                }
                                <Select.Option value="CUSTOMER">加入案件后,为客户人员</Select.Option>
                            </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary"  htmlType="submit" >{copyName}</Button>
                            </Form.Item>
                            
                        </Input.Group>
                    </div>
                </Form>
                }
            </Modal>
        </Fragment>
        );
    }
}
export default InviteFormView;