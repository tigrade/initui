import React,{DSBase,DSComponent,DSNavigate,get,Fragment} from 'comp/index';
import {Outlet} from 'react-router-dom';

import { Layout,Menu,Row, Col,Avatar,Button,Badge,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,MailOutlined,SettingOutlined } from '@ant-design/icons';
import {message} from 'antd';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;

class PlatformLayoutView extends DSComponent{   
    componentDidMount=()=>{
    }
    onSearch=()=>{
        window.open(DSBase.list.P_CaseSearchView.path, '_blank');
    }
    render(){
        const {teamView,menusSource,alias} = this.props;
        // const selectedKeys = [`${this.state.pageNo}`];
        const userItems = (<Menu items={[{
            key: 'a11',
            label:<DSNavigate url={DSBase.list._LoginView.path} element={<Button type="link" icon={<SettingOutlined />} >账号设置</Button>}/>
          }, {
            type: 'divider',
          },{
            key: 'a1w',
            label:<DSNavigate url={DSBase.logout.path} element={<Button type="link" icon={<LoginOutlined />} >退出</Button>}/>
          }]}/>);
        return (
        <Fragment>
            <Layout>
                <Header className='ds-theme-header'>
                <Row>
                    <Col flex="auto">
                        <Row wrap={false}>
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
                                {/* <Menu 
                                    selectedKeys={selectedKeys} 
                                    onClick={this.handleClick}
                                    className='ds-theme-nav' mode="horizontal" 
                                    defaultSelectedKeys={[`${this.state.pageNo}`]} 
                                    items={platformMenus}></Menu> */}
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
                                            {alias?alias.charAt(0).toUpperCase():"U"}
                                        </Avatar>
                                    </a>
                                </Dropdown>
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