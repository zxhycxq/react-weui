import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PickerGroup from './picker_group';
import classNames from '../../utils/classnames';
import Mask from '../mask';
/**
 *  Mobile select ui, currently only support Touch Events
 *
 */
class Picker extends Component {
    static propTypes = {
        /**
         * consists of array of object(max 2) with property `label` and others pass into element
         *
         */
        actions: PropTypes.array,
        /**
         * array objects consists of groups for each scroll group
         *
         */
        groups: PropTypes.array,
        /**
         * default group index thats selected, if not provide, automatic chose the best fiting item when mounted
         *
         */
        defaultSelect: PropTypes.array,
        /**
         * trigger when individual group change, pass property(`item`, `item index in group`, `group index in groups`, `selected`, `picker instance`)
         *
         */
        onGroupChange: PropTypes.func,
        /**
         * on selected change, pass property `selected` for array of slected index to `groups`
         *
         */
        onChange: PropTypes.func,
        /**
         * excute when the popup about to close
         *
         */
        onCancel: PropTypes.func,
        /**
         * display the component
         *
         */
        show: PropTypes.bool,
        /**
         * language object consists of `leftBtn` and `rightBtn`
         *
         */
        lang: PropTypes.object,
    };

    static defaultProps = {
        actions: [],
        groups: [],
        show: false,
        lang: { leftBtn: 'Cancel', rightBtn: 'Ok' },
    }

    constructor(props){
        super(props);
        let { defaultSelect, groups, actions, lang, onCancel,totalHeight} = this.props;
        // console.log('%c--1-- ', 'color:blue;', defaultSelect, groups, actions, lang, onCancel,totalHeight);
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
        let { groups,selected } = this.state;
        this.handleClose( ()=> {
            if (this.props.onChange)
                console.log('%c--this.state.selected,onChange-- ', 'color:blue;', selected);
                this.props.onChange(selected,this);
        } );
    }
    // 组改变
    handleChange(item, i, groupIndex){
        let selected = this.state.selected;
        selected[groupIndex] = i;
        console.log('%c--组改变selected-- ', 'color:blue;', selected,i,groupIndex);
        this.setState({ selected }, ()=>{
            if (this.props.onGroupChange) {
                console.log('%c--组改变-- ', 'color:blue;', item);
                // TODO 月份判断，确定日期
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
                    key={i} {...group}
                    onChange={this.handleChange}
                    groupIndex={i}
                    defaultIndex={this.state.selected[i]} />;
        });
    }

    render(){
        const { className, show, actions, groups, defaultSelect, onGroupChange, onChange, onCancel, ...others
        
        } = this.props;
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
