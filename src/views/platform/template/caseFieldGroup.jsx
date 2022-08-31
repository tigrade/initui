import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { message,Tag,Empty,Space } from 'antd';

class CaseFieldGroupListView extends DSComponent{   
    constructor(props){
        super(props);
        this.state = {dataSource:[],selectedKeys:{}};
    }
    static defaultProps = {
        caseType:'',
        onSelect:()=>{}
    }
    componentDidMount=async ()=>{
        await this.reload();
    }
    reload=async()=>{
        const {caseType} = this.props;
        const params = new FormData();
        params.append('caseTypeId', caseType.id);
        const response = await post('/api/caseFieldGroup/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            let dataSource = {};
            if(results!==null&&results!==undefined){
                dataSource = results.map(e=>{
                    return {name:e.name,id:e.id};
                });
            }
            this.setState(state=>{
                state.dataSource = dataSource;
                return state;
            });
        }
    }
    onCheckedCahange=(e,checked)=>{
        this.setState(state=>{
            if(checked===true){
                const _selectedKeys = {};
                _selectedKeys[e.id]=checked;
                state.selectedKeys = _selectedKeys;
            }else{
                state.selectedKeys = {};
            }
            return state;
        },()=>{
            this.props.onSelect({checked:checked,id:e.id,name:e.name});
        });
    }
    render(){
        const {dataSource,selectedKeys} = this.state;
        return (
        <Fragment>
            {dataSource.length<=0&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {dataSource.length>0&&
            <Space size={[8, 16]} wrap>
            {dataSource.map((e)=>{
                return <Tag  key={e.id} style={{padding:"0px"}}>
                <Tag.CheckableTag style={{padding:"12px",margin:"0px"}} checked={selectedKeys[e.id]} onChange={(checked)=>{this.onCheckedCahange(e,checked)}}>{e.name}</Tag.CheckableTag>
            </Tag>
            })}
            </Space>}
        </Fragment>
        );
    }
}
export default CaseFieldGroupListView;