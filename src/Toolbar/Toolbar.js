import React, { PureComponent } from 'react'

export default class Toolbar extends PureComponent {
    render() {
        const { children } = this.props
        return (
            <div className="imge-toolbar">
                <div className="imge-toolbar__actions">
                    {children}
                </div>
            </div>
        )
    }
}
