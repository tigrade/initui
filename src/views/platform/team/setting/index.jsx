import React,{DSComponent,Fragment} from 'comp/index';

import './index.less'
import { List,Row, Col,Button,Switch } from 'antd';


class TeamSettingView extends DSComponent{   
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
            {title: '团队名称',desc: teamView.name,action:[<Button type="primary" shape="round">编辑</Button>]},
            {title: '加入团队需要管理员审核',desc: '',action:[<Switch/>]},
            {title: '移交团队', desc: '每个团队只有一位所有者，移交后你将变为管理员员哦',action:[<Button type="primary" shape="round">移交</Button>]},
            {title: '解散团队',desc: '解散团队后，所有内容都会被立即删除，不可恢复哦',action:[<Button type="primary" shape="round">解散</Button>]},
          ];
        return (
        <Fragment>
            <div className='fl-team-setting'>
                <div className='fl-team-setting-title'>
                <Row wrap={false}>
                    <Col flex="auto">团队设置</Col>
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
export default TeamSettingView;