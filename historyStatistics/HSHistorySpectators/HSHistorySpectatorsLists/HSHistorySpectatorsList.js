import React, {useCallback} from 'react';
import {Button, Div, Group, Spinner, Header, Tabs, TabsItem, Link, Placeholder} from '@vkontakte/vkui';
import HSHistorySpectatorsItem from '../HSHistorySpectatorsItems/HSHistorySpectatorsItem';
import './HSHistorySpectatorsList.scss';
import {useDispatch, useSelector} from "react-redux";
import {VictoryPie} from 'victory';

import Icon16Dropdown from "@vkontakte/icons/dist/16/dropdown";
import HSHistorySpectatorsGraphicsItem from "../HSHistorySpectatorsItems/HSHistorySpectatorsGraphicsItem";
import {
    fetchHistoryStatistics, HistorySetPeriod,
    setHSPeriod,
    tabsChooseStatisticsTabs
} from "../../../../../../store/actions/tool/historyStatistics";
import {renderErrorPlaceholder} from "../../../../../../helpers/views";
import {VIEW_TOOL} from "../../../../../constViews";
import {
    PANEL_HS__HISTORY_SPECTATORS,
    PANEL_HS__HISTORY_STATISTICS,
    PANEL_HS__REVIEWS_TOP,
} from "../../../constPanels";
import {declOfNum} from "../../../../../../helpers/strings";
import {TABS_HISTORY, TABS_SPECTATORS} from "../../constTabs";
import {
    PERIOD_ALL,
    PERIOD_MONTH,
    PERIOD_TODAY,
    PERIOD_TWO_WEEK
} from "../../../../../../template/popouts/DateChangePeriod/constPeriod";
import {closePopout, openPopout} from "../../../../../../store/actions/page";
import PopoutTemplateDateChangeHSPeriod from "../../../../../../template/popouts/DateChangePeriod/DateChangeHSPeriod";
import {calcAge} from "../../../../../../helpers/dateTime";
import Icon56UsersOutline from "@vkontakte/icons/dist/56/users_outline";
import {Icon36StoryOutline} from "@vkontakte/icons";

