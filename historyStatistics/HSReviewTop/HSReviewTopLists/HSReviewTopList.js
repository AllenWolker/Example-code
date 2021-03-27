import React, {useCallback, useEffect} from 'react';
import {Group, Spinner, Tabs, TabsItem} from '@vkontakte/vkui';
import HSReviewTopItem from '../HSReviewTopItems/HSReviewTopItem';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchHSTopReviews,
    tabsChooseTopReviews
} from "../../../../../../store/actions/tool/historyStatistics";
import {renderErrorPlaceholder} from "../../../../../../helpers/views";
import {declOfNum} from "../../../../../../helpers/strings";
import {TABS_MALE, TABS_FEMALE, TABS_ALL,} from "../../../../../moycrush/panels/chooseCrush/constTabs";
import HeadTitle from "../../../../../../components/HeadTitle/HeadTitle";

const HSReviewTopList = (props) => {
    const dispatch = useDispatch();
    const handleFetchHSHistoryTopReviews = useCallback(() => dispatch(fetchHSTopReviews()), [dispatch]);
    const handleHSTabsTopReviews = useCallback((tabs) => dispatch(tabsChooseTopReviews(tabs)), [dispatch]);
    const loading = useSelector(state => state.toolHistoryStatistics.stories.loading);
    const error = useSelector(state => state.toolHistoryStatistics.stories.error);
    const history = useSelector(state => state.toolHistoryStatistics.stories.payload);
    const activeTopReviews = useSelector(state => state.toolHistoryStatistics.stories.activeTopReviews);
    const tabs = useSelector(state => state.toolHistoryStatistics.stories.reviewTopTabs);

    useEffect(() => {
        handleFetchHSHistoryTopReviews()
    }, [handleFetchHSHistoryTopReviews]);

    //console.log('activeTopReviews', activeTopReviews, tabs)

    const renderHSHistoryTopReviews = () => {
        history.spectatorsUserInfo.spectatorsProfile.sort(function (a, b) {
            if (a.views < b.views) {
                return 1;
            }
            if (a.views > b.views) {
                return -1;
            }
            return 0;
        });
        console.log('renderHSHistoryTopReviews', activeTopReviews, tabs)
        return history && history.response.length > 0 && activeTopReviews === "views" ? history.spectatorsUserInfo.spectatorsProfile.map((user, i) => {
            let name = user.first_name + ' ' + user.last_name;
            let view = user.views
            let id = user.id
            let sex = user.sex
            let photo = user.photo_100 ? user.photo_100 : '';
            const viewsCountStrFormat = view ? view + ' ' + declOfNum(view, ['просмотр', 'просмотра', 'просмотров']) : '';

            if (tabs && tabs !== "0") {
                if (tabs === "1") {
                    if (sex === 1) {
                        return (
                            <HSReviewTopItem
                                title={name}
                                id={id}
                                key={i}
                                sex={sex}
                                count={i + 1}
                                description={viewsCountStrFormat}
                                photo={photo}
                                goView={props.goView}
                            />
                        )
                    }
                } else if (tabs === "2") {
                    if (sex === 2) {
                        return (
                            <HSReviewTopItem
                                title={name}
                                id={id}
                                key={i}
                                sex={sex}
                                count={i + 1}
                                description={viewsCountStrFormat}
                                photo={photo}
                                goView={props.goView}
                            />
                        )
                    }
                }
            } else {
                return (
                    <HSReviewTopItem
                        title={name}
                        id={id}
                        key={i}
                        sex={sex}
                        count={i + 1}
                        description={viewsCountStrFormat}
                        photo={photo}
                        goView={props.goView}
                    />
                )
            }
            return null;

        }) : renderErrorPlaceholder({
            error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryTopReviews
        })
    }
    const renderHSHistoryTopLikes = () => {
        history.spectatorsUserInfo.spectatorsProfile.sort(function (a, b) {
            if (a.likes < b.likes) {
                return 1;
            }
            if (a.likes > b.likes) {
                return -1;
            }
            return 0;
        });
        return history && history.response.length > 0 && activeTopReviews === "likes" ? history.spectatorsUserInfo.spectatorsProfile.map((user, i) => {
            let name = user.first_name + ' ' + user.last_name;
            let likes = user.likes
            let id = user.id
            let sex = user.sex
            let photo = user.photo_100 ? user.photo_100 : '';
            const likesCountStrFormat = likes ? likes + ' ' + declOfNum(likes, ['лайк', 'лайка', 'лайков']) : '';
            if (likes > 0) {
                if (tabs && tabs !== "0") {
                    if (tabs === "1") {
                        if (sex === 1) {
                            return (
                                <HSReviewTopItem
                                    title={name}
                                    id={id}
                                    key={i}
                                    sex={sex}
                                    count={i + 1}
                                    description={likesCountStrFormat}
                                    photo={photo}
                                    goView={props.goView}
                                />
                            )
                        }
                    } else if (tabs === "2") {
                        console.log('SEX 2', tabs, sex)
                        if (sex === 2) {
                            return (
                                <HSReviewTopItem
                                    title={name}
                                    id={id}
                                    key={i}
                                    sex={sex}
                                    count={i + 1}
                                    description={likesCountStrFormat}
                                    photo={photo}
                                    goView={props.goView}
                                />
                            )
                        }
                    }
                } else {
                    return (
                        <HSReviewTopItem
                            title={name}
                            id={id}
                            key={i}
                            sex={sex}
                            count={i + 1}
                            description={likesCountStrFormat}
                            photo={photo}
                            goView={props.goView}
                        />
                    )
                }
            }
            return null;
        }) : renderErrorPlaceholder({
            error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryTopReviews
        })
    }
    const renderHSHistoryTopReplies = () => {
        history.spectatorsReplies.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            return 0;
        });
        return history && history.response.length > 0 && activeTopReviews === "replies"
            ? history.spectatorsReplies.map((user, i) => {
                let name = user.name;
                let replies = user.count
                let id = user.id
                let sex = user.sex
                let photo = user.photo_url ? user.photo_url : '';
                const repliesCountStrFormat = replies ? replies + ' ' + declOfNum(replies, ['ответ', 'ответа', 'ответов']) : '';
                if (replies > 0) {
                    if (tabs && tabs !== "0") {
                        if (tabs === "1") {
                            if (sex === 1) {
                                return (
                                    <HSReviewTopItem
                                        title={name}
                                        id={id}
                                        key={i}
                                        sex={sex}
                                        count={i + 1}
                                        description={repliesCountStrFormat}
                                        photo={photo}
                                        goView={props.goView}
                                    />
                                )
                            }
                        } else if (tabs === "2") {
                            if (sex === 2) {
                                return (
                                    <HSReviewTopItem
                                        title={name}
                                        id={id}
                                        key={i}
                                        sex={sex}
                                        count={i + 1}
                                        description={repliesCountStrFormat}
                                        photo={photo}
                                        goView={props.goView}
                                    />
                                )
                            }
                        }
                    } else {
                        return (
                            <HSReviewTopItem
                                title={name}
                                id={id}
                                key={i}
                                sex={sex}
                                count={i + 1}
                                description={repliesCountStrFormat}
                                photo={photo}
                                goView={props.goView}
                            />
                        )
                    }
                }
                return null;
            }) : renderErrorPlaceholder({
                error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryTopReviews
            })
    }
    /*const renderHSHistoryTopReposts = () => {
        history.spectatorsReplies.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            return 0;
        });
        return history && history.response.length > 0
            ? history.spectatorsReplies.map((user, i) => {
                if (i < 3) {
                    let name = user.name;
                    let reposts = user.count
                    let id = user.id
                    let sex = user.sex
                    let photo = user.photo_url ? user.photo_url : '';
                    const repliesCountStrFormat = reposts ? reposts + ' ' + declOfNum(reposts, ['репост', 'репоста', 'репостов']) : '';
                    if (reposts > 0) {
                        if (tabs && tabs !== "0") {
                            if (tabs === "1") {
                                if (sex === 1) {
                                    return (
                                        <HSReviewTopItem
                                            title={name}
                                            id={id}
                                            key={i}
                                            sex={sex}
                                            count={i + 1}
                                            description={repliesCountStrFormat}
                                            photo={photo}
                                            goView={props.goView}
                                        />
                                    )
                                }
                            } else if (tabs === "2") {
                                if (sex === 2) {
                                    return (
                                        <HSReviewTopItem
                                            title={name}
                                            id={id}
                                            key={i}
                                            sex={sex}
                                            count={i + 1}
                                            description={repliesCountStrFormat}
                                            photo={photo}
                                            goView={props.goView}
                                        />
                                    )
                                }
                            }
                        } else {
                            return (
                                <HSReviewTopItem
                                    title={name}
                                    id={id}
                                    key={i}
                                    sex={sex}
                                    count={i + 1}
                                    description={repliesCountStrFormat}
                                    photo={photo}
                                    goView={props.goView}
                                />
                            )
                        }
                    }
                }
            }) : renderErrorPlaceholder({
                error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryTopReviews
            })
    }

     */
    const setTabsSex = (tabs) => {
        //   console.log('setTabsSex', tabs)
        if (!loading) {
            console.log('setTabsSex', tabs)
            handleHSTabsTopReviews(tabs)
        }
    }
    return (
        <div >
                <HeadTitle>
                    {activeTopReviews === "replies" ? "Топ по ответам" :
                        activeTopReviews === "views" ? "Топ по просмотрам" :
                            activeTopReviews === "likes" ? "Топ по лайкам"
                                : "Топ по репостам"}
                </HeadTitle>
            <Tabs>
                <TabsItem
                    disabled={loading}
                    onClick={() => setTabsSex(TABS_ALL)}
                    selected={tabs === TABS_ALL}

                >
                    Все
                </TabsItem>
                <TabsItem
                    disabled={loading}
                    onClick={() => setTabsSex(TABS_MALE)}
                    selected={tabs === TABS_MALE}
                >
                    Мужчины
                </TabsItem>
                <TabsItem
                    disabled={loading}
                    onClick={() => setTabsSex(TABS_FEMALE)}
                    selected={tabs === TABS_FEMALE}
                >
                    Женщины
                </TabsItem>
            </Tabs>

            <Group
                style={{marginBottom: '20px'}}>
                {error === null ? renderHSHistoryTopReviews(tabs) : ''}
                {error === null ? renderHSHistoryTopLikes(tabs) : ''}
                {error === null ? renderHSHistoryTopReplies(tabs) : ''}
            </Group>
            {loading && <Spinner size="large" style={{margin: '20px 0'}}/>}
            {renderErrorPlaceholder({
                error: error,
                loading: loading,
                isTryAgainHandler: handleFetchHSHistoryTopReviews
            })}
        </div>
    )
}

export default HSReviewTopList;
