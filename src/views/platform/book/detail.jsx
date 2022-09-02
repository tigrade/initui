import React,{DSBase,DSComponent,DSNavigate,post,Fragment} from 'comp/index';
import {Outlet} from 'react-router-dom';

import { Layout,Menu,Row, Col,Anchor,Button,BackTop,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,MailOutlined,SettingOutlined,UsergroupAddOutlined,CloseCircleOutlined,ShareAltOutlined } from '@ant-design/icons';
import {message} from 'antd';
import TopicBaseView from 'views/platform/book/topic/base/index';
import TopicCaseView from 'views/platform/book/topic/case/index';
import TopicExplainView from 'views/platform/book/topic/explain/index';
import TopicRuleView from 'views/platform/book/topic/rule/index';
import TopicOtherView from 'views/platform/book/topic/other/index';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;


class P_BriefTopicView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false};
    }
    static defaultProps = {
        formData:{id:"",name:"",code:"",level:"11"},
        reloadTable:()=>{}
    }
    componentDidMount=async()=>{
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const _params = new FormData();
        _params.append('id', id);
        const response = await post('/api/briefTopic/find/one',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.briefTopic = results;
                return state;
            });
        }
    }
    render(){
        const {briefTopic} = this.state;
        if(briefTopic===undefined){
            return ;
        }
        const briefTopicMenus = [
            {name:"基本信息",code:"BASE_INFO"},
            {name:"法律法规",code:"CASE_ITEM"},
            {name:"相关判例",code:"CASE_PROCESS"},
            {name:"权威论述",code:"CASE_MEMBER"},
            {name:"其他",code:"CASE_FILES"},
        ]
        // const menusSource = briefTopicMenus.map(l=>{
        //     return {key:l.code,label:l.name};
        // });

        return (
        <Fragment>
            <Layout id='kkks'>
                <Header className='ds-theme-header'>
                <Row>
                    <Col flex="auto">
                        <Row>
                            <Col flex="auto">{briefTopic.title}</Col>
                        </Row>
                    </Col>
                    <Col flex="120px">
                        <Row wrap={false}>
                            <Col ><Button type="link" icon={<ShareAltOutlined />}>分享</Button></Col>
                            <Col push="2"></Col>
                        </Row>
                    </Col>
                </Row>
                </Header>
                <Layout>
                    <Layout style={{padding:0,overflow: "auto"}}>
                        <Content style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper' id='backTop'>
                            <TopicBaseView briefTopic={briefTopic}/>
                            <TopicRuleView briefTopic={briefTopic}/>
                            <TopicCaseView briefTopic={briefTopic}/>
                            <TopicExplainView briefTopic={briefTopic}/>
                            <TopicOtherView briefTopic={briefTopic}/>
                            
                            
                            
                            {/* <CaseBaseView briefTopic={briefTopic}/>
                            <CaseItemView briefTopic={briefTopic}/>
                            <CaseProcessView briefTopic={briefTopic}/>
                            <CaseResourceView briefTopic={briefTopic}/>
                            <CaseMemberView briefTopic={briefTopic}/> */}
                        </Content>
                    </Layout>

                    <Sider width={200} style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} id="ssds">
                        <div style={{padding:"12px 36px",background:"#ffffff",position:"fixed",top:"75px"}}>
                        <Anchor getContainer={() => document.getElementById('ssds')}>
                            {briefTopicMenus.map(e=>{
                                return <Anchor.Link href={`#${e.code}`} title={e.name} key={e.code}/>
                            })}
                            {/* <Anchor.Link href="#BASE_INFO" title="基本信息"  />
                            <Anchor.Link href="#CASE_ITEM" title="案件程序"/>
                            <Anchor.Link href="#CASE_PROCESS" title="案件流程" />
                            <Anchor.Link href="#CASE_FILES" title="资料清单"/>
                            <Anchor.Link href="#CASE_MEMBER" title="案件成员"/> */}
                        </Anchor>
                        </div>
                    </Sider>

                </Layout>
                <Footer plain='true'>
                    <div className={'banner'}>Copyright © 2018至今 鱼律（厦门）网络科技有限公司 All rights reserved.
                        <a href="//beian.miit.gov.cn" target="_blank" rel="noreferrer">闽ICP备18004543号-1</a>
                    </div>
                </Footer>
            </Layout>
            <BackTop target={() => document.getElementById('root')} visibilityHeight={20}/>
        </Fragment>
        );
    }
}
export default P_BriefTopicView;