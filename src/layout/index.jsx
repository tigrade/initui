import React,{DSBase,DSComponent,DSNavigate,get} from 'comp/index';
import {Outlet} from 'react-router-dom';

import { Layout,Menu,Row, Col,Avatar,Button,Badge,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,MailOutlined,SettingOutlined } from '@ant-design/icons';
import {message} from 'antd';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;

class DSLayout extends DSComponent { 
    constructor(props){
        super(props);
        this.state = {pageNo:props.pageNo,teamView:{}};
    }
    static getDerivedStateFromProps(props,state){
        if(props.pageNo !== state.pageNo) {
            return {pageNo:props.pageNo}
        }
        return null;
    }
    //初始化页面
    componentDidMount=async()=>{
        if(!sessionStorage.getItem('isTeam')){
            const teamSource = await get('/api/team/default').catch(error => {
                message.error(error.message);
            });
            if(teamSource){
                const {results} = teamSource;
                const {id,name} = results;
                const _teamView_ = JSON.stringify({id:id,name:name});
                sessionStorage.setItem('teamView', _teamView_);
                sessionStorage.setItem('isTeam', true);
            }
        }else{
            if(this.props.location.state){
                const {teamView} = this.props.location.state;//传递参数：teamView为特殊参数
                if(teamView){
                    const {id,name} = teamView;
                    const _teamView_ = JSON.stringify({id:id,name:name});
                    sessionStorage.setItem('teamView', _teamView_);
                    sessionStorage.setItem('isTeam', true);
                }
            }
        }
        
        if(sessionStorage.getItem("isTeam")==="true"){
            const _teamView = sessionStorage.getItem("teamView");
            const _teamView_ = JSON.parse(_teamView);
            this.setState(state=>{
                state.teamView = _teamView_;
                return state;
            });
        }
    }
    handleClick=(e)=>{
        this.setState((state)=>{
            state.pageNo = Number(e.key);
            return state;
        });
    }
    onSearch=()=>{
        window.open(DSBase.list.P_CaseSearchView.path, '_blank');
    }

    render() {
        const {teamView} = this.state;
        const selectedKeys = [`${this.state.pageNo}`];
        const userItems = (<Menu items={[{
            key: 'a11',
            label:<DSNavigate url={DSBase.list._LoginView.path} element={<Button type="link" icon={<SettingOutlined />} >账号设置</Button>}/>
          }, {
            type: 'divider',
          },{
            key: 'a1w',
            label:<DSNavigate url={DSBase.logout.path} element={<Button type="link" icon={<LoginOutlined />} >退出</Button>}/>
          }]}/>);
        const {authType,managerMenus,platformMenus} = this.props;
        return (
            <Layout>
                <Header className='ds-theme-header'>
                <Row>
                    <Col flex="auto">
                        <Row>
                            <Col flex="150px">
                                <div className="logo" >{teamView.name}</div>
                            </Col>
                            <Col flex="500px">
                                <div style={{padding:"12px 0px"}}>
                                <Input.Group compact>
                                    <Select defaultValue="case" size="large">
                                        <Select.Option value="case">案件</Select.Option>
                                    </Select>
                                    <Input.Search style={{ width: '400px' }} placeholder="输入查找案件关键字" size="large" onSearch={this.onSearch} enterButton/>
                                </Input.Group>
                                </div>
                            </Col>
                            <Col flex="auto">
                                <Menu 
                                    selectedKeys={selectedKeys} 
                                    onClick={this.handleClick}
                                    className='ds-theme-nav' mode="horizontal" 
                                    defaultSelectedKeys={[`${this.state.pageNo}`]} 
                                    items={platformMenus}></Menu>
                            </Col>
                            
                        </Row>
                    </Col>
                    <Col flex="120px">
                        <Row wrap={false}>
                            <Col ><Badge count={1}><Avatar icon={<MailOutlined />} gap="8"/></Badge></Col>
                            <Col push="2">
                                <Dropdown overlay={userItems} placement="bottom" overlayClassName='ds-user-menus'>
                                    <a onClick={e => e.preventDefault()}>
                                        <Avatar gap="8" style={{backgroundColor: '#87d068' }}>
                                            {this.state.alias?this.state.alias.charAt(0).toUpperCase():"U"}
                                        </Avatar>
                                    </a>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </Header>
                {authType==="client"&&
                <Content className='ds-theme-content'>
                    <div className='main-wrapper'>
                        <Outlet/>
                    </div>
                </Content>
                }
                {authType==="admin"&&
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
                            items={managerMenus}
                            />
                        </div>
                    </Sider>
                    <Layout style={{padding:0,overflow: "auto"}}>
                        <Content style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper'>
                            <Outlet context = {{teamView:teamView}}/>
                        </Content>
                    </Layout>
                </Layout>
                </div>
                }
                <Footer plain='true'>
                    <div className={'banner'}>Copyright © 2018至今 鱼律（厦门）网络科技有限公司 All rights reserved.
                        <a href="//beian.miit.gov.cn" target="_blank" rel="noreferrer">闽ICP备18004543号-1</a>
                    </div>
                </Footer>
            </Layout>
        );
    }
}
export default DSLayout;