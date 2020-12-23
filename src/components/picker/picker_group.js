import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from '../../utils/classnames';

class PickerGroup extends Component {
    static propTypes = {
        height: PropTypes.number,
        itemHeight: PropTypes.number,
        indicatorTop: PropTypes.number,
        indicatorHeight: PropTypes.number,
        onChange: PropTypes.func,
        aniamtion: PropTypes.bool,
        groupIndex: PropTypes.number,
        defaultIndex: PropTypes.number
    }

    static defaultProps = {
        height: 238,         // 总高度
        itemHeight: 25 + 9, //内容加 padding content + padding
        indicatorTop: 102,   // 绝对定位的指示器的top 值
        indicatorHeight: 34,  // 绝对定位的指示器的 height 值
        aniamtion: true,
        groupIndex: -1,
        defaultIndex: -1,
        mapKeys: {
            label: 'label'
        }
    }

    constructor(props){
        super(props);
        this.state = {
            touching: false,
            ogY: 0,
            ogTranslate: 0,
            touchId: undefined,
            translate: 0,
            totalHeight: 0,
            selected: 0,            // 选中索引
            animating: this.props.animation
        };

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.updateSelected = this.updateSelected.bind(this);
    }

    componentDidMount(){
        this.adjustPosition(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.adjustPosition(nextProps);
    }
    // 调整位置 translate
    adjustPosition(props){
        const { items, itemHeight, indicatorTop, defaultIndex } = props;
        const totalHeight = items.length * itemHeight; // 每一项的高度 x 项的数
        let translate = totalHeight <= indicatorTop ? indicatorTop : 0;// 项的数目是否比指示器高，不是则取indicatorTop
        let upperCount = Math.floor(indicatorTop / itemHeight);  // 指示器上面可以有几项内容
        
        if (defaultIndex > -1) {
            if (translate === 0){
                if ( defaultIndex > upperCount ){           //over
                    let overCount = defaultIndex - upperCount;
                    translate -= overCount * itemHeight;
                } else if ( defaultIndex === upperCount){   // 没有变化  transform：translate(0px, 0px)
                    translate = 0;
                } else {                                    // less    translate(0px, 34px)
                    translate += ( Math.abs(upperCount - defaultIndex) * itemHeight);
                }
            } else {
                translate -= itemHeight * defaultIndex; //所有的item 比indicator height小
            }
        }

    	this.setState({
            selected: defaultIndex,
            ogTranslate: translate,
            totalHeight,
            translate,
    	},
            () => defaultIndex > -1 ?
                this.updateSelected(false) : this.updateSelected()
        );
    }

    updateSelected(propagate = true){
        const { items, itemHeight, indicatorTop, indicatorHeight, onChange, groupIndex } = this.props;
        let { translate } = this.state;
        let selected = 0;
        // 确认selected的值为 item 中的哪一个
        items.forEach( (item, i) => {
            let itemHeightN =itemHeight * i;
            if ( translate + itemHeightN >= indicatorTop &&
            ( translate + itemHeightN + itemHeight ) <= indicatorTop + indicatorHeight ){
                selected = i;
            }
        });

        if (onChange && propagate) {
            onChange(items[selected], selected, groupIndex)
        };
    }
    // 触摸开始
    handleTouchStart(e){
        let { touching, translate} = this.state;
        if (touching || this.props.items.length <= 1) return;      // 长度小于 1 以及未触摸
        let targetTouches=e.targetTouches[0];
        this.setState({
            touching: true,
            ogTranslate: translate,
            touchId: targetTouches.identifier,
        	ogY: translate === 0 ? targetTouches.pageY : targetTouches.pageY - translate,
        	animating: false
        });
    }

    handleTouchMove(e){
        let { touching, translate, touchId, ogY} = this.state;
        if (!touching || this.props.items.length <= 1) return;
        let targetTouches=e.targetTouches[0];
        if (targetTouches.identifier !== touchId) return;

        //prevent move background
        e.preventDefault();

        const pageY = targetTouches.pageY;
        const diffY = pageY - ogY;
        this.setState({ translate: diffY });
    }

    handleTouchEnd(e){
        let { touching, ogTranslate,totalHeight} = this.state;
        if (!touching || this.props.items.length <= 1) return;

        const { indicatorTop, indicatorHeight, itemHeight } = this.props;
        let translate = this.state.translate;
        if ( Math.abs(translate - ogTranslate) < ( itemHeight * .51 ) ){
            translate = ogTranslate;
        } else if (translate > indicatorTop) {   // translate(0px, 102px)  上拉过多
            translate = indicatorTop;
        } else if (translate + totalHeight < indicatorTop + indicatorHeight) {
            translate = indicatorTop + indicatorHeight - totalHeight;
        } else {
            //pass single item range but not exceed boundry
            let step = 0, adjust = 0;
            let diff = (translate - ogTranslate) / itemHeight;

            if (Math.abs(diff) < 1){
                step = diff > 0 ? 1 : -1;
            } else {
                adjust = Math.abs((diff % 1) * 100) > 50 ? 1 : 0;
                step = diff > 0 ? Math.floor(diff) + adjust : Math.ceil(diff) - adjust;
            }
            translate = ogTranslate + ( step * itemHeight );
        }

        this.setState({
            touching: false,
            ogY: 0,
            touchId: undefined,
            ogTranslate: 0,
            animating: true,
            translate
        }, ()=>this.updateSelected());
    }

    render() {
        const { items, className, height, itemHeight, indicatorTop, indicatorHeight, onChange,
            aniamtion, groupIndex, defaultIndex, mapKeys, ...others } = this.props;
        let { translate, animating} = this.state;
        const cls = classNames('weui-picker__group', className);
        const styles = {
            'transform': `translate(0, ${translate}px)`,
            'transition': animating ? 'transform .3s' : 'none'
        };

        return (
            <div className={cls} { ...others }
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            >
                <div className="weui-picker__mask"></div>
                <div className="weui-picker__indicator"></div>
                <div className="weui-picker__content"
                    style={styles}
                    ref="content">
                    { items.map( (item, j) => {
                        const label = item[mapKeys.label];
                        const itemCls = classNames('weui-picker__item');

                        return <div key={j} className={itemCls}>{ label }</div>;
                    }) }
                </div>
            </div>
        );
    }
}

export default PickerGroup;
