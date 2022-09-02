import React, {Component,Fragment} from 'react';
import { post } from 'utils/http'; 
import { List, message,Checkbox, Row, Col,Pagination } from 'antd';

class DSList extends Component {
    constructor(props) {
        super(props);
        this.state = { condition: props.condition,selectedRowKeys:[]}
    }
    static defaultProps = {
        condition: {},
        path: '',
        title:'name',
        key:'id',
        other:{},
        model:"",
        onChange:(items)=>{}
    }
    componentDidMount = () => {
        this.reload();
    }
    static getDerivedStateFromProps(props,state){
        if(props.condition !== state.condition) {
            return {condition:props.condition}
        }
        return null;
    }
    reload = async() => {
        const { path,key } = this.props;
        const { condition } = this.state;
        const params = new FormData();
        const conditionKeys = Object.keys(condition).map(e=>e);
        conditionKeys.forEach(e=>{
            params.append(e, condition[e]);
        });
        const response = await post(path, params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            const { results} = response;
            const selectedRowKeys = results.filter(e=>e.selected).map(e=>e[key]);
            this.setState(state => {
                state.dataSource = results;
                state.selectedRowKeys = selectedRowKeys;
                return state;
            });
        }
    }
    onChange=(item,e)=>{
        const {checked} = e.target;
        const {key,model} = this.props;
        this.setState(state=>{
            let selectedRowKeys = state.selectedRowKeys;
            if(model!==""){
                if(checked===true){
                    selectedRowKeys.push(item[key]);
                    selectedRowKeys = selectedRowKeys.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    selectedRowKeys = selectedRowKeys.filter(e=>{
                        return e!==item[key];
                    });
                }
            }else{
                selectedRowKeys = [];
                selectedRowKeys.push(item[key]);
            }
            state.selectedRowKeys = selectedRowKeys;
            return state;
        },()=>{
            const {selectedRowKeys} = this.state;
            this.props.onChange(item,selectedRowKeys);
            
        });
    }
    hasChecked=(item)=>{
        const {key}=this.props;
        const {selectedRowKeys} = this.state;
        return selectedRowKeys.includes(item[key]);;
    }
    renderItem=(item)=>{
        const {title}=this.props;
        return (
        <List.Item  style={{border:0}}>
            <Row wrap={false} style={{width:"100%"}}>
                <Col flex={"auto"}><span>{item[title]}</span></Col>
                <Col flex={"20px"}><Checkbox checked={this.hasChecked(item)} onChange={this.onChange.bind(this,item)}/></Col>
            </Row>
        </List.Item>);
    }
    render() {
        const { dataSource } = this.state;
        const {other} = this.props;
        return (
        <Fragment>
            <div style={{position:"relative",borderTop:"1px solid #f0f0f0",marginRight:"16px",padding:"12px 24px",height:"50px"}}>
                <Row wrap={false} style={{width:"100%"}}>
                    <Col flex={"auto"}><span>全部选项</span></Col>
                    <Col flex={"20px"}><Checkbox/></Col>
                </Row>
            </div>
            <div style={{padding:"0px 24px"}}>
                {React.cloneElement(<List size="small" dataSource={dataSource} renderItem={this.renderItem}/>,{...other})}
            </div>
            {/* <div style={{position:"relative",borderTop:"1px solid #f0f0f0",margin:"0px 24px",padding:"12px 24px",height:"50px"}}>
                <div style={{position:"absolute",right:0}}>
                    <Pagination simple defaultCurrent={1} total={50} />
                </div>
            </div> */}
        </Fragment>
        )
    }
}
export default DSList;