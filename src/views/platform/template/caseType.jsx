import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { message,Tree,Empty} from 'antd';

class CaseTypeTreeView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {dataSource:[],selectedKeys:[]};
    }
    static defaultProps = {
        teamId:'',
        editor:true,
        onSelect:()=>{}
    }
    componentDidMount=async ()=>{
        await this.reload();
    }
    unSelect=()=>{
        this.setState(state=>{
            state.selectedKeys = [];
            return state;
        });
    }
    onSelect=(keys,node)=>{
        const {editor} = this.props;
        if(editor===true){
            this.setState(state=>{
                state.selectedKeys = keys;
                return state;
            },()=>{
                this.props.onSelect(node);
            });
        }else{
            if(node.node.isLeaf===true&&node.node.isRoot===false){
                this.setState(state=>{
                    state.selectedKeys = keys;
                    return state;
                },()=>{
                    this.props.onSelect(node);
                });
            }else{
                if(node.node.isLeaf===true){
                    message.error("请在案件分类的【设置】按钮，新增下级分类。");
                }
            }
        }
        
    }
    reload=async()=>{
        const dataSource = await this.loadData();
        if(dataSource){
            this.setState(state=>{
                state.dataSource = dataSource;
                state.expandedKeys = [];
                state.selectedKeys = [];
                state.loadedKeys=[];
                return state;
            });
        }else{
            this.setState(state=>{
                state.dataSource = [];
                state.expandedKeys = [];
                state.selectedKeys = [];
                state.loadedKeys=[];
                return state;
            });
        }
    }
    expendNode= async(module)=>{
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
    loadData=async(menuId)=>{
        const {teamId} = this.props;
        const params = new FormData();
        params.append('teamId', teamId);
        if(menuId!==undefined){
            params.append('caseTypeId', menuId);
        }
        const response = await post('/api/caseType/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            if(response.results){
                return response.results.map(e=>{
                    return {title:e.name,key:e.id,isLeaf:e.isLeaf,isRoot:e.caseTypeId===null?true:false};
                });
            }
        }
        return null;
    }
    onExpand=(expandedKeys)=>{
        this.setState(state=>{
            state.expandedKeys = expandedKeys;
            return state;
        });
    }
    onLoad=(loadedKeys)=>{
        this.setState(state=>{
            state.loadedKeys = loadedKeys;
            return state;
        });
    }
    render(){
        const {dataSource,selectedKeys,expandedKeys,loadedKeys} = this.state;
        return (
        <Fragment>
            {dataSource.length<=0&&
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            {dataSource.length>0&&
            <Tree 
            selectable={true} 
            onSelect={this.onSelect} 
            selectedKeys={selectedKeys} 
            onExpand={this.onExpand} 
            expandedKeys={expandedKeys}
            loadedKeys={loadedKeys}
            onLoad={this.onLoad}
            treeData={dataSource} 
            loadData={this.expendNode} 
            />
            }
        </Fragment>
        );
    }
}
export default CaseTypeTreeView;