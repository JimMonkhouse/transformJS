/*The setup part of transform is used to set up a space for 2d or 3d transforms using CSS.
You can add any property in to the object argument of the function that is a valid CSS 
style in camelCase javascript. 

If no height or width are given the perspectiveprovider will ingerit the width and size of the
div element provided as the first argument All other properties will inherit the default value.

transform.setup("HTMLDivElement", {
	perspective: "800px",
	perspectiveOrigin: "50px,50px" // can be in either px or %
})*/

/* This javascript will apply 3d transforms to css elements*/
/*The transform.transform() function is the action part here
  the function call will look like this:
  transform.transform({
  	translations: [xTranslation, yTranslation, zTranslation], (integers in pixels)
  	rotations: [xRotation, yRotation,zRotation], (integers or non-integers in degrees)
  	scales: [xScale, yScale, zScale, vScale], (ratio scales with 1 being 100% - Vscale is not necessary and if the same vScale is entered as others it will appear as if no scaling has occurred)
  	origins: [xOrigin, yOrigin, zOrigin]
  	});
  
  If an transform type is omitted then no transform of that type will be applied*/

var transform = {
	setup: function(el, obj){
		var div = document.getElementById(el),
		persProv = document.createElement('div'),
		cssText = "";

		persProv.id = el + 'perspective';
		persProv.style.height = obj.height||div.offsetHeight + 'px';
		persProv.style.width = obj.width||div.offsetWidth + 'px';
		persProv.style.position = "absolute";
		persProv.style.left = obj.left||div.offsetLeft +'px';
		persProv.style.top = obj.height||div.offsetTop + 'px';
		div.style.left = 0;
		div.style.top = 0;

		if (obj) {
			if (obj.perspective) {
				persProv.style.webkitPerspective = obj.perspective;
				persProv.style.mozPerspective = obj.perspective;
				persProv.style.oPerspective = obj.perspective;
				persProv.style.perspective = obj.perspective;
			} else {
				persProv.style.webkitPerspective = '800px';
				persProv.style.mozPerspective = '800px';
				persProv.style.oPerspective = '800px';
				persProv.style.perspective = '800px';
			}
			if (obj.perspectiveOrigin)
				persProv.style.webkitPerspectiveOrigin = obj.perspectiveOrigin;
				persProv.style.mozPerspectiveOrigin = obj.perspectiveOrigin;
				persProv.style.oPerspectiveOrigin = obj.perspectiveOrigin;
				persProv.style.perspectiveOrigin = obj.perspectiveOrigin;
		}

		persProv.appendChild((div.cloneNode(true)));
		div.parentNode.replaceChild(persProv, div);
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
	transform: function (obj) { //translations in pixels in order [x, y, z] rotations given in degrees in order [xrotation, yrotation, zrotation]
		"use strict";
		var xR = (typeof obj.rotations == "undefined") ? 0 : obj.rotations[0],
			yR = (typeof obj.rotations == "undefined") ? 0 : obj.rotations[1],
			zR = (typeof obj.rotations == "undefined") ? 0 : obj.rotations[2],
			xT = (typeof obj.translations == "undefined") ? 0 : obj.translations[0],
			yT = (typeof obj.translations == "undefined") ? 0 : obj.translations[1],
			zT = (typeof obj.translations == "undefined") ? 0 : obj.translations[2],
			xS = (typeof obj.scales == "undefined") ? 1 : obj.scales[0],
			yS = (typeof obj.scales == "undefined") ? 1 : obj.scales[1],
			zS = (typeof obj.scales == "undefined") ? 1 : obj.scales[2],
			vS = 1,
			xOrigin = (typeof obj.origins == "undefined") ? 0 : obj.origins[0],
			yOrigin = (typeof obj.origins == "undefined") ? 0 : obj.origins[1],
			zOrigin = (typeof obj.origins == "undefined") ? 0 : obj.origins[2],
			translateMatrix,
			scaleMatrix,
			combinedMatrix,
			cssText;
		
		if(obj.scales) {
			vS = (typeof obj.scales[3] == "undefined") ? 1 : obj.scales[3];
		}
		scaleMatrix = Matrix.create([[xS, 0, 0, 0], [0, yS, 0, 0], [0, 0, zS, 0], [0, 0, 0, vS]]); //set scalar quantities
		//set matrices to matrix objects for use by sylvester.js
		xR = Matrix.create(transform.xRot(xR));
		yR = Matrix.create(transform.yRot(yR));
		zR = Matrix.create(transform.zRot(zR));
		translateMatrix = Matrix.create(transform.translate(xT, yT, zT));
		//multiply matrices
		combinedMatrix = xR.x(yR).x(zR).x(scaleMatrix).x(translateMatrix);
		//combinedMatrix = this.multiplyMatrices()
		//write output
		cssText	= this.writeMatrix(combinedMatrix);
		return cssText;
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