import React,{DSTable,DSComponent,Fragment} from 'comp/index';

import { List,Row, Col,Button,Space } from 'antd';

import './index.less'

class TeamView extends DSComponent{   
    constructor(props){
        super(props);
        this.tableRef = React.createRef();
        const {teamView} = this.props.context;
        this.state = {searchCondition:{teamId:teamView.id}};
    }
    static defaultProps = {
        searchCondition:{}
    }
    componentDidMount=()=>{
        
        // this.setState(state=>{

        //     return state;
        // })
        
    }
    render(){
        const {searchCondition} = this.state;
        const columns=[
        {title: '成员',dataIndex: 'userAlias'},
        {title: '备注',dataIndex: 'alias'},
        {title: '最后操作',dataIndex: 'modifyTime'},
        {title: '邀请人',dataIndex: 'inviteMerchantUserName'},
        {title: '权限',dataIndex: 'merchantRoleName'},
        {title: '操作',width:160,render:(value,item,index)=>{
            return (
            <Space>
                <Button type="link">编辑</Button>
            </Space>
            );
        }}];
        return (
        <Fragment>
            <div className='fl-team'>
                <div className='fl-team-title'>
                <Row wrap={false}>
                    <Col flex="auto">团队成员</Col>
                </Row>
                </div>
                <div className='fl-team-wrap'>
                    <DSTable columns={columns} searchCondition={searchCondition} path={'/api/team/user/list'} pageable={false} ref={this.tableRef}></DSTable>
                </div>
            </div>
        </Fragment>
        );
    }
}
export default TeamView;