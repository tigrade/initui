import React,{DSBase,DSComponent,DSNavigate,get,Fragment} from 'comp/index';
import {Outlet} from 'react-router-dom';

import { Layout,Menu,Row, Col,Avatar,Button,Badge,Dropdown, Input,Select} from 'antd';
import { LoginOutlined,MailOutlined,SettingOutlined } from '@ant-design/icons';
import {message} from 'antd';

import './index.less';
import PlatformLayoutView from 'layout/client'
import AdminLayoutView from 'layout/admin'

import { Object3D } from 'three';
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
        //判断当前用户是否是管理员
        const {authType} = this.props;
        if(authType==='client'){
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
    }
    render() {
        const {authType,alias} = this.props;
        const userItems = (<Menu items={[{
            key: 'a11',
            label:<DSNavigate url={DSBase.list._LoginView.path} element={<Button type="link" icon={<SettingOutlined />} >账号设置</Button>}/>
            }, {
            type: 'divider',
            },{
            key: 'a1w',
            label:<DSNavigate url={DSBase.logout.path} element={<Button type="link" icon={<LoginOutlined />} >退出</Button>}/>
        }]}/>);

        if(authType==="admin"){
            const {managerMenus} = this.props;
            return (
                <Fragment>
                    <AdminLayoutView {...{menusSource:managerMenus,alias:alias}}></AdminLayoutView>
                </Fragment>
            );
        }

        if(authType==="client"){
            const {platformMenus} = this.props;
            const {teamView} = this.state;
            return (
                <Fragment>
                    <PlatformLayoutView {...{teamView:teamView,menusSource:platformMenus,alias:alias}}></PlatformLayoutView>
                </Fragment>
            );
        }
        return ;
        
    }
}
export default DSLayout;