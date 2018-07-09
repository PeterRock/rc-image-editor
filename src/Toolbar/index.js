import React, { PureComponent } from 'react'
import Item from './Item'
import './index.scss'

class Toolbar extends PureComponent {
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
Toolbar.Split = () => (<span className="imge-toolbar__split" />)

Toolbar.Item = Item

export default Toolbar
