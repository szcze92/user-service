module n3Charts.Factory {
  'use strict';

  export class Zoom extends Utils.BaseFactory {

    public behavior: D3.Behavior.Zoom;

    create() {
      this.behavior = d3.behavior.zoom();
    }

    update(data:Utils.Data, options:Utils.Options) {
      var xAxis = this.factoryMgr.get('x-axis');
      var yAxis = this.factoryMgr.get('y-axis');

      if (options.pan.x) {
        this.behavior.x(xAxis.scale);
      }

      if (options.pan.y) {
        this.behavior.y(yAxis.scale);
      }

      if (!options.pan.x && !options.pan.y) {
        return;
      }

      var y2Axis = this.factoryMgr.get('y2-axis');
      var eventMgr = this.eventMgr;
      var transitions = this.factoryMgr.get('transitions');

      this.behavior
        .scaleExtent([1, 1])
        .on('zoom', function() {
          // This will need to be done better when actually having y2 axes...
          y2Axis.scale.domain(yAxis.scale.domain());

          // Turning off and on transitions so that panning/zooming feels quick and
          // reactive
          transitions.off();
          eventMgr.trigger('zoom', d3.event.sourceEvent.target);
          transitions.on();
        });

      this.factoryMgr.get('container').svg.call(this.behavior);

      // This is to allow scroll, we don't actually care about zoom here,
      // despite the name...
      this.factoryMgr.get('container').svg.on('wheel.zoom', null);
      this.factoryMgr.get('container').svg.on('mousewheel.zoom', null);
    }
  }
}
