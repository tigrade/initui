import React, {Component,Fragment} from 'react';
import { post } from 'utils/http'; 
import { List, message,Checkbox, Row, Col,Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.less'

class DSList extends Component {
    constructor(props) {
        super(props);
        this.state = { condition: props.condition,selectedRowKeys:[],selectedAll:false,dataSource:[],pageNo:props.pageNo,pageSize:props.pageSize}
    }
    static defaultProps = {
        pageNo:1,
        pageSize:10,
        condition: {},
        path: '',
        title:'name',
        key:'id',
        other:{},
        filter:[],
        mode:"single",//multiple||single
        onChange:(items)=>{}
    }
    componentDidMount = () => {
        this.onDataLoading();
    }
    static getDerivedStateFromProps(props,state){
        if(props.condition !== state.condition) {
            return {condition:props.condition}
        }
        return null;
    }
    onDataLoading=async()=>{
        const { path,key,filter } = this.props;
        const {condition,pageNo,pageSize} = this.state;
        const params = new FormData();
        params.append('pageNo', pageNo);
        params.append('pageSize', pageSize);
        if (condition) {
            params.append('content', JSON.stringify(condition));
        }
        const response = await post(path, params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            const { results,pageNo,pageSize,total} = response;
            const selectedRowKeys = results.filter(e=>e.selected).map(e=>e[key]);
            this.setState(state => {
                state.dataSource = state.dataSource.concat(results.filter(e=>{
                    return filter.includes(e.id)?false:true;
                }));
                state.selectedRowKeys = state.selectedRowKeys.concat(selectedRowKeys);
                state.pageNo = pageNo;
                state.pageSize = pageSize;
                state.total = total;
                return state;
            });
        }
        return null;
    }
    onChange=(item,e)=>{
        const {checked} = e.target;
        const {key,mode} = this.props;
        this.setState(state=>{
            let selectedRowKeys = state.selectedRowKeys;
            if(mode==="multiple"){
                if(checked===true){
                    selectedRowKeys.push(item[key]);
                    selectedRowKeys = selectedRowKeys.filter((item, pos, self) => self.findIndex(v => v === item) === pos);
                }else{
                    selectedRowKeys = selectedRowKeys.filter(e=>{
                        return e!==item[key];
                    });
                }
            }else{
                if(checked===true){
                    selectedRowKeys.push(item[key]);
                }else{
                    selectedRowKeys = [];
                }
            }
            state.selectedRowKeys = selectedRowKeys;
            const groupSourceValue = state.dataSource.reduce((group, item) => {
                const groupName  = selectedRowKeys.includes(item[key])===true?"selected":"unselected";
                group[groupName] = group[groupName] ?? [];
                group[groupName].push(item);
                return group;
            }, {});
            const {selected,unselected} = groupSourceValue;
            let data = [];
            if(selected)data = data.concat(selected);
            if(unselected)data = data.concat(unselected);
            state.dataSource = data;//state.dataSource.sort((a,b)=>selectedRowKeys.includes(b[key])?1:-1);
            return state;
        },()=>{
            const {selectedRowKeys,selectedAll} = this.state;
            //一个时候，全部
            if(selectedAll===true){
                this.props.onChange(['ALL'],item);  
            }else{
                this.props.onChange(selectedRowKeys,item);
            }
        });
    }
    hasChecked=(item)=>{
        const {key}=this.props;
        const {selectedRowKeys,selectedAll} = this.state;
        if(selectedAll===true){
            return true;
        }
        return selectedRowKeys.includes(item[key]);
    }
    renderItem=(item)=>{
        const {title}=this.props;
        return (
        <List.Item>
            <Row wrap={false} style={{width:"100%"}}>
                <Col flex={"auto"}><span>{item[title]}</span></Col>
                <Col flex={"26px"} style={{paddingLeft:"6px"}}><Checkbox checked={this.hasChecked(item)} onChange={this.onChange.bind(this,item)}/></Col>
            </Row>
        </List.Item>);
    }
    onAllChange=(e)=>{
        const {checked} = e.target;
        this.setState(state => {
            state.selectedAll = checked;
            return state;
        });
    }
    onNextLoading=()=>{
        this.setState(state => {
            state.pageNo = state.pageNo+1;
            return state;
        },()=>{
            this.onDataLoading();
        });
    }
    render() {
        const { dataSource,total ,selectedAll} = this.state;
        const {other,mode} = this.props;
        return (
        <Fragment>
            {mode==="multiple"&&
            <div style={{position:"relative",margin:"0px 24px",padding:"12px 16px 6px 6px",borderBottom:"1px solid #f0f0f0"}}>
                <Row wrap={false} style={{width:"100%"}}>
                    <Col flex={"auto"}><span>全选</span></Col>
                    <Col flex={"20px"}>
                        <Checkbox checked={selectedAll} onChange={this.onAllChange}/>
                    </Col>
                </Row>
            </div>
            }
            <div id="scrollableDiv" style={{height: 250,overflow: 'auto',padding:"0px 24px"}}>
            <InfiniteScroll
                dataLength={dataSource.length}
                next={this.onNextLoading}
                hasMore={dataSource.length < total}
                loader={<Spin />}
                // endMessage={<Divider/>}
                scrollableTarget="scrollableDiv"
            >
                {React.cloneElement(<List size="small" dataSource={dataSource} renderItem={this.renderItem}/>,{...other})}
            </InfiniteScroll>
            </div>
        </Fragment>
        )
    }
}
export default DSList;