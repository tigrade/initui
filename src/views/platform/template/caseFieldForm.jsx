import React,{DSComponent,Fragment,post} from 'comp/index';
import './index.less'

import { Form,Input,InputNumber,Modal,Select,message,Button,Radio,Row,Col,Divider} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

class CaseFieldFormView extends DSComponent{   
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {dialog:false,formData:props.formData,showData:false,groupSource:[]};
    }
    static defaultProps = {
        formData:{id:"",name:"",required:"false",inputType:"TEXT",data:[{name:""},{name:""}],serialNumber:"1"},
        caseType:{id:'',name:''},
        formType:{add:{name:"新增字段",code:"1"},update:{name:"修改字段",code:"2"}},
        reloadTable:()=>{}
    }
    componentDidMount=async ()=>{
        // await this.loadFieldGroupSource();
    }
    loadFieldGroupSource=async(caseType)=>{
        // const {caseType} = this.props;
        const params = new FormData();
        params.append('caseTypeId', caseType.id);
        const response = await post('/api/caseFieldGroup/list',params).catch(error => {
            message.error(error.message);
        });
        if(response){
            if(response.results){
                this.setState(state=>{
                    state.groupSource = response.results;
                    return state;
                });
            }
        }
    }
    onEditor=async (_caseType,item)=>{
        const type = item===undefined?"1":"2";
        const {formType,caseType} = this.props;
        await this.loadFieldGroupSource(caseType);
        this.setState(state=>{
            state.dialog = true;
            state.formStatus = type;
            state.caseTypeId = caseType.id;
            if(type===formType.add.code){
                state.showData = false;
                state.dialogTitle = `【${caseType.name}】${formType.add.name}`;
            }
            if(type===formType.update.code){
                const inputType = item.type;
                state.showData = (inputType==="MULTIPLE_CHOICE"||inputType==="RADIO")?true:false;
                state.dialogTitle =`【${caseType.name}】${formType.update.name}`; 
            }
            return state;
        },()=>{
            if(type===formType.add.code){
                const {formData} = this.props;
                this.formRef.current.setFieldsValue(formData);
            }
            if(type===formType.update.code){
                this.formRef.current.setFieldsValue(Object.assign({inputType:item.type},item));
            }
        });
    }
    onCannel=()=>{
        this.setState(state=>{
            state.dialog = false;
            state.formData = null;
            return state;
        });
    }
    onFieldsChange=(f,i)=>{
        const fieldName = f[0].name[0];
        const fieldValue = f[0].value;
        if(fieldName==="inputType"){
            this.setState(state=>{
                state.showData = (fieldValue==="MULTIPLE_CHOICE"||fieldValue==="RADIO")?true:false;
                return state;
            });
        }
    }
    onSaveOrUpdate=async(e)=>{
        const {id,name,serialNumber,inputType,required,data,caseFieldGroupId} = e;
        const {formStatus,caseTypeId} = this.state;
        let path = "/api/caseField/save";
        let content = {caseTypeId:caseTypeId};
        if(formStatus===this.props.formType.add.code){
            content = Object.assign(content,{name:name,type:inputType,serialNumber:serialNumber,required:required,caseFieldGroupId:caseFieldGroupId});
        }
        if(formStatus===this.props.formType.update.code){
            path = "/api/caseField/modify";
            content = Object.assign(content,{id:id,name:name,type:inputType,serialNumber:serialNumber,required:required,caseFieldGroupId:caseFieldGroupId});
        }
        if(inputType==="MULTIPLE_CHOICE"||inputType==="RADIO"){
            content = Object.assign(content,{data:data});
        }
        const params = new FormData();
        params.append("content", JSON.stringify(content));
        const response = await post(path,params).catch(error => {
            message.error(error.message);
        });
        if(response){
            message.success(response.message);
        }
        this.setState(state=>{
            state.dialog = false;
            state.formData = null;
            return state;
        },()=>{
            this.props.reloadTable();
        });
    }
    render(){
        const {dialog,formData,dialogTitle,showData,groupSource} = this.state;
        return (
        <Fragment>
            <Modal
                title={dialogTitle}
                visible={dialog}
                okButtonProps={{htmlType: 'submit', form: '_form'}}
                onCancel={this.onCannel}
                okText="确认"
                cancelText="取消">
                <Form id="_form" layout="vertical" onFieldsChange={this.onFieldsChange} ref={this.formRef} initialValues={formData} onFinish={this.onSaveOrUpdate}>
                    <Form.Item name="id" label="编号" noStyle hidden={true}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '名称不能为空' }]}>
                        <Input placeholder=""  autoComplete="off"/>
                    </Form.Item>
                    {/* <Form.Item name='required' label="是否必填" rules={[{ required: true, message: '输入类型不能为空' }]}>
                        <Radio.Group>
                            <Radio value={true}>必填</Radio>
                            <Radio value={false}>选填</Radio>
                        </Radio.Group>
                    </Form.Item> */}
                    <Form.Item name="caseFieldGroupId" label="分组">
                        <Select>
                            {groupSource.map(e=>{
                                return <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="serialNumber" label="排序" rules={[{ required: true, message: '排序不能为空' }]}>
                        <InputNumber placeholder=""  autoComplete="off" style={{ width: '100%' }}/>
                    </Form.Item>
                    <Form.Item name='inputType' label="输入类型" rules={[{ required: true, message: '输入类型不能为空' }]}>
                        <Select>
                            <Select.Option value="RADIO">单选</Select.Option>
                            <Select.Option value="MULTIPLE_CHOICE">多选</Select.Option>
                            <Select.Option value="TEXT">文本</Select.Option>
                            <Select.Option value="DATE">日期</Select.Option>
                            <Select.Option value="DATE_TIME">日期时间</Select.Option>
                        </Select>
                    </Form.Item>
                    {showData&&
                    <Divider>选择数据项</Divider>}
                    {showData&&
                    <Form.List name="data">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => {
                                return (
                                    <Row align="top" key={index}>
                                        <Col flex="auto">
                                        <Form.Item {...field} name={[field.name,"name"]} rules={[{ required: true, message: "数据不能为空" }]}>
                                            <Input placeholder="请输入数据" style={{with:"60%"}}/>
                                        </Form.Item>
                                        </Col>
                                        <Col flex="50px" style={{paddingLeft:"12px",paddingTop:"6px"}}><MinusCircleOutlined onClick={() => remove(index)} /></Col>
                                    </Row>
                                );
                            })}
                            <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加数据</Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                    }
                </Form>
            </Modal>
        </Fragment>
        );
    }
}
export default CaseFieldFormView;



