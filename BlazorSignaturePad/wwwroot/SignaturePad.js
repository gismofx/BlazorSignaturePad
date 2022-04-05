//import Konva from 'konva';

import Konva from 'konva/lib/Core';
import 'konva/lib/shapes/Line';

const eventTarget = new EventTarget();
var stageWidth = 1000; //window.innerWidth;
var stageHeight = 1000; //window.innerHeight;


var scale, scaleX, scaleY, scaleInverseX, scaleInverseY;
var stage;
var layer;
var containerName = 'container1';
var strokeColor = '#df4b26';
var strokeWidth = 5;
var ratio = 3;

var isPaint = false;
var mode = 'brush';
var lastLine;




window.SignaturePad = {
    dotNetRef: null,
    InitSignaturePad: function (dotNetObjectReference, settings, existingSignature) {
        SignaturePad.dotNetRef = dotNetObjectReference;
        InitSignaturePad(settings);
        DrawExistingData(existingSignature);
        //eventTarget.addEventListener('OnSendDataUp', function (event) {
        //    DamageDiagram.dotNetRef.invokeMethodAsync('OnDataSend', event.detail);
        //});
    },
    RequestDrawingData: function () {
        return CollectSignatureData();
    },
    ClearSignaturePad: function () {
        ClearPad();
    },
    LockSignaturePad: function (locked) {
        SubscribeToMouseEvents(!locked);
    },
    DrawFromPointsArray: function (points, clearExisting) {
        DrawExistingData(points, clearExisting);
    },
    RequestAsImage: function (imageType, pixelRatio, jpgQuality) {
        return getStageAsBase64(imageType, pixelRatio, jpgQuality);
    },


}

function InitSignaturePad(settings) {
    var width = window.innerWidth;
    var height = window.innerHeight - 25;

    stageWidth = settings.stagePixelWidth ?? stageWidth;
    stageHeight = settings.stagePixelHeight ?? stageHeight;
    strokeColor = settings.strokeColor ?? strokeColor;
    strokeWidth = settings.strokeWidth ?? strokeWidth;
    ratio = settings.ratio ?? ratio;
    // first we need Konva core things: stage and layer
    stage = new Konva.Stage({
        container: settings.containerName,
        width: stageWidth,
        height: stageHeight,
    });

    layer = new Konva.Layer();
    stage.add(layer);


    SubscribeToMouseEvents(!settings.isLocked);

    var select = document.getElementById('tool');
    select.addEventListener('change', function () {
        mode = select.value;
    });


    fitStageIntoParentContainer();
    // adapt the stage on any window resize
    window.addEventListener('resize', fitStageIntoParentContainer);

}

function SubscribeToMouseEvents(subscribe = true) {
    if (subscribe) {
        stage.on('mousedown touchstart', function (e) {
            isPaint = true;
            var pos = stage.getPointerPosition();
            lastLine = new Konva.Line({
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                globalCompositeOperation:
                    mode === 'brush' ? 'source-over' : 'destination-out',
                points: [pos.x * scaleInverseX, pos.y * scaleInverseY],
            });
            layer.add(lastLine);
        });

        stage.on('mouseup touchend', function () {
            isPaint = false;
        });

        // and core function - drawing
        stage.on('mousemove touchmove', function (e) {
            if (!isPaint) {
                return;
            }

            e.evt.preventDefault();

            const pos = stage.getPointerPosition();
            var newPoints = lastLine.points().concat([pos.x * scaleInverseX, pos.y * scaleInverseY]);
            lastLine.points(newPoints);
        });
    }
    else {
        stage.off();
    }
}


function CollectSignatureData() {
    let lines = layer.getChildren(function (node) {
        return node.getClassName() === 'Line';
    });

    let lineArray = new Array;
    lines.forEach((line) => {
        lineArray.push(line.attrs.points);
    });
    return lineArray;
}

function ClearPad(deferRedraw=false) {
    layer.destroyChildren();
    if (!deferRedraw) {
        layer.draw();
    } 
}

function DrawExistingData(padData, clearExisting) {
    if (padData == null || padData === undefined) { return };
    if (clearExisting) {
        ClearPad(true);
    }
    padData.forEach((data) => {
        let lineToAdd = new Konva.Line({
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            points: data
        });
        layer.add(lineToAdd);
    });
    layer.draw();
}



/**
 * This will resize the stage based on parent container size
 * Both x and y scaling
 * */
function fitStageIntoParentContainer() {
    var container = document.querySelector('#stage-parent');

    // now we need to fit stage into parent
    var containerWidth = container.clientWidth;
    // to do this we need to scale the stage
    var scaleX = containerWidth / stageWidth;

    // now we need to fit stage into parent
    //var containerHeight = container.clientHeight;
    var containerHeight = containerWidth / ratio;
    // to do this we need to scale the stage
    var scaleY = containerHeight / stageHeight;
    //console.log(containerWidth + " x " + containerHeight);
    // uncomment to enable "uniform stretch"
    //scale = scaleX = scaleY = Math.min(scaleX, scaleY);

    scaleInverseX = 1 / scaleX;
    scaleInverseY = 1 / scaleY;
    stage.width(stageWidth * scaleX);
    stage.height(stageHeight * scaleY);
    stage.scale({ x: scaleX, y: scaleY });
    stage.draw();
}

/*
 * Convert the stage to an image
 * */
function getStageAsBase64(stageId, imageType, pixelRatio = 1, quality = 0.0) {
    return stage.toDataURL(
        {
            mimeType: imageType,
            pixelRatio: pixelRatio,
            quality: quality
        });
}



