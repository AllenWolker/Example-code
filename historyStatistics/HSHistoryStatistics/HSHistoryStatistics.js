import React from 'react';

import PanelHeaderWithPath from 'components/PanelHeaderWithPath/PanelHeaderWithPath';
import HSHistoryStatisticsList from "./HSHistoryStatisticsLists/HSHistoryStatisticsList";
import {Panel} from "@vkontakte/vkui";

const PanelHSHistoryStatistics = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeaderWithPath goBack={props.goBack}>Статистика историй</PanelHeaderWithPath>
            <HSHistoryStatisticsList goView={props.goView}/>
        </Panel>
    )
}

export default PanelHSHistoryStatistics;