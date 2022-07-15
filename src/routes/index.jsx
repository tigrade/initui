import React, { Component,useEffect,useState,useRef } from 'react';
import { BrowserRouter, Routes, Route,Link,Navigate,useLocation } from "react-router-dom";

import DSLayout from 'layout/index'

import DefaultView from 'views/default/index';
import CaseView from 'views/case/index';
function Layout(props){
    let items = props.items;
    // let pageNo = props.pageNo;
    // const menus = props.menus;
    const menus = useRef(props.menus);
    const location = useLocation();
    const [pageNo, setPageNo] = useState(props.pageNo);

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
    componentDidMount=()=>{
        console.log("componentDidUpdate");
    }
    componentDidUpdate=()=>{
        console.log("componentDidUpdate");
    }
    render() {
        const menus = [
            {"path":"/","name":"首页",key:1,el:<DefaultView/>},
            {"path":"/case","name":"案件",key:2,el:<CaseView/>}
        ];
        const items = menus.map(e=>{
            return { label: (<Link to={`${e.path}`}><span>{e.name}</span></Link>),key:e.key};
        });
        const pathname = new URL(window.location.href).pathname;
        const currentIndex = menus.findIndex(e=>{
            return e.path === pathname;
        });
        const pageNo = currentIndex===-1?1:menus[currentIndex].key;
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout items={items} pageNo={pageNo} menus={menus}/>}>
                        {
                            menus.filter(e=>{
                                return e.el!==undefined;
                            }).map(element => {
                                return <Route path={element.path} element={element.el} key={new Date().getTime()}/>
                            })
                        }
                        
                        {/* <Route path='/quote/dataMining' element={<QuotesDataMiningView/>} /> */}
                        
                        <Route path="*"
                            element={<Navigate to='/' replace={true}/>
                                // <main style={{ padding: "1rem" }}>
                                //     <p>There's nothing here!</p>
                                // </main>
                            }
                        />
                    </Route>

                </Routes>
            </BrowserRouter>
        );
    }
}
export default DSRoutes;