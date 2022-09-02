import React, {Component} from 'react';
import { post } from 'utils/http'; 
import { Table, message } from 'antd';

class DSTable extends Component {
    constructor(props) {
        super(props);
        this.state = { searchCondition: props.searchCondition, pagination: { current: 1, pageSize: 10, onChange: this.onPagination }}
    }
    static defaultProps = {
        columns: {},
        searchCondition: {},
        path: '',
        id:'id',
        pageable:true,
        other:{}

    }
    componentDidMount = () => {
        this.reload();
    }
    static getDerivedStateFromProps(props,state){
        if(props.searchCondition !== state.searchCondition) {
            return {searchCondition:props.searchCondition}
        }
        return null;
    }
    reload = async() => {
        const {pageable} = this.props;
        if(pageable===true){
            this.onPageableHandle();
        }else{
            this.onUnPageableHandle();
        }
        
    }
    onUnPageableHandle = async()=>{
        const { path } = this.props;
        if(path===''){message.error('路径未设置');return;}
        const { searchCondition } = this.state;
        const params = new FormData();
        if (searchCondition) {
            const conditionKeys = Object.keys(searchCondition).map(e=>e);
            conditionKeys.forEach(e=>{
                params.append(e, searchCondition[e]);
            });
        }
        const response = await post(path, params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            const { results} = response;
            this.setState(state => {
                state.dataSource = results;
                return state;
            });
        }
    }
    onPageableHandle = async($pageNo)=>{
        const _pageNo = $pageNo===undefined?1:$pageNo;
        const { path } = this.props;
        if(path===''){message.error('路径未设置');return;}
        const { pagination, searchCondition } = this.state;
        const params = new FormData();
        params.append('pageNo', _pageNo);
        params.append('pageSize', pagination.pageSize);
        if (searchCondition) {
            params.append('content', JSON.stringify(searchCondition));
        }
        const response = await post(path, params).catch(error => {
            message.error(error.message);
        });
        if (response) {
            const { results, pageNo, pageSize, total } = response;
            this.setState(state => {
                state.dataSource = results;
                const pagination = Object.assign({}, state.pagination, { pageSize: pageSize, total: total, current: pageNo });
                state.pagination = pagination;
                return state;
            });
        }
    }
    onPagination = (pageNo) => {
        this.onPageableHandle(pageNo);
    }
    render() {
        const { columns,pageable,other } = this.props;
        let _props = {};
        if(pageable===true){
            const { dataSource, pagination } = this.state;
            const temp = [{title: '序号',ellipsis: true,dataIndex: 'seq',fixed: 'left',width: 70 ,render: (value, item, index) => (pagination.current - 1) * 10 + index + 1}];
            const _columns = temp.concat(columns);
            _props = {columns:_columns,dataSource:dataSource,pagination:pagination,rowKey:this.props.id}
        }else{
            const { dataSource } = this.state;
            const temp = [{title: '序号',fixed: 'left',dataIndex: 'seq',width: 70 ,render: (value, item, index) => index + 1}];
            const _columns = temp.concat(columns);
            _props = {columns:_columns,dataSource:dataSource,rowKey:this.props.id,pagination:false}
        }
        return React.cloneElement(<Table {..._props} bordered/>,{...other});
        // return React.cloneElement(<Table columns={_columns} dataSource={dataSource} pagination={pagination} bordered rowKey={this.props.id}/>,{...other});
    }
}
export default DSTable;