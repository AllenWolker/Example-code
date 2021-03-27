import React, {useCallback} from 'react';
import { Banner } from '@vkontakte/vkui';
import LoupeIcon from "../../../../../../img/tool/historyStatistics/history-statistics-banner-icon.png";
import {useDispatch, useSelector} from "react-redux";
import {setVKStorage} from "../../../../../../store/actions/vkStorage";

const HSBanner = () => {
    const dispatch = useDispatch();
    const vkStorage = useSelector(state => state.vkStorage.payload ? state.vkStorage.payload : null);
    const toolHistoryStatistics = vkStorage !== null && vkStorage.hasOwnProperty('toolHistoryStatistics') ? vkStorage.toolHistoryStatistics : {};
    const isBanner = toolHistoryStatistics.hasOwnProperty('banner') ? toolHistoryStatistics.banner : true;
    const handleSetVKStorage = useCallback((key, value) => dispatch(setVKStorage(key, value)), [dispatch]);

    return (
        <Banner
            size='m'
            mode='image'
            asideMode='dismiss'
            imageTheme='dark'
            background={<div style={{background: 'radial-gradient(109.55% 109.55% at 0% 0%, #358DFF 0%, #0336FF 100%'}}/>}
            style={!isBanner ? {display: 'none'} : null}
            onDismiss={() => {
                handleSetVKStorage('toolHistoryStatistics', {
                    banner: false
                });
            }}
            before={<img width={28} height={28} src={LoupeIcon} alt=''/>}
            text={<span style={{fontSize: '16px'}}>Узнавайте статистику историй за 14 дней либо статистику отдельной истории</span>}
        />
    )
}

export default HSBanner;
