import React, {Component} from 'react';
import { post } from 'utils/http'; 
import { List, message,Checkbox } from 'antd';

class DSList extends Component {
    constructor(props) {
        super(props);
        this.state = { condition: props.condition}
    }
    static defaultProps = {
        condition: {},
        path: '',
        title:'name',

        other:{},
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
    onChange=(item)=>{
        this.props.onChange(item);
    }
    renderItem=(item)=>{
        const {title}=this.props;
        return (
        <List.Item>
            <Checkbox checked={item.selected} onChange={this.onChange.bind(this,item)}>{item[title]}</Checkbox>
        </List.Item>);
    }
    render() {
        const { dataSource } = this.state;
        const {other} = this.props;
        return React.cloneElement(
        <List size="small" dataSource={dataSource} renderItem={this.renderItem}/>,{...other});
    }
}
export default DSList;