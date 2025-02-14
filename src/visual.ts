/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import { select, Selection } from "d3-selection";
import { transformData, VData } from "./transformdata";

import { VisualSettings } from "./settings";
export class Visual implements IVisual {
  private target: HTMLElement;
  private settings: VisualSettings;
  private data: VData;
  private iconContainer: HTMLElement;
  private svg: Selection<SVGElement, any, HTMLElement, any>;
  private svgPath: Selection<SVGElement, any, HTMLElement, any>;

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.target = options.element;
    if (document) {
      this.iconContainer = document.createElement('div');
      this.iconContainer.classList.add('icon-container');
      this.target.appendChild(this.iconContainer);
      this.svg = select(this.iconContainer).append('svg');
      this.svgPath = this.svg.append('path');
    }
  }

  public update(options: VisualUpdateOptions) {
    this.settings = Visual.parseSettings(
      options && options.dataViews && options.dataViews[0]
    );
    console.log("Visual update", options);
    this.data = transformData(options);
    console.log(this.data);
    this.iconContainer.style.width = `${options.viewport.height}`;
    this.iconContainer.style.height = `${options.viewport.height}`;
    this.svg.attr('viewBox', '0 0 256 256');
    this.svg.attr('width', '100%');
    this.svg.attr('height', '100%');
    this.svg.attr('fill', this.settings.dataPoint.defaultColor);

    console.log('Data value:', this.data.value);
    console.log('Data target:', this.data.target);


    if (this.data.value < this.data.target) {
      this.svgPath.attr(
        'd',
        `M128.19,0.001c7.784,0.103
         15.268,4.679 18.878,11.667c35.897,71.008 71.454,142.187 106.748,213.496c6.175,12.734
          -3.077,30.641 -19.057,30.835c-71.172,0.288 -142.346,0.288 -213.518,0c-14.181,-0.172 -25.951,-16.619
           -19.057,-30.835c35.294,-71.309 70.851,-142.488 106.748,-213.496c3.657,-7.079 
           10.982,-11.704 19.258,-11.667Zm-102.592,231.999l204.804,0l-102.402,-204.805c-34.134,68.269 -68.268,136.537
           -102.402,204.805Zm117.66,-41.284l-0.744,28.284l-32.378,0l0.745,-28.284l32.377,0Zm2.606,-97.877l-9.304,78.525l-17.678,0l-6.885,-78.525l33.867,0Z`
      );
    } else{
        this.svgPath.attr(
            'd',
            `M128.414,0.001c52.33,0.249 102.675,34.861
             120.473,85.851c13.431,38.477 7.176,83.343
            -16.964,116.851c-23.478,32.59 -62.928,53.168
            -103.509,53.296c-47.58,0.151 -94.332,-28.377
            -115.615,-72.177c-20.156,-41.481 -15.868,-94.034 12.414,-132.078c23.528,-31.648
            62.108,-51.3 101.547,-51.738c0.551,-0.004 1.102,-0.006 1.654,-0.005Zm-0.752,24c-26.075,0.124
            -51.765,10.342 -70.713,28.087c-31.788,29.771 -42.37,80.166 -22.7,120.961c16.903,35.058 54.512,59.076
            94.089,58.95c44.066,-0.139 86.545,-30.776 99.451,-74.615c7.557,-25.67 4.729,-54.36 -7.887,-78.084c-17.654,-33.195
            -54.196,-55.36 -92.24,-55.299Zm61.992,47.373c-10.355,27.303 -38.272,90.906
            -50.998,118.208l-36.455,0c-12.727,-27.302 -25.238,-55.422 -35.592,-82.56l30.631,-1.635c7.118,19.618
            14.884,40.544 23.081,60.49l1.725,0c7.982,-19.783 30.074,-75.047 36.761,-94.503l30.847,0Z`
          );
    }
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }
}
