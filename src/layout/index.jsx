import React, { Component } from 'react';

import 'antd/dist/antd.less';
import { Layout,Menu,Row, Col} from 'antd';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button,Divider } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import './index.less'
import {Link,Outlet,Navigate,Location } from 'react-router-dom';
const { Header, Footer, Content } = Layout;


class DSLayout extends Component { 
    render() {
        const items = this.props.items;
        const pageNo = this.props.pageNo;
        return (
            <Layout>
                <Header className='ds-theme-header'>
                <Row>
                    <Col flex="auto">
                        <Row>
                            <Col flex="120px">
                                <div className="logo" />
                            </Col>
                            <Col flex="auto">
                                <Menu className='ds-theme-nav' mode="horizontal" defaultSelectedKeys={[`${pageNo}`]} items={items}></Menu>
                            </Col>
                        </Row>
                    </Col>
                    <Col flex="130px">
                        <Row>
                            <Col flex="50px">
                                <Avatar size="large" icon={<UserOutlined />} gap="8"/>
                            </Col>
                            <Col flex="auto">
                                <Button type="primary" icon={<LoginOutlined />} >退出</Button>
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
                <Footer plain='true'>Footer</Footer>
            </Layout>
        );
    }
}
export default DSLayout;