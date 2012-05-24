/* This javascript will apply 3d transforms to css elements*/
/*The transformer.transform() function is the action part here
  the function call will look like this:
  transformer.transform({
  	translations: [xTranslation, yTranslation, zTranslation],
  	rotations: [xRotation, yRotation,zRotation],
  	scales: [xScale, yScale, zScale, vScale],
  	origins: [xOrigin, yOrigin, zOrigin]
  	});
  
  If an object is missed out then it no transform of that type will be applied

  Translations amounts are in pixels
  Rotation amounts are in degrees
  Scales are based on a ratio with 0.5 being half scale, 1 is standard scale 2 being double.*/

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
	transform: function (obj) { //translations in pixels in order [x, y, z] rotations given in degrees in order [xrotation, yrotation, zrotation]
		"use strict";
		var xR = (typeof obj.rotations == "undefined") ? 0 : obj.rotations[0],
			yR = (typeof obj.rotations == "undefined") ? 0 : obj.rotations[1],
			zR = (typeof obj.rotations == "undefined") ? 0 : obj.rotations[2],
			xT = (typeof obj.translations == "undefined") ? 0 : obj.translations[0],
			yT = (typeof obj.translations == "undefined") ? 0 : obj.translations[1],
			zT = (typeof obj.translations == "undefined") ? 0 : obj.translations[2],
			xS = (typeof obj.scales == "undefined") ? 0 : obj.scales[0],
			yS = (typeof obj.scales == "undefined") ? 0 : obj.scales[1],
			zS = (typeof obj.scales == "undefined") ? 0 : obj.scales[2],
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