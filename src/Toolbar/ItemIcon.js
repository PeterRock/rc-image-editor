import React from 'react'
import PropTypes from 'prop-types'

const ItemIcon = (props) => {
    const {
        visible, active, name, onClick,
        extra, alt, title, disabled,
    } = props
    if (visible) {
        return (
            <span className="imge-toolbar-icon__item">
                <span
                    alt={alt}
                    title={title}
                    onClick={disabled ? undefined : onClick}
                    className={
                        `imge-toolbar-icon__wrapper${active ? ' active' : ''}${disabled ? ' disabled' : ''}`
                    }
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
