/* eslint-disable */
import React from 'react'
import { render } from 'react-dom'
import ImageEditor from '../../src'

const DEMO_IMG = './demo.jpg'

const EditableImage = (props) => {
    const handleClick = () => {
        props.onClick(props.src)
    }
    return (
        <img
            onClick={handleClick}
            src={props.src}
            alt={props.alt}
        />
    )
}

class ImageEditorDemo extends React.PureComponent {
    state = {
        visible: false,
        img: DEMO_IMG,
    }
    openEditor = (src) => {
        this.setState({
            visible: true,
        })
    }
    afterClose = () => {
        this.setState({
            visible: false,
        })
    }
    onSave = (data) => {
        console.log('image data', data)
        this.setState({ img: data })
    }

    render() {
        const { visible, img } = this.state
        return (
            <div>
                <EditableImage
                    onClick={this.openEditor}
                    src={img}
                    alt="SRC IMAGE"
                />
                <ImageEditor
                    visible={visible}
                    onClose={this.afterClose}
                    onSave={this.onSave}
                    data={img}
                    toolbar={{
                        mosaic: true,
                        restore: true,
                        downloadJpg: true,
                        rotate: true,
                    }}
                    editable
                />
            </div>
        )
    }
}

render(
    <div>World!
        <ImageEditorDemo />
    </div>
    , document.getElementById('content'),
)