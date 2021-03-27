import React, {useCallback, useEffect} from 'react';
import {Group, Spinner, Header, Tabs, TabsItem, CardScroll, Link, Div} from '@vkontakte/vkui';
import HSHistoryStatisticsItem from '../HSHistoryStatisticsItems/HSHistoryStatisticsItem';
import {useDispatch, useSelector} from "react-redux";
import HSHistoryStatisticsTopMenuItem from "../HSHistoryStatisticsItems/HSHistoryStatisticsTopMenuItem";
import {
    PANEL_HS__HISTORY_SPECTATORS,
    PANEL_HS__HISTORY_STATISTICS,
} from "../../../constPanels";
import {VIEW_TOOL} from "../../../../../constViews";
import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import {renderErrorPlaceholder} from "../../../../../../helpers/views";
import {
    fetchHistoryStatistics, HistorySetPeriod,
    setHSPeriod,
    tabsChooseStatisticsTabs
} from "../../../../../../store/actions/tool/historyStatistics";
import {TABS_HISTORY, TABS_SPECTATORS} from "../../constTabs";
import {
    PERIOD_ALL,
    PERIOD_MONTH,
    PERIOD_TODAY, PERIOD_TWO_WEEK,
} from "../../../../../../template/popouts/DateChangePeriod/constPeriod";
import {closePopout, openPopout} from "../../../../../../store/actions/page";
import PopoutTemplateDateChangeHSPeriod from "../../../../../../template/popouts/DateChangePeriod/DateChangeHSPeriod";

