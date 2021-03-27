import React from 'react';
import {Avatar, SimpleCell} from '@vkontakte/vkui';
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron';
import {VIEW_TOOL} from "../../../../../constViews";
import {PANEL_PROFILE} from "../../../../../profile/panels/constPanels";

const HSReviewTopItem = (props) => {
    return (
        <span   style={{  display: "flex"}}>
            <span style={{
                paddingLeft: "16px",
                paddingRight: "4px",
                alignSelf: "center",
                fontSize: "14px",
                lineHeight: "18px",
                letterSpacing: "0.2px",
                fontWeight: "bold",
                color: "#99A2AD",
            }}>{props.count}</span>
                    <SimpleCell
                        style={{width: "100%"}}
                        id={props.id}
                        before={<Avatar size={48} src={props.photo} />}
                        description={ props.description }
                        onClick={() => props.goView(VIEW_TOOL, PANEL_PROFILE, {
                            activeProfileId: props.id,
                        })}
                        after={<Icon16Chevron fill='#B8C1CC' />}
                    >
            { props.title }
        </SimpleCell>
        </span>

    )
}

export default HSReviewTopItem;
