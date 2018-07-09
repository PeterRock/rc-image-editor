import React from 'react'
import PropTypes from 'prop-types'

const Item = (props) => {
    const {
        visible, active, children, ...rest
    } = props
    if (visible) {
        return active ? (
            <span className="active" {...rest}>
                {children}
            </span>
        ) : (
            <span {...rest}>
                {children}
            </span>
        )
    }
    return null
}

Item.defaultProps = {
    visible: true,
}
Item.propTypes = {
    visible: PropTypes.bool,
}

export default Item
