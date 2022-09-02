import React,{DSComponent,Fragment,post} from 'comp/index';

import {Row,Col,Button, Descriptions} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import './index.less';

class TopicBaseView extends DSComponent {
    constructor(props){
        super(props);
    }
    static defaultProps = {
        briefTopic:{}
    }
    componentDidMount = () => {
    }
    render() {
        const {briefTopic} = this.props;
        return (
            <Fragment>
            <div className='fl-case-detail-base' id='BASE_INFO'>
                <div className='fl-case-detail-base-title'>
                <Row wrap={false}>
                    <Col flex="auto">基本信息</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                        <Button type="link" icon={<SettingOutlined />}>设置</Button>
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                <Descriptions layout="vertical" bordered>
                    <Descriptions.Item span={1} label="案由">{briefTopic.briefName}</Descriptions.Item>
                    <Descriptions.Item span={2} label="专题">{briefTopic.title}</Descriptions.Item>
                    <Descriptions.Item span={3} label="概述">{briefTopic.content}</Descriptions.Item>
                </Descriptions>
                </div>
            </div>
            </Fragment>
        );
    }
}
export default TopicBaseView;