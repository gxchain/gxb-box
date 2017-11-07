import {province} from './province';
import {city} from './city';
import {area} from './area';

let areaList = [];

for (let i=0; i<province.length; i++){
    areaList[i] = {};
    areaList[i].value = province[i].id;
    areaList[i].label = province[i].name;
    areaList[i].children = [];

    for (let j=0; j<city[areaList[i].value].length; j++){
        areaList[i].children[j] = {};
        areaList[i].children[j].value = city[areaList[i].value][j].id;
        areaList[i].children[j].label = city[areaList[i].value][j].name;
        areaList[i].children[j].children = [];
        for (let k=0; k<area[areaList[i].children[j].value].length; k++){
            areaList[i].children[j].children[k] = {};
            areaList[i].children[j].children[k].value = area[areaList[i].children[j].value][k].id;
            areaList[i].children[j].children[k].label = area[areaList[i].children[j].value][k].name;
        }
    }
}

export {areaList};