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
            const currentIndex = _menuSource.findIndex(e=>{
                return e.path === pathname;
            });
            const _pageNo = currentIndex===-1?0:_menuSource[currentIndex].code;
            let _title = currentIndex===-1?undefined:_menuSource[currentIndex].name;
            setTitle(_title)
            setPageNo(_pageNo);
        }
     }, [location,navigate,menuSource]);
    return (<DSLayout pageNo={pageNo} title={title} 
        {...{location,navigate,context}}
        platformMenus={props.platformMenus} managerMenus={props.managerMenus} authType={props.authType} alias={props.alias}/>);
}
function Element(props){
    const location = useLocation();
    const navigate = useNavigate();
    const context = useOutletContext();
    const Elm = props.el;
    useEffect(() => {
        const pathname = location.pathname;
        if(!localStorage.getItem('isLogin')){
            if(pathname!==DSBase.login.path){
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
        this.state = {menus:DSBase.menus};
    }
    componentDidMount=async()=>{
        
        await this.renderRoutes();
    }
    renderRoutes=async()=>{
        if(localStorage.getItem('isLogin')==="true"){
            const response = await get('/api/user/info').catch(error => {
                message.error(error.message);
            });
            
            let menuSource = await get('/api/user/menu').catch(error => { 
                message.error(error.message+"d");
            });
            if(response===undefined){
                localStorage.removeItem('isLogin');
                localStorage.removeItem('token');
                window.location.href = DSBase.login.path;
            }
            let managerMenus;
            let platformMenus;
            if(menuSource){
                const {manager,platform} = menuSource.results;
                if(manager){
                    managerMenus = this.renderMenus(manager);
                }
                if(platform){
                    platformMenus = this.renderMenus(platform);
                }else{
                    menuSource = Object.assign(menuSource,{platform:DSBase.menus});
                    platformMenus = this.renderMenus(DSBase.menus);
                }
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
                state.managerMenus = managerMenus;
                state.platformMenus = platformMenus;
                const {manager,platform} = menuSource;
                const db = [];
                this._menuSource(manager,db);
                this._menuSource(platform,db);
                state.menuSource = db;
                return state;
            });
        }

        const _componentList = await import("conf/manager");
        const keyList = Object.keys(DSBase.list);
        const componentsList = keyList.map(e=>{
            const x = DSBase.list[e];
            const DsClass = _componentList[x.code];
            const data = Object.assign({},{el:<Element el={DsClass} key={DSID()}/>},{"path":x.path,"only":x.only});
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

    renderMenus=(source)=>{
        return source.map(l=>{
            if(l.isLeaf===true){
                const children = this.renderMenus(l.subMenu);
                return {key:l.code,label:l.name,children:children};
            }
            //icon:React.createElement(NotificationOutlined)
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
    componentDidUpdate=()=>{
    }
    render() {
        if(!this.state.onlys||!this.state.frames)return;//判断是否已经加载完毕
        const {platformMenus,managerMenus,authType,alias,menuSource} = this.state;
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
                            console.log(element.path);
                            return <Route path={element.path} element={element.el} key={DSID()}/>
                        })
                    }
                    <Route path="/" element={<Layout db={menuSource} 
                        platformMenus={platformMenus} managerMenus={managerMenus} authType={authType} alias={alias}/>}>
                        {
                            frames.filter(e=>{
                                return e.el!==undefined;
                            }).map(element => {
                                return <Route path={element.path} element={element.el} key={DSID()} />//forceRefresh={true}
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