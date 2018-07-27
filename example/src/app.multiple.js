/* eslint-disable */
import React from 'react'
import { render } from 'react-dom'
import ImageEditor from '../../src'

const demos = [
    './demo1.jpg',
    './demo.jpg',
    './demo1.jpg',
    './demo.jpg',
]

class ImageEditorDemo extends React.PureComponent {
    state = {
        visible: false,
        index: 0,
        currentImage: demos[0],
    }
    openEditor = (src) => {
        this.setState({
            visible: true,
            data: src,
        })
    }
    afterClose = () => {
        this.setState({
            visible: false,
        })
    }
    onSave = (data) => {
        console.log('image data', data)
    }
    switchPrev = () => {
        const { currentImage } = this.state
        let index = demos.indexOf(currentImage)
        index = (index + 1) % demos.length
        this.setState({
            currentImage: demos[index]
        })
    }
    switchNext = () => {
        const { currentImage } = this.state
        let index = demos.indexOf(currentImage)
        index = (demos.length + index - 1) % demos.length
        this.setState({
            currentImage: demos[index]
        })
    }

    render() {
        const { visible, index, currentImage } = this.state
        const sayHello = () => { console.log('Hello') }
        return (
            <div>
                <h3>多图模式</h3>
                <div>
                    {
                        demos.map((img, idx) => <img key={idx} src={img} onClick={this.openEditor} />)
                    }
                </div>
                <ImageEditor
                    switchable
                    visible={visible}
                    onClose={this.afterClose}
                    onSaveDataURL={this.onSave}
                    onSwitchPrev={this.switchPrev}
                    onSwitchNext={this.switchNext}
                    data={currentImage}
                    current={index}
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