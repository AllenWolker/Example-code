import React from 'react';
import {Avatar, SimpleCell} from '@vkontakte/vkui';
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron';
import {VIEW_TOOL} from "../../../../../constViews";
import {PANEL_HS__HISTORY_STATISTICS} from "../../../constPanels";

const HSUsersItem = (props) => {
    return (
        <SimpleCell
            id={props.id}
            before={<Avatar size={48} src={props.photo} />}
            description={ props.description }
            onClick={() => props.goView(VIEW_TOOL, PANEL_HS__HISTORY_STATISTICS, {
                activeUserId: props.id,
                activeUserPhoto: props.photo,
                activeUserTitle: props.title,
                activeUserDescription: props.whoStories,
                //  activeUserStoryLink: props.storyLink
            })}
            after={<Icon16Chevron fill='#B8C1CC' />}
        >
            { props.title }
        </SimpleCell>
    )
}

export default HSUsersItem;
