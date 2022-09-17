import React,{DSComponent,Fragment,DSTreeSelect,post} from 'comp/index';
import moment from 'moment';
import './index.less'

import { Row,Col,Modal,message, Button,Form,Input,Select,Radio,Popconfirm,Empty,Tree,DatePicker,Divider} from 'antd';

class ItemFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.editForm = null;
        this.state = {dialog:false,dataSource:[],selectedKeys:[],formType:1,schemaFields:[],caseItem:{}};
    }
    static defaultProps = {
        reloadTable:()=>{}
    }
    componentDidMount = () => {
        this.loadCaseItemList();
    }
    loadCaseItemList=async()=>{
        const {lawCase} = this.props;
        const _params = new FormData();
        _params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseItem/list',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            if(Array.isArray(results)){
                const dataSource = results.map(e=>{
                    return {title:e.title,key:e.id,isLeaf:true};
                });
                this.setState(state=>{
                    state.dataSource = dataSource;
                    return state;
                });
            }
        }
    }
    onEditor=(item)=>{
        this.setState(state=>{
            state.dialog = true;
            state.dialogTitle = "程序设置";
            return state;
        },()=>{
            this.loadMemberList();
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            return state;
        },()=>{
            this.props.reloadTable();
        });
    }
    loadMemberList=async()=>{
        const {lawCase} = this.props;
        const _params = new FormData();
        _params.append('lawCaseId', lawCase.id);
        const response = await post('/api/lawCaseMember/list',_params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                state.memberSourceList = (results===null||results===undefined)?[]:results;
                return state;
            });
        }
    }
    onSelectNode=async(keys,node)=>{
        if(node.selected===true){
            this.setState(state=>{
                state.formType = 2;
                state.caseItem = node.node;
                state.selectedKeys = keys;
                return state;
            },async()=>{
                const params = new FormData();
                params.append('id', keys[0]);
                const response = await post('/api/lawCaseItem//find/one',params).catch(error => {
                    message.error(error.message);
                });
                if(response){
                    const {results} = response;
                    const {schemaFields,positionList,caseTypeId} = results;
                    await this.loadSchemaFields({id:caseTypeId});
                    const positionSourceValue = positionList.reduce((group, item) => {
                        const { positionType } = item;
                        group[positionType] = group[positionType] ?? [];
                        group[positionType].push(item);
                        return group;
                    }, {});
                    const dynamicFieldValueList = schemaFields.map(f=>{
                        const v = {};
                        let vv = f.storeValue;
                        if(f.type==="DATE"&&vv!==undefined&&vv!==null){
                            vv = moment(vv);
                        }
                        if(f.type==="DATE_TIME"&&vv!==undefined&&vv!==null){
                            vv = moment(vv);
                        }
                        if(f.type==="MULTIPLE_CHOICE"){
                            vv = vv.split(",");
                        }
                        if(vv===null){
                            vv = undefined;
                        }
                        v[f.id] = vv;
                        return v;
                    }).reduce((json, value) => {
                        json = Object.assign({},json,value); 
                        return json;
                    }, {});
                    const {BRANCH,MASTER} = positionSourceValue;
                    const {caseItem} = this.state;
                    let dataForm = Object.assign({},dynamicFieldValueList,{id:caseItem.key});
                    if(BRANCH!==undefined&&BRANCH.length>0){
                        const b = BRANCH.map(i=>{
                            return i.caseMemberId;
                        });
                        dataForm = Object.assign({},dataForm,{branch:b});
                    }
                    if(MASTER!==undefined&&MASTER.length>0){
                        const m = MASTER.map(i=>{
                            return i.caseMemberId;
                        });
                        dataForm = Object.assign({},dataForm,{master:m});
                    }
                    this.formRef.current.setFieldsValue(dataForm);
                }
            });
        }else{
            this.setState(state=>{
                state.formType = 1;
                state.caseItem = {};
                state.selectedKeys = keys;
                state.schemaFields =  [];
                return state;
            },()=>{
                this.formRef.current.resetFields();
            });
        }
        
    }
    editformRef=(element)=>{
        this.editForm = element;
    }
    onDeleteNode=async()=>{
        const {caseItem} = this.state;
        const params = new FormData();
        let path = '/api/lawCaseItem/delete';
        params.append('id', caseItem.key);
        const response = await post(path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            this.setState(state=>{
                state.formType = 1;
                state.caseItem = {};
                state.selectedKeys = [];
                state.schemaFields =  [];
                return state;
            },()=>{
                this.formRef.current.resetFields();
                message.success(response.message);
                this.loadCaseItemList();
            });
        }
    }
    onSaveOrUpdate=async(e)=>{
        const {lawCase} = this.props;
        const {id,master,branch,caseTypeId} = e;
        let positionList=[];
        if(master!==undefined&&master.length>0){
            const _master = master.map(i=>{
                return {caseMemberId:i,positionType:"MASTER"};
            });
            positionList = positionList.concat(_master);
        }
        if(branch!==undefined&&branch.length>0){
            const _branch = branch.map(i=>{
                return {caseMemberId:i,positionType:"BRANCH"};
            });
            positionList = positionList.concat(_branch);
        }
        const {schemaFields,formType} = this.state;
        let schemaFieldsValue = [];
        if(schemaFields.length>0){
            schemaFieldsValue = schemaFields.map(item=>{
                let  fieldValue = e[item.id];
                if(Array.isArray(fieldValue)){
                    if(fieldValue.length>0){
                        fieldValue = fieldValue.join(',');
                    }else{
                        fieldValue = undefined;
                    }
                }
                return Object.assign({id:item.id,name:item.name,storeValue:fieldValue});
            });
        }
        const params = new FormData();
        let path = '/api/lawCaseItem/save';
        if(formType===2){
            path = '/api/lawCaseItem/modify';
            const content = {id:id,schemaFields:schemaFieldsValue,positionList:positionList}
            params.append('content', JSON.stringify(content));
        }else{
            const content = {caseTypeId:caseTypeId.id,lawCaseId:lawCase.id,schemaFields:schemaFieldsValue,positionList:positionList}
            params.append('content', JSON.stringify(content));
        }
        const response = await post(path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            this.setState(state=>{
                state.formType = 1;
                state.caseItem = {};
                state.selectedKeys = [];
                state.schemaFields =  [];
                return state;
            },()=>{
                this.formRef.current.resetFields();
                message.success(response.message);
                this.loadCaseItemList();
            });
        }
    }
    onFieldsChange=async (f,i)=>{
        if(f.length===1){
            const fieldName = f[0].name[0];
            const fieldValue = f[0].value;
            if(fieldName==='caseTypeId'&&Object.keys(fieldValue).length>0){
                await this.loadSchemaFields(fieldValue);
            }
        }
        
    }
    loadSchemaFields=async(value)=>{
        const params = new FormData();
        params.append('caseTypeId', value.id);
        const response = await post('/api/caseField/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            const {results} = response;
            this.setState(state=>{
                if(results==null){
                    state.schemaFields = [];
                }else{
                    state.schemaFields = results;
                }
                return state;
            });
        }
    }
    dynamicFormRender=()=>{
        const {schemaFields,memberSourceList} = this.state;
        if(schemaFields.length>0){
            const groupSourceKey = schemaFields.filter((item, pos, self) => self.findIndex(v => v.caseFieldGroupName === item.caseFieldGroupName) === pos).map(item=>{
                const { caseFieldGroupName,caseFieldGroupSort} = item;
                return {name:caseFieldGroupName,key:caseFieldGroupSort===null?-1:caseFieldGroupSort};
            }).sort((a, b) => a.key - b.key);
            const groupSourceValue = schemaFields.reduce((group, item) => {
                const { caseFieldGroupName } = item;
                group[caseFieldGroupName] = group[caseFieldGroupName] ?? [];
                group[caseFieldGroupName].push(item);
                return group;
              }, {});
            return groupSourceKey.map((item,index)=>{
                const data = groupSourceValue[item.name];
                if(index===0){
                    return (
                    <Row gutter={24}  key={index}>
                        <Col span={8}>
                            <Form.Item name="master" label="主办" rules={[{ required: true, message: '主办不能为空' }]}>
                            <Select mode='multiple'>
                                {memberSourceList.map(e=>{
                                    return <Select.Option value={e.id} key={e.id}>{e.memberAlias}</Select.Option>
                                })}
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                        <Form.Item name="branch" label="辅办">
                        <Select mode='multiple'>
                            {memberSourceList.map(e=>{
                                return <Select.Option value={e.id} key={e.id}>{e.memberAlias}</Select.Option>
                            })}
                        </Select>
                        </Form.Item>
                        </Col>
                    {data.length>0&&
                        data.sort((a, b) => a.serialNumber - b.serialNumber).map(e=>{
                            return (
                            <Col span={8} key={e.id}>
                                {e.type==='TEXT'&&
                                <Form.Item name={`${e.id}`} label={e.name}>
                                    <Input placeholder="" autoComplete="off"/>
                                </Form.Item>
                                }
                                {e.type==='RADIO'&&
                                <Form.Item name={`${e.id}`} label={e.name}>
                                    <Select>
                                        {e.data.map((d,i)=>{
                                            return (
                                                <Select.Option key={i} value={d.name}>{d.name}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                                }
                                {e.type==='MULTIPLE_CHOICE'&&
                                <Form.Item name={`${e.id}`} label={e.name}>
                                    <Select mode="multiple">
                                        {e.data.map((d,i)=>{
                                            return (
                                                <Select.Option key={i} value={d.name}>{d.name}</Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                                }
                                {e.type==='DATE'&&
                                <Form.Item name={`${e.id}`} label={e.name}>
                                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/>
                                </Form.Item>
                                }
                                {e.type==='DATE_TIME'&&
                                <Form.Item name={`${e.id}`} label={e.name}>
                                    <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                                }
                            </Col>
                            )
                        })
                    }
                    </Row>
                    );
                }else{
                    return (
                    <Fragment key={index}>
                        <Divider plain>{item.name}</Divider>
                        <Row gutter={24} key={index}>
                        {data.length>0&&
                            data.sort((a, b) => a.serialNumber - b.serialNumber).map(e=>{
                                return (
                                <Col span={8} key={e.id}>
                                    {e.type==='TEXT'&&
                                    <Form.Item name={`${e.id}`} label={e.name}>
                                        <Input placeholder="" autoComplete="off"/>
                                    </Form.Item>
                                    }
                                    {e.type==='RADIO'&&
                                    <Form.Item name={`${e.id}`} label={e.name}>
                                        <Select>
                                            {e.data.map((d,i)=>{
                                                return (
                                                    <Select.Option key={i} value={d.name}>{d.name}</Select.Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                    }
                                    {e.type==='MULTIPLE_CHOICE'&&
                                    <Form.Item name={`${e.id}`} label={e.name}>
                                        <Select mode="multiple">
                                            {e.data.map((d,i)=>{
                                                return (
                                                    <Select.Option key={i} value={d.name}>{d.name}</Select.Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                    }
                                    {e.type==='DATE'&&
                                    <Form.Item name={`${e.id}`} label={e.name}>
                                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/>
                                    </Form.Item>
                                    }
                                    {e.type==='DATE_TIME'&&
                                    <Form.Item name={`${e.id}`} label={e.name}>
                                        <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss"/>
                                    </Form.Item>
                                    }
                                </Col>
                                )
                            })
                        }
                        </Row>
                    </Fragment>
                    );
                }
            });
        }
        
    }
    render(){
        const {dialog,dialogTitle,formType,dataSource,selectedKeys,schemaFields,caseItem} = this.state;
        const {lawCase} = this.props;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                width={1200}
                bodyStyle={{overflowY:"auto",padding:0}}
                onCancel={this.onCannel}
                footer={null}>
                <div className='menu-modal'>
                <Row wrap={false}>
                    <Col flex="150px">
                        <div style={{overflowY:"auto",maxHeight:600,padding:"20px 0px"}}>
                        {dataSource.length<=0&&<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        {dataSource.length>0&&
                        <Tree 
                        selectable={true} 
                        onSelect={this.onSelectNode} 
                        selectedKeys={selectedKeys}
                        treeData={dataSource}
                        />
                        }
                        </div>
                    </Col>
                    <Col flex="auto">
                        <Radio.Group value={formType}>
                            <Radio value={1} disabled={formType!==1}>新增</Radio>
                            <Radio value={2} disabled={formType!==2&&formType!==4}>编辑</Radio>
                            <Popconfirm
                                placement="bottom" 
                                title={`确认删除【${caseItem.title}】`}
                                onConfirm={this.onDeleteNode}
                                okText={"确认"}
                                cancelText={"取消"}>
                            <Radio value={3} disabled={formType!==2&&formType!==4}>删除</Radio>
                            </Popconfirm>
                        </Radio.Group>
                        
                        <div style={{marginTop:"12px"}}>
                        <Form layout="vertical" ref={this.formRef}  onFieldsChange={this.onFieldsChange} onFinish={this.onSaveOrUpdate}>
                            <Form.Item name="id" label="编号" noStyle hidden={true}>
                                <Input placeholder="" autoComplete="off"/>
                            </Form.Item>
                            {formType===1&&
                            <Row>
                            <Col span={24}>
                            <Form.Item name="caseTypeId" label="类型" rules={[{ required: true, message: '类型不能为空' }]}>
                                <DSTreeSelect defaultDataSource={[{value:lawCase.caseTypeId,title:lawCase.caseTypeName,isLeaf:lawCase.caseTypeLeaf}]} vaildLeaf={true} condition={{caseTypeId:lawCase.caseTypeId,teamId:lawCase.teamId}} path='/api/caseType/list' code={{title:'name',value:'id',isLeaf:'isLeaf',pId:"caseTypeId"}}></DSTreeSelect>
                            </Form.Item>
                            </Col>
                            </Row>
                            }
                            {schemaFields.length>0&&this.dynamicFormRender()}
                            <Divider />
                            <Row>
                                <Col flex={"auto"}></Col>
                                <Col width="80">
                                <Form.Item>
                                {formType===1&&<Button type="primary" htmlType="submit" size="large">新增</Button>}
                                {formType===2&&<Button type="primary" htmlType="submit" size="large">更新</Button>}
                                </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        </div>
                    </Col>
                </Row>
                </div>
            </Modal>
        </Fragment>
        );
    }
}
export default ItemFormView;