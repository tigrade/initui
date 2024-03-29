import React,{DSTable,DSComponent,Fragment} from 'comp/index';

import {Row,Col,Button} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import './index.less';
import CaseMemberFormView from 'views/platform/case/manager/member/form'

class CaseMemberView extends DSComponent {
    constructor(props){
        super(props);
        this.caseMemberFormRef = React.createRef();
        this.tableRef = React.createRef();
    }
    static defaultProps = {
        lawCase:{},
        editor:true
    }
    componentDidMount = () => {
    }
    onEditor=()=>{
        this.caseMemberFormRef.current.onEditor();
    }
    reload=()=>{
        this.tableRef.current.reload();//刷新表单
    }
    render() {
        const columns=[
            {title: '名称',dataIndex: 'memberAlias'},
            {title: '类型',dataIndex: 'memberType',render:(value,item,index)=>{
                if(value==="SOURCE")return "案源人员";
                if(value==="INNER_HANDLER")return "内部办案成员";
                if(value==="OUTER_HANDLER")return "外部办案成员";
                if(value==="CUSTOMER")return "客户成员";
                return value;
            }}];
        const {lawCase,editor} = this.props;
        const searchCondition = {lawCaseId:lawCase.id};
        return (
            <Fragment>
            <CaseMemberFormView  lawCase={lawCase} reloadTable={this.reload}  ref={this.caseMemberFormRef}/>
            <div className='fl-case-detail-base' id='CASE_MEMBER'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">案件成员</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                    {editor===true&&<Button type="link" icon={<SettingOutlined />}  onClick={this.onEditor.bind(this)}>设置</Button>}
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                    <DSTable columns={columns} searchCondition={searchCondition} path={'/api/lawCaseMember/list'} pageable={false} ref={this.tableRef}></DSTable>
                </div>
            </div>
            
            </Fragment>
        );
    }
}
export default CaseMemberView;