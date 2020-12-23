import React from 'react';
import PropTypes from 'prop-types';
import Picker from './picker';

/**
 *  建立在 picker基础上的date picker
 */
class CityPicker extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired, // Array of item trees, consists property for label and subitems
        /**
         * keys for data provide, `id` to indicate property name for label, `items` to indicate property name for subitems
         */
        dataMap: PropTypes.object,
        selected: PropTypes.array,   // 当前选中的 item
        show: PropTypes.bool,        // 组件显示
        lang: PropTypes.object,      // language object consists of `leftBtn` and `rightBtn`
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
        const { groups, newselected } = this.parseData(data, dataMap.items, selected);
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
      let _selected = 0;
      if ( Array.isArray(selected) && selected.length > 0){
        let _selectedClone = selected.slice(0);
        _selected = _selectedClone.shift();
        selected = _selectedClone;
      }
      if (typeof data[_selected] === 'undefined'){
          _selected = 0;
      }

      newselected.push(_selected);
      
      let item = data[_selected];
      var _group = JSON.parse(JSON.stringify(data));
      _group.forEach(g=>delete g[subKey]);
      group.push({
          items: _group,
          mapKeys: { 'label': this.props.dataMap.id }
      });
      if (typeof item[subKey] !== 'undefined' && Array.isArray(item[subKey])){  // 递归
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
                text += `${group['items'][selected[_i]][this.props.dataMap.id]} `;
            });
        } catch (err){ //wait
            text = this.state.text;
        }
        this.setState({
            groups,
            text,
            selected: newselected
        }, ()=>cb());
    }
    //
    updateGroup(item, i, groupIndex, selected, picker){
        this.updateDataBySelected(selected, ()=>{
            //update picker
            picker.setState({
                selected: this.state.selected
            });
        });
    }
    // 选中的索引
    handleChange(selected){
        // let { text } = this.state;
        // let { onChange } = this.props;
        console.log('%c--text-- ', 'color:blue;', selected,this.props);
        console.log('%c--2-- ', 'color:blue;', this.state.selected);
        //handle unchange
        if (selected === this.state.selected){
            console.log('%c--不变-- ', 'color:blue;',);
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
