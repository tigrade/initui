import React,{DSBase,DSComponent,DSNavigate,get,Fragment} from 'comp/index';
import {Outlet,Link} from 'react-router-dom';

import { Layout,Menu,Row, Col,Avatar,Button,Badge,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,MailOutlined,SettingOutlined } from '@ant-design/icons';
import {message} from 'antd';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;

class AdminLayoutView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {menusSource:[]}
    }
    static defaultProps = {
    }
    componentDidMount=()=>{
        this.onLoadMenu();
    }
    onLoadMenu = async ()=>{
        let menuSource = await get('/api/user/menu').catch(error => { 
            message.error(error.message+"d");
        });
        let managerMenus;
        if(menuSource){
            const {manager,platform} = menuSource.results;
            if(manager){
                managerMenus = this.renderMenus(manager);
            }
        }
        this.setState(state=>{
            const db = [];
            this._menuSource(managerMenus,db);
            state.menusSource = db;
            return state;
        });
    }
    onSearch=()=>{
        window.open(DSBase.list.P_CaseSearchView.path, '_blank');
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
    render(){
        const {alias} = this.props;
        const {menusSource} = this.state;
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
                        <Row>
                            <Col flex="150px">
                                <div className="logo" ></div>
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
                    <Layout style={{padding:0,overflow: "auto"}}>
                        <Content style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper'>
                            <Outlet/>
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
export default AdminLayoutView;