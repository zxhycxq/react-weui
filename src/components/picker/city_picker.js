import React from 'react';
import PropTypes from 'prop-types';
import Picker from './picker';

/**
 *  建立在 picker基础上的日期picker
 *
 */
let daysArr = [
    {
        "name":"1日",
        "code":"210101"
    },
    {
        "name":"2日",
        "code":"210102"
    },
    {
        "name":"3日",
        "code":"210103"
    },
    {
        "name":"4日",
        "code":"210104"
    },
    {
        "name":"5日",
        "code":"210114"
    }
];
class CityPicker extends React.Component {

    static propTypes = {
        /**
         * Array of item trees, consists property for label and subitems
         */
        data: PropTypes.array.isRequired,
        /**
         * keys for data provide, `id` to indicate property name for label, `items` to indicate property name for subitems
         */
        dataMap: PropTypes.object,
        selected: PropTypes.array,// 当前选中的 item
        show: PropTypes.bool,   // 组件显示
        lang: PropTypes.object,     // language object consists of `leftBtn` and `rightBtn`
    }

    static defaultProps = {
        data: [],
        dataMap: { id: 'name', items: 'sub' },
        selected: [],
        show: false,
        lang: { leftBtn: '取消', rightBtn: '确定' }
    }

    constructor(props){
        super(props);
        const { data, selected, dataMap } = this.props;
        // console.log('%c--初始化加载数据-- ', 'color:blue;', data, selected, dataMap);
        const { groups, newselected } = this.parseData(data, dataMap.items, selected);
        console.log('%c--groups, newselected -- ', 'color:blue;', groups, newselected );
        this.state = {
            groups,
            selected: newselected,
            picker_show: false,
            text: ''
        };
        this.updateGroup = this.updateGroup.bind(this);
        this.parseData = this.parseData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //@return array of group with options
    parseData(data, subKey, selected = [], group = [], newselected = []){
        // console.log('%c--2parseData-- ', 'color:red;', data, subKey, selected, group , newselected);
      let _selected = 0;
      if ( Array.isArray(selected) && selected.length > 0){
        let _selectedClone = selected.slice(0);
        _selected = _selectedClone.shift();
        selected = _selectedClone;
      }
       console.log('%c--selected-- ', 'color:cyan;', selected,_selected,data[_selected]);
      if (typeof data[_selected] === 'undefined'){
          _selected = 0;
      }

      newselected.push(_selected);
      
        let item = data[_selected];
      console.log('%c--data-- ', 'color:orange;', data,item);
      var _group = JSON.parse(JSON.stringify(data));
      _group.forEach(g=>delete g[subKey]);
      console.log('%c--_group-- ', 'color:red;', _group);
      group.push({
          // items: data[_selected].name.includes('日')?finalDay:_group,
          items: _group,
          mapKeys: { 'label': this.props.dataMap.id }
      });
        console.log('%c--[[group]]-- ', 'color:blue;',group,);
      if (typeof item[subKey] !== 'undefined' && Array.isArray(item[subKey])){
        return this.parseData(item[subKey], subKey, selected, group, newselected);
      } else {
        return { groups: group, newselected };
      }
    }
    //
    updateDataBySelected(selected, cb){
        const { data, dataMap } = this.props;
        //validate if item exists

        const { groups, newselected } = this.parseData(data, dataMap.items, selected);

        let text = '';
        try {
            groups.forEach( (group, _i) => {
                text += `${group['items'][selected[_i]][dataMap.id]} `;
            });
        } catch (err){ //wait
            text = this.state.text;
        }
        console.log('%c--updateDataBySelected-- ', 'color:orange;', groups, text,newselected);
        this.setState({
            groups,
            text,
            selected: newselected
        }, ()=>cb());
    }
    //
    updateGroup(item, i, groupIndex, selected, picker){
        console.log('%c--picker.props-- ', 'color:blue;', picker.props);
        let oldGroup =picker.props.groups.slice(0,2);
        let finalDay = item.name=='2 月'? daysArr.slice(0,2):daysArr.slice(0,5);
        this.updateDataBySelected(selected, ()=>{
            console.log('%c--组改变触发的-- ', 'color:red;',item,  groupIndex, selected, picker,finalDay);
            let newPicker ={};
            picker.setState({
                selected: this.state.selected,
                groups:oldGroup.concat(finalDay)
            });
        });
    }
    // 选中的索引
    handleChange(selected){
        console.log('%c--选中的索引-- ', 'color:blue;', selected);
        //handle unchange
        if (selected === this.state.selected){
            this.updateDataBySelected(selected, ()=>{
                if (this.props.onChange) this.props.onChange(this.state.text);
            });
        }

        if (this.props.onChange) this.props.onChange(this.state.text);
    }

    render(){
        let { selected,groups } = this.state;
        let { onCancel,show,lang } = this.props;
        return (
            <Picker
                show={show}
                onGroupChange={this.updateGroup}
                onChange={this.handleChange}
                defaultSelect={selected}
                groups={groups}
                onCancel={onCancel}
                lang={lang}
            />
        );
    }
}

export default CityPicker;