const HSHistorySpectatorsList = (props) => {
    const dispatch = useDispatch();
    const handleFetchHSHistorySpectators = useCallback(() => dispatch(fetchHistoryStatistics()), [dispatch]);
    const loading = useSelector(state => state.toolHistoryStatistics.stories.loading);
    const error = useSelector(state => state.toolHistoryStatistics.stories.error);
    const history = useSelector(state => state.toolHistoryStatistics.stories.payload);
    const dataSetPeriod = useSelector(state => state.toolHistoryStatistics.stories.setPeriodDate);
    const handleHSHistoryTabs = useCallback((tabs) => dispatch(tabsChooseStatisticsTabs(tabs)), [dispatch]);
    const handleOpenPopout = useCallback((popout) => dispatch(openPopout(popout)), [dispatch]);
    const handleClosePopout = useCallback(() => dispatch(closePopout()), [dispatch]);
    const period = useSelector(state => state.toolHistoryStatistics.stories.period);
    const handleSetPeriodHS = useCallback((name, atMin = null, atMax = null) => dispatch(setHSPeriod(name, atMin, atMax)), [dispatch]);
    const handleTakePeriod = useCallback(() => dispatch(HistorySetPeriod()), [dispatch]);
    let pMale = 0
    let pFemale = 0
    let tabs = TABS_SPECTATORS
    let male = 0
    let female = 0
    let percent = 0
    //   const [countReposts ,setCountReposts] = useState(0);
    console.log('HSHistoryStatisticsList history', period,dataSetPeriod)


    //процентное соотношение женщин и мужчин
    history.spectatorsUserInfo.spectatorsProfile.map(user => {
        if ((user.expires_at >= period.atMin && user.expires_at <= period.atMax)
            || (period.atMin === null && period.atMax === null)) {
            user.sex === 1 ? female += 1 : male += 1;
        }
        return null
    })
    percent = 100 / (male + female)
    pFemale = female > 0 ? Math.floor(female * percent) : 0
    pMale = male > 0 ? Math.floor(male * percent) : 0


    // console.log("MALE", pMale, pFemale, male, female, percent)
    const renderPeriod = ({title, period, handler}) => {
        if (period.atMax === null && period.name !== 'all') handleTakePeriod();
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
                backPanel={PANEL_HS__HISTORY_SPECTATORS}
                backView={VIEW_TOOL}
                period={period} // Период из redux store
                setPeriod={handleSetPeriodHS} // action из redux
                panelTitle={'Статистика историй'}
                closePopout={handleClosePopout}
            />
        );
    }


    //console.log('HSHistorySpectatorsList', history, "tabs", tabs)
    const renderHSHistorySpectatorsGeoItem = () => {
        let cityPercent = []
        let one = 0
        let count = 0

        history.spectatorsUserInfo.spectatorsProfile.map((user) => {
            if ((user.expires_at >= period.atMin && user.expires_at <= period.atMax)
                || (period.atMin === null && period.atMax === null)) {
                count++;
                // eslint-disable-next-line no-unused-expressions
                if (user.city) {
                    let storyx = cityPercent.findIndex(item => item.cityTitle === user.city.title);
                    storyx > -1
                        ? cityPercent[storyx].count += 1
                        : cityPercent.push({cityTitle: user.city.title, count: 1})
                }
            }
            return null
        })

        cityPercent.length > 0 && cityPercent.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            return 0;
        });
        one = Math.floor(100 / count)

        return history && history.response.length > 0 ? cityPercent.map((city, i) => {
            if (city.count > 0) {
                return (
                    <HSHistorySpectatorsGraphicsItem
                        title={city.cityTitle}
                        key={i + '2'}
                        // indicator={"Geo_graphics"}
                        percentLine1={Math.floor(city.count * one)}
                    />
                )
            }
            return null
        }) : <Placeholder
            icon={<Icon56UsersOutline/>}
        >
            Истории не найдены
        </Placeholder>;
    }
    const renderHSHistorySpectatorsAgesItem = () => {
        let agesRange = [
            {"male": 0, "female": 0},
            {"male": 0, "female": 0},
            {"male": 0, "female": 0}
        ]
        // eslint-disable-next-line no-unused-expressions
        history.spectatorsUserInfo.spectatorsProfile.length > 0 ?
            // eslint-disable-next-line no-unused-expressions
            history.spectatorsUserInfo.spectatorsProfile.map(user => {
                if ((user.expires_at >= period.atMin && user.expires_at <= period.atMax)
                    || (period.atMin === null && period.atMax === null)) {
                    if (user.bdate && calcAge(user.bdate) <= 24) {
                        user.sex === 1 ? agesRange[0].female += 1
                            : agesRange[0].male += 1;
                    }
                    if (user.bdate && calcAge(user.bdate) >= 24 && calcAge(user.bdate) <= 40) {
                        user.sex === 1 ? agesRange[1].female += 1
                            : agesRange[1].male += 1;
                    }
                    if (user.bdate && calcAge(user.bdate) > 40) {
                        user.sex === 1 ? agesRange[2].female += 1
                            : agesRange[2].male += 1;
                    }
                }
                return null
            })
            : '';
        //  console.log("renderHSHistorySpectatorsItem", history.spectatorsUserInfo.agesRange)
        return history && history.response.length > 0
            ? agesRange.map((age, i) => {
                let percent = 100 / (+age.female + age.male)
                //   console.log("renderHSHistorySpectatorsAgesItem", age, percent)
                return (
                    <HSHistorySpectatorsGraphicsItem
                        key={i}
                        title={i === 0 ? "16-24" : i === 1 ? "24-40" : ">40"}
                        indicator={"sex_and_age_graphics"}
                        percentLine1={Math.floor(percent * age.male) ? Math.floor(percent * age.male) : 0}
                        percentLine2={Math.floor(percent * age.female) ? Math.floor(percent * age.female) : 0}
                    />
                )
            }) : <Placeholder
                icon={<Icon36StoryOutline height={56} width={56}/>}
            >
                Истории не найдены
            </Placeholder>;
    }

    const renderHSHistorySpectatorsTopViewers = () => {
       if(dataSetPeriod?.arrView.length>0) {dataSetPeriod.arrView.sort(function (a, b) {
           if (a.views < b.views) {
               return 1;
           }
           if (a.views > b.views) {
               return -1;
           }
           return 0;
       });
       }
        // console.log(history.spectatorsUserInfo.spectatorsProfile[0].views)
        return dataSetPeriod?.arrView.length > 0 ? dataSetPeriod.arrView.map((user, i) => {
            if (i < 3) {
                let name = user.first_name + ' ' + user.last_name;
                let views = user.views
                let id = user.id
                let photo = user.photo_100 ? user.photo_100 : '';
                const viewsCountStrFormat = views ? views + ' ' + declOfNum(views, ['просмотр', 'просмотра', 'просмотров']) : '';
                if (views > 0) {
                    return (
                        <HSHistorySpectatorsItem
                            id={id}
                            title={name}
                            count={i + 1}
                            key={i}
                            description={viewsCountStrFormat}
                            photo={photo}
                            goView={props.goView}
                        />
                    )
                }
            }

            return null
        }) : <Placeholder
            icon={<Icon36StoryOutline height={56} width={56}/>}
        >
            Истории не найдены22
        </Placeholder>;
    }
    const renderHSHistorySpectatorsTopLikes = () => {
        if(dataSetPeriod?.arrLikes.length>0) {dataSetPeriod.arrLikes.sort(function (a, b) {
            if (a.likes < b.likes) {
                return 1;
            }
            if (a.likes > b.likes) {
                return -1;
            }
            return 0;
        });
        }
        return dataSetPeriod?.arrLikes.length > 0
            ? dataSetPeriod.arrLikes.map((user, i) => {
                if (i < 3) {
                    let name = user.first_name + ' ' + user.last_name;
                    let likes = user.likes
                    let id = user.id
                    let photo = user.photo_100 ? user.photo_100 : '';
                    const likesCountStrFormat = likes ? likes + ' ' + declOfNum(likes, ['лайк', 'лайка', 'лайков']) : '';
                    if (likes > 0) {

                        return (
                            <HSHistorySpectatorsItem
                                id={id}
                                title={name}
                                count={i + 1}
                                key={i}
                                description={likesCountStrFormat}
                                photo={photo}
                                goView={props.goView}
                            />
                        )
                    }
                }
                return null
            }) : <Placeholder
                icon={<Icon36StoryOutline height={56} width={56}/>}
            >
                Истории не найдены
            </Placeholder>;
    }
    const renderHSHistorySpectatorsTopReplies = () => {
        if(dataSetPeriod?.arrReplies.length>0) {dataSetPeriod.arrReplies.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            }
            if (a.count > b.count) {
                return -1;
            }
            return 0;
        });
        }
        return dataSetPeriod?.arrReplies.length > 0
            ? dataSetPeriod.arrReplies.map((user, i) => {
                if (i < 3) {
                    let name = user.name;
                    let replies = user.count
                    let id = user.id
                    let photo = user.photo_url ? user.photo_url : '';
                    const repliesCountStrFormat = replies ? replies + ' ' + declOfNum(replies, ['ответ', 'ответа', 'ответов']) : '';
                    if (replies > 0) {
                        return (
                            <HSHistorySpectatorsItem
                                id={id}
                                title={name}
                                count={i + 1}
                                key={i}
                                description={repliesCountStrFormat}
                                photo={photo}
                                goView={props.goView}
                            />
                        )
                    }
                }
                return null
            }) : <Placeholder
                icon={<Icon36StoryOutline height={56} width={56}/>}
            >
                Истории не найдены
            </Placeholder>
    }
    /* const renderHSHistorySpectatorsTopReposts = () => {
    let count = 0
         history.spectatorsReplies.sort(function (a, b) {
             if (a.count < b.count) {
                 return 1;
             }
             if (a.count > b.count) {
                 return -1;
             }
             return 0;
         })
         return history && history.response.length > 0
             ? history.spectatorsReplies.map((user, i) => {
                 if (i < 3) {
                     let name = user.name;
                     let replies = user.count
                     let id = user.id
                     let photo = user.photo_url ? user.photo_url : '';
                     const repliesCountStrFormat = replies ? replies + ' ' + declOfNum(replies, ['ответ', 'ответа', 'ответов']) : '';
                     if (replies > 0) {
                     count++
                         return (
                             <HSHistorySpectatorsItem
                                 title={name}
                                 count={i + 1}
                                 key={id}
                                 description={repliesCountStrFormat}
                                 photo={photo}
                                 goView={props.goView}
                             />
                         )
                     }

                 }
                                     if(count === 0 && i ===2){
                        return(<Placeholder
                            key={i+ '1'}
                            icon={<Icon56UsersOutline />}
                        >
                            Истории не найдены
                        </Placeholder>)
                    }
                 return null
             }) : renderErrorPlaceholder({
                 error: error, loading: loading, isTryAgainHandler: handleFetchHSHistorySpectators
             })
     }

     */
    const setTabsSex = (tabs) => {
        if (!loading) {
            console.log("setTabsSex", tabs)
            handleHSHistoryTabs(tabs);
            // handleFetchChooseCrush();
        }
    }

    return (
        <div className={'hs-history-spectators-list'}>
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
            <Group
                className={'hs-history-spectators-list__sex_and_age_container'}
                header={<Header mode="secondary">Пол и возраст</Header>}
            >
                {(pFemale > 0 || pMale > 0) && <Div className={'hs-history-spectators-list__victory_pie'}>
                    <svg viewBox="0 0 200 200">
                        <g transform={"translate(-30, -75)"}>
                            <VictoryPie name="pie"
                                        width={250}
                                        standalone={false}
                                        colorScale={["#EE94B4", "#579BEB",]}
                                //style={{ labels: {fontSize: 25, padding: 10}}}

                                        data={[{x: "Female", y: `${pFemale}`},
                                            {x: "Male", y: `${pMale > 0 ? 100 - pFemale : 0}`}]}
                            />
                        </g>
                    </svg>
                    <span className={'hs-history-spectators-list__victory_pie_index_container'}>
                        <span>
                         <div><div style={{backgroundColor: '#579BEB'}}/>
                             {pMale > 0 ? 100 - pFemale : 0}%  </div>
                        <div>Мужчины</div>
                        </span>
                        <span>
                         <div><div style={{backgroundColor: '#EE94B4'}}/>
                             {pFemale}%</div>
                        <div> Женщины</div>
                        </span>
                    </span>
                </Div>}
                {pFemale === 0 && pMale === 0 && <Placeholder

                    icon={<Icon36StoryOutline height={56} width={56}/>}
                >
                    Зрители не найдены
                </Placeholder>}

                {error === null && (pFemale > 0 || pMale > 0) ? renderHSHistorySpectatorsAgesItem() : ''}

            </Group>
            {dataSetPeriod?.arrView.length > 0 &&   <Group
                header={<Header mode="secondary" style={{paddingLeft: '12px'}}>Гео</Header>}
                style={{marginBottom: '20px'}}>
                {error === null ? renderHSHistorySpectatorsGeoItem() : ''}
            </Group>}
            {dataSetPeriod?.arrView.length > 0 && <Group
                header={<Header mode="secondary">Топ по просмотрам</Header>}
                style={{marginBottom: '20px'}}>
                {error === null ? renderHSHistorySpectatorsTopViewers() : ''}
                 <Div style={{textAlign: 'center'}}>
                <Button
                    onClick={() => props.goView(VIEW_TOOL, PANEL_HS__REVIEWS_TOP, {activeTopReviews: 'views'})}>Смотреть
                    всех</Button>
            </Div>
            </Group>}
            {dataSetPeriod?.arrView.length > 0 && <Group
                header={<Header mode="secondary">Топ по лайкам</Header>}
                style={{marginBottom: '20px'}}>
                {error === null ? renderHSHistorySpectatorsTopLikes() : ''}
                {dataSetPeriod?.arrLikes.length > 0 && <Div style={{textAlign: 'center'}}>
                    <Button
                        onClick={() => props.goView(VIEW_TOOL, PANEL_HS__REVIEWS_TOP, {activeTopReviews: 'likes'})}>Смотреть
                        всех</Button>
                </Div>}
            </Group>}

            {dataSetPeriod?.arrView.length > 0 && <Group
                header={<Header mode="secondary">Топ по ответам</Header>}
                style={{marginBottom: '20px'}}>
                {error === null ? renderHSHistorySpectatorsTopReplies() : ''}
                {dataSetPeriod?.arrReplies.length > 0 && <Div style={{textAlign: 'center'}}>
                    <Button
                        onClick={() => props.goView(VIEW_TOOL, PANEL_HS__REVIEWS_TOP, {activeTopReviews: 'replies'})}>Смотреть
                        всех</Button>
                </Div>}
            </Group>}
            {
                loading && <Spinner size="large" style={{margin: '20px 0'}}/>
            }
            {
                renderErrorPlaceholder({
                    error: error,
                    loading: loading,
                    isTryAgainHandler: handleFetchHSHistorySpectators
                })
            }
        </div>
    )
}

export default HSHistorySpectatorsList;
