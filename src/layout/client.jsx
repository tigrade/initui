import React,{DSBase,DSComponent,DSNavigate,Fragment,post} from 'comp/index';
import {Outlet,Link} from 'react-router-dom';

import { Layout,Menu,Row, Col,Avatar,Button,Tooltip,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,UsergroupAddOutlined,SettingOutlined,BlockOutlined } from '@ant-design/icons';
import {message} from 'antd';

import './index.less';
import InviteFormView from 'views/setting/invite/index';
import TeamView from 'views/setting/team/index';
import logoGif from 'assets/imgs/logo.gif';
import UserSettingView from 'views/setting/user/index';

const { Header, Footer, Content, Sider } = Layout;

class PlatformLayoutView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.teamRef = React.createRef();
        this.searchRef = React.createRef();
        this.userSettingRef = React.createRef();
        this.state = {searchData:"",menusSource:[]}
    }
    static defaultProps = {
    }
    componentDidMount=()=>{
        document.addEventListener('visibilitychange', this.handleVisibilitychange);
        this.onLoadMenu();
    }
    onLoadMenu = async ()=>{
        const {teamView} = this.props;
        const params = new FormData();
        params.append('teamId', teamView.id);
        const response = await post('/api/client/menu',params).catch(error => {
            message.error(error.message);
        });
        const teamRoleResponse = await post('/api/client/teamRole',params).catch(error => {
            message.error(error.message);
        });
        let teamRole;
        if(teamRoleResponse){
            const {results} = teamRoleResponse;
            teamRole = results;
        }
        if(response){
            const {results} = response;
            const data = results===null?[]:results;
            const menusList= this.renderMenus(data);
            this.setState(state=>{
                const db = [];
                this._menuSource(menusList,db);
                state.menusSource = db;
                state.teamRole = teamRole;
                return state;
            });
        }
    }
    handleVisibilitychange=()=>{
        if(document.hidden!==true){
            this.clearSearch = setInterval(() => {
                if(this.searchRef!==null&&this.searchRef.current!==null&&this.searchRef.current.input){
                    this.searchRef.current.input.value="";
                    clearInterval(this.clearSearch);
                }
            },10);
        }
    }
    onChangeCase=()=>{
        this.teamRef.current.onEditor()
    }
    onEditor=()=>{
        this.formRef.current.onEditor()
    }
    onSearch=(e)=>{
        const path = DSBase.list.P_CaseSearchView.path;
        window.open(`${path}?data=${e}`, '_blank');
    }
    renderMenus=(source)=>{
        return source.map(l=>{
            if(l.isLeaf===true){
                const children = this.renderMenus(l.subMenu);
                return {key:l.code,label:l.name,children:children};
            }
            return {key:l.code,label:(<Link to={l.path}><span>{l.name}</span></Link>)};
        });
    }
    _menuSource=(source,db)=>{
        for(let s in source){
            if(source[s].isLeaf===true){
                this._menuSource(source[s].subMenu,db);
            }else{
                db.push(source[s]);
            }
        }
    }
    onUserSetting=()=>{
        this.userSettingRef.current.onEditor();
    }
    onQuite=()=>{
        localStorage.removeItem('isLogin');
        localStorage.removeItem('token');
        this.props.navigate('/api/sign_up',{replace: true});
    }
    render(){
        const {teamView,alias} = this.props;
        const {menusSource,teamRole} = this.state;
        if(teamRole===undefined)return;
        return (
        <Fragment>
            <InviteFormView teamView={teamView} ref={this.formRef} teamRole={teamRole}/>
            <TeamView ref={this.teamRef} {...{navigate:this.props.navigate}}/>
            <UserSettingView  ref={this.userSettingRef}/>
            <Layout>
                <Header className='ds-theme-header'>
                <Row wrap={false}>
                    <Col flex="auto">
                        <Row wrap={false} >
                            <Col flex="220px" >
                                <Row wrap={false} gutter={16} align="middle" justify="start">
                                    <Col><img alt='logo' src={logoGif} style={{width:"50px",margin:0,paddingBottom:"12px"}}/></Col>
                                    <Col><div >{teamView.name}</div></Col>
                                </Row>
                                {/* <div className="logo" ></div> */}
                            </Col>
                            <Col flex="auto">
                                <div style={{padding:"12px 0px"}}>
                                <Input.Group compact>
                                    <Select defaultValue="case" size="large">
                                        <Select.Option value="case">案件</Select.Option>
                                    </Select>
                                    <Input.Search style={{ width: '400px' }} ref={this.searchRef} placeholder="输入查找案件关键字" size="large" onSearch={this.onSearch} enterButton/>
                                </Input.Group>
                                </div>
                            </Col>
                            {/* <Col flex="auto">
                                <Menu 
                                    selectedKeys={selectedKeys} 
                                    onClick={this.handleClick}
                                    className='ds-theme-nav' mode="horizontal" 
                                    defaultSelectedKeys={[`${this.state.pageNo}`]} 
                                    items={platformMenus}></Menu>
                            </Col> */}
                            
                        </Row>
                    </Col>
                    <Col flex="160px">
                        <Row wrap={false} gutter={8}>
                            <Col>
                                <Tooltip placement="bottom" title={"切换案件"} color="#1890ff">
                                    <Button shape="circle"  icon={<BlockOutlined />} onClick={this.onChangeCase}/>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Tooltip placement="bottom" title={"邀请用户"} color="#1890ff">
                                    <Button shape="circle"  icon={<UsergroupAddOutlined />} onClick={this.onEditor}/>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Tooltip placement="bottom" title={"账号设置"} color="#1890ff">
                                    <Button shape="circle"  icon={<SettingOutlined />} onClick={this.onUserSetting}/>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Tooltip placement="bottom" title={`退出系统`} color="#1890ff">
                                    <a onClick={this.onQuite}>
                                        <Avatar gap="8" style={{backgroundColor: '#1890ff' }}>
                                            {alias?alias.charAt(0).toUpperCase():"U"}
                                        </Avatar>
                                    </a>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </Header>
                <div className='ds-theme-content' >
                <Layout>
                    <Sider width={200} className="site-layout-background" trigger={null} collapsible={true} collapsed={false}>
                        <div style={{padding:0,overflowY: "auto",position:"absolute",overflowX:"hidden",width: "100%",height: "100%"}}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['k5-1']}
                            defaultOpenKeys={['k5-1']}
                            style={{
                                height: '100%',
                                borderRight: 0,
                            }}
                            items={menusSource}
                            />
                        </div>
                    </Sider>
                    <Layout style={{padding:0,overflowX: "auto",overflowY: "none",scrollbarWidth: "thin"}}>
                        <Content style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper'>
                            <Outlet context = {{teamView:teamView}}/>
                        </Content>
                    </Layout>
                </Layout>
                </div>
                <Footer plain='true'>
                    <div className={'banner'}>Copyright © 2018至今 鱼律（厦门）网络科技有限公司 All rights reserved.
                        <a href="//beian.miit.gov.cn" target="_blank" rel="noreferrer">闽ICP备18004543号-1</a>
                    </div>
                </Footer>
            </Layout>
        </Fragment>
        );
    }
}
export default PlatformLayoutView;