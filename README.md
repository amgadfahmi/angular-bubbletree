# angular-bubbletree 
Master 0.1.0: [![Build Status](https://travis-ci.org/amgadfahmi/angular-bubbletree.svg?branch=master)](https://travis-ci.org/amgadfahmi/js-binarysearch)&nbsp; Development 0.1.0: [![Build Status](https://travis-ci.org/amgadfahmi/angular-bubbletree.svg?branch=development)](https://travis-ci.org/amgadfahmi/js-binarysearch)&nbsp;[![dependency Status](https://david-dm.org/amgadfahmi/angular-bubbletree.svg)](https://david-dm.org/amgadfahmi/angular-bubbletree)

![angular d3 chart bubble tree](https://amgadfahmi.files.wordpress.com/2016/06/angular-bubbletree-chart.png "angular d3 chart bubble tree")



## Installation

[![bower](https://amgadfahmi.files.wordpress.com/2016/05/bower.png "Javascript Binary Search")](http://bower.io/search/?q=angular-bubbletree)

You can install the package using Bower 
```
$ bower install --save js-binarysearch
```
Or download the project and find the module in `dist/` folder 

## Usage
The directive is simple, define the directive in your html as following  

```html
<bubbletree 
    id="testChart"                  //required 
    control="chart"                 //required
    link-distance='100'             //optional
    fill-style='solid'              //optional
    parent-color='steelblue'        //optional
    child-color='lightgray'         //optional
    collapsed-color='#ffdd99'       //optional
    link-color='#9ecae1'            //optional
    enable-tooltip="true"           //optional
    text-x="1.45em"                 //optional
    text-y="3.45em"                 //optional
    scale-score="10">               //optional
</bubbletree>
```
And in your controller define the following 
```javascript
//this very important to communicate with the directive 
//and be able to call internal functionalities
 $scope.chart = {};
 //load you data in anyway you want 
 $http.get('data.json').then(function(result) {
    //once data is ready pass it to the bind function
    $scope.chart.bind( result.data);
 });
```

## Parameters 

```
parameter       condition   default     description 
id              required    NA          defines the control id in the dom 
control         required    NA          refernece to scope object in order to communicate with the directive 
width           optional    1000        determine the svg container width 
height          optional    400         determine the svg container height 
link-distance   optional    100         determine the distanaation between each node 
fill-style      optional    gradient    changes the chart bubbles layout (solid - gradient)
parent-color    optional    #336699     color of any parent node (works only with solid style)
child-color     optional    #e0e0eb     color of any child node (works only with solid style)
collapsed-color optional    #19334d     color of any collapsed parent node (works only with solid style)
link-color      optional    #9ecae1     color of link between nodes 
enable-tooltip  optional    true        show small tooltip beside the node(very basic)
text-x          optional    1.45em      determine the x coordinates of the node text according to its node 
text-y          optional    3.45em      determine the y coordinates of the node text according to its node 
scale-score     optional    10          determine the scaling factor for node sizes(1 too small - 30 is big) 
```

## Extra info

![angular d3 chart bubble tree](https://amgadfahmi.files.wordpress.com/2016/06/angular-bubbletree-chart2.png "angular d3 chart bubble tree")

You can override the default following classes in order to change the look of component 
```css
.btNode circle {
}
.btNode text {
}
.btLink {
}
div.btTooltip{
}
```

## License

Copyright [2016] Amgad Fahmi

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.