'use strict'

import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions=powerbi.extensibility.visual.VisualUpdateOptions

export interface VData {
    value:number,
    target:number
}

export function transformData(options:VisualUpdateOptions){
let data:VData
try {
    const values=options.dataViews[0].categorical.values
    data={
        value:<number>values[0]?.values[0],
        target:<number>values[1]?.values[0]
    }
} catch (error) {
    data={
        value:0,
        target:0
    }
    console.log(error)
}

return data
}