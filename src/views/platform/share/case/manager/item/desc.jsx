import React,{DSComponent,Fragment,post} from 'comp/index';

import { Descriptions,Divider,message} from 'antd';
import './index.less';

class CaseItemDescView extends DSComponent {
    constructor(props){
        super(props);
        this.state = {dataSource:[]};
    }
    static defaultProps = {
        lawCaseItem:{}
    }
    componentDidMount = () => {
        this.reload();
    }
    reload=async()=>{
        const {lawCaseItem} = this.props;
        const params = new FormData();
        params.append('id', lawCaseItem.id);
        const response = await post('/api/lawCaseItem//find/one',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.dataSource = results;
                return state;
            });
        }
    }
    dynamicFormRender=()=>{
        const {dataSource} = this.state;
        const {schemaFields,positionList} = dataSource;
        if(schemaFields!==undefined&&schemaFields.length>0){
            const groupSourceKey = schemaFields.filter((item, pos, self) => self.findIndex(v => v.groupName === item.groupName) === pos).map(item=>{
                const { groupName,groupSort} = item;
                return {name:groupName,key:groupSort};
            }).sort((a, b) => a.key - b.key);
            const groupSourceValue = schemaFields.reduce((group, item) => {
                const { groupName } = item;
                group[groupName] = group[groupName] ?? [];
                group[groupName].push(item);
                return group;
            }, {});

            const positionSourceValue = positionList.reduce((group, item) => {
                const { positionType } = item;
                group[positionType] = group[positionType] ?? [];
                group[positionType].push(item);
                return group;
            }, {});

            return groupSourceKey.map((item,index)=>{
                const data = groupSourceValue[item.name];
                const branch = positionSourceValue['BRANCH'];
                const master = positionSourceValue['MASTER'];
                

                if(index===0){
                    return (
                    <Descriptions layout="vertical" bordered key={index}>
                        <Descriptions.Item label="主办律师">{Array.isArray(master)?master.map(e=>e.caseMemberAlias).join(","):""}</Descriptions.Item>
                        <Descriptions.Item label="辅办律师">{Array.isArray(branch)?branch.map(e=>e.caseMemberAlias).join(","):""}</Descriptions.Item>
                        {data.length>0&&data.sort((a, b) => a.seq - b.seq).map(e=>{
                            return (
                            <Descriptions.Item label={e.name} key={e.id}>{e.storeValue}</Descriptions.Item>
                            )
                        })}
                    </Descriptions>   
                    );
                }else{
                    return (
                    <Fragment key={index}>
                        <Divider plain>{item.name}</Divider>
                        <Descriptions layout="vertical" bordered>
                        {data.length>0&&data.sort((a, b) => a.seq - b.seq).map(e=>{
                            return (
                            <Descriptions.Item label={e.name} key={e.id}>{e.storeValue}</Descriptions.Item>
                            )
                        })}
                        </Descriptions>
                    </Fragment>   
                    );
                }
            });
        }
        
    }
    render() {
        return (
            <Fragment>
                {this.dynamicFormRender()}
            </Fragment>
        );
    }
}
export default CaseItemDescView;