(function() {
'use strict';

Darkroom.Utils = {
  extend: extend,
  computeImageViewPort: computeImageViewPort,
  createElement: createElement,
  hideElement: hideElement,
  showElement: showElement,
  forEachValue: forEachValue,
  cloneImage: cloneImage,
  makeStatic: makeStatic
};

function createElement(type, attrs) {
  var elt = document.createElement(type);

  Object.keys(attrs).forEach(function(prop) { elt.setAttribute(prop, attrs[prop]); })
  return elt;
}

function hideElement(elt) {
  elt.style.display = 'none';
  return elt;
}

function showElement(elt) {
  elt.style.display = 'inline';
  return elt;
}

function forEachValue(obj, cb) {
  Object.keys(obj).forEach(function(prop) { cb(obj[prop]); });
}

function cloneImage(image, cb) {

  var OPTS = [
	'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY',
	'lockUniScaling', 'hasControls', 'hasBorders', 'selectable', 'evented'
  ];

  image.clone(cb, OPTS);
}

function makeStatic(fabricObject) {
  fabricObject.set({
	selectable: false,
	evented: false,
	lockMovementX: true,
	lockMovementY: true,
	lockRotation: true,
	lockScalingX: true,
	lockScalingY: true,
	lockUniScaling: true,
	hasControls: false,
	hasBorders: false
  });

  return fabricObject;
}

// Utility method to easily extend objects.
function extend(b, a) {
  var prop;
  if (b === undefined) {
    return a;
  }
  for (prop in a) {
    if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
      b[prop] = a[prop];
    }
  }
  return b;
}

function computeImageViewPort(image) {
  return {
    height: Math.abs(image.getWidth() * (Math.sin(image.getAngle() * Math.PI/180))) + Math.abs(image.getHeight() * (Math.cos(image.getAngle() * Math.PI/180))),
    width: Math.abs(image.getHeight() * (Math.sin(image.getAngle() * Math.PI/180))) + Math.abs(image.getWidth() * (Math.cos(image.getAngle() * Math.PI/180))),
  }
}

})();
