
$(function() {

    window.plotPCA = function plotPCA(pcaObj, name, container, tooltipFormatter) {

        container = container || 'pca-container';
        tooltipFormatter = tooltipFormatter || function() { return this.key; };

        var mins = pcaObj.ranges[1],
            maxs = pcaObj.ranges[0],
            titles = pcaObj.titles;

        var chart = new Highcharts.Chart({
            chart: {
                renderTo: container,
                margin: [100, 100, 100, 100],
                type: 'scatter',
                options3d: {
                    enabled: true,
                    alpha: 20,
                    beta: 30,
                    depth: 250
                },
            },
            title: {text: name},
            legend: {
                enabled: false
            },
            xAxis: {
                title: {text: titles[0]},
                min: mins[0],
                max: maxs[0]
            },
            yAxis: {
                title: {text: titles[1]},
                min: mins[1],
                max: maxs[1]
            },
            zAxis: {
                title: {text: titles[2]},
                min: mins[2],
                max: maxs[2]
            },
            series: pcaObj.series,
            tooltip: {
                formatter: tooltipFormatter,
                useHTML: true,
                backgroundColor: '#4c4c4c', // green
                borderColor: '#4c4c4c',
                borderRadius: 0,
                shadow: false,
                style: {
                    color: 'white',
                    fontFamily: 'Helvetica',
                    fontWeight: 'normal',
                    padding: 6
                }
            }
        });

        // Add mouse events for rotation
        $(chart.container).bind('mousedown.hc touchstart.hc', function (eStart) {
            eStart = chart.pointer.normalize(eStart);

            var posX = eStart.pageX,
                posY = eStart.pageY,
                alpha = chart.options.chart.options3d.alpha,
                beta = chart.options.chart.options3d.beta,
                newAlpha,
                newBeta,
                sensitivity = 10; // lower is more sensitive

            $(document).bind({
                'mousemove.hc touchdrag.hc': function (e) {
                    // Run beta
                    newBeta = beta + (posX - e.pageX) / sensitivity;
                    chart.options.chart.options3d.beta = newBeta;

                    // Run alpha
                    newAlpha = alpha + (e.pageY - posY) / sensitivity;
                    chart.options.chart.options3d.alpha = newAlpha;

                    chart.redraw(false);
                },
                'mouseup touchend': function () {
                    $(document).unbind('.hc');
                }
            });
        });
    }
});