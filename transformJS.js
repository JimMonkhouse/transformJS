var transform = {
	setup: function(el, obj){
		var div = document.querySelectorAll(el),
		divInner = "new div element",
		cssText = "",
		objPerspective = true,
		obj = typeof obj == "undefined" ? {} : obj,
		i, j;

		for (var j = div.length - 1; j >= 0; j--) {
			divInner = div[j].cloneNode(true);
			if (/\./.test(el)) 
				divInner.className = el.replace(/\./, "") + 'inner';
			else if (/#/.test(el))
				divInner.id = el.replace(/#/, '') + 'inner';
			divInner.style.height = obj.height||div[j].offsetHeight + 'px';
			divInner.style.width = obj.width||div[j].offsetWidth + 'px';
			divInner.style.left = obj.left||div[j].offsetLeft +'px';
			divInner.style.top = obj.height||div[j].offsetTop + 'px';
			div[j].style.webkitTransformStyle = "preserve-3d";
			div[j].style.mozTransformStyle = "preserve-3d";
			div[j].style.oTransformStyle = "preserve-3d";
			div[j].style.transformStyle = "preserve-3d";

			if (obj) {
				for(i in obj) {
					if(!obj.hasOwnProperty(i)){continue;};
					if(/(height|width|left|top)/.test(i)){continue;};
					switch(i) {
						case 'perspective':
							div[j].style.webkitPerspective = obj.perspective;
							div[j].style.mozPerspective = obj.perspective;
							div[j].style.oPerspective = obj.perspective;
							div[j].style.perspective = obj.perspective;
							objPerspective = true;
							break;
						case 'perspectiveOrigin':
							div[j].style.webkitPerspectiveOrigin = obj.perspectiveOrigin;
							div[j].style.mozPerspectiveOrigin = obj.perspectiveOrigin;
							div[j].style.oPerspectiveOrigin = obj.perspectiveOrigin;
							div[j].style.perspectiveOrigin = obj.perspectiveOrigin;
							break;
						default:
							div[j].style[i] = obj[i];
							break;
					}
				}
				if (!objPerspective) {
					div[j].style.webkitPerspective = '800px';
					div[j].style.mozPerspective = '800px';
					div[j].style.oPerspective = '800px';
					div[j].style.perspective = '800px';
				}
			}
			div[j].innerHTML = "";
			div[j].appendChild(divInner);
		};

		NodeList.prototype.transform = transform.transform;
		HTMLElement.prototype.transform = transform.transform;
		div = document.querySelectorAll(el+'inner');
		return div;
	},
	xRot: function (angle) {
		"use strict";
		var x = angle * (Math.PI / 180),
		matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		matrix[1][1] = Math.cos(-x);
		matrix[1][2] = Math.sin(x);
		matrix[2][1] = Math.sin(-x);
		matrix[2][2] = Math.cos(-x);
		return matrix;
	},
	yRot: function (angle) {
		"use strict";
		var x = angle * (Math.PI / 180),
		matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		matrix[0][0] = Math.cos(-x);
		matrix[0][2] = Math.sin(-x);
		matrix[2][0] = Math.sin(x);
		matrix[2][2] = Math.cos(-x);
		return matrix;
	},
	zRot: function (angle) {
		"use strict";
		var x = angle * (Math.PI / 180),
			matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		matrix[0][0] = Math.cos(x);
		matrix[0][1] = Math.sin(x);
		matrix[1][0] = Math.sin(-x);
		matrix[1][1] = Math.cos(x);
		return matrix;
	},
	translate: function (x, y, z) {
		"use strict";
		var matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		matrix[3][0] = x;
		matrix[3][1] = y;
		matrix[3][2] = z;
		return matrix;
	},
	origin: function (x, y, z) {
		"use strict";
		var matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		matrix[0][3] = x;
		matrix[1][3] = y;
		matrix[2][3] = z;
		return matrix;
	},
	transform: function (obj) {
		"use strict";
		var obj = (typeof obj == "undefined") ? {} : obj,
			xR = (typeof obj.rotation == "undefined") ? 0 : obj.rotation[0],
			yR = (typeof obj.rotation == "undefined") ? 0 : obj.rotation[1],
			zR = (typeof obj.rotation == "undefined") ? 0 : obj.rotation[2],
			xT = (typeof obj.translation == "undefined") ? 0 : obj.translation[0],
			yT = (typeof obj.translation == "undefined") ? 0 : obj.translation[1],
			zT = (typeof obj.translation == "undefined") ? 0 : obj.translation[2],
			xS = (typeof obj.scale == "undefined") ? 1 : obj.scale[0],
			yS = (typeof obj.scale == "undefined") ? 1 : obj.scale[1],
			zS = (typeof obj.scale == "undefined") ? 1 : obj.scale[2],
			vS = 1,
			xOrigin = (typeof obj.origin == "undefined") ? 0 : obj.origin[0],
			yOrigin = (typeof obj.origin == "undefined") ? 0 : obj.origin[1],
			zOrigin = (typeof obj.origin == "undefined") ? 0 : obj.origin[2],
			translateMatrix,
			scaleMatrix,
			combinedMatrix,
			originMatrix,
			cssText,
			browser = window.navigator.userAgent,
			i;
		
		if(obj.scales) {
			vS = (typeof obj.scales[3] == "undefined") ? 1 : obj.scales[3];
		}
		scaleMatrix = Matrix.create([[xS, 0, 0, 0], [0, yS, 0, 0], [0, 0, zS, 0], [0, 0, 0, vS]]); //set scalar quantities
		//set matrices to matrix objects for use by sylvester.js
		xR = Matrix.create(transform.xRot(xR));
		yR = Matrix.create(transform.yRot(yR));
		zR = Matrix.create(transform.zRot(zR));
		translateMatrix = Matrix.create(transform.translate(xT, yT, zT));
		originMatrix = Matrix.create([[1,0,0,xOrigin],[0,1,0,yOrigin],[0,0,1,zOrigin],[0,0,0,1]]);
		//multiply matrices
		combinedMatrix = xR.x(yR).x(zR).x(scaleMatrix).x(translateMatrix).x(originMatrix);
		//combinedMatrix = this.multiplyMatrices()
		//write output
		cssText	= transform.writeMatrix(combinedMatrix);
		//return cssText;

		if(this.length) {
			for(i = this.length - 1; i >= 0; i--) {
				this[i].style.webkitTransform = cssText;
				this[i].style.mozTransform = cssText;
				this[i].style.oTransform = cssText;
				this[i].style.msTransform = cssText;
				this[i].style.transform = cssText;
			}
		} else {
			this.style.webkitTransform = cssText;
			this.style.mozTransform = cssText;
			this.style.oTransform = cssText;
			this.style.msTransform = cssText;
			this.style.transform = cssText;
		}
	},
	writeMatrix: function (matrix) {
		"use strict";
		var i, j, z, output, 
		count = 0,
		arr = [];

		if (!matrix.length) {
			for(i in matrix) {
				if(!matrix.hasOwnProperty(i)){continue}
				for(j = 0; j < matrix[i].length; j++) {
					for(z = 0; z < matrix[i][j].length; z++) {
						arr[count] = (matrix[i][j][z]).toFixed(20);
						count++;
					}
				}
			}
		} else {
			for(i = 0; i < matrix.length; i++) {
				for (j = 0; j < matrix[i].length; j++) {
					arr[count] = (matrix[i][j]).toFixed(20);
					count++;
				}
			}
		}
		output = "matrix3d(" + arr + ")";
		return output;
	}
	/* For later implementation if sylvester is removed?
	multiplyMatrices: function(xRot, yRot, zRot) {
		var newMatrix = [[1,0,0,0],[0,1,0,0,],[0,0,1,0],[0,0,0,1]],
		midMatrix = [[1,0,0,0],[0,1,0,0,],[0,0,1,0],[0,0,0,1]];
		for(i = 0; i < 3; i++){/*
 			midMatrix[i][0] = xRot[i][0] * yRot[0][0] + xRot[i][1] * yRot[1][0] + xRot[i][2] * yRot[2][0];
 			midMatrix[i][1] = xRot[i][0] * yRot[0][1] + xRot[i][1] * yRot[1][1] + xRot[i][2] * yRot[2][1];
			midMatrix[i][2] = xRot[i][0] * yRot[0][2] + xRot[i][1] * yRot[1][2] + xRot[i][2] * yRot[2][2];
		}
		for(i = 0; i < 3; i++){
 			newMatrix[i][0] = midMatrix[i][0] * zRot[0][0] + midMatrix[i][1] * zRot[1][0] + midMatrix[i][2] * zRot[2][0];
 			newMatrix[i][1] = midMatrix[i][0] * zRot[0][1] + midMatrix[i][1] * zRot[1][1] + midMatrix[i][2] * zRot[2][1];
			newMatrix[i][2] = midMatrix[i][0] * zRot[0][2] + midMatrix[i][1] * zRot[1][2] + midMatrix[i][2] * zRot[2][2];
		}
		return newMatrix;
	}*/
}