import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Event, Element } from '../utils'
import './rangeSlider.scss'

function appendEventsOn(ele, eventNames, event) {
    if (Array.isArray(eventNames) && eventNames.length > 0) {
        eventNames.forEach(eventName => ele.addEventListener(eventName, event))
    }
}
function appendEventsOff(ele, eventNames, event) {
    if (Array.isArray(eventNames) && eventNames.length > 0) {
        eventNames.forEach(eventName =>
            ele.removeEventListener(eventName, event)
        )
    }
}

const moveEvent = ['mousemove', 'touchmove']
const endEvent = ['mouseup', 'mouseleave', 'touchend', 'touchcancel']

/* 受控组件 */
class RangeSlider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sliderX: 0,
            value: false,
            sliderWidth: 0,
        }
    }

    handleDown = e => {
        if (e.button && e.button !== 0) return

        // 记录组件和点击点相对于文档的水平位置
        const sliderX = Element.getDocumentOffsetLeft(this.slider)
        const sliderWidth = this.sliderBar.clientWidth
        const moveX = Event.getClickPoint(e).x
        this.setState({
            sliderX,
            sliderWidth,
            value: this.calValue(sliderX, moveX, sliderWidth),
        })

        // 添加鼠标、touch移动事件
        appendEventsOn(document, moveEvent, this.handleMove)
        appendEventsOn(document, endEvent, this.handleEnd)
    }
    handleMove = e => {
        const { sliderX, sliderWidth } = this.state
        const moveX = Event.getClickPoint(e).x
        this.setState({
            value: this.calValue(sliderX, moveX, sliderWidth),
        })
    }
    handleEnd = () => {
        // 解绑移动跟踪事件
        appendEventsOff(document, moveEvent, this.handleMove)
        appendEventsOff(document, endEvent, this.handleEnd)

        // 传递结果给onChange
        const { onChange } = this.props
        if (typeof onChange === 'function') {
            const { value } = this.state
            onChange(value)
        }
    }

    calValue = (originX, newX, width) => {
        const { min, max, value: defaultValue } = this.props
        let offsetLeft = newX - originX
        offsetLeft = Math.max(0, Math.min(width, offsetLeft))
        const value =
            parseInt(((max - min) * offsetLeft) / width + min, 10) ||
            defaultValue
        return value
    }

    render() {
        const { min, max, value: defaultValue } = this.props
        let { value } = this.state
        const sliderWidth = (this.sliderBar && this.sliderBar.clientWidth) || 120
        value = value ? value : defaultValue
        const offsetLeft = Math.max(0, (value * sliderWidth) / (max - min) - 7)

        return (
            <div className="imge-range-slider">
                <div
                    ref={ref => (this.slider = ref)}
                    className="range-slider"
                    onMouseDown={this.handleDown}
                    onTouchStart={this.handleDown}
                    draggable="false"
                >
                    <div className="range-slider-wrapper">
                        <div
                            className="range-slider-bar"
                            ref={ref => (this.sliderBar = ref)}
                        />
                        <div
                            className="range-slider-control"
                            style={{ left: offsetLeft }}
                        />
                    </div>
                </div>
                <span className="imge-range-slider__text"> {value}</span>
            </div>
        )
    }
}

RangeSlider.defaultProps = {
    min: 0,
    max: 10,
    value: 1,
    onChange: null,
}
RangeSlider.propTypes = {
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
}

export default RangeSlider
