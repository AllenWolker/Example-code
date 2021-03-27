import React from 'react';
import './HSHistorySpectatorsItem.scss';


const HSHistorySpectatorsGraphicsItem = (props) => {
    //let graphicPercent = 200 * (props.percent / 100);
    let sexAgeGraphicLine1 = 200 * (props.percentLine1 / 100);
    let sexAgeGraphicLine2 = props.percentLine2 ? 200 * (props.percentLine2 / 100) : undefined;
    return (
        <span className={'tool-hs-history-spectators-graphics-item'}>
        <div className={'tool-hs-history-spectators-graphics-item__title'}>{props.title}</div>
       <div
           className={`tool-hs-history-spectators-graphics-item__line__container ${props.percentLine2 ? 'tool-hs-history-spectators-graphics-item__line_sex_and_age' : ''}`}>
               <span>
            <div className={'tool-hs-history-spectators-graphics-item__cell_geo_graphic'}
                 style={{width: `${sexAgeGraphicLine1}px`}}/>
            <div>{props.percentLine1}%</div>
        </span>
           {sexAgeGraphicLine2 ? <span>
                <div className={'tool-hs-history-spectators-graphics-item__cell_geo_graphic_two'}
                     style={{width: `${sexAgeGraphicLine2}px`}}/>
                <div>{props.percentLine2}%</div>
            </span> : ''}
       </div>

        </span>

    )
}

export default HSHistorySpectatorsGraphicsItem;