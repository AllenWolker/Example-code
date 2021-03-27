import React from 'react';

import {
    HISTORY_STATISTICS_REQUEST,
    HISTORY_STATISTICS_SUCCESS,
    HISTORY_STATISTICS_ERROR,
    HS__HISTORY_SPECTATORS_REQUEST,
    HS__HISTORY_SPECTATORS_SUCCESS,
    HS__HISTORY_SPECTATORS_ERROR,
    HS__TOP_REVIEW_TABS,
    HS__STATISTICS_TABS,
    HS__STATISTICS_SET_PERIOD,
    HISTORY_TAKE_PERIOD_SUCCESS,
    HISTORY_TAKE_PERIOD_ERROR,
    HS__HISTORY_SPECTATORS_CANCEL,
} from '../../constType';
import {
    APIVkGetUsers,
    APIVkExecute,
} from 'api/vk/apiMethods';

import {addVKScope, getSearchObject} from 'helpers/api';
import {delay} from "../../../helpers/dateTime";
import {getPeriod} from "../../../template/popouts/DateChangePeriod/actions";
import Icon56LockOutline from "@vkontakte/icons/dist/56/lock_outline";


export function HistorySetPeriod() {
    return async (dispatch, getState) => {
        try {
            const state = getState().toolHistoryStatistics;
            let period = state.stories.period
            const {atMin, atMax} = await getPeriod(period);

            console.log('HistorySetPeriod', atMax, atMin,)
            dispatch(success(atMax, atMin, period.name))
        } catch
            (e) {
            dispatch(error({message: e}));
        }
    }

    function success(atMax, atMin, periodName, objSpectators) {
        return {type: HISTORY_TAKE_PERIOD_SUCCESS, atMax, atMin, periodName, objSpectators};
    }

    function error({message, icon = null, isTryAgain = true, isVisibleMessage = false}) {
        return {type: HISTORY_TAKE_PERIOD_ERROR, message, icon, isTryAgain, isVisibleMessage};
    }
}

