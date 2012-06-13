transformJS
===========

creates a 3dMatrix for CSS transforms  

To use this JS File you will need to have sylvester.js
------------------------------------------------------
You can download sylvester from http://sylvester.jcoglan.com/  


Setting up a 3d space
---------------------

transform.setup() is an optional method of transform.js It will create a simple space with perspective where you can apply 3D transforms to an element or group of elements.  

In order to setup a 3d space you must have an html page with at least 1 div present. The setup method is then called like this:  

var myVar = transform.setup("selector", {
	perspective: '800px',
	perspectiveOrigin: '50%,50%',
	left: '200px',
	top: '100px',
	width: '600px',
	height: '400px'
});

The selector is the only mandatory argument for the function call the object is optional. 

The selector users document.querySelectorAll which means two things

>1. It must be passed in with the # prefix for ids and the . prefix for classes.
>
>2. It wont work in older browsers (until I change the setup method).

If no object is passed it will only be possible to perform 2D transforms: Any attempted 3d transforms will work but have no depth to them, so rotating a div in the x or y axis for example would not cause the side that moves further away to get smaller and the near side to get larger. It is possible to pass an empty object here {} and the perspective and perspectiveOrigin values will default to the values given above. The other properties (left, top etc) will inherit the same values as the div element passed in the first argument if they are not declared in the object.

It is possible to pass any CSS selector in via the object to style the containing div as long as they are camel cased in instances which contain dashes '-'. perspective and perspectiveOrigin do not need any vendor prefix as they are automatically added in the script. All other CSS selectors which currently require a vendor prefix need to be given one. 

e.g. 
CSS Selector = -webkit-transition-timing-function: linear;
Object Equivalent = webkitTransitionTimingFunction: 'linear'

The setup method will copy the HTML element(s) children and place all this within a wrapper inside the HTML element. If the CSS selector used was .someClass the inner wrapper would be .someClassTransformer The .transform method can then be called on the variable used in the setup function and this will apply the transformation to the inner div (.someClassTransformer) created during the setup method. If you have applied any "transition" CSS properties to make your transformations nice and smooth these will be applied to the inner divs also so that the transition effects will be maintained.

If an object is passed as an argument the script will then create a container around the div element that will provide perspective for 3D transformations. 

It is important to remember when using 3D CSS transformation that each div is only a 2D plain so cannot be given any depth. To give the illusion of depth it must be built up with other div elements. These can all be contained inside another div and then a single transform can be applied at that level which will affect all children within the affected div.

On completion of the setup method the 'transform' prototype is added to the HTMLElement which means 2 things

>1. It makes it super easy to do your transformations.
>
>2. It doesn't work in older browsers (yet).

How to do the super easy transformations you may ask? Well it goes a little something like this.

myDiv.transform({
	rotation: [x,y,z],          
	translation:[x,y,z],		
	scale: [x,y,z],				
	origin: [x,y,z]
});

All properties in this function call are optional. If nothing is passed as an argument the HTML element will return to an untransformed state.

>Rotations can be given in integers or floating point numbers (value in degrees) 
>
>Translations values are given in integers in pixel amounts
>
>Scale values are given in floating point or integer values a ratio of the current size where 0 = 0% of size 1= 100%, 2=200% etc. Their is another scale that can be added in the scales argument e.g. scale: [x,y,z,v]. the V effectively scales the viewpoint. If this is entered and has the same value as x,y,z it will appear as though no scaling has occured. If you wish to use the V to scale your transforms the other values should be entered as a 1 i.e. scale: [1,1,1,1.3] to zoom x 1.3.

The transform method can be used two different ways. If you have used the transform.setup method:
>var x = transform.setup(".thisClass"), {perspective: "800px"}) 

then you can apply the same transform to all items in the node list by simply calling transform like this:
>x.transform({translation: [50,25,0], rotation: [60,0,0]});

Alternatively you can apply the transform to just a single item in the node list:
>x[0].transform({translation: [50,25,0], rotation: [60,0,0]});

The final way is to call it on a single HTML element or node list. If you choose to do it this way you must call transform.setup without any arguments (transform.setup();) first in order for the prototype functions to be added to the nodelist and html element objects. Once this is done the call can be made like this:
>document.getElementById("someDiv").transform({translation: [50,25,0], rotation: [60,0,0]});
>OR
>document.getElementsByClassName("someClass").transform({translation: [50,25,0], rotation: [60,0,0]});


I think that sums everything up. If anyone has any tips/advice/pointers I am happy to hear from you as I haven't been coding too long and still have a lot to learn.

