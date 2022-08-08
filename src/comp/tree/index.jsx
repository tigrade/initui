import React, {Component} from 'react';
import { post } from 'utils/http'; 
import { TreeSelect, message } from 'antd';

class DSTreeSelect extends Component {
    constructor(props) {
        super(props);
        this.state={dataSource:[],value:{}}
    }
    static defaultProps = {
        path:'',
        value:{id:"",name:""},
        onChange:()=>{},
        code:{title:'',value:'',isLeaf:'isLeaf',pId:''}
    }
    static getDerivedStateFromProps(props,state){
        if(JSON.stringify(props.value) !== JSON.stringify(state.value)) {
            return {value:props.value}
        }
        return null;
    }
    componentDidMount=async ()=>{
        await this.onLoad();
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
    expendNode= async(item)=>{
        if(item){
            const children = await this.loadData(item.key);
            const {dataSource} = this.state;
            if(dataSource){
                const moduleSource = this.renderSource(dataSource,item.key,children);
                this.setState(state=>{
                    state.dataSource = moduleSource;
                    return state;
                });
            }
        }
    }
    renderSource=(list,key,children)=>{
        return list.map(node=>{
            if(node.value===key){
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
    loadData=async(keyId)=>{
        const params = new FormData();
        if(keyId!==undefined){
            params.append(this.props.code.pId, keyId);
        }
        const response = await post(this.props.path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            if(response.results){
                return response.results.map(e=>{
                    return {title:e[this.props.code.title],value:e[this.props.code.value],isLeaf:e[this.props.code.isLeaf],pId:e[this.props.code.pId]};
                });
            }
        }
        return null;
    }
    onChange=(key,node)=>{
        this.props.onChange({id:node.value,name:node.title});
    }
    render() {
        const {dataSource,value} = this.state;
        const _defaultValue = value.name!==undefined||value.name!==""?value.name:undefined;
        return (
            <TreeSelect treeData={dataSource} loadData={this.expendNode} onSelect={this.onChange} value={_defaultValue}/>
        );
    }
}
export default DSTreeSelect;