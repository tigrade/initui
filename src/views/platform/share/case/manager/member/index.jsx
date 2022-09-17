import React,{DSTable,DSComponent,Fragment} from 'comp/index';

import {Row,Col} from 'antd';
import './index.less';

class CaseMemberView extends DSComponent {
    constructor(props){
        super(props);
    }
    static defaultProps = {
        lawCase:{}
    }
    componentDidMount = () => {
    }
    render() {
        const columns=[
            {title: '名称',dataIndex: 'memberAlias'},
            {title: '类型',dataIndex: 'memberType',render:(value,item,index)=>{
                if(value==="SOURCE")return "案源人员";
                if(value==="HANDLER")return "办案成员";
                if(value==="CUSTOMER")return "客户成员";
                return value;
            }}];
        const {lawCase} = this.props;
        const searchCondition = {lawCaseId:lawCase.id};
        return (
            <Fragment>
            <div className='fl-case-detail-base' id='CASE_MEMBER'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">案件成员</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
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