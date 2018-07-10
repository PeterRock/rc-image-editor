import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './loading.scss'

export default class LoadingMask extends PureComponent {
    render() {
        const { loading } = this.props
        if (loading) {
            return (
                <div className="loading-mask"><i className="loading-mask__icon-loading" /></div>
            )
        }
        return null
    }
}

LoadingMask.defaultProps = {
    loading: true,
}
LoadingMask.propTypes = {
    loading: PropTypes.bool,
}
