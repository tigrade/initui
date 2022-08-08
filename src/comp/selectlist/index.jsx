import React, {Component} from 'react';
import { post } from 'utils/http'; 
import { Table, message } from 'antd';

class DSSelectList extends Component {
    constructor(props) {
        super(props);
        this.state = { condition: props.condition}
    }
    static defaultProps = {
        columns: {},
        condition: {},
        path: '',
        id:'id',
        other:{},
        onChange:(keyList,items)=>{}
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
        const { path } = this.props;
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
            const selectedRowKeys = results.filter(e=>e.selected).map(e=>e.resourceId);
            this.setState(state => {
                state.dataSource = results;
                state.selectedRowKeys = selectedRowKeys;
                return state;
            });
        }
    }
    onChange=(selectedRowKeys, selectedRows)=>{
        this.setState(state => {
            state.selectedRowKeys = selectedRowKeys;
            return state;
        },()=>{
            this.props.onChange(selectedRowKeys,selectedRows);
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        });
    }
    render() {
        const { columns } = this.props;
        const { dataSource ,selectedRowKeys} = this.state;
        const {other} = this.props;
        const rowSelection={
            selectedRowKeys,
            onChange:this.onChange
        }
        return React.cloneElement(<Table columns={columns} dataSource={dataSource} rowSelection={rowSelection} bordered rowKey={this.props.id} />,{...other});
    }
}
export default DSSelectList;