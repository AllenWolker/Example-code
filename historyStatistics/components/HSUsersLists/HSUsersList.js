import React, {useCallback, useEffect} from 'react';
import {Div, Group, Spinner} from '@vkontakte/vkui';
import HSUsersItem from '../HSUsersItems/HSUsersItem';
import {useDispatch, useSelector} from "react-redux";
import {renderErrorPlaceholder} from "../../../../../../helpers/views";
import {cancelHSLoad, fetchHistoryStatistics} from "../../../../../../store/actions/tool/historyStatistics";

const HSUsersList = (props) => {
    const dispatch = useDispatch();
    const handleFetchHS = useCallback(() => dispatch(fetchHistoryStatistics()), [dispatch]);
    const loading = useSelector(state => state.toolHistoryStatistics.stories.loading);
    const error = useSelector(state => state.toolHistoryStatistics.stories.error);
    const history = useSelector(state => state.toolHistoryStatistics.stories.payload);
     const isOnce = useSelector(state => state.toolHistoryStatistics.stories.isOnce);
    const handleCancelHSUsersList = useCallback(() => dispatch(cancelHSLoad()), [dispatch]);


    useEffect(() => {
        return () => {
            handleCancelHSUsersList();
        }
    }, [handleCancelHSUsersList])

    useEffect(() => {
        if (!isOnce)
        handleFetchHS();
    }, [handleFetchHS, isOnce]);

    console.log('HSUsersList history', history, history?.userName)

    const renderHSUserList = () => {
        //console.log('HSUsersList history', history.userName,)
        const userName = history ? history.userName : ''
        const userPhoto = history ? history.photo_url : ''
        const id = history ? history.id : '';
        return history && history.userName ? [1].map((int, i) => {
            // console.log('friends-history', history)
            return (
                <HSUsersItem
                    title={userName}
                    key={i}
                    id={id}
                    // key={i}
                    whoStories={'friend-stories'}
                    //  description={storyCountStrFormat}
                    photo={userPhoto}
                    goView={props.goView}
                />
            )
        }) : renderErrorPlaceholder({
            error: error, loading: loading, isTryAgainHandler: handleFetchHS, defaultMessage: 'что то пошло не так'
        })
    }
    /* const renderHSGroupList = () => {
         return history.groupsStories.length > 0 ? history.groupsStories.map((history, i) => {
             //console.log('ID-history', history)
             const id = history.story.items[0].id;
             const name = history.name;
             const photo = history.photo_50 ? history.photo_50 : '';
             const storyCount = history.story.items[0].stories.length;
             const storyCountStrFormat = storyCount ? storyCount + ' ' + declOfNum(storyCount, ['история', 'истории', 'историй']) : '';
             // if (i < showCount) {
             return (
                 <HSUsersItem
                     title={name}
                     id={id}
                     key={i}
                     whoStories = {'group-stories'}
                     description={storyCountStrFormat}
                     photo={photo}
                     goView={props.goView}
                 />
             )
             // }
         }) : renderErrorPlaceholder({
             error: error, loading: loading, isTryAgainHandler: handleFetchHS
         })

     }*/
    return (
        <div className={'hs-users-list'}>
            {!loading && <Div style={{
                paddingBottom: "0px",
                fontSize: "13px",
                lineHeight: "16px",
                letterSpacing: "0.2px",
                textTransform: "uppercase",
                color: "#818C99",
            }}>Мои Истории</Div>}
            <Group separator={'hide'} style={{marginTop: "-10px"}}>
                {history !== null && error === null ? renderHSUserList() : ''}
            </Group>
            {/*
                       {!loading && <Div style={{
                paddingBottom: "0px",
                fontSize: "13px",
                lineHeight: "16px",
                letterSpacing: "0.2px",
                textTransform: "uppercase",
                color: "#818C99",
            }}>истории в сообществах</Div>}
            <Group separator={'hide'} style={{marginTop: "-10px"}}>
                {history !== null && error === null ? renderHSGroupList() : ''}
        </Group>
            */}

            {loading && <Spinner size="large" style={{margin: '20px 0'}}/>}
            {renderErrorPlaceholder({
                error: error,
                loading: loading,
                isTryAgainHandler: handleFetchHS
            })}
        </div>
    )
}

export default HSUsersList;
