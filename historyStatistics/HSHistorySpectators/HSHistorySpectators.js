import React from 'react';

import PanelHeaderWithPath from 'components/PanelHeaderWithPath/PanelHeaderWithPath';
import HSHistorySpectatorsList from "./HSHistorySpectatorsLists/HSHistorySpectatorsList";
import {Panel} from "@vkontakte/vkui";

const PanelHSHistorySpectators = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeaderWithPath goBack={props.goBack}>Статистика историй</PanelHeaderWithPath>
            <HSHistorySpectatorsList goView={props.goView}/>
        </Panel>
    )
}

export default PanelHSHistorySpectators;