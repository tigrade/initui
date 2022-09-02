import React,{DSComponent,Fragment,post} from 'comp/index';

import {Row,Col,Button, Empty,Collapse} from 'antd';
import {SettingOutlined} from '@ant-design/icons';
import './index.less';

class TopicRuleView extends DSComponent {
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
                    <Col flex="auto">法律法规</Col>
                    <Col flex="100px" style={{textAlign:'right'}}>
                        <Button type="link" icon={<SettingOutlined />}>设置</Button>
                    </Col>
                </Row>
                </div>
                <div className='fl-case-detail-base-wrap'>
                <Collapse defaultActiveKey={['1']}>
                    <Collapse.Panel header="法规-01" key="1">
                    <div><Empty description={"暂无数据"}/>
                    </div>
                    </Collapse.Panel>
                    <Collapse.Panel header="法规-02" key="2" >
                    <div></div>
                    </Collapse.Panel>
                    <Collapse.Panel header="法规-03" key="3">
                    <div></div>
                    </Collapse.Panel>
                </Collapse>
                </div>
            </div>
            </Fragment>
        );
    }
}
export default TopicRuleView;