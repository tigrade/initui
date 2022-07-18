import React, { Component,useEffect,useState,useRef } from 'react';
import { BrowserRouter, Routes, Route,Link,Navigate,useLocation } from "react-router-dom";

import { nanoid } from 'nanoid'; 

import DSLayout from 'layout/index'
import _init from 'views/index'


function Layout(props){
    let items = props.items;
    const menus = props.menus;//useRef()
    const location = useLocation();
    const [pageNo, setPageNo] = useState();

    useEffect(() => {
        const pathname = location.pathname;
        const currentIndex = menus.findIndex(e=>{
            return e.path === pathname;
        });
        const _pageNo = currentIndex===-1?1:menus[currentIndex].key;
        setPageNo(_pageNo);
     }, [location]);
    return (<DSLayout items={items} pageNo={pageNo}/>);
}
class DSRoutes extends Component {
    constructor(props){
        super(props);
        this.state = {menus:_init.menus};
    }
    componentDidMount=async()=>{
        const _componentList = await import("views/index");
        const keyList = Object.keys(_init.list);
        const componentsList = keyList.map(e=>{
            const x = _init.list[e];
            const _class = _componentList[x.code];
            const data = Object.assign({},{el:<_class key={nanoid()}/>},{"path":x.path,"only":x.only});
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
    componentDidUpdate=()=>{
        console.log("componentDidUpdate");
    }
    render() {
        const menus  = this.state.menus||[];
        const frames = this.state.frames||[];
        const onlys = this.state.onlys||[];
        const items = menus.map(e=>{
            return { label: (<Link to={`${e.path}`}><span>{e.name}</span></Link>),key:e.key};
        });
        return (
            <BrowserRouter>
                <Routes>
                    {/* <Route path="/login" element={<LoginView/>}/> */}
                    {
                        onlys.filter(e=>{
                            return e.el!==undefined;
                        }).map(element => {
                            return <Route path={element.path} element={element.el} key={nanoid()}/>
                        })
                    }
                    <Route path="/" element={<Layout items={items} menus={menus}/>}>
                        {
                            frames.filter(e=>{
                                return e.el!==undefined;
                            }).map(element => {
                                return <Route path={element.path} element={element.el} key={nanoid()}/>
                            })
                        }
                        <Route path="*" element={<Navigate to='/login' replace={true}/>}/>
                    </Route>

                </Routes>
            </BrowserRouter>
        );
    }
}
export default DSRoutes;