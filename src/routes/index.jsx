import React,{DSID,DSBase,DSComponent,useEffect,useState,get,useCallback} from 'comp/index';
import { BrowserRouter, Routes, Route,Link,Navigate,useLocation,useNavigate,useOutletContext  } from "react-router-dom";
import {message} from 'antd';

import DSLayout from 'layout/index'

function Layout(props){
    const location = useLocation();
    const navigate = useNavigate();
    const context = useOutletContext();
    const [pageNo, setPageNo] = useState();
    const [title, setTitle] = useState();

    const menuSource = useCallback(()=>{
      return props.db;
    },[props.db]);
    useEffect(() => {
        const pathname = location.pathname;
        if(!localStorage.getItem('isLogin')){
            navigate('/login');
            return ;
        }
        if(menuSource()){
            const _menuSource = menuSource();
        }
     }, [location,navigate,menuSource]);
    return (<DSLayout pageNo={pageNo} title={title} {...{location,navigate,context}} authType={props.authType} alias={props.alias}/>);
}
function Element(props){
    const location = useLocation();
    const navigate = useNavigate();
    const context = useOutletContext();
    const Elm = props.el;
    useEffect(() => {
        const pathname = location.pathname;
        if(!localStorage.getItem('isLogin')){
            //过滤非需要登陆的页面
            const filterList = ['/content/invite','/content/share/lawCase/index'];
            if(pathname!==DSBase.login.path&&filterList.includes(pathname)===false){
                navigate(DSBase.login.path);
                return ;
            }
        }else{
            if(pathname===DSBase.login.path){
                navigate(DSBase.root.path);
                return ;
            }
        }
     }, [location,navigate]);
     return <Elm {...{location,navigate,context}}/>
}
class DSRoutes extends DSComponent {
    constructor(props){
        super(props);
        this.state = {}
    }
    componentDidMount=async()=>{
        await this.renderRoutes();
    }
    renderRoutes=async()=>{
        if(localStorage.getItem('isLogin')==="true"){
            const response = await get('/api/user/info').catch(error => {
                message.error(error.message);
            });
            if(response===undefined){
                localStorage.removeItem('isLogin');
                localStorage.removeItem('token');
                window.location.href = DSBase.login.path;
            }
            const {type,aliasName} = response.results;
            this.setState(state=>{
                state.alias = aliasName;
                if(type==="31"){
                    state.authType = "client";
                }
                if(type==="11"){
                    state.authType = "admin";
                }
                return state;
            });
        }

        const _componentList = await import("conf/manager");
        const keyList = Object.keys(DSBase.list);
        const componentsList = keyList.map(e=>{
            const x = DSBase.list[e];
            const DsClass = _componentList[x.code];
            const data = Object.assign({},{el:<Element el={DsClass} key={DSID()}/>},{"path":x.path,"only":x.only,key:e});
            return data;
        });

        const componentsOnlyList = componentsList.filter(e=>{
            return e.only===true;
        });

        const componentsFrameList = componentsList.filter(e=>{
            return e.only===false;
        });
        this.setState(state=>{
            state.frames = componentsFrameList;
            state.onlys = componentsOnlyList;
            return state;
        });
    }
    render() {
        if(!this.state.onlys||!this.state.frames)return;//判断是否已经加载完毕
        const {authType,alias} = this.state;
        const frames = this.state.frames||[];
        const onlys = this.state.onlys||[];
        return (
            <BrowserRouter>
                <Routes>
                    {/* <Route path="/login" element={<LoginView/>}/> */}
                    {
                        onlys.filter(e=>{
                            return e.el!==undefined;
                        }).map(element => {
                            return <Route path={element.path} element={element.el} key={DSID()}/>
                        })
                    }
                    <Route path="/" element={<Layout authType={authType} alias={alias}/>}>
                        {
                            frames.filter(e=>{
                                return e.el!==undefined;
                            }).map(element => {
                                if(element.path==="/content/index"&&authType==="client"){
                                    return <Route index  element={element.el} key={DSID()} />//forceRefresh={true}
                                }else if(element.path==="/content/home"&&authType==="admin"){
                                    return <Route index  element={element.el} key={DSID()} />//forceRefresh={true}
                                }else{
                                    return <Route path={element.path} element={element.el} key={DSID()} />//forceRefresh={true}
                                }
                            })
                        }
                        <Route path="*" element={<Navigate to='/' replace={true}/>}/>
                    </Route>
                    
                </Routes>
            </BrowserRouter>
        );
    }
}
export default DSRoutes;