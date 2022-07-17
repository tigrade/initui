import React, { Component } from 'react';

import 'antd/dist/antd.less';
import { Layout,Menu,Row, Col} from 'antd';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import './index.less'
import {Outlet} from 'react-router-dom';
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