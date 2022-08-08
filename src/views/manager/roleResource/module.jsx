import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { message,Tree} from 'antd';

class ModuleTreeView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {dataSource:[],selectedKeys:[]};
    }
    static defaultProps = {
        onSelect:()=>{}
    }
    componentDidMount=async ()=>{
        await this.onLoad();
    }
    unSelect=()=>{
        this.setState(state=>{
            state.selectedKeys = [];
            return state;
        });
    }
    onSelect=(keys,node)=>{
        this.setState(state=>{
            state.selectedKeys = keys;
            return state;
        },()=>{
            this.props.onSelect(keys);
        });
        
    }
    onLoad=async()=>{
        const dataSource = await this.loadData();
        if(dataSource){
            this.setState(state=>{
                state.dataSource = dataSource;
                return state;
            });
        }
    }
    expendNode= async (module)=>{
        if(module){
            const children = await this.loadData(module.key);
            const {dataSource} = this.state;
            if(dataSource){
                const moduleSource = this.renderSource(dataSource,module.key,children);
                this.setState(state=>{
                    state.dataSource = moduleSource;
                    return state;
                });
            }
        }
    }
    renderSource=(list,key,children)=>{
        return list.map(node=>{
            if(node.key===key){
                node['children'] = children;
                return node;
            }
            if(node.children){
                const _children = this.renderSource(node.children,key,children);
                node['children'] = _children;
                return node;
            }
            return node;
        })
    }
    loadData=async(moduleId)=>{
        const params = new FormData();
        if(moduleId!==undefined){
            params.append('moduleId', moduleId);
        }
        const response = await post('/api/module/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            if(response.results){
                return response.results.map(e=>{
                    return {title:e.name,key:e.id,isLeaf:e.isLeaf};
                });
            }
        }
        return null;
    }
    render(){
        const {dataSource,selectedKeys} = this.state;
        return (
        <Fragment>
            <Tree treeData={dataSource} loadData={this.expendNode} onSelect={this.onSelect} selectedKeys={selectedKeys}/>
        </Fragment>
        );
    }
}
export default ModuleTreeView;