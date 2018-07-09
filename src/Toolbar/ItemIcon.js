import React from 'react'
import PropTypes from 'prop-types'

const ItemIcon = (props) => {
    const {
        visible, active, name, onClick,
        extra,
    } = props
    if (visible) {
        return (
            <span className="imge-toolbar-icon__item">
                <span
                    onClick={onClick}
                    className={`imge-toolbar-icon__wrapper${active ? ' active' : ''}`}
                >
                    <i className={`imge-toolbar__icon ${name}`} />
                </span>
                {extra}
            </span>
        )
    }
    return null
}

ItemIcon.defaultProps = {
    visible: true,
    active: false,
    name: '',
    onClick: null,
}
ItemIcon.propTypes = {
    visible: PropTypes.bool,
    active: PropTypes.bool,
    name: PropTypes.string,
    onClick: PropTypes.func,
}

export default ItemIcon
