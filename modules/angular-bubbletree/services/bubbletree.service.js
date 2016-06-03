(function() {
    'use strict';
    angular.module('angular-bubbletree').service('bubbletreeSvc', bubbletreeSvc);
    bubbletreeSvc.$inject = ['$log'];

    function bubbletreeSvc(log) {
        var service = {};

        service.linearScale = function(value, scaledData, min, max, scale) {
            var scaled = d3.scale.linear()
                .domain([min, max])
                .range([1 * scale, 2 * scale]);
            return scaled(value);
        };

        // Returns a list of all nodes under the datasource.
        service.flatten = function(datasource, scaledData) {
            var nodes = [],
                i = 0;

            function recurse(node) {
                if (node.size) {
                    scaledData.push(node.size);
                }
                if (node.children) {
                    node.children.forEach(recurse);
                }
                if (!node.id) {
                    node.id = ++i;
                }
                nodes.push(node);
            }
            recurse(datasource);
            return nodes;
        };

        service.colorSolid = function(d, params) {
            return d._children ? params.collapsedColor //'#19334d' // collapsed package
                : d.children ? params.parentColor //'#336699' // expanded package
                : params.childColor; //'#e0e0eb'; // leaf node
        };

        service.colorGradient = function(svg, d) {
            var color = '#fff',
                id = 'btGradient';

            // Define the gradient
            var gradient = svg.append('svg:defs')
                .append('svg:linearGradient')
                .attr('id', id)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%')
                .attr('spreadMethod', 'pad');

            // Define the gradient colors
            gradient.append('svg:stop')
                .attr('offset', '0%')
                .attr('stop-color', '#999')
                .attr('stop-opacity', 1);

            gradient.append('svg:stop')
                .attr('offset', '100%')
                .attr('stop-color', color)
                .attr('stop-opacity', 1);

            return 'url(#' + id + ')';
        };

        return service;

    }

})();