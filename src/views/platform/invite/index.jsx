import React,{DSComponent,Fragment} from 'comp/index';

import './index.less'
import { List,Row, Col,Button,Switch } from 'antd';


class InviteView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {teamView:undefined};
    }
    static defaultProps = {
    }
    componentDidMount=()=>{
        const _teamView = sessionStorage.getItem("teamView");
        const _teamView_ = JSON.parse(_teamView);
        this.setState(state=>{
            state.teamView = _teamView_;
            return state;
        });
    }
    render(){
        const {teamView} = this.state;
        if(!teamView)return;
        const data = [
            {title: '连接邀请',desc: '点击邀请按钮生成并拷贝发送给邀请人',action:[<Button type="primary" shape="round">邀请</Button>]},
            {title: '邮箱邀请',desc: '点击邀请按钮输入邀请人邮箱即可把邀请连接发送到邀请人邮箱账号',action:[<Button type="primary" shape="round">邀请</Button>]},
          ];
        return (
        <Fragment>
            <div className='fl-team-setting'>
                <div className='fl-team-setting-title'>
                <Row wrap={false}>
                    <Col flex="auto">人员邀请</Col>
                </Row>
                </div>
                <div className='fl-team-setting-wrap'>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                    <List.Item actions={item.action}>
                        <List.Item.Meta title={item.title} description={item.desc} />
                    </List.Item>
                    )}
                />
                </div>
            </div>
           
        </Fragment>
        );
    }
}
export default InviteView;