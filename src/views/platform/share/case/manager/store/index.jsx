import React,{DSTable,DSComponent,Fragment,post} from 'comp/index';

import { Divider,Space,List, Empty,Row,Col,Tabs,Button,Collapse, Descriptions,Typography,Radio} from 'antd';
import {PlusOutlined,DeleteOutlined,SettingOutlined,EditOutlined,LikeOutlined,MessageOutlined } from '@ant-design/icons';
import './index.less';

class CaseResourceView extends DSComponent {
    constructor(props){
        super(props);
    }
    static defaultProps = {
        lawCase:{}
    }
    componentDidMount = () => {
    }
    render() {
        return (
            <Fragment>
            <div className='fl-case-detail-base' id='CASE_FILES'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">资料清单</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                <Empty description={"暂无数据"}/>
                </div>
            </div>
            </Fragment>
        );
    }
}
export default CaseResourceView;