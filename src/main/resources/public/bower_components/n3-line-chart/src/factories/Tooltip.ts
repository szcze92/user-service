module n3Charts.Factory {
  'use strict';

  interface INeighbour {
    row: any;
    series: Utils.SeriesOptions;
  }

  export class Tooltip extends Utils.BaseFactory {

    private svg:D3.Selection;
    private line:D3.Selection;
    private dots:D3.Selection;

    constructor(private element: HTMLElement) {
      super();
    }

    create() {
      this.createTooltip();
      this.eventMgr.on('container-move.tooltip', this.show.bind(this));
      this.eventMgr.on('container-out.tooltip', this.hide.bind(this));

      this.hide();
    }

    createTooltip() {
      var svg = this.svg = d3.select(this.element)
        .append('div')
          .attr('class', 'chart-tooltip');

      svg.append('div')
        .attr('class', 'abscissas');

      this.line = this.factoryMgr.get('container').overlay
        .append('line')
          .attr('class', 'tooltip-line');

      this.dots = this.factoryMgr.get('container').overlay
        .append('g')
          .attr('class', 'tooltip-dots');
    }

    destroy() {
      this.svg.remove();
    }

    getClosestRows(x: number, data: Utils.Data, options: Utils.Options): {rows: INeighbour[], index:number} {
      var visibleSeries = options.series.filter((series) => series.visible);
      var datasets = visibleSeries.map((series) => data.getDatasetValues(series, options).filter(series.defined));

      var closestRows = [];
      var closestIndex = -1;
      var minDistance = Number.POSITIVE_INFINITY;

      for (var i = 0; i < datasets.length; i++) {
        for (var j = 0; j < datasets[i].length; j++) {
          if (options.axes.x.type === 'date') {

            // _sigh_ TypeScript...
            var distance = Math.abs((<any>datasets[i][j].x).getTime() - x);
          } else {
            var distance = Math.abs(datasets[i][j].x - x);
          }

          if (distance === minDistance) {
            closestRows.push({series: visibleSeries[i], row: datasets[i][j]});
          } else if (distance < minDistance) {
            minDistance = distance;
            closestRows = [{series: visibleSeries[i], row: datasets[i][j]}];
            closestIndex = j;
          }
        }
      }

      return {rows: closestRows, index: closestIndex};
    }

    showFromCoordinates(coordinates: Factory.ICoordinates, data: Utils.Data, options: Utils.Options) {
      var {x, y} = coordinates;

      if (x === undefined || y === undefined) {
        this.hide();
        return;
      }


      if (x instanceof Date) {
        // _sigh_ TypeScript...
        x = (<Date>x).getTime();
      }

      var {rows, index} = this.getClosestRows(<number>x , data, options);
      if (rows.length === 0) {
        this.hide();
        return;
      }

      this.updateTooltipDots(rows);
      this.dots.style('opacity', '1');

      this.updateLinePosition(rows);
      this.line.style('opacity', '1');

      var tooltipContent = this.getTooltipContent(rows, index, options);

      if (options.tooltipHook) {
        tooltipContent = options.tooltipHook(rows);
      }

      if (!tooltipContent) {
        return;
      }

      this.updateTooltipContent(tooltipContent, index, options);
      this.updateTooltipPosition(rows);
      this.svg.style('display', null);
    }


    show(event: any, data: Utils.Data, options: Utils.Options) {
      var container: Factory.Container = this.factoryMgr.get('container');
      var coordinates = container.getCoordinatesFromEvent(event);

      this.showFromCoordinates(coordinates, data, options);
    }

    // This is the part the user can override.
    getTooltipContent(rows: INeighbour[], closestIndex: number, options: Utils.Options) {
      var xTickFormat = options.getByAxisSide(Utils.AxisOptions.SIDE.X).tickFormat;
      var yTickFormat = options.getByAxisSide(Utils.AxisOptions.SIDE.Y).tickFormat;

      var getRowValue = (d: INeighbour) => {
        var fn = yTickFormat ? (y1) => yTickFormat(y1, closestIndex) : (y1) => y1;
        var y1Label = fn(d.row.y1);

        if (d.series.hasTwoKeys()) {
          return '[' + fn(d.row.y0) + ', ' + y1Label + ']';
        } else {
          return y1Label;
        }
      };

      return {
        abscissas: xTickFormat ? xTickFormat(rows[0].row.x, closestIndex) : rows[0].row.x,
        rows: rows.map(function(row: INeighbour) {
          return {
            label: row.series.label,
            value: getRowValue(row),
            color: row.series.color,
            id: row.series.id
          };
        })
      };
    }

    updateTooltipContent(result: any, closestIndex: number, options: Utils.Options) {
      this.svg.select('.abscissas')
        .text(result.abscissas);

      var initItem = (s) => {
        s.attr({'class': 'tooltip-item'});

        s.append('div')
          .attr({'class': 'color-dot'})
          .style({
            'background-color': (d) => d.color
          });

        s.append('div')
          .attr({'class': 'series-label'});

        s.append('div')
          .attr({'class': 'y-value'});

        return s;
      };

      var updateItem = (s) => {
        s.select('.series-label')
          .text((d) => d.label);

        s.select('.y-value')
          .text((d) => d.value);

        return s;
      };

      var items = this.svg.selectAll('.tooltip-item')
        .data(result.rows, (d:any , i) => !!d.id ? d.id : i);

      items.enter()
        .append('div')
        .call(initItem)
        .call(updateItem);

      items.call(updateItem);
      items.exit().remove();
    }

    updateTooltipDots(rows: INeighbour[]) {
      var xScale = this.factoryMgr.get('x-axis').scale;
      var yScale = this.factoryMgr.get('y-axis').scale;

      var radius = 3;
      var circlePath = (r, cx, cy) => {
        return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;
      };

      var trianglePath = (r, cx, cy) => {
        return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;
      };

      var initDots = (s) => {
        s.attr('class', 'tooltip-dots-group');

        s.append('path').attr({
          'class': 'tooltip-dot y1'
        });

        s.append('path').attr({
          'class': 'tooltip-dot y0'
        }).style({
          'display': (d) => d.series.hasTwoKeys() ? null : 'none'
        });
      };

      var updateDots = (s) => {
        s.select('.tooltip-dot.y1').attr({
          'd': (d) => circlePath(radius, xScale(d.row.x), yScale(d.row.y1)),
          'stroke': (d) => d.series.color
        });

        s.select('.tooltip-dot.y0').attr({
          'd': (d) => {
            if (d.series.hasTwoKeys()) {
              return circlePath(radius, xScale(d.row.x), yScale(d.row.y0));
            }

            return '';
          },
          'stroke': (d) => d.series.color
        });
      };

      var dots = this.dots.selectAll('.tooltip-dots-group')
        .data(rows);

      dots.enter()
        .append('g')
        .call(initDots)
        .call(updateDots);

      dots.call(updateDots);
      dots.exit().remove();
    }

    updateTooltipPosition(rows: INeighbour[]) {
      var [lastRow] = rows.slice(-1);

      var xAxis = this.factoryMgr.get('x-axis');
      var yScale = this.factoryMgr.get('y-axis').scale;

      var margin = this.factoryMgr.get('container').getDimensions().margin;
      var leftOffset = this.element.offsetLeft;
      var topOffset = this.element.offsetTop;

      var xOffset = 0;
      var transform = '';

      if (xAxis.isInLastHalf(lastRow.row.x)) {
        transform = 'translate(-100%, 0)';
        xOffset = -10;
      } else {
        xOffset = 10;
      }

      this.svg
        .style({
          'left': (leftOffset + margin.left + xAxis.scale(lastRow.row.x) + xOffset) + 'px',
          'top': (topOffset + margin.top) + 'px',
          'transform': transform
        });

      return;
    }

    updateLinePosition(rows: INeighbour[]) {
      var container = <Factory.Container> this.factoryMgr.get('container');
      var dim: Utils.Dimensions = container.getDimensions();

      var [lastRow] = rows.slice(-1);

      var xAxis = this.factoryMgr.get('x-axis');

      var x = xAxis.scale(lastRow.row.x);

      this.line.attr({
        'x1': x,
        'x2': x,
        'y1': -dim.margin.top,
        'y2': dim.innerHeight
      });

      return;
    }

    hide() {
      this.svg
        .style('display', 'none');

      this.line
        .style('opacity', '0');

      this.dots
        .style('opacity', '0');
    }
  }
}
