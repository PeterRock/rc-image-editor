import React from 'react'
import Toolbar from './Toolbar'
import RangeSlider from './RangeSlider'
import ItemIcon from './ItemIcon'
import './index.scss'

const Split = () => (<span className="imge-toolbar__split" />)

const TogglePanel = props => (
    <div className="imge-toolbar-sub-panel" style={{ display: props.visible ? 'block' : 'none' }}>
        {props.children}
    </div>
)

export { Split, ItemIcon, TogglePanel, RangeSlider }
export default Toolbar
