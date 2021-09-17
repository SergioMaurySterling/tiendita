import React from 'react'

/*styles*/
import {BannerContainer,CoinImgBanner, TextBanner, BannerButton, HandImg, BannerTitle,RocketImg} from '../Banner/BannerStyles'

/*Images*/
import coin from '../images/Banner/coin.png'
import handcoins from '../images/Banner/handcoins.png'
import rocket from '../images/Banner/rocketship.png'


export const Banner = () => {
    return (
        <BannerContainer>
            <BannerTitle>GET READY<br/>TO WIN!</BannerTitle>
            <CoinImgBanner src={coin} alt='Coin Widget'></CoinImgBanner>
            <TextBanner>Welcome to FreeLotto, the home of free instant<br/>win lotto games and sweepstakes.</TextBanner>
            <BannerButton>Join the Winners Circle! →</BannerButton>
            <HandImg src={handcoins} alt='Hand with Coins'></HandImg>
            <RocketImg src={rocket} alt='Rocket flying'></RocketImg>
        </BannerContainer>
    )
}