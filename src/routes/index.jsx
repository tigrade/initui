import React, { Component } from 'react';
import { BrowserRouter, Routes, Route,Link,Navigate } from "react-router-dom";

import DSLayout from 'layout/index'

import DefaultView from 'views/default/index';

class DSRoutes extends Component {
    componentDidMount=()=>{
        
    }
    render() {
        const menus = [
            {"path":"/","name":"首页",key:1,el:<DefaultView/>},
            {"path":"/case","name":"案件",key:2,el:<DefaultView/>}
        ];
        const items = menus.map(e=>{
            return { label: (<Link to={`${e.path}`}><span>{e.name}</span></Link>),key:e.key};
        });
        const pathname = new URL(window.location.href).pathname;
        const currentIndex = menus.findIndex(e=>{
            return e.path == pathname;
        });
        const pageNo = currentIndex==-1?1:menus[currentIndex].key;
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DSLayout items={items} pageNo={pageNo}/>}>
                        {
                            menus.filter(e=>{
                                return e.el!==undefined;
                            }).map(element => {
                                return <Route path={element.path} element={element.el} key={new Date().getTime()}/>
                            })
                        }
                        
                        {/* <Route path='/quote/dataMining' element={<QuotesDataMiningView/>} /> */}
                        
                        <Route path="*"
                            element={<Navigate to='/' />
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