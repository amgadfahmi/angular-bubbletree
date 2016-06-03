(function() {
    'use strict';
    angular.module('angular-bubbletree').directive('bubbletree', bubbletree);
    bubbletree.$inject = ['$log', 'bubbletreeSvc'];

    function bubbletree(log, svc) {

        return {
            name: 'bubbletree',
            scope: {
                datasource: '=',
                control: '='
            },
            restrict: 'E',
            replace: true,
            transclude: false,
            link: function postLink(scope, element, attrs) {
                var width = '100%',
                    height = '100%',
                    force, svg, div, link, node,
                    datasource, scaledData = [];

                scope.internalCtrl = scope.control || {};

                scope.internalCtrl.bind = function(data) {
                    log.debug('Binding bubble tree chart');
                    if (data) {
                        datasource = data;
                        render();
                        log.debug('Binding completed');
                    }
                };

                function initialize() {
                    var dummy;
                    scope.params = {};
                    dummy = attrs.id ? scope.params.id = attrs.id : scope.params.id = 'bubbletree';
                    dummy = attrs.width ? scope.params.width = attrs.width : scope.params.width = 1000;
                    dummy = attrs.height ? scope.params.height = attrs.height : scope.params.height = 400;
                    dummy = attrs.linkDistance ? scope.params.linkDistance = attrs.linkDistance : scope.params.linkDistance = 100;
                    dummy = attrs.enableTooltip ? scope.params.enableTooltip = scope.$eval(attrs.enableTooltip) : scope.params.enableTooltip = true;
                    dummy = attrs.fillStyle && ['solid', 'gradient'].indexOf(attrs.fillStyle) >= 0 ? scope.params.fillStyle = attrs.fillStyle : scope.params.fillStyle = 'gradient';
                    dummy = attrs.parentColor ? scope.params.parentColor = attrs.parentColor : scope.params.parentColor = '#336699';
                    dummy = attrs.childColor ? scope.params.childColor = attrs.childColor : scope.params.childColor = '#e0e0eb';
                    dummy = attrs.collapsedColor ? scope.params.collapsedColor = attrs.collapsedColor : scope.params.collapsedColor = '#19334d';
                    dummy = attrs.linkColor ? scope.params.linkColor = attrs.linkColor : scope.params.linkColor = '#9ecae1';
                    dummy = attrs.textX ? scope.params.textX = attrs.textX : scope.params.textX = '1.45em';
                    dummy = attrs.textY ? scope.params.textY = attrs.textY : scope.params.textY = '3.45em';
                    dummy = attrs.scaleScore ? scope.params.scaleScore = attrs.scaleScore : scope.params.scaleScore = 10;


                    force = d3.layout.force()
                        .linkDistance(scope.params.linkDistance)
                        .charge(-120)
                        .gravity(0.01)
                        .size([scope.params.width, scope.params.height])
                        .on('tick', tick);

                    svg = d3.select('#' + attrs.id)
                        .append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    link = svg.selectAll('.btLink');
                    node = svg.selectAll('.btNode');

                    if (scope.params.enableTooltip) {
                        div = d3.select('#' + attrs.id).append('div')
                            .attr('class', 'btTooltip')
                            .style('opacity', 0);
                    }

                }

                initialize();


                function render() {
                    var nodes = svc.flatten(datasource, scaledData),
                        links = d3.layout.tree().links(nodes);

                    // Restart the force layout.
                    force
                        .nodes(nodes)
                        .links(links)
                        .start();

                    // Update links.
                    link = link.data(links, function(d) {
                        return d.target.id;
                    });

                    link.exit().remove();

                    link.enter().insert('line', '.btNode')
                        .attr('class', 'btLink');
                    if (scope.params.linkColor) {
                        link.attr('style', 'stroke:' + scope.params.linkColor + ';');
                    }

                    // Update nodes.
                    node = node.data(nodes, function(d) {
                        return d.id;
                    });

                    node.exit().remove();

                    var nodeEnter = node.enter().append('g')
                        .attr('class', 'btNode')
                        .on('click', click)
                        .call(force.drag);


                    nodeEnter.append('circle')
                        .on('mouseover', function(d) {
                            if (scope.params.enableTooltip) {
                                div.transition()
                                    .duration(1000)
                                    .style('opacity', 0.9);

                                var pageX = d3.event.pageX;
                                var pageY = d3.event.pageY;
                                var data = d;
                                // http.get('exampleTooltip.html').then(function(result) {
                                //     var element = angular.element('<div></div>');
                                //     element.append(result.data);
                                //     var newScope = scope.$new();
                                //     newScope.node = data;
                                //     newScope.test = 'i am data';
                                //     var compiled = compile(element)(newScope);
                                //     console.log(compiled);
                                //     // newScope.$digest();
                                // div.html(compiled[0].innerHTML)
                                // .style('left', (pageX - 120) + 'px')
                                //  .style('top', (pageY - 12) + 'px');
                                // });
                                var size = data.size ? data.size : '';
                                div.html(data.name + '<br/>' + size)
                                    .style('left', (pageX - 120) + 'px')
                                    .style('top', (pageY - 12) + 'px');
                            }

                        })
                        .on('mouseout', function(d) {
                            if (scope.params.enableTooltip) {
                                div.transition()
                                    .duration(500)
                                    .style('opacity', 0);
                            }
                        })
                        .attr('r', function(d) {
                            // console.log(svc.linearScale(d.size, datasource));
                            var min = d3.min(scaledData);
                            var max = d3.max(scaledData);
                            return svc.linearScale(d.size, datasource, min, max, scope.params.scaleScore) || 10;
                        });

                    nodeEnter.append('text')
                        .attr('dy', scope.params.textY)
                        .attr('dx', scope.params.textX)
                        .text(function(d) {
                            return d.name;
                        });

                    node.select('circle')
                        .style('fill', function(d) {
                            if (scope.params.fillStyle === 'solid') {
                                return svc.colorSolid(d, scope.params);
                            } else {
                                return svc.colorGradient(svg, d, scope.params);
                            }

                        });
                }

                function tick() {
                    link.attr('x1', function(d) {
                        return d.source.x;
                    })
                        .attr('y1', function(d) {
                            return d.source.y;
                        })
                        .attr('x2', function(d) {
                            return d.target.x;
                        })
                        .attr('y2', function(d) {
                            return d.target.y;
                        });

                    node.attr('transform', function(d) {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });
                }


                // Toggle children on click.
                function click(d) {
                    if (d3.event.defaultPrevented) {
                        return;
                    } // ignore drag
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    render();
                }

            }

        };
    }

})();