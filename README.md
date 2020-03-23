# Image Editor
`npm install rc-image-edit --save` or `yarn add rc-image-edit`


### Screenshot
![image](https://github.com/PeterRock/rc-image-editor/raw/master/example/src/screen_01.png)

### Props

|prop |type |default |description |
|:---|:---|:---|:---|
|visible |boolean |false |编辑器是否可见 |
|onClose |() => void |- |点击关闭按钮触发的事件 |
|onSave |(imgData) => void |- |点击保存按钮触发的事件 |
|switchable |boolean   |false |是否允许切换浏览图片 |
|onSwitchPrev |(event) => void |- |点击前一张图片按钮事件 |
|onSwitchNext |(event) => void |- |点击后一张图片按钮事件 |
|data |string |- |图片数据：url 或者dataURL |
|editable |boolean |true |允许编辑图片 |
|toolbar |object | | |
| toolbar.mosaic |boolean |true |打码 |
| toolbar.restore |boolean |true |还原 |
| toolbar.downloadJpg |boolean |false |导出Jpg下载 |
| toolbar.rotate |boolean |true |旋转 |
