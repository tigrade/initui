import React,{DSComponent,Fragment,post} from 'comp/index';

import { Row,Col,Button, Descriptions} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import './index.less';
import BaseFormView from 'views/platform/case/manager/base/form';

class CaseBaseView extends DSComponent {
    constructor(props){
        super(props);
        this.baseFormRef = React.createRef();
    }
    static defaultProps = {
        lawCase:{},
        editor:false
    }
    componentDidMount = () => {

    }
    onEditor=()=>{
        const {lawCase} = this.props;
        this.baseFormRef.current.onEditor(lawCase);
    }
    reloadPage=()=>{
        window.location.reload();
    }
    render() {
        const {lawCase,editor} = this.props;
        return (
            <Fragment>
            <BaseFormView ref={this.baseFormRef} reloadPage={this.reloadPage}/>
            <div className='fl-case-detail-base' id='BASE_INFO'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">基本信息</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                        {editor===true&&<Button type="link" icon={<SettingOutlined />} onClick={this.onEditor}>设置</Button>}
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                <Descriptions layout="vertical" bordered>
                    <Descriptions.Item span={3} label="案件名称">{lawCase.title}</Descriptions.Item>
                    <Descriptions.Item span={1} label="案源人员">{lawCase.caseSource}</Descriptions.Item>
                    <Descriptions.Item span={1} label="创建时间">{lawCase.createTime}</Descriptions.Item>
                    <Descriptions.Item span={1} label="案件类型">{lawCase.caseTypeName}</Descriptions.Item>
                    <Descriptions.Item span={1} label="团队名称">{lawCase.teamName}</Descriptions.Item>
                    <Descriptions.Item label="客户名称">{lawCase.teamCustomerName}</Descriptions.Item>
                </Descriptions>
                </div>
            </div>
            </Fragment>
        );
    }
}
export default CaseBaseView;