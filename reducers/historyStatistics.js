import {
    HISTORY_STATISTICS_REQUEST,
    HS__HISTORY_SPECTATORS_REQUEST,
    HS__HISTORY_SPECTATORS_ERROR,
    HS__HISTORY_SPECTATORS_SUCCESS,
    HISTORY_STATISTICS_ERROR,
    HISTORY_STATISTICS_SUCCESS,
    HS__TOP_REVIEW_TABS,
    HS__STATISTICS_TABS,
    HS__STATISTICS_SET_PERIOD,
    HISTORY_TAKE_PERIOD_SUCCESS, HISTORY_TAKE_PERIOD_ERROR, HISTORY_STATISTICS_STOP, HS__HISTORY_SPECTATORS_CANCEL
} from '../../constType';
import { TABS_ALL } from 'views/moycrush/panels/chooseCrush/constTabs';
import { TABS_HISTORY } from '../../../views/tool/panels/historyStatistics/constTabs';
import {PERIOD_ALL} from "../../../template/popouts/DateChangePeriod/constPeriod";
const initialState = {
    stories: {
        payload: null,
        cachePayload: null,
        activeUserId: null, // Параметры для сохранения пользователя
        activeUserPhoto: null, //
        activeUserTitle: null, //
        activeUserDescription: null, //
        activeDownloadStory: null,
        activeTopReviews:null,
        reviewTopTabs: TABS_ALL,
        hsHistoryTabs: TABS_HISTORY,
        stop:false,
        count: 20,
        period: {
            name: PERIOD_ALL,
            atMin: null,
            atMax: null
        },
        setPeriodDate:null,
        lastPeriodName: null,
        filter: '',
        isOnce: false,
        search: '',
        error: null,
        loading: false,
        showCount: 20,
    },
}

export default function HistoryStatisticsReducer(state = initialState, action) {
    switch (action.type) {
        case HISTORY_STATISTICS_REQUEST:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    showCount: 20,
                    payload: null,
                    isOnce: true,
                    loading: true,
                    error: null,
                },
            };
        case HISTORY_STATISTICS_SUCCESS:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    stop: false,
                    setPeriodDate: action.objSpectators,
                    payload: action.storiesPayload,
                    loading: false,
                    error: null
                },
            }
        case HISTORY_STATISTICS_ERROR:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    stop: false,
                    loading: false,
                    error: action.error
                }
            };
        case HISTORY_STATISTICS_STOP:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    stop: true,
                }
            };
        case HISTORY_TAKE_PERIOD_SUCCESS:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    period: {
                        ...state.period,
                        name: action.periodName,
                        atMin: action.atMin,
                        atMax: action.atMax,
                    },
                    loading: false,
                    error: null
                },
            }
        case HISTORY_TAKE_PERIOD_ERROR:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    loading: false,
                    error: action.error
                }
            };
        case HS__HISTORY_SPECTATORS_REQUEST:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    showCount: 20,
                    loading: true,
                    error: null,
                },
            };
        case HS__HISTORY_SPECTATORS_CANCEL:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    loading: false,
                },
            };
        case HS__HISTORY_SPECTATORS_SUCCESS:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    activeTopReviews: action.review,
                    loading: false,
                    error: null,

                },
            }
        case HS__HISTORY_SPECTATORS_ERROR:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    loading: false,
                    error: action.error
                }
            }
        case HS__TOP_REVIEW_TABS:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    reviewTopTabs: action.tabs
                }
            }
        case HS__STATISTICS_TABS:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    hsHistoryTabs: action.tabs
                }
            }
        case HS__STATISTICS_SET_PERIOD:
            return {
                ...state,
                stories: {
                    ...state.stories,
                    setPeriodDate:action.objSpectators,
                    lastPeriodName: state.stories.period.name, // Сохраняем предыдущий период
                    period: {
                        ...state.stories.period,
                        name: action.name,
                        atMin: action.atMin,
                        atMax: action.atMax,
                    }
                }
            }
        default:
            return state;
    }
}
