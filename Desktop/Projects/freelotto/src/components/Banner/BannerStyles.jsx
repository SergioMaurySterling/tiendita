import styled from 'styled-components'

/*sytles*/
import { PangramText, Button, BriceTitle} from '../Reusable/ReusableStyles'

export const BannerContainer = styled.div `
    max-width:100%;
    height: 720px;
    margin-top: 179px;
    padding-left: 140px;
    padding-top: 106px;
`

export const BannerTitle = styled(BriceTitle)`
    position: absolute;
    z-index: 2;
`

export const CoinImgBanner = styled.img`
    width: 122px;
    height: 123px;
    position: absolute;
    left: 550px;
    top: 390px;
    z-index: 1;
`

export const TextBanner = styled(PangramText) `
    line-height: 19.56px;
    position: absolute;
    top: 585px;
`

export const BannerButton = styled(Button) `
    width: 294.86px;
    height: 84px;
    position: absolute;
    top: 665px;
`

export const HandImg = styled.img`
    width: 570.99px;
    height: 614.02px;
    position: absolute;
    left: 750px;
    top:240px;
    transform: rotate(10deg);
`

export const RocketImg = styled.img `
    position: absolute;
    left: 1080px;
    right: -0.24%;
    top: 265px;
    bottom: 88%;
`



