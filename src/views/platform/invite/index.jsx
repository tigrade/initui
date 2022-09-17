import React,{DSBase,DSComponent,Fragment,post} from 'comp/index';

import './index.less'
import { List,Row, Col,Button,Switch ,Avatar, Input,Form,message} from 'antd';


class InviteView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {teamView:undefined,inviteToken:undefined};
    }
    static defaultProps = {
    }
    componentDidMount=async()=>{
        const params = new URLSearchParams(window.location.search);
        const inviteToken = params.get('code');
        const _params = new FormData();
        _params.append('code', inviteToken);
        const response = await post('/api/invite/token',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                if(results){
                    const {teamName,memberAlias} = results;
                    state.teamName = teamName;
                    state.memberAlias = memberAlias;
                }
                state.inviteToken = inviteToken;
                return state;
            });
            
        }
    }
    onRegeditJoin=()=>{
        const {inviteToken} = this.state;
        this.props.navigate(DSBase.list._LoginView.path+'?type=Regedit&inviteToken='+inviteToken);
    }
    onLoginJoin=()=>{
        const {inviteToken} = this.state;
        this.props.navigate(DSBase.list._LoginView.path+'?type=Login&inviteToken='+inviteToken);
    }
    onJoinTeam=async(e)=>{
        const {content} = e;
        const {inviteToken} = this.state;
        const params = new FormData();
        params.append('code', inviteToken);
        params.append('content', content===undefined?"":content);
        const response = await post('/api/invite/join',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            window.location.href = DSBase.root.path;
        }
    }
    render(){
        const {teamName,memberAlias} = this.state;
        console.log(localStorage.getItem('isLogin'));
        const isLogin = (localStorage.getItem('isLogin')===null||localStorage.getItem('isLogin')!=="true")?false:true;
        return (
        <Fragment>
            <div className='fl-invite-bg'>
                <div></div>
                <div className='fl-invite-body'>
                    <div className='fl-invite-body-banner'>
                    {/* <Avatar gap="8" style={{backgroundColor: '#87d068' }}>TI</Avatar> */}
                        {/* <img src={invImg}/> */}
                        <div className='fl-invite-body-header'>
                            <div className='create'>{memberAlias}</div>
                            <div className='title'>邀请您加入#{teamName}#</div>
                        </div>
                    </div>
                    
                    {isLogin===false&&
                    <div className='fl-invite-body-fotter'>
                        <div className='regedit-join'>
                            <Button type="primary" style={{width:"100%"}} size="large" onClick={this.onRegeditJoin}>注册并加入团队</Button>
                        </div>
                        <div className='login-join'>
                            <Button type="link" style={{width:"100%"}} size="large" onClick={this.onLoginJoin}>已有账号? 登录加入团队</Button>
                        </div>
                    </div>
                    }
                    {isLogin===true&&
                    <div className='fl-invite-body-fotter'>
                        <Form id="_form" layout="vertical"  ref={this.formRef}  onFinish={this.onJoinTeam}>
                            <Form.Item name="content" label="加入原因">
                                <Input.TextArea rows={4} placeholder="你可以填写加入原因，帮助管理员快速通过你的申请。如：我是主办律师Jeck，负责诉讼案件，申请加入团队" maxLength={6} autoSize={{ minRows: 2, maxRows: 6 }}/>
                            </Form.Item>
                            <Form.Item noStyle className='execute-join'>
                                <Button type="primary" htmlType="submit"  style={{width:"100%"}} size="large">申请加入团队</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    }
                </div>
            </div>
        </Fragment>
        );
    }
}
export default InviteView;