const HSHistoryStatisticsList = (props) => {

    const dispatch = useDispatch();
    const handleFetchHSHistoryStatistics = useCallback(() => dispatch(fetchHistoryStatistics()), [dispatch]);
    const loading = useSelector(state => state.toolHistoryStatistics.stories.loading);
    const error = useSelector(state => state.toolHistoryStatistics.stories.error);
    const history = useSelector(state => state.toolHistoryStatistics.stories.payload);
    // const tabs = useSelector(state => state.toolHistoryStatistics.stories.hsHistoryTabs);
    const handleHSHistoryTabs = useCallback((tabs) => dispatch(tabsChooseStatisticsTabs(tabs)), [dispatch]);
    const handleOpenPopout = useCallback((popout) => dispatch(openPopout(popout)), [dispatch]);
    const handleClosePopout = useCallback(() => dispatch(closePopout()), [dispatch]);
    const period = useSelector(state => state.toolHistoryStatistics.stories.period);
    const handleSetPeriodHS = useCallback((name, atMin = null, atMax = null) => dispatch(setHSPeriod(name, atMin, atMax)), [dispatch]);
    const handleTakePeriod = useCallback(() => dispatch(HistorySetPeriod()), [dispatch]);
    let tabs = TABS_HISTORY
    useEffect(() => {
        console.log('handleTakePeriod')
        //  if (!isOnce)
        handleTakePeriod();
    }, [handleTakePeriod]);



    console.log('HSHistoryStatisticsList history', history)

    const topMenuItems = [
        'Опубликовано',
        'Просмотров',
        'Лайков',
        'Ответов',
        'Репостов'
    ]
    const renderPeriod = ({title, period, handler}) => {
        if (period.atMax === null && period.name !== 'all') handleTakePeriod();
        //const {atMin, atMax} =  getPeriod(period);
        console.log("renderPeriod", period,)
        let str = '';
        if (period) {
            switch (period.name) {
                case PERIOD_MONTH:
                    str = 'За месяц';
                    break;
                case PERIOD_TODAY:
                    str = 'За сегодня';
                    break;
                case PERIOD_TWO_WEEK:
                    str = 'За 14 дней';
                    break;
                case PERIOD_ALL:
                    str = 'За всё время';
                    break;
                default:
                    str = ''
                    break;
            }
        }
        return (
            <Div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontWeight: 'bold', fontSize: '20px', color: 'var(--color-000)'}}>{title}</span>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Link onClick={handler} style={{marginRight: '2px', whiteSpace: 'nowrap'}}>{str}</Link>
                        <Icon16Dropdown fill='var(--color-other-link)'/>
                    </div>
                </div>
            </Div>
        )
    }
    const onClickPeriod = () => {
        if (loading)
            return false;

        handleOpenPopout(
            <PopoutTemplateDateChangeHSPeriod
                goView={props.goView}
                backPanel={PANEL_HS__HISTORY_STATISTICS}
                backView={VIEW_TOOL}
                period={period} // Период из redux store
                setPeriod={handleSetPeriodHS} // action из redux
                panelTitle={'Статистика историй'}
                closePopout={handleClosePopout}
            />
        );
    }
    const renderHSHistoryStatisticsTopMenu = () => {
        let answers = 0
        let views = 0
        let likes = 0
        let reposts = 0
        let publicStories = 0
        // eslint-disable-next-line no-unused-expressions
        history && history.response.length > 0 ? history.response.map(story => {
            if ((period.atMin <= story.date && period.atMax >= story.date)
                || (period.atMin === null && period.atMax === null)) {
                answers += story.answers_count;
                views += story.views;
                likes += story.likes_count;
                reposts += story.reposts_count
                publicStories++
            }
            return null
        }) : ''
        //const userName = history.userName
        const userPhoto = history.photo_url
        return history && history.response ? topMenuItems.map((name, id) => {
            //  console.log('friends-history', history)
            let count = 0
            switch (name) {
                case "Лайков":
                    count = likes
                    break;
                case "Репостов" :
                    count = reposts
                    break;
                case "Опубликовано":
                    count = publicStories
                    break;
                case "Просмотров":
                    count = views
                    break;
                case "Ответов":
                    count = answers
                    break;
                default:
                    break
            }
            return (
                <HSHistoryStatisticsTopMenuItem
                    description={name}
                    key={id}
                    id={id}
                    indicator={count}
                    whoStories={'friend-stories'}
                    photo={userPhoto}
                    goView={props.goView}
                />
            )
        }) : renderErrorPlaceholder({
            error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryStatistics
        })
    }

    const renderHSHistoryStatisticsTopViews = () => {
        history.response.sort(function (a, b) {
            if (a.views < b.views) {
                return 1;
            }
            if (a.views > b.views) {
                return -1;
            }
            return 0;
        });



        history.response.map(size => {
         //   console.log("SIZE ERROR",size?.photo?.sizes, "length",size?.photo?.sizes.length,"URL",size?.photo?.sizes?.url,'HEIGTH',size?.photo?.sizes?.height);
            // eslint-disable-next-line no-unused-expressions
           size.type==="photo"? size.photo.sizes.sort(function (a, b) {
                if (a.height > b.height) {
                    return 1;
                }
                if (a.height < b.height) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }):''
            return null
        })
        //console.log('history.response', history.response)
        return history && history.response
            ? history.response.map((view, i) => {
              //  console.log("atMin", period.atMin, view.date, period.atMax)
                if ((period.atMin <= view.date && period.atMax >= view.date)
                    || (period.atMin === null && period.atMax === null&&view)) {
                    console.log("VIEW", view)
                    return (
                        <HSHistoryStatisticsItem
                            count={view.views}
                            tops={'viewers'}
                            storyId={view.id}
                            ownerId={view.owner_id}
                            key={i}
                            // description={'11 историй'}
                            photo={view?.photo?.sizes ? view.photo.sizes[4].url : view?.video?.first_frame? view.video.first_frame[view.video.first_frame.length-1]: '' }
                            goView={props.goView}
                        />
                    )
                }
                return null
            }) : renderErrorPlaceholder({
                error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryStatistics
            })
    }
    const renderHSHistoryStatisticsTopLikes = () => {
        history.response.sort(function (a, b) {
            if (a.likes_count < b.likes_count) {
                return 1;
            }
            if (a.likes_count > b.likes_count) {
                return -1;
            }
            return 0;
        });
        history.response.map(size => {
            // eslint-disable-next-line no-unused-expressions
            size.type==="photo"? size.photo.sizes.sort(function (a, b) {
                if (a.height > b.height) {
                    return 1;
                }
                if (a.height < b.height) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }):""
            return null
        })
        return history && history.response.length > 0
            ? history.response.map((like, i) => {
                if ((period.atMin <= like.date && period.atMax >= like.date)
                    || (period.atMin === null && period.atMax === null)) {
                    return (
                        <HSHistoryStatisticsItem
                            count={like.likes_count}
                            storyId={like.id}
                            ownerId={like.owner_id}
                            tops={'likes'}
                            key={i}
                            // description={'11 историй'}
                            photo={like?.photo?.sizes ? like.photo.sizes[4].url : like?.video?.first_frame? like.video.first_frame[like.video.first_frame.length-1]: '' }
                            goView={props.goView}
                        />
                    )
                }
                return null
            }) : renderErrorPlaceholder({
                error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryStatistics
            })
    }
    const renderHSHistoryStatisticsTopAnswers = () => {
        history.response.sort(function (a, b) {
            if (a.answers_count < b.answers_count) {
                return 1;
            }
            if (a.answers_count > b.answers_count) {
                return -1;
            }
            return 0;
        });
        history.response.map(size => {
            // eslint-disable-next-line no-unused-expressions
            size.type==="photo"? size.photo.sizes.sort(function (a, b) {
                if (a.height > b.height) {
                    return 1;
                }
                if (a.height < b.height) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }):''
            return null
        })
        return history && history.response.length > 0
            ? history.response.map((answer, i) => {
                if ((period.atMin <= answer.date && period.atMax >= answer.date)
                    || (period.atMin === null && period.atMax === null)) {
                    return (
                        <HSHistoryStatisticsItem
                            storyId={answer.id}
                            ownerId={answer.owner_id}
                            count={answer.answers_count}
                            tops={'message'}
                            key={i}
                            // description={'11 историй'}
                            photo={answer?.photo?.sizes ? answer.photo.sizes[4].url : answer?.video?.first_frame? answer.video.first_frame[answer.video.first_frame.length-1]: '' }
                            goView={props.goView}
                        />
                    )
                }
                return null
            }) : renderErrorPlaceholder({
                error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryStatistics
            })
    }
    const renderHSHistoryStatisticsTopReposts = () => {
        history.response.sort(function (a, b) {
            if (a.reposts_count < b.reposts_count) {
                return 1;
            }
            if (a.reposts_count > b.reposts_count) {
                return -1;
            }
            return 0;
        });
        history.response.map(size => {

            // eslint-disable-next-line no-unused-expressions
            size.type==="photo"? size.photo.sizes.sort(function (a, b) {
                if (a.height > b.height) {
                    return 1;
                }
                if (a.height < b.height) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }):''
            return null
        })
        return history && history.response.length > 0
            ? history.response.map((repost, i) => {
                if ((period.atMin <= repost.date && period.atMax >= repost.date)
                    || (period.atMin === null && period.atMax === null)) {
                    return (
                        <HSHistoryStatisticsItem
                            storyId={repost.id}
                            ownerId={repost.owner_id}
                            count={repost.reposts_count}
                            tops={'reposts'}
                            key={i}
                            // description={'11 историй'}
                            photo={repost?.photo?.sizes ? repost.photo.sizes[4].url : repost?.video?.first_frame? repost.video.first_frame[repost.video.first_frame.length-1]: '' }
                            goView={props.goView}
                        />
                    )
                }
                return null
            }) : renderErrorPlaceholder({
                error: error, loading: loading, isTryAgainHandler: handleFetchHSHistoryStatistics
            })
    }
    const setTabsSex = (tabs) => {
        if (!loading) {
            handleHSHistoryTabs(tabs);
            // handleFetchChooseCrush();
        }
    }
    return (
        <div>
            {renderPeriod({title: 'Статистика историй', period: period, handler: onClickPeriod})}
            <Tabs>
                <TabsItem
                    onClick={() => {
                        props.goView(VIEW_TOOL, PANEL_HS__HISTORY_STATISTICS)
                        setTabsSex(TABS_HISTORY)
                    }}
                    disabled={loading}
                    selected={tabs === TABS_HISTORY}
                >
                    Истории
                </TabsItem>
                <TabsItem
                    disabled={loading}
                    selected={tabs === TABS_SPECTATORS}
                    onClick={() => {
                        props.goView(VIEW_TOOL, PANEL_HS__HISTORY_SPECTATORS)
                        setTabsSex(TABS_SPECTATORS)
                    }}
                >
                    Зрители
                </TabsItem>
            </Tabs>
            <Group separator={'hide'} style={{marginBottom: '22px'}}>
                {history !== null && error === null ? renderHSHistoryStatisticsTopMenu() : ''}
            </Group>

            <Group
                separator={'hide'}
                header={<Header mode="secondary">Топ по просмотрам</Header>}
                style={{marginBottom: '20px'}}>
                <CardScroll style={{display: 'flex', justifyContent: 'center', marginTop: "-12px"}}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        {history !== null && error === null ? renderHSHistoryStatisticsTopViews() : ''}
                    </div>
                </CardScroll>
            </Group>
            <Group
                separator={'hide'}
                header={<Header mode="secondary">Топ по лайкам</Header>}
                style={{marginBottom: '20px'}}>
                <CardScroll style={{display: 'flex', justifyContent: 'center', marginTop: "-12px"}}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        {history !== null && error === null ? renderHSHistoryStatisticsTopLikes() : ''}
                    </div>
                </CardScroll>
            </Group>
            <Group
                separator={'hide'}
                header={<Header mode="secondary">Топ по ответам</Header>}
                style={{marginBottom: '20px'}}>
                <CardScroll style={{display: 'flex', justifyContent: 'center', marginTop: "-12px"}}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        {history !== null && error === null ? renderHSHistoryStatisticsTopAnswers() : ''}

                    </div>
                </CardScroll>
            </Group>
            <Group
                separator={'hide'}
                header={<Header mode="secondary">Топ по репостам</Header>}
                style={{marginBottom: '20px'}}>
                <CardScroll style={{display: 'flex', justifyContent: 'center', marginTop: "-12px"}}>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        {history !== null && error === null ? renderHSHistoryStatisticsTopReposts() : ''}
                    </div>
                </CardScroll>
            </Group>
            {loading && <Spinner size="large" style={{margin: '20px 0'}}/>}
            {renderErrorPlaceholder({
                error: error,
                loading: loading,
                isTryAgainHandler: handleFetchHSHistoryStatistics
            })}
        </div>
    )
}

export default HSHistoryStatisticsList;
