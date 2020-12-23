import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PickerGroup from './picker_group';
import classNames from '../../utils/classnames';
import Mask from '../mask';
/**
 *  移动端，仅支持 touch 事件
 */
class Picker extends Component {
    static propTypes = {
        actions: PropTypes.array, // consists of array of object(max 2) with property `label` and others pass into element
        groups: PropTypes.array,     // array objects consists of groups for each scroll group
        defaultSelect: PropTypes.array, // default group index thats selected, if not provide, automatic chose the best fiting item when mounted
        // trigger when individual group change, pass property(`item`, `item index in group`, `group index in groups`, `selected`, `picker instance`)
        onGroupChange: PropTypes.func,
        onChange: PropTypes.func, // on selected change, pass property `selected` for array of slected index to `groups`
        onCancel: PropTypes.func,// excute when the popup about to close
        show: PropTypes.bool, // display the component
        lang: PropTypes.object, // language object consists of `leftBtn` and `rightBtn`
    };

    static defaultProps = {
        actions: [],
        groups: [],
        show: false,
        lang: { leftBtn: 'Cancel', rightBtn: 'Ok' },
    }

    constructor(props){
        super(props);
        let { defaultSelect, groups, actions, lang, onCancel} = this.props;
        console.log('%c--this.props-- ', 'color:blue;', this.props);
        this.state = {
            selected: defaultSelect ? defaultSelect : Array(groups.length).fill(-1),
            actions: actions.length > 0 ? actions : [{
                label: lang.leftBtn,
                onClick: e=>this.handleClose( ()=> {if (onCancel) onCancel(e);} )
            },
            {
                label: lang.rightBtn,
                onClick: e=>this.handleChanges()
            }],
            closing: false
        };

        this.handleChanges = this.handleChanges.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    //  确定按钮
    handleChanges(){
        let { selected } = this.state;
        console.log('%c--确定-- ', 'color:blue;', selected,this.props);
        this.handleClose( ()=> {
            if (this.props.onChange)
                this.props.onChange(selected,this);
        } );
    }
    // 组改变
    handleChange(item, i, groupIndex){
        let selected = this.state.selected;
        selected[groupIndex] = i;
        this.setState({ selected }, ()=>{
            if (this.props.onGroupChange) {
                this.props.onGroupChange(item, i, groupIndex, this.state.selected, this)
            };
        });
    }
    // 关闭
    handleClose(cb){
        this.setState({
            closing: true
        }, ()=> setTimeout( ()=> {
            this.setState({ closing: false });
            cb();
        }, 300));
    }
    //上面部分内容
    renderActions(){
        // 取消和确定
        let elActions = this.state.actions.map( (action, i)=> {
            const { label, ...others } = action;
            return <a {...others} key={i} className="weui-picker__action"> { label }</a>;
        });

        return (
            <div className="weui-picker__hd">
                { elActions }
            </div>
        );
    }
    // 组渲染
    renderGroups(){
        return this.props.groups.map( (group, i) => {
            return <PickerGroup
                    key={i}
                    {...group}
                    onChange={this.handleChange}
                    groupIndex={i}
                    defaultIndex={this.state.selected[i]} />;
        });
    }

    render(){
        const { className, show, actions, groups, defaultSelect, onGroupChange, onChange, onCancel, ...others } = this.props;
        let { closing } = this.state;
        const cls = classNames('weui-picker', {
            'weui-animate-slide-up': show && !closing,
            'weui-animate-slide-down': closing
        }, className);
        const maskCls = classNames({
            'weui-animate-fade-in': show && !closing,
            'weui-animate-fade-out': closing
        });

        return show ? (
            <div>
                <Mask className={maskCls}
                      onClick={e=>this.handleClose( ()=> {if (onCancel) onCancel(e);} )} />
                <div className={cls} {...others}>
                    { this.renderActions() }
                    <div className="weui-picker__bd">
                        { this.renderGroups() }
                    </div>
                </div>
            </div>
        ) : false;
    }
}

export default Picker;
