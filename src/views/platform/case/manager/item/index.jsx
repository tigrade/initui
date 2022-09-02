import React,{DSComponent,Fragment,post} from 'comp/index';

import {Empty,Row,Col,Tabs,Button,message} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import './index.less';

import  ItemFormView from 'views/platform/case/manager/item/form';
import  CaseItemDescView from 'views/platform/case/manager/item/desc';


class CaseItemView extends DSComponent {
    constructor(props){
        super(props);
        this.state = {dataSource:[],activeKey:undefined};
        this.caseItemFormRef = React.createRef();
    }
    static defaultProps = {
        lawCase:{}
    }
    componentDidMount = () => {
        this.reload();
    }
    reload=async()=>{
        const {lawCase} = this.props;
        const params = new FormData();
        params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseItem/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                if(results!==undefined&&results!==null&&results.length>0){
                    state.activeKey = results[0].id;
                    state.dataSource = results;
                }else{
                    state.dataSource = [];
                    state.activeKey = undefined;
                }
                return state;
            });
        }
    }
    onChangeTabs=(activeKey)=>{
        this.setState(state=>{
            state.activeKey = activeKey;
            return state;
        });
    }
    onEditor=()=>{
        this.caseItemFormRef.current.onEditor();
        this.setState(state=>{
            state.activeKey = "";
            return state;
        });
    }
    render() {
        const {lawCase} = this.props;
        const {dataSource,activeKey} = this.state;
        return (
            <Fragment>
            <ItemFormView lawCase={lawCase} reloadTable={this.reload} ref={this.caseItemFormRef}/>
            <div className='fl-case-detail-base' id='CASE_ITEM'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">案件程序</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                        <Button type="link" icon={<SettingOutlined />} onClick={this.onEditor.bind(this)}>设置</Button>
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                {dataSource.length>0&&
                <Tabs tabPosition={"left"} destroyInactiveTabPane={true} activeKey={activeKey} onChange={this.onChangeTabs}>
                    {dataSource.map(item=>{
                        return (
                        <Tabs.TabPane tab={item.title} key={item.id} forceRender={true}>
                            <CaseItemDescView lawCaseItem={item} key={Math.floor(Math.random() * 10000)}/>
                        </Tabs.TabPane>    
                        )
                    })}
                </Tabs>
                }
                {dataSource.length<=0&&<Empty description={"暂无数据"}/>}
                </div>
            </div>
            </Fragment>
        );
    }
}
export default CaseItemView;