async function saveHSStories(userInfo, dispatch, getState) {
    try {
        const tokenSettings = getSearchObject().vk_access_token_settings.split(',');
        let userPayloadStories = {};
        let spectatorsInfo = {}
        let partStoriesId = '456239'
        let spectatorsId = [];
        let spectatorsReplies = []
        let spectatorsLike = {}
        let spectatorsViewers = {}
        let spectatorsUsersViewers = []
        let userSaveStories = {}
        userSaveStories.response = []
        let partUserSaveStories = []
        let arrRepliesStories = []
        let arrViewersStories = []
        let arrStatsStories = []
        let objSpectators = {
            arrView: [],
            arrLikes: [],
            arrReplies: []
        }
        if (!tokenSettings.includes('stories')) {
            console.log('НЕт прав')
            return false;
        }

        let groupStories3 = []
        //   const storiesGet = await APIEye3StoryGetTool();
        for (let i = 0; i < 999; i++) {
            let part = partStoriesId
            let storiesId = 0
            if (i < 10) storiesId = part + '00' + i;
            if (i => 10 && i < 100) storiesId = part + '0' + i;
            if (i >= 100) storiesId = part + i;
            groupStories3.push("\"" + userInfo.response[0].id + '_' + storiesId + "\"")
        }

        const executeStoriesById = await APIVkExecute({
            code: `var storyId = [${groupStories3}];
                            var i = 0;
                            var story = [];
                                while( i !=10) {
                                var j = 0;
                                  var partArrStoryId = storyId.slice(i * 100, (i * 100) + 100);
 var arr = API.stories.getById({stories: partArrStoryId , extended: 1});
                                story.push(arr);
                                  i = i+1;
                                 };
                                return story;`
        })
        for (let i = 0; i < executeStoriesById.response.length; i++) {
            executeStoriesById.response[i].items.map(item => {
                if (item.date) {
                    userSaveStories.response.push(item)
                }
                return null;
            })
        }


        if (userSaveStories.response.length <= 25) {
            userSaveStories.response.map(story => {
                partUserSaveStories.push(story.id);
                return null;
            })
            console.log('partUserSaveStories', partUserSaveStories)
            const executeRepliesStories = await APIVkExecute({
                code: `var storyId = [${partUserSaveStories}];
                        var id = ${userInfo.response[0].id};
                        var i = 0;
                        var story = [];
                         while(i!=storyId.length &&  i!=25) {
                             var arr = API.stories.getReplies({owner_id: id ,story_id:storyId[i],fields: ['photo_100', 'sex'], extended: 1});
                             story.push(arr);
                               i = i+1;
                         };
                          return story;`
            })
            await delay(350);
            const executeViewersStories = await APIVkExecute({
                code: `var storyId = [${partUserSaveStories}];
                        var id = ${userInfo.response[0].id};
                        var i = 0;
                        var story = [];
                         while(i!=storyId.length &&  i!=25) {
                             var arr = API.stories.getViewers({owner_id: id ,story_id:storyId[i],extended: 1});
                             story.push(arr);
                               i = i+1;
                         };
                          return story;`
            })
            await delay(350)
            const executeStatsStories = await APIVkExecute({
                code: `var storyId = [${partUserSaveStories}];
                        var id = ${userInfo.response[0].id};
                        var i = 0;
                        var story = [];
                         while(i!=storyId.length &&  i!=25) {
                             var arr = API.stories.getStats({owner_id: id ,story_id:storyId[i]});
                             story.push(arr);
                               i = i+1;
                         };
                          return story;`
            })
            arrViewersStories.push(executeViewersStories)
            arrRepliesStories.push(executeRepliesStories);
            arrStatsStories.push(executeStatsStories);
        } else {
            for (let i = 0; i < Math.round(userSaveStories.response.length / 25); i++) {
                partUserSaveStories = [];
                let partObjSaveStories = userSaveStories.response.slice(
                    (i * 25) > userSaveStories.response.length ? userSaveStories.response.length : (i * 25),
                    (i * 25) > userSaveStories.response.length ? userSaveStories.response.length + 1
                        : (i * 25) + 25 > userSaveStories.response.length ? userSaveStories.response.length : (i * 25) + 25)
                for (let story of partObjSaveStories) {
                    partUserSaveStories.push(story.id);
                }


                console.log('partUserSaveStories', partUserSaveStories)
                const executeRepliesStories = await APIVkExecute({
                    code: `var storyId = [${partUserSaveStories}];
                        var id = ${userInfo.response[0].id};
                        var i = 0;
                        var story = [];
                         while(i!=storyId.length &&  i!=25) {
                             var arr = API.stories.getReplies({owner_id: id ,story_id:storyId[i],fields: ['photo_100', 'sex'], extended: 1});
                             story.push(arr);
                               i = i+1;
                         };
                          return story;`
                })
                await delay(350);
                const executeViewersStories = await APIVkExecute({
                    code: `var storyId = [${partUserSaveStories}];
                        var id = ${userInfo.response[0].id};
                        var i = 0;
                        var story = [];
                         while(i!=storyId.length &&  i!=25) {
                             var arr = API.stories.getViewers({owner_id: id ,story_id:storyId[i],extended: 1});
                             story.push(arr);
                               i = i+1;
                         };
                          return story;`
                })
                await delay(350)
                const executeStatsStories = await APIVkExecute({
                    code: `var storyId = [${partUserSaveStories}];
                        var id = ${userInfo.response[0].id};
                        var i = 0;
                        var story = [];
                         while(i!=storyId.length &&  i!=25) {
                             var arr = API.stories.getStats({owner_id: id ,story_id:storyId[i]});
                             story.push(arr);
                               i = i+1;
                         };
                          return story;`
                })
                arrViewersStories[0]?.response
                    ? arrViewersStories[0].response = arrViewersStories[0].response.concat(executeViewersStories.response)
                    : arrViewersStories.push(executeViewersStories)
                arrRepliesStories[0]?.response
                    ? arrRepliesStories[0].response = arrRepliesStories[0].response.concat(executeRepliesStories.response)
                    : arrRepliesStories.push(executeRepliesStories)
                arrStatsStories[0]?.response
                    ? arrStatsStories[0].response = arrStatsStories[0].response.concat(executeStatsStories.response)
                    : arrStatsStories.push(executeStatsStories)
                delay(350);
            }
        }
        console.log('arrStoryIds', arrStatsStories, executeStoriesById, arrViewersStories, arrRepliesStories)

        //Create Replies list

        arrRepliesStories[0].response.map((story, i) => {
            if (story.count > 0) {
                story.profiles.map(user => {
                    if (userInfo.response[0].id !== user.id
                        // eslint-disable-next-line  eqeqeq
                        && !spectatorsReplies.some(item => item.id == user.id)) {
                        spectatorsReplies.push({
                            photo_url: user.photo_100 ? user.photo_100 : '',// Фото
                            sex: user.sex ? user.sex.toString() : null,
                            name: user.first_name + ' ' + user.last_name,
                            id: user.id,
                            count: 1
                        })
                        // eslint-disable-next-line  eqeqeq
                    } else if (spectatorsReplies.some(item => item.id == user.id)) {
                        // eslint-disable-next-line no-unused-expressions
                        spectatorsReplies.map(userx => {
                            // eslint-disable-next-line no-unused-expressions
                            userx.id === user.id ? userx.count += 1 : '';
                            return null;
                        })
                    }
                    return null;
                })
            }
            return null;
        });
        //Create Viewers and likes list
        arrViewersStories[0].response.forEach((viewer, i) => {
            viewer.items.map((user, ii) => {
                if (spectatorsUsersViewers.length > 0) {
                    //   console.log("APIVkGetViewersStories not first",spectatorsUsersViewers)
                    let userx = spectatorsUsersViewers.findIndex(item => item.id === user.user_id);
                    if (userx !== -1) {
                        // eslint-disable-next-line no-unused-expressions
                        !spectatorsUsersViewers[userx].expires_at.includes(userSaveStories.response[i].expires_at)
                            ? spectatorsUsersViewers[userx].expires_at.push(userSaveStories.response[i].expires_at)
                            : '';
                    } else {
                        //     console.log("APIVkGetViewersStories not user",spectatorsUsersViewers)
                        spectatorsUsersViewers.push(user.user)
                        spectatorsUsersViewers[spectatorsUsersViewers.length - 1].expires_at = []
                        spectatorsUsersViewers[spectatorsUsersViewers.length - 1].expires_at.push(userSaveStories.response[i].expires_at);
                    }
                } else {
                    /// console.log("APIVkGetViewersStories first")
                    spectatorsUsersViewers.push(user.user)
                    spectatorsUsersViewers[0].expires_at = []
                    spectatorsUsersViewers[0].expires_at.push(userSaveStories.response[i].expires_at);
                }
                spectatorsId.push(user.user_id)
                // eslint-disable-next-line no-unused-expressions
                spectatorsViewers[user.user_id]
                    ? spectatorsViewers[user.user_id] += 1
                    // eslint-disable-next-line no-unused-expressions
                    : spectatorsViewers[user.user_id] = 1
                // eslint-disable-next-line no-unused-expressions
                user.is_liked ? spectatorsLike[user.user_id]
                    ? spectatorsLike[user.user_id] += 1
                    : spectatorsLike[user.user_id] = 1 : ''
                return null
            })
        })

//Create Stats List
        arrStatsStories[0].response.map((stats, i) => {
            //  story.shared_count = stat.response.shares.count
            userSaveStories.response[i].answers_count = stats.answer.count
            userSaveStories.response[i].reposts_count = stats.shares.count
            return null
        });
        //  console.log('saveStories', userSaveStories, spectatorsUsersViewers)
        let spectatorsProfiles = await APIVkGetUsers({
            userIds: spectatorsId.join(),
            fields: ['photo_100', 'bdate', 'city', 'country', 'sex', 'relation', 'last_seen', 'online'],
        })
        spectatorsInfo.city = []
        spectatorsInfo.sex = []
        //create spectators data
        // eslint-disable-next-line no-unused-expressions
        spectatorsProfiles.response.length > 0 ?
            // eslint-disable-next-line no-unused-expressions
            spectatorsProfiles.response.map(user => {
                user.views = spectatorsViewers[user.id]
                let userx = spectatorsUsersViewers.find(item => item.id === user.id);
                userx.expires_at.sort(function (a, b) {
                    if (a < b) return 1;
                    if (a > b) return -1;
                    return 0;
                });
                user.expires_story_at = userx.expires_at
                spectatorsLike[user.id] ? user.likes = spectatorsLike[user.id] : user.likes = 0
                return null
            })
            : '';

        objSpectators.arrView = spectatorsProfiles.response
        objSpectators.arrLikes = spectatorsProfiles.response;
        objSpectators.arrReplies = spectatorsReplies;
        userPayloadStories = userSaveStories;
        userPayloadStories.spectatorsUserInfo = spectatorsInfo;
        userPayloadStories.spectatorsReplies = spectatorsReplies;
        userPayloadStories.spectatorsUserInfo.spectatorsProfile = spectatorsProfiles.response
        userPayloadStories.userName = userInfo.response[0].first_name + ' ' + userInfo.response[0].last_name;
        userPayloadStories.photo_url = userInfo.response[0].photo_100 ? userInfo.response[0].photo_100 : '' // Фото
        userPayloadStories.vk_id = userInfo.response[0].id
        userPayloadStories.allPublicStories = userSaveStories.response.length //опубликовано

        return {userPayloadStories, objSpectators}

    } catch (e) {
        throw String('saveStories::: ' + e);
    }
}

