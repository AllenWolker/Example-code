import React from 'react';

import PanelHeaderWithPath from 'components/PanelHeaderWithPath/PanelHeaderWithPath';
import HSReviewTopList from "./HSReviewTopLists/HSReviewTopList";
import {Panel} from "@vkontakte/vkui";

const PanelHSReviewTop = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeaderWithPath goBack={props.goBack}>Статистика историй</PanelHeaderWithPath>
            <HSReviewTopList goView={props.goView}/>
        </Panel>
    )
}

export default PanelHSReviewTop;