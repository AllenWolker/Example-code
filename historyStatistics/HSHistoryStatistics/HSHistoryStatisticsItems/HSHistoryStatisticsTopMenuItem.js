import React from 'react';
import './HSHistoryStatisticsItem.scss';

import {SimpleCell} from "@vkontakte/vkui";
import Icon24MessageOutline from '@vkontakte/icons/dist/24/message_outline';
import Icon12View from '@vkontakte/icons/dist/12/view';
import Icon16LikeOutline from '@vkontakte/icons/dist/16/like_outline';
import Icon16ReplyOutline from '@vkontakte/icons/dist/16/reply_outline';
import Icon20StoryOutline from '@vkontakte/icons/dist/20/story_outline';
const HSHistoryStatisticsTopMenuItem = (props) => {
    let menuIcon=[<Icon20StoryOutline width={22} height={22}/>,<Icon12View  width={23} height={16}/>,<Icon16LikeOutline  width={23} height={20}/>,<Icon24MessageOutline  width={23} height={21}/>,<Icon16ReplyOutline  width={24} height={20}/>]
    return (
        <>
            <div className='tool-hs-statistics-history-item__top-menu'>
                <SimpleCell
                    style={{fontSize: "16px",
                        letterSpacing: "0.1px",}}
                    //onClick={() => this.setState({activePanel: 'nothing'})}
                    indicator={props.indicator}
                    before={menuIcon[props.id]}
                >{props.description}
                </SimpleCell>

            </div>
        </>
    )
}

export default HSHistoryStatisticsTopMenuItem;
