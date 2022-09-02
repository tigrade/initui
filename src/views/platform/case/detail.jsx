import React,{DSBase,DSComponent,DSNavigate,post,Fragment} from 'comp/index';
import {Outlet} from 'react-router-dom';

import { Layout,Menu,Row, Col,Anchor,Button,BackTop,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,KeyOutlined,SettingOutlined,UsergroupAddOutlined,DeliveredProcedureOutlined,ShareAltOutlined } from '@ant-design/icons';
import {message} from 'antd';
import CaseBaseView from 'views/platform/case/manager/base/index';
import CaseItemView from 'views/platform/case/manager/item/index';
import CaseProcessView from 'views/platform/case/manager/process/index';
import CaseMemberView from 'views/platform/case/manager/member/index';
import CaseResourceView from 'views/platform/case/manager/store/index';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;


class CaseDetailView extends DSComponent{   
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
        const response = await post('/api/lawCase/find/one',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.lawCase = results;
                return state;
            });
        }
    }
    onClosed=async()=>{
        const {lawCase} = this.state;
        const params = new FormData();
        params.append('id', lawCase.id);
        const response = await post('/api/lawCase/closed',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            window.location.reload();
        }
    }
    onReopen=async()=>{
        const {lawCase} = this.state;
        const params = new FormData();
        params.append('id', lawCase.id);
        const response = await post('/api/lawCase/reopen',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
            window.location.reload();
        }
    }
    render(){
        const {lawCase} = this.state;
        if(lawCase===undefined){
            return ;
        }
        const {status} = lawCase;
        const lawCaseMenus = [
            {name:"基本信息",code:"BASE_INFO"},
            {name:"程序列表",code:"CASE_ITEM"},
            {name:"流程节点",code:"CASE_PROCESS"},
            {name:"成员列表",code:"CASE_MEMBER"},
            {name:"存储列表",code:"CASE_FILES"},
            {name:"人员邀请",code:"CASE_JOIN"},
        ]
        const menusSource = lawCaseMenus.map(l=>{
            return {key:l.code,label:l.name};
        });
        const isClosed = status==="closed"?true:false;//status==="processing"?true:false;
        return (
        <Fragment>
            <Layout id='kkks'>
                <Header className='ds-theme-header'>
                <Row>
                    <Col flex="auto">
                        <Row>
                            <Col flex="auto">{isClosed===true?`【结案】${lawCase.title}`:`【进行中】${lawCase.title}`}</Col>
                        </Row>
                    </Col>
                    <Col flex="120px">
                        <Row wrap={false}>
                            {isClosed!==true&&
                            <Col ><Button type="link" icon={<DeliveredProcedureOutlined />} onClick={this.onClosed}>结案</Button></Col>
                            }
                            {isClosed===true&&
                            <Col ><Button type="link" icon={<KeyOutlined />} onClick={this.onReopen}>重启</Button></Col>
                            }
                            <Col ><Button type="link" icon={<ShareAltOutlined />}>分享</Button></Col>
                            <Col ><Button type="link" icon={<UsergroupAddOutlined />}>邀请</Button></Col>
                            <Col push="2"></Col>
                        </Row>
                    </Col>
                </Row>
                </Header>
                <Layout>
                    <Layout style={{padding:0,overflow: "auto"}}>
                        <Content style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper' id='backTop'>
                            <CaseBaseView lawCase={lawCase} editor={!isClosed}/>
                            <CaseItemView lawCase={lawCase} editor={!isClosed}/>
                            <CaseProcessView lawCase={lawCase} editor={!isClosed}/>
                            <CaseResourceView lawCase={lawCase} editor={!isClosed}/>
                            <CaseMemberView lawCase={lawCase} editor={!isClosed}/>
                        </Content>
                    </Layout>

                    <Sider width={200} style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} id="ssds">
                        <div style={{padding:"12px 36px",background:"#ffffff",position:"fixed",top:"75px"}}>
                        <Anchor getContainer={() => document.getElementById('ssds')}>
                            <Anchor.Link href="#BASE_INFO" title="基本信息"  />
                            <Anchor.Link href="#CASE_ITEM" title="案件程序"/>
                            <Anchor.Link href="#CASE_PROCESS" title="案件流程" />
                            <Anchor.Link href="#CASE_FILES" title="资料清单"/>
                            <Anchor.Link href="#CASE_MEMBER" title="案件成员"/>
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
export default CaseDetailView;