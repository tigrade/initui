import React, { Component, Fragment,useId } from 'react';
import { nanoid } from 'nanoid'; 
import { Form, Input, Select, Button, PageHeader, Divider, DatePicker,BackTop,Row,Col,Tag,Space,Table } from 'antd';
import './index.less';
import { typeList } from 'antd/lib/message';
const {Search} = Input;
const { CheckableTag } = Tag;

const style = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  };

  const sharedOnCell = (_, index) => {
    return {};
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'q',
      width: 80,
      render: (text) => <a>{text}</a>,
      onCell: sharedOnCell,
    },
    {
      title: '案件名称',
      dataIndex: 'name',
      
      onCell: sharedOnCell,
    },
    {
      title: '承办人',
      dataIndex: 'q1',
      width: 200,
      onCell: sharedOnCell,
    },
    {
      title: '进度',
      dataIndex: 'q2',
      width: 80,
      onCell: sharedOnCell,
    },
    {
      title: '任务',
      dataIndex: 'q3',
      width: 160,
      onCell: sharedOnCell,
    },
    {
        title: '状态',
        dataIndex: 'q4',
        width: 150,
        onCell: sharedOnCell,
    },
    {
        title: '创建时间',
        dataIndex: 'q5',
        width: 150,
        onCell: sharedOnCell,
    },
    {
        title: '关注',
        dataIndex: 'q6',
        width: 80,
        onCell: sharedOnCell,
    },
  ];
  const data = [
    
  ];

class CaseView extends Component {
    componentDidMount = () => {
    }
    render() {
        const type = [""];

        return (
            <Fragment>
                {/*搜索板块 */}
                <PageHeader className="site-page-header" title="案件管理" subTitle="根据下列条件检索" extra={[
                    <Button key={nanoid()} size="large">新增案件</Button>,
                    <Search key={nanoid()} placeholder="请输入案件名称" allowClear enterButton="搜索" size="large" onSearch={null}/>]}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col flex="100px">案件类型</Col>
                            <Col flex="auto">:
                                <CheckableTag color="default" >全部</CheckableTag>
                                <CheckableTag color="default" >诉讼</CheckableTag>
                                <CheckableTag color="default"  checked={true}>仲裁</CheckableTag>
                                <CheckableTag color="default" >顾问</CheckableTag>
                                <CheckableTag color="default" >非诉</CheckableTag>
                                <CheckableTag color="default" >其他</CheckableTag>
                            </Col>
                        </Row>

                        <Row wrap={false}>
                            <Col flex="100px">客户名称</Col>
                            <Col flex="auto">:
                                <CheckableTag color="default" >全部</CheckableTag>
                                <CheckableTag color="default" >幸福地产</CheckableTag>
                                <CheckableTag color="default"  checked={true}>世贸国际</CheckableTag>
                                <CheckableTag color="default" >恒大地产</CheckableTag>
                                <CheckableTag color="default" >中国移动</CheckableTag>
                                <CheckableTag color="default" >中国电信</CheckableTag>
                                <CheckableTag color="default" >厦门国贸</CheckableTag>
                               
                            </Col>
                        </Row>

                        <Row wrap={false}>
                            <Col flex="100px">进度</Col>
                            <Col flex="auto">:
                                <CheckableTag color="default" >全部</CheckableTag>
                                <CheckableTag color="default" >开盘前</CheckableTag>
                                <CheckableTag color="default"  checked={true}>收集证据</CheckableTag>
                                <CheckableTag color="default" >结案</CheckableTag>
                            </Col>
                        </Row>

                        <Row wrap={false}>
                            <Col flex="100px">状态</Col>
                            <Col flex="auto">:
                                <CheckableTag color="default" >全部</CheckableTag>
                                <CheckableTag color="default" >进行中</CheckableTag>
                                <CheckableTag color="default"  checked={true}>已完结</CheckableTag>
                            </Col>
                        </Row>

                    </Space>
                </PageHeader>

                <Divider />

                <Table columns={columns} dataSource={data} bordered />
            </Fragment>
        );
    }
}
export default CaseView;