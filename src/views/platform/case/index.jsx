import React,{DSID,DSBase,DSComponent,DSNavigate,Fragment} from 'comp/index';
import { Input, Button, PageHeader,Row,Col,Tag,Space,Table,Breadcrumb } from 'antd';
import './index.less';

// import DSNavigate from 'comp/nav/index';

const {Search} = Input;
const { CheckableTag } = Tag;

  const sharedOnCell = (_, index) => {
    return {};
  };

  

class CaseView extends DSComponent {
    constructor(props){
        super(props);
        this.state = {pageNo:1}
    }
    componentDidMount = () => {
    }
    onChangePagination=(current)=>{
        this.setState(state=>{
            state.pageNo = current;
            return state;
        });
    }
    render() {
        const {pageNo} = this.state
        
        const columns = [
            {
              title: '序号',
              dataIndex: 'seq',
              width: 70,
              render: (value, item, index) => (pageNo - 1) * 10 + index + 1,
            //   onCell: sharedOnCell,
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
            {id:1,name:"诉讼案件"}
          ];
        
        return (
            <Fragment>
                <Breadcrumb style={{margin: '16px 12px',}}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>案件管理</Breadcrumb.Item>
                    {/* <Breadcrumb.Item>新增案件</Breadcrumb.Item> */}
                </Breadcrumb>
                <div style={{padding: "0px 12px 12px",minHeight: 280,}} >
                    {/*搜索板块 */}
                    <PageHeader className="site-page-header" style={{background:"#ffff"}}>
                        <Row wrap={false} style={{paddingBottom: "16px"}}>
                            <Col flex="auto">
                                <Search key={DSID()} placeholder="请输入案件名称" allowClear enterButton="搜索" size="large" onSearch={null}/>
                            </Col>
                            <Col flex="160px" style={{paddingLeft: "16px"}}>
                                <DSNavigate key={DSID()} url={DSBase.list.P_NewCaseView.path} element={<Button key={DSID()} size="large">新增案件</Button>}/>
                            </Col>
                        </Row>

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

                    <div style={{marginTop:8,padding: "8px 12px 24px",background:"#ffff"}} >
                        <Table columns={columns} dataSource={data} bordered pagination={{onChange:this.onChangePagination}} rowKey={record => DSID()}/>
                    </div>
                    
                    
                </div>
                
            </Fragment>
        );
    }
}
export default CaseView;