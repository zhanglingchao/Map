//    获取aqi数据
function aqiData() {
    $.ajax({
        type: "get",
        url: "https://api.waqi.info/feed/beijing/?token=demo",
        success: function (data) {
            var aqi = data.data.aqi;
            var location = data.data.city.geo;
            var locationX = location[0];
            var locationY = location[1];
            location[0] = locationY;
            location[1] = locationX;
            mapData(location, aqi);
        },
    });
}

var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 10, //地图显示的缩放级别
});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

function mapData(x, aqi) {
    //创建地图
    map.setZoomAndCenter(14, x);
    AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {

        var lngLats = getGridLngLats(map.getCenter(), 5, 5);
        var marker = new SimpleMarker({
            //自定义图标节点(img)的属性
            iconLabel: aqi,
            iconStyle: {
                src: '//webapi.amap.com/theme/v1.3/markers/b/mark_b.png',
                style: {
                    width: '20px',
                    height: '30px'
                }
            },
            //设置基点偏移
            map: map,
            showPositionPoint: true,
            position: lngLats[1],
            zIndex: 200,
            content: '经纬度: ' + x,
        });
        marker.content = '经纬度: ' + x;
        marker.on('click', markerClick);
        marker.emit('click', {target: marker});
    })
}

function markerClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}

function getGridLngLats(center, colNum, size, cellX, cellY) {
    var pxCenter = map.lnglatToPixel(center);
    var rowNum = Math.ceil(size / colNum);
    var startX = pxCenter.getX(),
        startY = pxCenter.getY();

    cellX = cellX || 70;
    cellY = cellY || 70;

    var lngLats = [];
    for (var r = 0; r < rowNum; r++) {
        for (var c = 0; c < colNum; c++) {
            var x = startX + (c - (colNum - 1) / 2) * (cellX);
            var y = startY + (r - (rowNum - 1) / 2) * (cellY);
            lngLats.push(map.pixelToLngLat(new AMap.Pixel(x, y)));
            if (lngLats.length >= size) {
                break;
            }
        }
    }
    return lngLats;
}

$(function () {
    aqiData();
})