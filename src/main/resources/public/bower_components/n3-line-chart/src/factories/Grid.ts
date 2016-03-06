module n3Charts.Factory {
  'use strict';

  export class Grid extends Utils.BaseFactory {

    public svg: D3.Selection;
    public xAxis: D3.Svg.Axis;
    public yAxis: D3.Svg.Axis;

    create() {
      this.svg = this.factoryMgr.get('container').axes
        .insert('g', ':first-child')
          .attr('class', 'grid');

      this.svg.append('g').classed('x-grid', true);
      this.svg.append('g').classed('y-grid', true);
    }


    update(data:Utils.Data, options:Utils.Options) {
      var container = <Factory.Container> this.factoryMgr.get('container');
      var dim: Utils.Dimensions = container.getDimensions();

      if (options.grid.x) {
        var xAxis = <D3.Svg.Axis> this.factoryMgr.get('x-axis').cloneAxis();

        this.svg.select('.x-grid')
          .transition()
          .call(this.factoryMgr.get('transitions').edit)
          .attr('transform', 'translate(0, ' + dim.innerHeight + ')')
          .call(xAxis.tickSize(-dim.innerHeight, 0));
      }

      if (options.grid.y) {
        var yAxis = <D3.Svg.Axis> this.factoryMgr.get('y-axis').cloneAxis();


        this.svg.select('.y-grid')
          .transition()
          .call(this.factoryMgr.get('transitions').edit)
          .call(yAxis.tickSize(-dim.innerWidth, 0));
      }
    }

    destroy() {
      this.svg.remove();
    }
  }
}
