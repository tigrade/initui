import React,{DSBase,DSComponent,DSNavigate,get,Fragment} from 'comp/index';
import {Outlet} from 'react-router-dom';

import { Layout,Menu,Row, Col,Avatar,Button,Badge,Dropdown, Input,Select,Tag,Space,Card} from 'antd';
import { LoginOutlined,MailOutlined,SettingOutlined } from '@ant-design/icons';
import {message} from 'antd';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;

class SearchView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {data:""}
    }
    static defaultProps = {
    }
    componentDidMount=()=>{
        const url = window.location.href;
        const path = url.replace(window.location.search,'');
        const params = new URLSearchParams(window.location.search);
        const data = params.get('data');
        this.setState(state=>{
            state.data = data;
            return state;
        },()=>{
            window.history.pushState('','',path);
        });
    }
    onSearch=(e)=>{
        this.setState(state=>{
            state.data = e;
            return state;
        });
    }
    render(){
        const {teamView,menusSource,alias} = this.props;
        const {data} = this.state;
        if(data==="")return;
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
                        <Row>
                            <Col flex="150px">
                                
                            </Col>
                            <Col flex="500px">
                                <div style={{padding:"12px 0px"}}>
                                <Input.Group compact>
                                    <Select defaultValue="case" size="large">
                                        <Select.Option value="case">案件</Select.Option>
                                    </Select>
                                    <Input.Search style={{ width: '400px' }} defaultValue = {data} placeholder="输入查找案件关键字" size="large" onSearch={this.onSearch} enterButton allowClear/>
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
                {/* <div className='ds-theme-content' > */}
                <Layout>
                    {/* <Sider width={200} className="site-layout-background" trigger={null} collapsible={true} collapsed={false}>
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
                    </Sider> */}
                    <Layout style={{padding:0,overflow: "auto"}}>
                        <Content style={{"padding": "12px 0px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper'>
                            <Card>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Row>
                                    <Col flex="100px">案件类型</Col>
                                    <Col flex="auto">:
                                        <Tag.CheckableTag color="default" >全部</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >诉讼</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default"  checked={true}>仲裁</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >顾问</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >非诉</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >其他</Tag.CheckableTag>
                                    </Col>
                                </Row>

                                <Row wrap={false}>
                                    <Col flex="100px">客户名称</Col>
                                    <Col flex="auto">:
                                        <Tag.CheckableTag color="default" >全部</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >幸福地产</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default"  checked={true}>世贸国际</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >恒大地产</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >中国移动</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >中国电信</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >厦门国贸</Tag.CheckableTag>
                                    
                                    </Col>
                                </Row>

                                <Row wrap={false}>
                                    <Col flex="100px">进度</Col>
                                    <Col flex="auto">:
                                        <Tag.CheckableTag color="default" >全部</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >开盘前</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default"  checked={true}>收集证据</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >结案</Tag.CheckableTag>
                                    </Col>
                                </Row>

                                <Row wrap={false}>
                                    <Col flex="100px">状态</Col>
                                    <Col flex="auto">:
                                        <Tag.CheckableTag color="default" >全部</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default" >进行中</Tag.CheckableTag>
                                        <Tag.CheckableTag color="default"  checked={true}>已完结</Tag.CheckableTag>
                                    </Col>
                                </Row>

                            </Space>
                            </Card>
                        </Content>
                    </Layout>
                </Layout>
                {/* </div> */}
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
export default SearchView;