import React,{DSComponent,post,Fragment} from 'comp/index';

import { Layout,Row, Col,Anchor,BackTop} from 'antd';
import {message} from 'antd';
import CaseBaseView from 'views/platform/share/case/manager/base/index';
import CaseItemView from 'views/platform/share/case/manager/item/index';
import CaseProcessView from 'views/platform/share/case/manager/process/index';
import CaseMemberView from 'views/platform/share/case/manager/member/index';
import CaseResourceView from 'views/platform/share/case/manager/store/index';

import './index.less';

const { Header, Footer, Content, Sider } = Layout;

class ShareCaseDetailView extends DSComponent{   
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
                    </Col>
                </Row>
                </Header>
                <Layout>
                    <Layout style={{padding:0,overflow: "auto"}}>
                        <Content style={{"padding": "0 12px 12px",minHeight: 280,background:"#f0f2f5"}} className='main-wrapper' id='backTop'>
                            <CaseBaseView lawCase={lawCase}/>
                            <CaseItemView lawCase={lawCase}/>
                            <CaseProcessView lawCase={lawCase}/>
                            <CaseResourceView lawCase={lawCase}/>
                            <CaseMemberView lawCase={lawCase}/>
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
export default ShareCaseDetailView;