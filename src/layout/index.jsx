import React, { Component } from 'react';
import {Outlet} from 'react-router-dom';

import 'antd/dist/antd.less';
import { Layout,Menu,Row, Col,Avatar,Button} from 'antd';
import { UserOutlined,LoginOutlined } from '@ant-design/icons';

import './index.less'
import DSNavigate from 'comp/nav/index'

const { Header, Footer, Content } = Layout;

class DSLayout extends Component { 
    constructor(props){
        super(props);
        this.state = {pageNo:props.pageNo};
    }
    componentWillReceiveProps=(nextProps,nextContext)=>{
        if(nextProps.pageNo !== this.state.pageNo) {
            // this.props.pageNo = nextProps.pageNo;
            this.setState(state=>{
                state.pageNo = nextProps.pageNo;
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

    render() {
        const items = this.props.items;
        const selectedKeys = [`${this.state.pageNo}`];
        return (
            <Layout>
                <Header className='ds-theme-header'>
                <Row>
                    <Col flex="auto">
                        <Row>
                            <Col flex="0px">
                                <div className="logo" />
                            </Col>
                            <Col flex="auto">
                                <Menu 
                                    selectedKeys={selectedKeys} 
                                    onClick={this.handleClick}
                                    className='ds-theme-nav' mode="horizontal" 
                                    defaultSelectedKeys={[`${this.state.pageNo}`]} 
                                    items={items}></Menu>
                            </Col>
                        </Row>
                    </Col>
                    <Col flex="150px">
                        <Row align='middle'>
                            <Col flex="50px">
                                <Avatar icon={<UserOutlined />} gap="8"/>
                            </Col>
                            <Col flex="auto">
                                <DSNavigate url="/login" element={<Button type="primary" icon={<LoginOutlined />} >退出</Button>}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </Header>
                <Content className='ds-theme-content'>
                    <div className='main-wrapper'>
                        <Outlet/>
                    </div>
                </Content>
                <Footer plain='true'>
                    <div className={'banner'}>Copyright © 2018至今 鱼律（厦门）网络科技有限公司 All rights reserved.
                        <a href="//beian.miit.gov.cn" target="_blank">闽ICP备18004543号-1</a>
                    </div>
                </Footer>
            </Layout>
        );
    }
}
export default DSLayout;