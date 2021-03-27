import React from 'react';
import './HSHistoryStatisticsItem.scss';
import Icon24Message from '@vkontakte/icons/dist/24/message';
import Icon12View from '@vkontakte/icons/dist/12/view';
import Icon16Like from '@vkontakte/icons/dist/16/like_outline';
import Icon12Repost from '@vkontakte/icons/dist/12/repost';
const HSHistoryStatisticsItem = (props) => {
    let menuIcon = [<Icon12View width={14} height={10}/>
        , <Icon16Like width={12} height={10}/>
        , <Icon24Message width={12} height={10}/>
        , <Icon12Repost width={12} height={10}/>]

    return (
        <>
            <div className='tool-hs-history-statistics-item__container'
                 onClick={
                   props.tops?  () => {
                         // eslint-disable-next-line array-callback-return
                         [1].map(() => {
                             window.open(`https://vk.com/feed?w=story${props.ownerId}_${props.storyId}`, '_blank');
                         })
                     }:''}
            >
                <img style={{position: 'absolute', zIndex: '1'}} src={props.photo} width={104} height={156} alt=''/>
                <div
                    className={'tool-hs-history-statistics-item__bottomIndicator'}
                >
                    {props.tops === 'viewers' ? menuIcon[0]
                        : props.tops === 'likes' ? menuIcon[1]
                            : props.tops === 'message' ? menuIcon[2]
                                : props.tops === 'reposts' ? menuIcon[3] : ''
                    }
                    <span>{props.count}</span>
                </div>
            </div>
        </>
    )
}

export default HSHistoryStatisticsItem;