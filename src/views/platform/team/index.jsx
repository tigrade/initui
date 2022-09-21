import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';

import { Row, Col,Button,Space,message,Breadcrumb } from 'antd';

import './index.less'
import TeamFormView from 'views/platform/team/form';
class TeamView extends DSComponent{   
    constructor(props){
        super(props);
        this.tableRef = React.createRef();
        this.formRef = React.createRef();
        const {teamView} = this.props.context;
        this.state = {searchCondition:{teamId:teamView.id}};
    }
    static defaultProps = {
        searchCondition:{}
    }
    componentDidMount=()=>{
        
    }
    onEditor=(item)=>{
        this.formRef.current.onEditor(item);
    }
    onReload=()=>{
        this.tableRef.current.reload();
    }
    onDelete=async(item)=>{
        const params = new FormData();
        params.append("id",item.id);
        const response = await post('/api/team/user/delete',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            this.onReload();
        }
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
                <Button type="link" onClick={this.onEditor.bind(this,item)}>设置</Button>
                {item.merchantRoleCode!=="TEAM_OWNER"&&
                <Button type="link" onClick={this.onDelete.bind(this,item)}>移除</Button>
                }
            </Space>
            );
        }}];
        return (
        <Fragment>
            <TeamFormView ref={this.formRef} reloadTable={this.onReload}/>
            <div className='fl-team'>
                <Breadcrumb>
                    <Breadcrumb.Item>团队管理</Breadcrumb.Item>
                    <Breadcrumb.Item>团队成员</Breadcrumb.Item>
                </Breadcrumb>
                <div className='fl-team-title'>
                <Row wrap={false}>
                    <Col flex="auto">成员列表</Col>
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