export function tabsChooseTopReviews(tabs) {
    return {type: HS__TOP_REVIEW_TABS, tabs}
}

export function tabsChooseStatisticsTabs(tabs) {
    return {type: HS__STATISTICS_TABS, tabs}
}

export function setHSPeriod(name, atMin = null, atMax = null) {
    return async (dispatch, getState) => {
        try {
            let objSpectators = {
                arrView: [],
                arrLikes: [],
                arrReplies: []
            }
            const state = getState().toolHistoryStatistics;
            let period = {}
            period.name = name
            let history = state.stories.payload
            console.log('setHSPeriod', objSpectators.arrView)
            const {atMin, atMax} = await getPeriod(period);
            history.spectatorsUserInfo.spectatorsProfile.sort(function (a, b) {
                if (a.views < b.views) {
                    return 1;
                }
                if (a.views > b.views) {
                    return -1;
                }
                return 0;
            });

            history.spectatorsUserInfo.spectatorsProfile.map((user, i) => {
                if (i < 3) {
                    if ((user.expires_at >= atMin && user.expires_at <= atMax)
                        || (atMin === null && atMax === null)) {
                        let views = user.views
                        if (views > 0) {
                            objSpectators.arrView.push(user)
                        }
                    }
                }
                return null
            });

            history.spectatorsUserInfo.spectatorsProfile.sort(function (a, b) {
                if (a.likes < b.likes) {
                    return 1;
                }
                if (a.likes > b.likes) {
                    return -1;
                }
                return 0;
            });
            history.spectatorsUserInfo.spectatorsProfile.map((user, i) => {
                if (i < 3) {
                    if ((user.expires_at >= atMin && user.expires_at <= atMax)
                        || (atMin === null && atMax === null)) {
                        let likes = user.likes
                        if (likes > 0) {
                            objSpectators.arrLikes.push(user)
                        }
                    }
                }
                return null
            });
            history.spectatorsReplies.sort(function (a, b) {
                if (a.count < b.count) {
                    return 1;
                }
                if (a.count > b.count) {
                    return -1;
                }
                return 0;
            })
            history.spectatorsReplies.map((user, i) => {
                if (i < 3) {
                    if ((user.expires_at >= atMin && user.expires_at <= atMax)
                        || (atMin === null && atMax === null)) {
                        let replies = user.count
                        if (replies > 0) {
                            objSpectators.arrReplies.push(user)
                        }
                    }
                }
                return null;
            })

            console.log('setHSPeriod', name, atMax, atMin, objSpectators)
            dispatch(success(name, atMax, atMin, objSpectators))
        } catch (e) {
            throw String('setHSPeriod::: ' + e);
        }
    }

    function success(name, atMax, atMin, objSpectators) {
        return {type: HS__STATISTICS_SET_PERIOD, name, atMin, atMax, objSpectators}
    }
}

