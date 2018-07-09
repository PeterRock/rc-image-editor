import React from 'react'
import PropTypes from 'prop-types'

const RangeSlider = (props) => {
    const {
        min, max, value, onChange,
    } = props

    return (
        <div className="imge-range-slider">
            <input
                onChange={onChange}
                type="range"
                min={min}
                max={max}
                value={value}
                className="imge-range-slider__input"
            />
            <span className="imge-range-slider__text">{value}</span>
        </div>
    )
}

RangeSlider.defaultProps = {
    visible: true,
    min: 0,
    max: 10,
    value: 1,
    onChange: null,
}
RangeSlider.propTypes = {
    visible: PropTypes.bool,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
}

export default RangeSlider
