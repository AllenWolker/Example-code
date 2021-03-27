import React from 'react';

import PanelHeaderWithPath from 'components/PanelHeaderWithPath/PanelHeaderWithPath';
import { Panel } from '@vkontakte/vkui';
import HSBanner from "./components/HSBanner/HSBanner";
import HSUsersList from "./components/HSUsersLists/HSUsersList";

const PanelHistoryStatistics = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeaderWithPath goBack={props.goBack}>Статистика историй</PanelHeaderWithPath>
            <HSBanner/>
            <HSUsersList goView={props.goView}/>

        </Panel>

    )
}

export default PanelHistoryStatistics;