export function cancelHSLoad() {
    return {type: HS__HISTORY_SPECTATORS_CANCEL};
}

/*async function getHistoryStatistics(userId, groupId) {
    try {

        let userStories = [];
        let groupsStories = [];
        let flag = false

        // console.log('getDownloadHistory usersStories', usersStories)

        /*   for (let id of groupId.response.items) {
        //console.log('groupStories id: ', id);
         if(flag) {
              return {
                  usersStories,
                  groupsStories
              };
          }
        await delay(350);
        let story = await APIVkGetStories({
            ownerId: -id.id,
            fields: [],
        });
        if (story.response.count > 0) {
            for (let group of groupId.response.items) {
                if (group.id === id.id) {
                    group.story = story.response;
                    groupsStories.push(group)
                    console.log('story groupId', story);
                    flag = true
                }
            }
        }
    }



        console.log('userStories groupsStories: ', groupsStories);

        if (checkVKMethodError(userStories)) {
            console.log('Ошибка при загрузке историй');
            return false;
        }
        return {
            // usersStories,
            groupsStories
        };
    } catch (e) {
        throw String('getDownloadHistory::: ' + e);
    }
}
*/
export function fetchHistoryStatistics() {
    return async (dispatch, getState) => {
        try {
            if (!await addVKScope('stories')) { // Проверка на разрешение stories
                dispatch(error({
                    message: 'Для отображения просмотров требуется доступ к историям',
                    icon: <Icon56LockOutline/>,
                    isVisibleMessage: true
                }));
                return false;
            }
            if (getState().toolHistoryStatistics.stories.loading) return;

            await delay(400);
            dispatch(request());

            let userId = getSearchObject().vk_user_id
            // console.log('fetchHistoryStatistics APIEye3GetProfile' , userProfile)
            //userId = getSearchObject().vk_user_id
            //  const groups = await APIVkGetGroups({userId: userId})
            const myProfile = await APIVkGetUsers({
                userIds: userId,
                fields: ['photo_100', 'bdate', 'city', 'country', 'sex', 'relation', 'last_seen', 'online'],
            })
            let usersStories = await saveHSStories(myProfile, dispatch, getState);
            //console.log('fetchDownloadHistory friends', friends)
            // let stories = await getHistoryStatistics(myProfile, groups)
            // console.log('fetchDownloadHistory stories', stories)
            dispatch(success(usersStories.userPayloadStories, usersStories.objSpectators));

        } catch (e) {
            dispatch(error({message: e}));
        }
    }

    function request() {
        return {type: HISTORY_STATISTICS_REQUEST};
    }

    function success(storiesPayload,objSpectators) {
        return {type: HISTORY_STATISTICS_SUCCESS, storiesPayload,objSpectators};
    }

    function error({message, icon = null, isTryAgain = true, isVisibleMessage = false}) {
        return {type: HISTORY_STATISTICS_ERROR, message, icon, isTryAgain, isVisibleMessage};
    }
}


export function fetchHSTopReviews() {
    return async (dispatch, getState) => {
        try {
            dispatch(request());
            const state = getState().toolHistoryStatistics;
            const pageParam = getState().page.param;
            // Задаем pageParam в зависимости от его наличия (когда загружен новый пользователь при изменении периода используются значения из state.gifts)
            const topReviews = pageParam ? pageParam.activeTopReviews : state.stories.activeTopReviews
            dispatch(success(topReviews));

        } catch (e) {
            dispatch(error({message: e}));
        }
    }

    function request() {
        return {type: HS__HISTORY_SPECTATORS_REQUEST};
    }

    function success(review) {
        return {type: HS__HISTORY_SPECTATORS_SUCCESS, review};
    }

    function error({message, icon = null, isTryAgain = true, isVisibleMessage = false}) {
        return {type: HS__HISTORY_SPECTATORS_ERROR, message, icon, isTryAgain, isVisibleMessage};
    }

}
