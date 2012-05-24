/* This javascript will apply 3d transforms to css elements*/
/*The transformer.transform() function is the action part here
  the function call will look like this:
  transformer.transform([xTranslation, yTranslation, zTranslation],[xRotation, yRotation,zRotation],*/

var transformer = {
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
	transform: function (translations, rotations, scales, origins) { //translations in pixels in order [x, y, z] rotations given in degrees in order [xrotation, yrotation, zrotation]
		"use strict";
		var xR = rotations[0],
			yR = rotations[1],
			zR = rotations[2],
			xT = translations[0],
			yT = translations[1],
			zT = translations[2],
			xS,
			yS,
			zS,
			tS,
			xOValue,
			yOValue,
			zOValue,
			translateMatrix,
			scaleMatrix,
			combinedMatrix,
			cssText;

		if (!scales) {
			xS = 1;
			yS = 1;
			zS = 1;
			tS = 1;
		} else {
			xS = scales[0];
			yS = scales[1];
			zS = scales[2];
			tS = 1; //chances of wanting this as anything other than 1 are very slim
		}

		if (!origins) {
			xOValue = 0;
			yOValue = 0;
			zOValue = 0;
		} else {
			xOValue = origins[0];
			yOValue = origins[1];
			zOValue = origins[2];
		}
	
		scaleMatrix = Matrix.create([[xS, 0, 0, 0], [0, yS, 0, 0], [0, 0, zS, 0], [0, 0, 0, 1]]); //set scalar quantities
		//set matrices to matrix objects for use by sylvester.js
		xR = Matrix.create(transformer.xRot(xR));
		yR = Matrix.create(transformer.yRot(yR));
		zR = Matrix.create(transformer.zRot(zR));
		translateMatrix = Matrix.create(transformer.translate(xT, yT, zT));
		//multiply matrices
		combinedMatrix = xR.x(yR).x(zR).x(scaleMatrix).x(translateMatrix);
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
}