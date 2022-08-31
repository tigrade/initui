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
        condition: {},
        defaultDataSource:[],
        vaildLeaf:false,
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
        const {defaultDataSource} = this.props;
        if(defaultDataSource.length<=0){
            const dataSource = await this.loadData();
            if(dataSource){
                this.setState(state=>{
                    state.dataSource = dataSource;
                    return state;
                });
            }
        }else{
            const children = await this.loadData();
            if(children===null){
                this.setState(state=>{
                    state.dataSource = defaultDataSource;
                    return state;
                });
            }else{
                const moduleSource = this.renderSource(defaultDataSource,defaultDataSource.value,children);
                this.setState(state=>{
                    state.dataSource = moduleSource;
                    return state;
                });
            }
            
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
        const { condition } = this.props;
        let _condition =condition;
        if(keyId!==undefined){
            const b = {};
            b[this.props.code.pId] = keyId;
            _condition = Object.assign({},_condition,b);
        }
        const conditionKeys = Object.keys(_condition).map(e=>e);
        conditionKeys.forEach(e=>{
            params.append(e, _condition[e]);
        });
        
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
        const {vaildLeaf} = this.props;
        if(vaildLeaf===true){
            if(node.isLeaf===true){
                this.props.onChange({id:node.value,name:node.title});
            }
        }else{
            this.props.onChange({id:node.value,name:node.title});
        }
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